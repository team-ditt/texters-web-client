import {ReactComponent as CheckboxIcon} from "assets/icons/checkbox.svg";

type Props = {
  isFixed: boolean;
  disabled?: boolean;
  onToggle: () => void;
};

export default function ThreadFixedCheckBox({isFixed, disabled, onToggle}: Props) {
  return (
    <button className="flex flex-row gap-3 items-center" disabled={disabled} onClick={onToggle}>
      <div
        className="w-[18px] h-[18px] min-w-[18px] min-h-[18px] rounded border border-[#A9A9A9] bg-transparent transition-colors duration-100 flex justify-center items-center"
        style={{
          borderColor: isFixed ? "#3D3D3D" : disabled ? "#dddddd" : "#A5A5A5",
          backgroundColor: isFixed ? "#3D3D3D" : disabled ? "#f7f7f7" : "transparent",
        }}>
        {isFixed ? <CheckboxIcon /> : null}
      </div>
      <span className={`text-[14px] ${disabled ? "text-[#c4c4c4]" : "text-[#3D3D3D]"}`}>
        고정글
      </span>
    </button>
  );
}
