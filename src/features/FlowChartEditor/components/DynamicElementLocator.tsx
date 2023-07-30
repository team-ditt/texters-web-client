import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import {ReactNode} from "react";

type Props = {
  zIndex?: number;
  children: ReactNode;
};

export default function DynamicElementLocator({zIndex, children}: Props) {
  const viewPortState = useFlowChartEditorStore(state => state.viewPortState);
  const frameSize = viewPortState.frameSize;
  const contentSize = viewPortState.contentSize;
  const scale = viewPortState.scale;
  const offset = viewPortState.offset;

  if (frameSize.height <= 0) return;

  return (
    <div
      className="absolute"
      style={{
        zIndex,
        transform: `translate(${Math.round(-offset.x)}px, ${Math.round(
          frameSize.height / 2 - offset.y,
        )}px)`,
        transition: "transform 0.2s ease",
      }}>
      {children}
    </div>
  );
}
