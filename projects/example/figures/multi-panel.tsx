import { Figure } from '@/framework/Figure';
import type { FigureComponentBaseProps } from '@/framework/types';
import { theme } from '@/framework/theme';
import { PanelGrid } from '@/framework/layout/PanelGrid';
import { Box, Label } from '@/framework/diagrams/primitives';

export default function MultiPanelFigure({
  width,
  height,
  background,
  title = 'Example: multi-panel figure',
  subtitle = 'Use PanelGrid to compose sub-panels (a, b, c…)',
  panelA = 'Panel: raw',
  panelB = 'Panel: processed',
  panelC = 'Panel: ablation',
  panelD = 'Panel: summary'
}: FigureComponentBaseProps & {
  title?: string;
  subtitle?: string;
  panelA?: string;
  panelB?: string;
  panelC?: string;
  panelD?: string;
}) {
  const panelW = 440;
  const panelH = 210;

  return (
    <Figure width={width} height={height} background={background} title="Multi-panel layout">
      <text x={70} y={44} fontSize={18} fontWeight={800} fill={theme.colors.text}>
        {title}
      </text>
      <Label x={70} y={76} text={subtitle} fontSize={13} fill={theme.colors.subtleText} />

      <PanelGrid x={40} y={90} width={width - 80} height={height - 120} rows={2} cols={2}>
        <g>
          <Box x={0} y={0} width={panelW} height={panelH} label={panelA} fill="#EEF2FF" stroke="#6366F1" />
        </g>
        <g>
          <Box x={0} y={0} width={panelW} height={panelH} label={panelB} fill="#ECFDF5" stroke="#10B981" />
        </g>
        <g>
          <Box x={0} y={0} width={panelW} height={panelH} label={panelC} fill="#FFFBEB" stroke="#F59E0B" />
        </g>
        <g>
          <Box x={0} y={0} width={panelW} height={panelH} label={panelD} fill="#FEF2F2" stroke="#EF4444" />
        </g>
      </PanelGrid>
    </Figure>
  );
}
