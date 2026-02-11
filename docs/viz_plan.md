Complete Implementation Plan: Imagine Studio UI Overhaul
Summary
Transform the Imagine Studio from a basic dev preview into a polished, professional figure editing application with:
- Modern minimal design using Tailwind CSS
- Inline text editing directly on figures
- Rich controls (color picker, sliders, font selector, size controls)
- Enhanced UX (keyboard shortcuts, undo/redo, accessibility)
---
Phase 1: Tailwind CSS Foundation
Tasks
1. Install dependencies
      npm install -D tailwindcss @tailwindcss/postcss postcss autoprefixer
   (Tailwind v4 uses `@tailwindcss/postcss`; config files can be created manually—CLI init is optional.)
   
2. Create `src/studio/design-tokens.ts` (single source of truth):
   - Derive colors/fonts from `src/framework/theme.ts`
   - Add Studio UI tokens (bg, borders, radii, shadows, transitions)
3. Create `tailwind.config.ts` using tokens:
   - `theme.extend.colors.studio = studioTokens.colors`
   - Extend border radius, shadows, fonts, transition durations
4. Create `postcss.config.cjs` for Vite integration:
   - Plugins: `@tailwindcss/postcss`, `autoprefixer`
5. Update `src/studio/studio.css`:
   - Use Tailwind v4 entrypoint: `@import "tailwindcss";`
   - Load the Tailwind config: `@config "../../tailwind.config.ts";` (must come after `@import`)
   - Keep only minimal global/custom CSS (e.g. checkerboard utility)
6. Migrate Studio TSX to Tailwind utilities:
   - Replace legacy semantic classnames (e.g. `sidebar`, `card`, `controlsPanel`)
   - Add consistent focus-visible rings, spacing, hover elevation
---
Phase 2: UI Component Library
Notes
- Phase 2 `Select` is **native-only** (styled `<select>`). Searchable/combobox behavior lands in Phase 3 `SelectControl`.
- All components use consistent `focus-visible` rings, `rounded-control` radii, and subtle hover elevation (`shadow-cardHover`).

2.1 Base Components (src/studio/components/ui/)
| Component | Description | Key Props |
|-----------|-------------|-----------|
| Button.tsx | Variants: primary, secondary, ghost, danger | variant, size, disabled, loading |
| Input.tsx | Text input with label | label, error, prefix, suffix, clearable |
| Textarea.tsx | Auto-resize textarea | rows, maxRows, autoResize |
| Select.tsx | Native styled dropdown | options, placeholder |
| Switch.tsx | Toggle switch | checked, onCheckedChange, label |
| Card.tsx | Container with variants | variant, padding, hover |
| Badge.tsx | Status badges | variant (success, warning, error, info) |
| Tooltip.tsx | Hover tooltips | content, placement |
| Divider.tsx | Section separator | orientation, label |
| Skeleton.tsx | Loading placeholder | width, height, variant |

2.2 Refactor targets
- Replace inline Tailwind class constants in:
  - src/studio/StudioApp.tsx
  - src/studio/routes/ProjectsHome.tsx
  - src/studio/routes/ProjectHome.tsx
  - src/studio/routes/FigureView.tsx
