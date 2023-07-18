import {api} from "@/api";
import {useTextInput} from "@/hooks";
import {Validator} from "@/utils";
import {useMutation} from "@tanstack/react-query";
import {useEffect} from "react";

export default function usePenNameForm() {
  const {value: penName, isValid: isValidPenName, onInput} = useTextInput(Validator.isValidPenName);

  const {mutate: checkIsUniquePenName, isError: isDuplicatePenName} = useMutation(
    (penName: string) => api.members.isUniquePenName(penName),
  );

  useEffect(() => {
    if (!penName || !isValidPenName) return;
    const timeout = setTimeout(() => checkIsUniquePenName(penName), 500);
    return () => clearTimeout(timeout);
  }, [penName, isValidPenName]);

  return {penName, isValidPenName, isDuplicatePenName, onInput};
}
