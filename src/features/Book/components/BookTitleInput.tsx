import {ChangeEvent, ChangeEventHandler} from "react";

type Props = {
  title: string;
  isValid: boolean;
  onInput: ChangeEventHandler<HTMLInputElement>;
};

export default function BookTitleInput({title, isValid, onInput}: Props) {
  const MAX_LENGTH = 30;
  const borderColor = () => {
    if (!title) return "#BDBDBD";
    if (!isValid) return "#FF0000";
    return "#000000";
  };

  const _onInput = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.value.length > MAX_LENGTH) return;
    onInput(event);
  };

  return (
    <>
      <div className="h-[46px] border-b-2 flex items-center" style={{borderColor: borderColor()}}>
        <input
          className="flex-1 text-center font-medium text-[22px] placeholder:text-[#BDBDBD]"
          value={title}
          placeholder="작품 제목을 입력해주세요"
          maxLength={MAX_LENGTH}
          onInput={_onInput}
        />
      </div>
      <span className="m-1 h-6 self-center text-[14px] text-[#F04437]">
        {isValid ? null : "사용할 수 없는 제목이에요!"}
      </span>
    </>
  );
}
