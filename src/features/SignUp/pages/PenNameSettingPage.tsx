import {api} from "@/api";
import {TextInput} from "@/components";
import {usePreventDirectSignUp} from "@/features/SignUp/hooks";
import {useTextInput} from "@/hooks";
import {Validator} from "@/utils";
import {useMutation} from "@tanstack/react-query";
import {useEffect, useMemo} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";

export default function PenNameSettingPage() {
  const [searchParams] = useSearchParams();
  const {value: penName, isValid: isValidPenName, onInput} = useTextInput(Validator.isValidPenName);
  const navigate = useNavigate();

  const {mutate: checkIsUniquePenName, isError: isDuplicatePenName} = useMutation(
    (penName: string) => api.members.isUniquePenName(penName),
  );
  const {mutate: signUp, isLoading} = useMutation({
    mutationFn: () => api.auth.signUp({oauthId: searchParams.get("oauthId")!, penName}),
    onSuccess: () => navigate("/"),
    onError: () => navigate("/login"),
  });

  const invalid = useMemo(
    () => !isValidPenName || isDuplicatePenName,
    [isValidPenName, isDuplicatePenName],
  );
  const invalidMessage = useMemo(
    () =>
      isDuplicatePenName
        ? "이미 존재하는 필명입니다."
        : "필명은 15자 이내의 한글, 숫자, 영어만 사용할 수 있습니다.",
    [isDuplicatePenName],
  );

  usePreventDirectSignUp();
  useEffect(() => {
    if (!penName) return;
    const timeout = setTimeout(() => checkIsUniquePenName(penName), 500);
    return () => clearTimeout(timeout);
  }, [penName]);

  return (
    <div className="page-container gap-[16px] items-stretch">
      <TextInput
        label="필명"
        placeholder="필명을 입력하세요."
        value={penName}
        onInput={onInput}
        supportingMessage="운영정책을 위반하는 필명은 추후 제재될 수 있습니다."
        invalid={invalid}
        invalidMessage={invalidMessage}
        maxLength={15}
      />
      <button
        className="px-4 py-2 bg-blue-primary text-white border-none rounded-md self-center"
        onClick={signUp as () => void}
        disabled={isLoading}>
        회원가입 완료
      </button>
    </div>
  );
}
