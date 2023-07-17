import {api} from "@/api";
import {SizedBox} from "@/components";
import {useMutation} from "@tanstack/react-query";
import {ReactComponent as InvalidInputIcon} from "assets/icons/invalid-input.svg";
import {ReactComponent as ValidInputIcon} from "assets/icons/valid-input.svg";
import {HTMLAttributes, useEffect, useState} from "react";

type Props = HTMLAttributes<HTMLInputElement> & {
  value: string;
  isValid: boolean;
};

export default function PenNameForm({value, isValid, onInput}: Props) {
  const [message, setMessage] = useState("");
  const [formColor, setFormColor] = useState("#A9A9A9");

  const {mutate: checkIsUniquePenName, isError: isDuplicatePenName} = useMutation(
    (penName: string) => api.members.isUniquePenName(penName),
  );

  useEffect(() => {
    if (!value || !isValid) return;
    const timeout = setTimeout(() => checkIsUniquePenName(value), 500);
    return () => clearTimeout(timeout);
  }, [value, isValid]);

  useEffect(() => {
    function getMessage() {
      if (!value) return "";
      if (!isValid) return "사용할 수 없는 필명이에요";
      if (isDuplicatePenName) return "이미 사용중인 필명이에요";
      return "사용할 수 있는 필명이에요";
    }

    function getFormColor() {
      if (!value) return "#A9A9A9";
      if (!isValid || isDuplicatePenName) return "#FF2E2E";
      if (isValid && !isDuplicatePenName) return "#00CD15";
      return "#000000";
    }

    setMessage(getMessage());
    setFormColor(getFormColor());
  }, [value, isValid, isDuplicatePenName]);

  return (
    <div className="flex-1">
      <div className={"relative w-full h-[34px]"}>
        <input
          className="w-full h-full text-[20px] placeholder:text-[#BEBEBE] border-b-[1.5px] outline-transparent"
          style={{borderColor: formColor}}
          value={value}
          placeholder="필명"
          onInput={onInput}
          maxLength={15}
        />
      </div>
      <SizedBox height={4} />
      <p className="flex items-center gap-1">
        {value && isValid && !isDuplicatePenName ? <ValidInputIcon /> : null}
        {!isValid || isDuplicatePenName ? <InvalidInputIcon /> : null}
        <span className="text-[10px]" style={{color: formColor}}>
          {message}
        </span>
      </p>
      <SizedBox height={12} />
      <ul>
        <li className="text-[12px] text-[#A9A9A9] flex">
          <span className="me-1">-</span>
          <span>한글, 영문, 숫자 포함 1~15글자 이하 (특수문자 불가능)</span>
        </li>
        <li className="text-[12px] text-[#A9A9A9] flex">
          <span className="me-1">-</span>
          <span>운영정책에 금지되는 내용으로 생성하였다면 운영정책에 따라 조치될 수 있습니다.</span>
        </li>
      </ul>
    </div>
  );
}
