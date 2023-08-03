import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import {useEffect, useState} from "react";

export default function ScrollBar() {
  const {frameSize, contentSize, offset, scale} = useFlowChartEditorStore(
    state => state.viewPortState,
  );
  const scrollViewPort = useFlowChartEditorStore(state => state.scrollViewPort);
  const adjustedFrameSize = {
    width: frameSize.width - 8,
    height: frameSize.height - 8,
  };
  const scrollRatio = {
    x: Math.min(1, adjustedFrameSize.width / contentSize.width),
    y: Math.min(1, adjustedFrameSize.height / contentSize.height),
  };

  const [isDragging, setIsDragging] = useState<"horizontal" | "vertical" | null>();

  const startDrag = (axis: "horizontal" | "vertical") => {
    setIsDragging(axis);
  };
  const updateMousePosition = (event: MouseEvent) => {
    if (isDragging !== null) {
      event.preventDefault();
      scrollViewPort({
        x: isDragging === "horizontal" ? event.movementX / scrollRatio.x : 0,
        y: isDragging === "vertical" ? event.movementY / scrollRatio.y : 0,
      });
    }
  };
  const stopDrag = () => {
    setIsDragging(null);
  };

  useEffect(() => {
    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseup", stopDrag);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseup", stopDrag);
    };
  }, [isDragging, contentSize.width, contentSize.height]);

  if (
    contentSize.width <= 0 ||
    contentSize.height <= 0 ||
    frameSize.width <= 0 ||
    frameSize.height <= 0
  )
    return;

  return (
    <div>
      <div
        className="absolute z-[100] h-[10px] bottom-0 py-[2px]"
        style={{
          width: adjustedFrameSize.width * scrollRatio.x,
          transform: `translateX(${offset.x * scrollRatio.x}px)`,
          transition: isDragging ? "none" : "all 0.1s ease",
        }}
        onMouseDown={() => startDrag("horizontal")}>
        <div className="w-full h-full rounded-full bg-[#9F9F9F]"></div>
      </div>
      <div
        className="absolute z-[100] w-[10px] right-0 px-[2px]"
        style={{
          height: adjustedFrameSize.height * scrollRatio.y,
          transform: `translateY(${
            offset.y * scrollRatio.y + (adjustedFrameSize.height * (1 - scrollRatio.y)) / 2
          }px)`,
          transition: isDragging ? "none" : "all 0.1s ease",
        }}
        onMouseDown={() => startDrag("vertical")}>
        <div className="w-full h-full rounded-full bg-[#9F9F9F]"></div>
      </div>
    </div>
  );
}
