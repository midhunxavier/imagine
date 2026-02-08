import { Figure } from '@/framework/Figure';
import type { FigureComponentBaseProps } from '@/framework/types';
import { Box, Callout, Label, Arrow } from '@/framework/diagrams/primitives';
import { theme } from '@/framework/theme';

function DashedArrow({
  x1,
  y1,
  x2,
  y2,
  stroke = theme.colors.axis,
  strokeWidth = theme.strokes.thick
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke?: string;
  strokeWidth?: number;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeDasharray="6,4"
      markerEnd="none"
    />
  );
}

export default function AIAgentArchitectureFigure({
  width,
  height,
  background,
  title = 'AI Agent Architecture',
  subtitle = 'Multi-agent system with tool use and memory',
  userInput = 'User Input',
  orchestrator = 'Orchestrator',
  memory = 'Memory / Context',
  llm = 'LLM / Model',
  tools1 = 'Tool A',
  tools2 = 'Tool B',
  tools3 = 'Tool C',
  output = 'Response',
  notes = 'Components communicate via function calling'
}: FigureComponentBaseProps & {
  title?: string;
  subtitle?: string;
  userInput?: string;
  orchestrator?: string;
  memory?: string;
  llm?: string;
  tools1?: string;
  tools2?: string;
  tools3?: string;
  output?: string;
  notes?: string;
}) {
  const startY = 100;
  const boxW = 160;
  const boxH = 70;
  const mainBoxH = 90;
  const gapX = 60;
  const gapY = 80;

  const centerX = 500;
  const xOrchestrator = centerX - boxW / 2;
  const xMemory = centerX - boxW / 2;
  const xLLM = centerX - boxW / 2;
  const xOutput = centerX - boxW / 2;

  const yUser = startY;
  const yOrchestrator = yUser + mainBoxH + gapY;
  const yMemory = yOrchestrator + mainBoxH + gapY - 20;
  const yLLM = yOrchestrator;
  const yTools = yOrchestrator;
  const yOutput = yMemory + boxH + gapY;

  const xToolsStart = xOrchestrator + boxW + gapX + 40;
  const xTools1 = xToolsStart;
  const xTools2 = xToolsStart;
  const xTools3 = xToolsStart;
  const yTools1 = yTools - 50;
  const yTools2 = yTools + 10;
  const yTools3 = yTools + 70;

  return (
    <Figure width={width} height={height} background={background} title="AI Agent Architecture">
      <text x={70} y={44} fontSize={18} fontWeight={800} fill={theme.colors.text}>
        {title}
      </text>
      <Label x={70} y={76} text={subtitle} fontSize={13} fill={theme.colors.subtleText} />

      <Box x={centerX - boxW / 2} y={yUser} width={boxW} height={boxH} label={userInput} fill={theme.colors.panel} stroke={theme.colors.blue} />

      <Box x={xOrchestrator} y={yOrchestrator} width={boxW} height={mainBoxH} label={orchestrator} fill={theme.colors.panel} stroke={theme.colors.teal} />

      <Arrow x1={centerX} y1={yUser + boxH} x2={centerX} y2={yOrchestrator} />

      <Box x={xLLM} y={yLLM} width={boxW} height={mainBoxH} label={llm} fill={theme.colors.panel} stroke={theme.colors.orange} />

      <Arrow x1={xOrchestrator + boxW} y1={yOrchestrator + mainBoxH / 2} x2={xLLM} y2={yLLM + mainBoxH / 2} />
      <DashedArrow x1={xLLM} y1={yLLM + mainBoxH / 2} x2={xOrchestrator + boxW} y2={yOrchestrator + mainBoxH / 2} stroke={theme.colors.subtleText} />

      <Box x={xTools1} y={yTools1} width={boxW - 20} height={50} label={tools1} fill="#F3F4F6" stroke="#9CA3AF" />
      <Box x={xTools2} y={yTools2} width={boxW - 20} height={50} label={tools2} fill="#F3F4F6" stroke="#9CA3AF" />
      <Box x={xTools3} y={yTools3} width={boxW - 20} height={50} label={tools3} fill="#F3F4F6" stroke="#9CA3AF" />

      <Arrow x1={xLLM + boxW} y1={yLLM + 25} x2={xTools1} y2={yTools1 + 25} />
      <Arrow x1={xLLM + boxW} y1={yLLM + mainBoxH / 2} x2={xTools2} y2={yTools2 + 25} />
      <Arrow x1={xLLM + boxW} y1={yLLM + mainBoxH - 25} x2={xTools3} y2={yTools3 + 25} />

      <DashedArrow x1={xTools1} y1={yTools1 + 25} x2={xLLM + boxW} y2={yLLM + 25} stroke={theme.colors.subtleText} />
      <DashedArrow x1={xTools2} y1={yTools2 + 25} x2={xLLM + boxW} y2={yLLM + mainBoxH / 2} stroke={theme.colors.subtleText} />
      <DashedArrow x1={xTools3} y1={yTools3 + 25} x2={xLLM + boxW} y2={yLLM + mainBoxH - 25} stroke={theme.colors.subtleText} />

      <Box x={xMemory} y={yMemory} width={boxW} height={boxH} label={memory} fill={theme.colors.panel} stroke={theme.colors.red} />

      <Arrow x1={xOrchestrator + boxW / 2} y1={yOrchestrator + mainBoxH} x2={xMemory + boxW / 2} y2={yMemory} />
      <DashedArrow x1={xMemory + boxW / 2} y1={yMemory + boxH} x2={xOrchestrator + boxW / 2} y2={yOrchestrator + mainBoxH} stroke={theme.colors.subtleText} />

      <Box x={xOutput} y={yOutput} width={boxW} height={boxH} label={output} fill={theme.colors.panel} stroke={theme.colors.teal} />

      <Arrow x1={centerX} y1={yMemory + boxH} x2={centerX} y2={yOutput} />

      <Callout x={70} y={yOutput + boxH + 30} width={boxW + 100} height={44} text={notes} />
    </Figure>
  );
}
