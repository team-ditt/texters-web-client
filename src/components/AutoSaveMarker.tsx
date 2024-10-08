import {TextersError} from "@/types/error";
import {toAutoSaveTimestamp} from "@/utils/formatter";
import {ReactComponent as CheckCircleIcon} from "assets/icons/check-circle.svg";

type Props = {
  isSaving?: boolean;
  updatedAt?: string;
  error?: TextersError | null;
};

export default function AutoSaveMarker({
  isSaving = false,
  updatedAt = new Date().toISOString(),
  error,
}: Props) {
  if (error)
    return (
      <div className="flex items-center gap-1.5">
        <CheckCircleIcon stroke="#E86767" />
        <span className="font-medium text-[12px] text-[#E86767]">자동 저장 실패!</span>
      </div>
    );

  if (isSaving)
    return (
      <div className="flex items-center gap-1.5">
        <CheckCircleIcon stroke="#888888" />
        <span className="font-medium text-[12px] text-[#888888]">자동 저장 중입니다...</span>
      </div>
    );

  return (
    <div className="flex items-center gap-1.5">
      <CheckCircleIcon stroke="#6EBC76" />
      <span className="font-medium text-[12px] text-[#6EBC76]">자동 저장 완료!</span>
      <span className="font-medium text-[12px] text-[#6EBC76]">
        {toAutoSaveTimestamp(updatedAt)}
      </span>
    </div>
  );
}
