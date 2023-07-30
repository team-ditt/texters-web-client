import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import {ReactComponent as TrashIcon} from "assets/icons/trash.svg";

type Props = {
  choiceId: number;
};

const OFFSET = {
  x: -8,
  y: 10,
};

export default function ChoiceDelete({choiceId}: Props) {
  const hoveringState = useFlowChartEditorStore(state => state.hoveringState);
  const choiceViewState = useFlowChartEditorStore(state => state.viewStates.choices[choiceId]);
  const deleteChoice = useFlowChartEditorStore(state => state.deleteChoice);
  const elementState = choiceViewState.elementState;
  if (!elementState) return;
  const isHovering = hoveringState.isHovering === "choice" && hoveringState.sourceId === choiceId;

  const handleDeleteClicked = () => {
    deleteChoice(choiceId);
  };

  return (
    <div
      className="absolute cursor-pointer z-50"
      style={{
        transform: `translate(${OFFSET.x}px, ${OFFSET.y}px)`,
        opacity: isHovering ? 1 : 0,
      }}
      onClick={handleDeleteClicked}>
      <TrashIcon width={20} height={20} stroke="#CBD2E0" />
    </div>
  );
}
