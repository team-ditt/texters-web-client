import {ChangeEvent, ChangeEventHandler} from "react";

type Props = {
  title: string;
  onInput: ChangeEventHandler<HTMLInputElement>;
};

export default function ThreadTitleInput({title, onInput}: Props) {
  const MAX_TITLE_LENGTH = 100;

  const _onInput = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.value.length > MAX_TITLE_LENGTH) return;
    onInput(event);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-bold">제목</span>
      <input
        className={`rounded-md border border-[#ECECEC] py-2.5 px-4 focus:border-[#3D3D3D] focus:shadow-[0_2px_14px_0px_rgba(0,0,0,0.10)] transition-all`}
        type="text"
        placeholder="제목을 입력해주세요"
        value={title}
        onInput={_onInput}
      />
    </div>
  );
}
