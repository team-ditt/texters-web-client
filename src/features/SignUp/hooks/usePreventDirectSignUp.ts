import {useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";

export default function usePreventDirectSignUp() {
  const [searchParams] = useSearchParams();
  const oauthId = searchParams.get("oauthId");
  const navigate = useNavigate();

  useEffect(() => {
    if (!oauthId) {
      navigate("/sign-in");
    }
  }, []);
}
