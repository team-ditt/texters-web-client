import {DesktopAppBar} from "@/components";
import {useAuthGuard} from "@/hooks";

export default function BookInfoForm() {
  useAuthGuard();

  return (
    <div className="desktop-view">
      <DesktopAppBar />
      <div className="desktop-view-content">작품 개요 작성/수정</div>
    </div>
  );
}
