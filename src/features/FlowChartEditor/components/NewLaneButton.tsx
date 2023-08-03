import StaticElementLocator from "@/features/FlowChartEditor/components/StaticElementLocator";
import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";

export default function NewLaneButton() {
  const viewState = useFlowChartEditorStore(state => state.viewStates.newLaneButton);
  const insertNewLane = useFlowChartEditorStore(state => state.insertNewLane);
  const elementState = viewState.elementState;
  const order = viewState.data.laneOrder;

  if (!elementState) return null;

  const handleClick = () => {
    insertNewLane(order + 1);
  };

  return (
    <StaticElementLocator zIndex={10}>
      <div
        className="absolute"
        style={{
          transform: `translate(${elementState.box.x}px, ${elementState.box.y}px) scale(${elementState.scale})`,
          opacity: elementState.opacity,
          width: elementState.box.width,
          height: elementState.box.height,
        }}>
        <button
          className="absolute w-[24px] h-[24px] rounded-full bg-white border-[3px] border-black shadow-[0_2px_5px_0_#00000080]"
          onClick={handleClick}>
          <div className="w-full h-full p-[2.5px] flex justify-center items-center">
            <div className="w-full h-[3px] rounded-full bg-black"></div>
          </div>
          <div className="absolute top-0 w-full h-full p-[2.5px] flex justify-center items-center">
            <div className="w-full h-[3px] rounded-full bg-black rotate-90"></div>
          </div>
        </button>
      </div>
    </StaticElementLocator>
  );
}
