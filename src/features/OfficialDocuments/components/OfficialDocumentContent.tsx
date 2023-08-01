import {SizedBox} from "@/components";
import {OfficialDocumentType, officialDocuments} from "@/constants";
import {Fragment} from "react";

type Props = {
  type: OfficialDocumentType;
};

export default function OfficialDocumentContent({type}: Props) {
  const doc = officialDocuments[type];

  return (
    <div className="w-full flex flex-col gap-1">
      {doc.articles.map((article, index) => (
        <Fragment key={index}>
          <span className="font-bold text-[18px]">{article.title}</span>
          <span className="whitespace-pre-wrap">{article.content}</span>
          <ol className="ps-4">
            {article.paragraphs?.map((paragraph, index) => (
              <Fragment key={index}>
                <li className="list-decimal list-outside">{paragraph.content}</li>
                <ul className="ps-4">
                  {paragraph.subparagraphs?.map((subparagraph, index) => (
                    <li key={index} className="list-disc list-outside">
                      {subparagraph}
                    </li>
                  ))}
                </ul>
              </Fragment>
            ))}
          </ol>
          {article.footer ? (
            <>
              <SizedBox height={8} />
              <span>{article.footer}</span>
            </>
          ) : null}
          <SizedBox height={8} />
        </Fragment>
      ))}
    </div>
  );
}
