import {Validator} from "@/utils";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export default function useMobileViewGuard(enabled: boolean = false) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!enabled) return;
    if (!Validator.isMobileDevice(navigator.userAgent)) return;
    alert("텍스터즈 스튜디오는 PC환경에서만 사용 가능해요!");
    navigate("/", {replace: true});
  }, [enabled]);
}
