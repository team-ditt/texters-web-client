import {SizedBox} from "@/components";
import {OfficialDocumentType, officialDocuments} from "@/constants";
import {OfficialDocumentContent} from "@/features/OfficialDocuments/components";

type Props = {
  type: OfficialDocumentType;
};

export default function OfficialDocumentPage({type}: Props) {
  const doc = officialDocuments[type];

  return (
    <div className="mobile-view p-6 pt-16">
      <div className="w-full flex flex-col items-start gap-1 py-4 border-y-2 border-[#D9D9D9]">
        <span className="text-[30px] font-bold">{doc.title}</span>
        <span className="text-[16px] text-[#7C7C7C]">
          {doc.updatedAt.toLocaleDateString()} 개정됨
        </span>
      </div>
      <SizedBox height={16} />

      <OfficialDocumentContent type={type} />
    </div>
  );
}
