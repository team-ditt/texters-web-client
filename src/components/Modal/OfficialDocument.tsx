import {OfficialDocumentType, officialDocuments} from "@/constants";
import OfficialDocumentContent from "@/features/OfficialDocuments/components/OfficialDocumentContent";
import {ReactComponent as CloseModalIcon} from "assets/icons/close-modal.svg";
import {MouseEvent} from "react";
import ReactModal from "react-modal";

type Props = ReactModal.Props & {
  type: OfficialDocumentType;
  onAgree: () => void;
};

export default function OfficialDocument({type, onAgree, onRequestClose, ...props}: Props) {
  const doc = officialDocuments[type];

  const _onAgree = (e: MouseEvent) => {
    onAgree();
    onRequestClose?.call(null, e);
  };

  return (
    <ReactModal
      overlayClassName="fixed inset-0 bg-overlay z-[2000]"
      className="absolute top-14 bottom-14 left-2 right-2 m-auto max-w-[400px] max-h-[800px] border-[3px] border-black outline-none bg-white rounded-[12px] flex flex-col items-center overflow-hidden"
      closeTimeoutMS={200}
      onRequestClose={onRequestClose}
      appElement={document.getElementById("root") as HTMLElement}
      {...props}>
      <button className="absolute top-2 right-2 p-1" onClick={onRequestClose}>
        <CloseModalIcon width={28} height={28} />
      </button>

      <div className="w-full flex flex-col items-start gap-1 px-8 py-4">
        <span className="text-[30px] font-bold">{doc.title}</span>
        <span className="text-[16px] text-[#7C7C7C]">
          {doc.updatedAt.toLocaleDateString()} 개정됨
        </span>
      </div>
      <div className="w-full border-t border-[#D9D9D9]" />

      <div className="w-full flex-1 px-8 pt-4 overflow-y-auto">
        <OfficialDocumentContent type={type} />
      </div>

      <button className="w-full h-12 bg-[#242424] text-white" onClick={_onAgree}>
        <span>동의하고 계속하기</span>
      </button>
    </ReactModal>
  );
}
