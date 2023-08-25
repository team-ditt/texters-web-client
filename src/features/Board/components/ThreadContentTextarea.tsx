import {ChangeEvent, ChangeEventHandler} from "react";

type Props = {
  content: string;
  onInput: ChangeEventHandler<HTMLTextAreaElement>;
};

export default function ThreadContentTextarea({content, onInput}: Props) {
  const MAX_CONTENT_LENGTH = 10000;

  const _onInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (event.currentTarget.value.length > MAX_CONTENT_LENGTH) return;
    onInput(event);
  };

  return (
    <div className="grow flex flex-col gap-1.5">
      <div className="flex flex-row justify-between">
        <span className="font-bold me-7">내용</span>
        <div className="flex flex-row gap-[2px] items-center text-[12px] text-[#6F6F6F] font-[700]">
          <span>{content.length.toLocaleString()}</span>
          <span>/10,000</span>
        </div>
      </div>
      <div className="grow w-full relative">
        {content.length === 0 ? (
          <span className="absolute left-4 z-[-1] top-10 text-[#A5A5A5] text-[14px] select-none">
            본문 최대 10,000자
          </span>
        ) : null}
        <textarea
          className={`h-full w-full bg-transparent rounded-md border border-[#ECECEC] py-3.5 px-4 resize-none focus:border-[#3D3D3D] focus:shadow-[0_2px_14px_0px_rgba(0,0,0,0.10)] transition-all placeholder:text-[#A5A5A5]`}
          placeholder="내용을 입력해주세요"
          value={content}
          onInput={_onInput}
        />
      </div>
    </div>
  );
}
