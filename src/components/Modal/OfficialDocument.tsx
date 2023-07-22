import FlatButton from "@/components/FlatButton";
import SizedBox from "@/components/SizedBox";
import {ReactComponent as CloseModalIcon} from "assets/icons/close-modal.svg";
import {MouseEvent} from "react";
import ReactModal from "react-modal";

export type OfficialDocumentType =
  | "terms and conditions"
  | "personal info collection"
  | "personal info outsourcing";

type Props = ReactModal.Props & {
  type: OfficialDocumentType;
  onAgree: () => void;
};

export default function OfficialDocument({type, onAgree, onRequestClose, ...props}: Props) {
  const _onAgree = (e: MouseEvent) => {
    onAgree();
    onRequestClose?.call(null, e);
  };

  return (
    <ReactModal
      overlayClassName="fixed inset-0 bg-overlay z-[2000]"
      className="absolute top-14 bottom-14 left-2 right-2 m-auto max-w-[400px] max-h-[800px] outline-none bg-white rounded-[12px] flex flex-col items-center"
      closeTimeoutMS={200}
      onRequestClose={onRequestClose}
      appElement={document.getElementById("root") as HTMLElement}
      {...props}>
      <button className="self-end mt-4 mr-4" onClick={onRequestClose}>
        <CloseModalIcon />
      </button>

      <SizedBox height={12} />
      <div className="w-full flex flex-col items-start gap-[6px] px-8 pb-8">
        <span className="text-[30px] font-bold text-[#494949]">
          {OFFICIAL_DOCUMENTS[type].title}
        </span>
        <span className="text-[16px] text-[#7C7C7C]">
          {OFFICIAL_DOCUMENTS[type].updatedAt.toLocaleDateString()} 개정됨
        </span>
      </div>
      <div className="w-full border-t border-[#D9D9D9]" />

      <div className="flex-1 px-8 pt-4 overflow-y-auto">
        <span>{OFFICIAL_DOCUMENTS[type].content}</span>
      </div>

      <div className="w-full px-8 pt-4 pb-8">
        <FlatButton className="!h-12" onClick={_onAgree}>
          <span>동의하고 계속하기</span>
        </FlatButton>
      </div>
    </ReactModal>
  );
}

const OFFICIAL_DOCUMENTS: Record<
  OfficialDocumentType,
  {title: string; updatedAt: Date; content: string}
> = {
  "terms and conditions": {
    title: "서비스 약관",
    updatedAt: new Date("2023-07-18"),
    content:
      "1. Clause 1\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra condimentum eget purus in. Consectetur eget id morbi amet amet, in. Ipsum viverra pretium tellus neque. Ullamcorper suspendisse aenean leo pharetra in sit semper et. Amet quam placerat sem.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra condimentum eget purus in. Consectetur eget id morbi amet amet, in. Ipsum viverra pretium tellus neque. Ullamcorper suspendisse aenean leo pharetra in sit semper et. Amet quam placerat sem.\n\n2. Clause 2\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra condimentum eget purus in. Consectetur eget id morbi amet amet, in. Ipsum viverra pretium tellus neque. Ullamcorper suspendisse aenean leo pharetra in sit semper et. Amet quam placerat sem.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra condimentum eget purus in. Consectetur eget id morbi amet amet, in. Ipsum viverra pretium tellus neque. Ullamcorper suspendisse aenean leo pharetra in sit semper et. Amet quam placerat sem.",
  },
  "personal info collection": {
    title: "개인정보 수집 및 이용",
    updatedAt: new Date("2023-07-18"),
    content:
      "1. Clause 1\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra condimentum eget purus in. Consectetur eget id morbi amet amet, in. Ipsum viverra pretium tellus neque. Ullamcorper suspendisse aenean leo pharetra in sit semper et. Amet quam placerat sem.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra condimentum eget purus in. Consectetur eget id morbi amet amet, in. Ipsum viverra pretium tellus neque. Ullamcorper suspendisse aenean leo pharetra in sit semper et. Amet quam placerat sem.\n\n2. Clause 2\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra condimentum eget purus in. Consectetur eget id morbi amet amet, in. Ipsum viverra pretium tellus neque. Ullamcorper suspendisse aenean leo pharetra in sit semper et. Amet quam placerat sem.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra condimentum eget purus in. Consectetur eget id morbi amet amet, in. Ipsum viverra pretium tellus neque. Ullamcorper suspendisse aenean leo pharetra in sit semper et. Amet quam placerat sem.",
  },
  "personal info outsourcing": {
    title: "개인정보 위탁제공",
    updatedAt: new Date("2023-07-18"),
    content:
      "1. Clause 1\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra condimentum eget purus in. Consectetur eget id morbi amet amet, in. Ipsum viverra pretium tellus neque. Ullamcorper suspendisse aenean leo pharetra in sit semper et. Amet quam placerat sem.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra condimentum eget purus in. Consectetur eget id morbi amet amet, in. Ipsum viverra pretium tellus neque. Ullamcorper suspendisse aenean leo pharetra in sit semper et. Amet quam placerat sem.\n\n2. Clause 2\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra condimentum eget purus in. Consectetur eget id morbi amet amet, in. Ipsum viverra pretium tellus neque. Ullamcorper suspendisse aenean leo pharetra in sit semper et. Amet quam placerat sem.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra condimentum eget purus in. Consectetur eget id morbi amet amet, in. Ipsum viverra pretium tellus neque. Ullamcorper suspendisse aenean leo pharetra in sit semper et. Amet quam placerat sem.",
  },
};
