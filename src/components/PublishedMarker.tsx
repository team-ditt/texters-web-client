import {ReactComponent as CheckCircleIcon} from "assets/icons/check-circle.svg";

export default function PublishedMarker() {
  return (
    <div className="flex items-center gap-1.5">
      <CheckCircleIcon stroke="#2f82ff" />
      <span className="font-medium text-[12px] text-[#2f82ff]">공개된 작품</span>
    </div>
  );
}
