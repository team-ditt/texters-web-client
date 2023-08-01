import {ChangeEventHandler} from "react";

type Props = {
  title: string;
  isValid: boolean;
  onInput: ChangeEventHandler<HTMLInputElement>;
};

export default function BookTitleInput({title, isValid, onInput}: Props) {
  const borderColor = () => {
    if (!title) return "#BDBDBD";
    if (!isValid) return "#FF0000";
    return "#000000";
  };

  return (
    <>
      <div
        className="self-center w-[630px] h-[50px] border-b-[3px] flex items-center"
        style={{borderColor: borderColor()}}>
        <input
          className="flex-1 text-center font-medium text-[24px] placeholder:text-[#BDBDBD]"
          value={title}
          placeholder="작품 제목을 입력해주세요"
          maxLength={30}
          onInput={onInput}
        />
      </div>
      <span className="m-2 h-6 self-center text-[#FF0000]">
        {isValid ? null : "사용할 수 없는 제목이에요!"}
      </span>
    </>
  );
}
