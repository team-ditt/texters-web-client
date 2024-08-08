import {Modal, SizedBox} from "@/components";
import {useModal} from "@/hooks";
import {ReactComponent as AddPhotoIcon} from "assets/icons/add-photo.svg";
import {ChangeEvent, useRef, useState} from "react";
import BookCoverImage from "./BookCoverImage";

type Props = {
  coverImageUrl?: string;
  setCoverImage: (file: File) => void;
};

export default function BookCoverImageUploader({coverImageUrl, setCoverImage}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>(coverImageUrl);
  const {isOpen, openModal, closeModal} = useModal();

  const onOpenFileUploader = () => {
    inputRef.current?.click();
  };

  const onFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      event.target.value = "";
      return openModal();
    }

    setCoverImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImageUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <button
      className="relative w-[250px] h-[250px] self-center rounded-lg overflow-hidden"
      disabled={true}
      onClick={onOpenFileUploader}>
      <div className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-75 transition-opacity flex flex-col justify-center items-center bg-black">
        <AddPhotoIcon width={72} height={72} />
        <SizedBox height={8} />
        <span className="font-bold text-[18px] leading-[32px] text-white whitespace-pre">
          jpg, jpeg, png, webp 파일,{"\n"}5MB 이하, 1000x1000 이상의{"\n"}이미지를 권장합니다.
        </span>
      </div>
      <BookCoverImage className="aspect-square object-cover" src={imageUrl} />
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        onChange={onFileSelect}
        hidden
      />

      <Modal.Alert
        isOpen={isOpen}
        title="이미지 크기를 줄여주세요"
        message="5MB가 넘는 이미지는 표지로 등록할 수 없어요!"
        onRequestClose={closeModal}
      />
    </button>
  );
}
