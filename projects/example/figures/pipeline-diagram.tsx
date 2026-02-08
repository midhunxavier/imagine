import { Figure } from '@/framework/Figure';
import type { FigureComponentBaseProps } from '@/framework/types';
import { Box, Callout, Label, Arrow } from '@/framework/diagrams/primitives';
import { theme } from '@/framework/theme';

export default function PipelineDiagramFigure({
  width,
  height,
  background,
  title = 'Example: analysis pipeline',
  subtitle = 'Pure-SVG boxes/arrows + theme tokens',
  step1 = 'Ingest',
  step2 = 'Process',
  step3 = 'Publish',
  callout = 'Edit labels in Controls'
}: FigureComponentBaseProps & {
  title?: string;
  subtitle?: string;
  step1?: string;
  step2?: string;
  step3?: string;
  callout?: string;
}) {
  const y = 120;
  const boxW = 220;
  const boxH = 86;
  const gap = 70;
  const startX = 70;

  const x1 = startX;
  const x2 = x1 + boxW + gap;
  const x3 = x2 + boxW + gap;

  return (
    <Figure width={width} height={height} background={background} title="Pipeline diagram">
      <text x={70} y={44} fontSize={18} fontWeight={800} fill={theme.colors.text}>
        {title}
      </text>
      <Label x={70} y={76} text={subtitle} fontSize={13} fill={theme.colors.subtleText} />

      <Box x={x1} y={y} width={boxW} height={boxH} label={step1} />
      <Box x={x2} y={y} width={boxW} height={boxH} label={step2} />
      <Box x={x3} y={y} width={boxW} height={boxH} label={step3} />

      <Arrow x1={x1 + boxW} y1={y + boxH / 2} x2={x2} y2={y + boxH / 2} />
      <Arrow x1={x2 + boxW} y1={y + boxH / 2} x2={x3} y2={y + boxH / 2} />

      <Callout x={x2 - 10} y={y + boxH + 40} width={boxW + 20} height={44} text={callout} />
    </Figure>
  );
}
