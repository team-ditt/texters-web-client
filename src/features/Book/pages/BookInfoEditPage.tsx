import {DesktopAppBar} from "@/components";
import {useAuthGuard} from "@/hooks";

export default function BookInfoEditPage() {
  useAuthGuard();

  return (
    <div className="desktop-view">
      <DesktopAppBar />
      <div className="desktop-view-content">작품 개요 수정</div>
    </div>
  );
}