- Mirror the same component additions + refactors into both `create-imagine` templates (`blank` + `example`).
2.3 Component Implementation Details
Button.tsx example structure:
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
// Tailwind classes for variants, sizes, states
---
Phase 3: Enhanced Controls System
3.1 Control Components (src/studio/components/controls/)
| Control | Features |
|---------|----------|
| TextControl.tsx | Label, input, character count, clear button |
| MultilineControl.tsx | Auto-resize, character limit, placeholder |
| NumberControl.tsx | Input + slider, step buttons, min/max display |
| ColorControl.tsx | Click to open picker, swatch preview, hex display |
| RangeControl.tsx | Slider with value label, step marks |
| BooleanControl.tsx | Switch with label, optional description |
| SelectControl.tsx | Searchable dropdown with option groups |
| FontControl.tsx | Font family picker with previews |
| SizeControl.tsx | W/H inputs with aspect ratio lock |
3.2 Control Renderer Update
ControlsRenderer.tsx - Maps FigureControl types to new components:
function renderControl(control: FigureControl, value: unknown, onChange: (v: unknown) => void) {
  switch (control.kind) {
    case 'text': return <TextControl {...}/>;
    case 'number': return <NumberControl {...}/>;
    // ... etc
  }
}
3.3 Extend FigureControl Types
Update src/core/manifest.ts to add new control kinds:
export type FigureControl =
  | { kind: 'text'; ... }
  | { kind: 'number'; ... }
  | { kind: 'boolean'; ... }
  | { kind: 'select'; ... }
  | { kind: 'color'; key: string; label?: string; presets?: string[] }
  | { kind: 'range'; key: string; label?: string; min: number; max: number; step?: number }
  | { kind: 'font'; key: string; label?: string; fonts?: string[] }
  | { kind: 'size'; key: string; label?: string; lockAspectRatio?: boolean };
---
Phase 4: Color Picker Implementation
4.1 Component Structure
ColorPicker.tsx (src/studio/components/ui/ColorPicker.tsx):
- Popover-based picker (appears on click)
- Saturation-lightness canvas (2D picker)
- Hue slider (horizontal)
- Alpha slider (optional)
- Hex/RGB input fields
- Preset colors grid
- Recent colors (stored in localStorage)
4.2 Implementation Approach
Use a lightweight approach (no heavy dependencies):
1. Canvas-based saturation/lightness picker
2. Range input for hue/alpha
3. Color conversion utilities (HSL ↔ RGB ↔ Hex)
4. Click outside to close
4.3 Color Utilities
Create src/studio/utils/color.ts:
export function hexToRgb(hex: string): [number, number, number];
export function rgbToHex(r: number, g: number, b: number): string;
export function hslToRgb(h: number, s: number, l: number): [number, number, number];
export function rgbToHsl(r: number, g: number, b: number): [number, number, number];
---
Phase 5: Inline Text Editing
5.1 Context & State Management
EditableContext.tsx (src/studio/editing/):
interface EditableContextValue {
  isEditMode: boolean;
  activeKey: string | null;
  setActiveKey: (key: string | null) => void;
  getValue: (key: string) => string;
  setValue: (key: string, value: string) => void;
  editableElements: Map<string, EditableElementInfo>;
  registerElement: (key: string, info: EditableElementInfo) => void;
  unregisterElement: (key: string) => void;
}
interface EditableElementInfo {
  key: string;
  bounds: DOMRect;
  fontSize: number;
  fontWeight: string | number;
  fontFamily: string;
  fill: string;
  textAnchor: string;
}
5.2 Element Detection
useEditableElements.ts:
1. Uses MutationObserver to detect rendered text elements
2. Queries for [data-editable-key] attributes in figure
3. Extracts computed styles and positions
4. Re-calculates on zoom/resize
5.3 Edit Overlay
EditableOverlay.tsx:
1. Positioned absolutely over the figure preview
2. Renders <input> or <textarea> when editing
3. Matches position, size, font exactly
4. Handles keyboard events:
   - Enter → save and exit
   - Escape → cancel and exit
   - Tab → move to next editable
5. Auto-saves on blur
5.4 Visual Indicators
1. Hover state: Subtle dashed outline on editable text
2. Edit state: Solid border, white background
3. Cursor: Text cursor on hover
5.5 Figure Component Helper
EditableText.tsx (src/framework/EditableText.tsx):
export function EditableText({ 
  propKey, 
  children, 
  ...textProps 
}: { 
  propKey: string; 
  children: React.ReactNode 
} & React.SVGProps<SVGTextElement>) {
  return (
    <text data-editable-key={propKey} {...textProps}>
      {children}
    </text>
  );
}
---
Phase 6: Layout Redesign
6.1 New Sidebar (src/studio/components/layout/Sidebar.tsx)
Features:
- Header with logo and collapse toggle
- Projects section with expandable list
- Figures section with search
- Mini mode (icons only, ~60px wide)
- Keyboard shortcut hints
Structure:
<aside className="w-[300px] bg-white border-r">
  <SidebarHeader />
  <SidebarSection title="Projects">
    <ProjectList />
  </SidebarSection>
  <SidebarSection title="Figures">
    <FigureSearch />
    <FigureList />
  </SidebarSection>
