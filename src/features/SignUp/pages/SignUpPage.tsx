import {api} from "@/api";
import {AnimatedMobilePageContainer, FlatButton, SizedBox} from "@/components";
import {PenNameForm, TermsAndConditionsForm} from "@/features/SignUp/components";
import {usePreventDirectSignUp} from "@/features/SignUp/hooks";
import {useTextInput} from "@/hooks";
import {Validator} from "@/utils";
import {useMutation} from "@tanstack/react-query";
import {ReactComponent as LeftArrowIcon} from "assets/icons/left-arrow.svg";
import {useNavigate, useSearchParams} from "react-router-dom";

export default function SignUpPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const {value: penName, isValid, onInput} = useTextInput(Validator.isValidPenName);

  const {mutate: signUp, isLoading} = useMutation({
    mutationFn: () => api.auth.signUp({oauthId: searchParams.get("oauthId")!, penName}),
    onSuccess: () => navigate("/"),
    onError: () => navigate("/login"),
  });

  const onGoBack = () => navigate("/login");

  usePreventDirectSignUp();
  return (
    <AnimatedMobilePageContainer className="relative px-6 py-20 min-h-[560px] justify-center items-center">
      <button className="absolute left-6 top-6" onClick={onGoBack}>
        <LeftArrowIcon />
      </button>

      <div className="flex-1 max-w-[400px] min-h-[400px] max-h-[800px] flex flex-col">
        <h1 className="font-bold text-[25px]">필명을 정해주세요</h1>
        <SizedBox height={24} />
        <PenNameForm value={penName} isValid={isValid} onInput={onInput} />
        <TermsAndConditionsForm />

        <FlatButton
          className="px-4 py-2 bg-blue-primary text-white border-none rounded-md self-center"
          onClick={signUp as () => void}
          disabled={isLoading}>
          <span className="font-bold text-[18px]">가입하기</span>
        </FlatButton>
      </div>
    </AnimatedMobilePageContainer>
  );
}
