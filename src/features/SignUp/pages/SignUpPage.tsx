import {api} from "@/api";
import {FlatButton, SizedBox} from "@/components";
import {PenNameForm, TermsAndConditionsForm} from "@/features/SignUp/components";
import {usePenNameForm, usePreventDirectSignUp} from "@/features/SignUp/hooks";
import {useMutation} from "@tanstack/react-query";
import {ReactComponent as LeftArrowIcon} from "assets/icons/left-arrow.svg";
import {useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";

export default function SignUpPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const penNameForm = usePenNameForm();
  const [allAgreed, setAllAgreed] = useState(false);
  const canSubmit =
    penNameForm.penName &&
    penNameForm.isValidPenName &&
    !penNameForm.isDuplicatePenName &&
    allAgreed;

  const {mutate: signUp, isLoading} = useMutation({
    mutationFn: () =>
      api.auth.signUp({oauthId: searchParams.get("oauthId")!, penName: penNameForm.penName}),
    onSuccess: () => navigate("/"),
    onError: () => navigate("/login"),
  });

  const onGoBack = () => navigate("/login");

  usePreventDirectSignUp();

  return (
    <div className="mobile-view relative px-6 pt-20 pb-10 justify-center items-center">
      <button className="fixed left-6 top-6" onClick={onGoBack}>
        <LeftArrowIcon />
      </button>

      <div className="flex-1 max-w-[400px] min-h-[400px] max-h-[800px] flex flex-col">
        <h1 className="font-bold text-[25px]">필명을 정해주세요</h1>
        <SizedBox height={24} />
        <PenNameForm {...penNameForm} />
        <TermsAndConditionsForm allAgreed={allAgreed} setAllAgreed={setAllAgreed} />

        <FlatButton onClick={signUp as () => void} disabled={!canSubmit || isLoading}>
          <span>가입하기</span>
        </FlatButton>
      </div>
    </div>
  );
}
