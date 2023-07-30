import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import {ReactNode} from "react";

type Props = {
  zIndex: number;
  children: ReactNode;
};

export default function StaticElementLocator({zIndex, children}: Props) {
  const viewPortState = useFlowChartEditorStore(state => state.viewPortState);
  const frameSize = viewPortState.frameSize;
  const contentSize = viewPortState.contentSize;
  const scale = viewPortState.scale;
  const offset = viewPortState.offset;

  return (
    <div
      className="absolute"
      style={{
        zIndex,
        transform: `translate(${-offset.x}px, ${0}px)`,
        transition: "transform 0.2s ease",
      }}>
      {children}
    </div>
  );
}