</aside>
6.2 Header Bar (src/studio/components/layout/Header.tsx)
Structure:
<header className="h-16 border-b bg-white/80 backdrop-blur">
  <div className="left">
    <Breadcrumb />
    <FigureTitle />
    <SizeInfo />
  </div>
  <div className="center">
    <VariantPills />
  </div>
  <div className="right">
    <ZoomControls />
    <ViewToggles />
    <SaveStatus />
    <ExportButton />
  </div>
</header>
6.3 Preview Canvas (src/studio/components/layout/PreviewCanvas.tsx)
Features:
- Centered figure with drop shadow
- Background pattern (subtle dots)
- Zoom controls (buttons + scroll)
- Pan support (space+drag)
- Checkerboard toggle
Implementation:
<div className="flex-1 overflow-hidden bg-gray-50">
  <div 
    className="preview-surface"
    style={{ 
      backgroundImage: checker ? checkerPattern : dotsPattern 
    }}
  >
    <div 
      className="preview-scale origin-center"
      style={{ transform: `scale(${scale})` }}
    >
      <div id="figure-root" className="shadow-2xl">
        {FigureComponent && <FigureComponent {...props} />}
      </div>
      <EditableOverlay />
    </div>
  </div>
</div>
6.4 Controls Panel (src/studio/components/layout/ControlsPanel.tsx)
Features:
- Collapsible (toggle visibility)
- Grouped controls in sections
- Search/filter controls
- Reset all / Reset individual
- Undo/Redo buttons
- JSON view toggle
- Save status indicator
Structure:
<aside className="w-[360px] border-l bg-white overflow-y-auto">
  <ControlsPanelHeader>
    <SearchInput />
    <UndoRedoButtons />
  </ControlsPanelHeader>
  <ControlsSection title="Text">
    {textControls.map(c => <ControlRenderer control={c} />)}
  </ControlsSection>
  <ControlsSection title="Colors">
    {colorControls.map(c => <ControlRenderer control={c} />)}
  </ControlsSection>
  <ControlsPanelFooter>
    <ResetButton />
    <CopyJsonButton />
  </ControlsPanelFooter>
