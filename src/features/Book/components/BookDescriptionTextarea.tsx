import {ChangeEvent, ChangeEventHandler} from "react";

type Props = {
  description: string;
  onInput: ChangeEventHandler<HTMLTextAreaElement>;
};

export default function BookDescriptionTextarea({description, onInput}: Props) {
  const MAX_LENGTH = 1000;

  const _onInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (event.currentTarget.value.length > MAX_LENGTH) return;
    onInput(event);
  };

  return (
    <div className="flex-1 border-y-[3px] border-t-[#BDBDBD] border-b-black flex flex-col">
      <span className="font-medium text-[18px] px-3 py-2">작품 소개</span>
      <textarea
        className="flex-1 min-h-[400px] border-t border-b-2 border-[#BDBDBD] resize-none leading-7 px-3 py-3"
        value={description}
        placeholder="작품 소개를 입력해주세요"
        onInput={_onInput}
        maxLength={MAX_LENGTH}
      />
      <p className="flex self-end items-center p-3">
        <span className="font-bold text-[14px] me-1">{description.length.toLocaleString()}</span>
        <span className="font-bold text-[14px] text-[#D1D1D1]">/ 1,000자</span>
      </p>
    </div>
  );
}
