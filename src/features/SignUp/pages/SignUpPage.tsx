import {api} from "@/api";
import {FlatButton, SizedBox} from "@/components";
import {PenNameForm, TermsAndConditionsForm} from "@/features/SignUp/components";
import {usePenNameForm, usePreventDirectSignUp} from "@/features/SignUp/hooks";
import {useMutation} from "@tanstack/react-query";
import {ReactComponent as LeftArrowIcon} from "assets/icons/left-arrow.svg";
import {motion} from "framer-motion";
import {useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";

const HORIZONTAL_HIDDEN_ANIMATION_PROPS = {
  left: "100%",
};
const HORIZONTAL_IDLE_ANIMATION_PROPS = {
  left: "auto",
};
const VERTICAL_HIDDEN_ANIMATION_PROPS = {
  top: "100%",
};
const VERTICAL_IDLE_ANIMATION_PROPS = {
  top: 0,
};

export default function SignUpPage() {
  const [pageHiddenAnimationProps, setPageHiddenAnimationProps] = useState<any>(
    HORIZONTAL_HIDDEN_ANIMATION_PROPS,
  );
  const [pageIdleAnimationProps, setPageIdleAnimationProps] = useState<any>(
    HORIZONTAL_IDLE_ANIMATION_PROPS,
  );

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
    onSuccess: () => {
      setPageHiddenAnimationProps(VERTICAL_HIDDEN_ANIMATION_PROPS);
      setPageIdleAnimationProps(VERTICAL_IDLE_ANIMATION_PROPS);
      navigate("/", {replace: true});
    },
    onError: () => {
      navigate("/");
      navigate("/sign-in");
    },
  });

  const onGoBack = () => {
    navigate("/");
    navigate("/sign-in");
  };

  usePreventDirectSignUp();

  return (
    <motion.div
      className="mobile-view fixed left-auto right-auto h-full px-6 pt-20 pb-10 justify-center items-center z-[2000]"
      initial={pageHiddenAnimationProps}
      animate={pageIdleAnimationProps}
      exit={pageHiddenAnimationProps}>
      <button className="absolute left-6 top-6" onClick={onGoBack}>
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
    </motion.div>
  );
}