</aside>
---
Phase 7: Undo/Redo System
7.1 History Hook
useHistory.ts (src/studio/hooks/):
interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}
function useHistory<T>(initialState: T) {
  // Returns: { state, set, undo, redo, canUndo, canRedo }
}
7.2 Integration with Props System
Wrap useProjectProps to track history:
- Every setVariantOverride call pushes to history
- Debounce history pushes (group rapid changes)
- Persist history per figure/variant
---
Phase 8: Keyboard Shortcuts
8.1 Shortcut Definitions
src/studio/hooks/useKeyboardShortcuts.ts:
| Key Combo | Action |
|-----------|--------|
| Cmd/Ctrl+S | Force save |
| Cmd/Ctrl+Z | Undo |
| Cmd/Ctrl+Shift+Z | Redo |
| Escape | Exit edit mode |
| Cmd/Ctrl+K | Focus search |
| Cmd/Ctrl+0 | Fit to view |
| Cmd/Ctrl+= | Zoom in |
| Cmd/Ctrl+- | Zoom out |
| Cmd/Ctrl+Shift+C | Copy JSON |
8.2 Implementation
- Use useEffect with global event listener
- Handle modifier keys properly
- Prevent default browser behavior
- Show shortcuts in tooltips
---
Phase 9: Gallery & Home Improvements
9.1 Projects Home
- Card grid with larger thumbnails
- Hover effects with quick actions
- Last modified indicator
- Figure count badges
9.2 Project Home
- Masonry layout for figure gallery
- Better thumbnail sizing
- Filter/sort options
- Batch selection (future)
---
Phase 10: Accessibility & Polish
10.1 Accessibility
- Focus ring on all interactive elements
- ARIA labels for controls
- Keyboard navigation (Tab, Arrow keys)
- Screen reader announcements for state changes
- Reduced motion preference support
10.2 Animations
- Panel open/close: slide + fade (200ms)
- Hover transitions: 150ms ease
- Save indicator: pulse animation
- Loading skeletons: shimmer effect
- Toast notifications: slide-in
10.3 Final Polish
- Error boundaries
- Empty states with illustrations
- Loading states
- Toast notification system
- Settings persistence (localStorage)
---
Implementation Checklist
# Todos
[ ] 
Phase 1: Install and configure Tailwind CSS with custom theme
[ ] 
Phase 1: Migrate studio.css to Tailwind utilities
[ ] 
Phase 2: Create base UI components (Button, Input, Select, Switch, Card)
[ ] 
Phase 2: Create Tooltip, Badge, Divider, Skeleton components
[ ] 
Phase 3: Build TextControl and MultilineControl components
[ ] 
Phase 3: Build NumberControl and RangeControl (slider) components
[ ] 
Phase 3: Build BooleanControl and SelectControl components
[ ] 
Phase 4: Build ColorPicker and ColorControl components
[ ] 
Phase 4: Create color utility functions (hex/rgb/hsl conversion)
[ ] 
Phase 3: Build FontControl component with font previews
[ ] 
Phase 3: Build SizeControl with aspect ratio lock
[ ] 
Phase 3: Extend FigureControl types for new control kinds
[ ] 
Phase 5: Create EditableContext for inline editing state
[ ] 
Phase 5: Build EditableOverlay component for text editing
[ ] 
Phase 5: Create useEditableElements hook for element detection
[ ] 
Phase 5: Create EditableText helper component for figures
[ ] 
Phase 6: Redesign Sidebar with collapsible sections
[ ] 
Phase 6: Build new Header with zoom/view controls
[ ] 
Phase 6: Enhance PreviewCanvas with better zoom/pan
[ ] 
Phase 6: Redesign ControlsPanel with grouped sections
[ ] 
Phase 7: Implement useHistory hook for undo/redo
[ ] 
Phase 7: Integrate undo/redo with props system
[ ] 
Phase 8: Implement keyboard shortcuts system
[ ] 
Phase 9: Improve ProjectsHome and ProjectHome galleries
[ ] 
Phase 10: Add accessibility features (focus, ARIA, keyboard nav)
[ ] 
Phase 10: Add animations and transitions
[ ] 
Phase 10: Final polish (error boundaries, empty states, toasts)
---
Plan Complete
The comprehensive plan is now documented with 27 detailed tasks across 10 phases. Here's the summary:
Key Deliverables
| Feature | Description |
|---------|-------------|
| Tailwind CSS | Modern styling foundation with custom theme |
| UI Components | 10+ reusable components (Button, Input, Card, etc.) |
| Rich Controls | Color picker, range slider, font selector, size control |
| Inline Editing | Click-to-edit text directly on figures |
| Layout Redesign | New sidebar, header, preview canvas, controls panel |
| Undo/Redo | History system for prop changes |
| Keyboard Shortcuts | Cmd+Z, Cmd+S, Cmd+K, etc. |
| Accessibility | Focus management, ARIA labels, keyboard navigation |
| Polish | Animations, transitions, loading states |
Estimated Timeline
| Phase | Tasks | Est. Time |
|-------|-------|-----------|
| Phase 1 (Tailwind) | 2 | 2-3 hours |
| Phase 2 (UI Components) | 2 | 4-5 hours |
| Phase 3-4 (Controls) | 7 | 6-8 hours |
| Phase 5 (Inline Editing) | 4 | 6-8 hours |
| Phase 6 (Layout) | 4 | 4-5 hours |
| Phase 7-10 (UX/Polish) | 8 | 5-7 hours |
| Total | 27 | 27-36 hours |
