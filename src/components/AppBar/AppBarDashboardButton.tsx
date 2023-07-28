import {useAuthStore} from "@/stores";
import {Validator} from "@/utils";
import {ReactComponent as ToDashboardIcon} from "assets/icons/to-dashboard.svg";
import {useNavigate} from "react-router-dom";

export default function AppBarDashboardButton() {
  const {didSignIn} = useAuthStore();
  const navigate = useNavigate();

  const onNavigateToDashboard = () => {
    if (Validator.isMobileDevice(navigator.userAgent))
      return alert("텍스터즈 스튜디오는 PC환경에서만 사용 가능해요!");
    if (didSignIn()) return navigate("/studio/dashboard");
    if (confirm("텍스터즈 스튜디오를 이용하기 위해서는 로그인이 필요해요. 로그인하시겠어요?"))
      return navigate("/sign-in");
  };

  return (
    <button className="p-1.5" onClick={onNavigateToDashboard}>
      <ToDashboardIcon />
    </button>
  );
}
