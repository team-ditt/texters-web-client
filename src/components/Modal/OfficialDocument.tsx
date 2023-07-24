import FlatButton from "@/components/FlatButton";
import SizedBox from "@/components/SizedBox";
import {ReactComponent as CloseModalIcon} from "assets/icons/close-modal.svg";
import {MouseEvent, ReactNode} from "react";
import ReactModal from "react-modal";

export type OfficialDocumentType = "terms and conditions" | "personal info collection";

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

      <div className="w-full flex-1 px-8 pt-4 overflow-y-auto">
        {OFFICIAL_DOCUMENTS[type].content}
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
  {title: string; updatedAt: Date; content: ReactNode}
> = {
  "terms and conditions": {
    title: "텍스터즈 이용약관",
    updatedAt: new Date("2023-07-22"),
    content: <TermsAndConditionsContent />,
  },
  "personal info collection": {
    title: "텍스터즈 개인정보보호",
    updatedAt: new Date("2023-07-22"),
    content: <PersonalInfoCollectionContent />,
  },
};

function TermsAndConditionsContent() {
  return (
    <p className="w-full flex flex-col gap-1">
      <span className="font-bold text-[18px]">제1조 (목적)</span>
      <span>
        이 약관은 텍스터즈(이하 ‘운영진’)가 제공하는 서비스의 이용과 관련하여 서비스와 이용자와의
        권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.
      </span>
      <SizedBox height={8} />
      <span className="font-bold text-[18px]">제2조 (정의)</span>
      <span>본 약관에서 사용하는 용어의 정의는 다음과 같습니다.</span>
      <ol className="ps-4">
        <li className="list-decimal list-outside">
          “운영진”이라 함은 콘텐츠 산업과 관련된 모바일, 웹 서비스를 제공하는 자를 말합니다.
        </li>
        <li className="list-decimal list-outside">
          “이용자”라 함은 서비스에 접속하여 이 약관에 따라 콘텐츠 및 제반 서비스를 이용하는 이용자를
          말합니다. 이용자는 “회원가입”을 통해 서비스를 이용하는 모든 “회원”과 “회원가입”을 하지
          않은 상태로 서비스를 이용한 “비회원” 모두를 통틀어 말합니다.
        </li>
        <li className="list-decimal list-outside">
          “콘텐츠”라 함은 정보통신망이용촉진 및 정보보호 등에 관한 법률 제2조 제1항 제1호의 규정에
          의한 정보통신망에서 사용되는 부호•문자 표현된 자료 또는 정보로서, 그 보존 및 이용에 있어서
          효용을 높일 수 있도록 전자적 형태로 제작 또는 처리된 것을 말하며 “서비스”를 이용함에 있어
          게시한 정보 형태의 글 등을 의미합니다.
        </li>
        <li className="list-decimal list-outside">
          “로그”라 함은 이용자가 서비스를 이용하면서 자동으로 생성된 IP주소, 접속 시간 등을
          말합니다.
        </li>
      </ol>
      <SizedBox height={8} />
      <span className="font-bold text-[18px]">제3조 (약관 등의 명시와 설명 및 개정)</span>
      <ol className="ps-4">
        <li className="list-decimal list-outside">
          "운영진"은 이 약관을 회원가입 화면 등에 게시합니다.
        </li>
        <li className="list-decimal list-outside">
          "운영진"은 관련법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
        </li>
        <li className="list-decimal list-outside">
          개정 내용이 회원에게 불리할 경우, 적용일자 및 개정사유를 명시하여 현행약관과 함께 팝업으로
          30일간 게시합니다.
        </li>
        <li className="list-decimal list-outside">
          회원이 개정약관에 동의하지 않는 경우, 이용계약을 해지함으로써 거부 의사를 표현할 수
          있습니다. 단, 30일 내에 거부 의사 표시를 하지 않을 경우 약관에 동의한 것으로 간주합니다.
        </li>
        <li className="list-decimal list-outside">
          비회원이 서비스를 이용할 경우, 이 약관에 동의한 것으로 간주합니다.
        </li>
      </ol>
      <SizedBox height={8} />
      <span className="font-bold text-[18px]">제4조 (개인정보의 관리 및 보호)</span>
      <ol className="ps-4">
        <li className="list-decimal list-outside">
          회원이 체결한 서비스 이용계약은 처음 이용계약을 체결한 본인에 한해 적용됩니다.
        </li>
        <li className="list-decimal list-outside">
          회원의 아이디, 비밀번호 등 모든 개인정보의 관리책임은 본인에게 있으므로, 타인에게 양도 및
          대여할 수 없으며, 유출되지 않도록 관리해야 합니다. 만약 본인의 아이디 및 비밀번호를 타인이
          사용하고 있음을 인지했을 경우 바로 서비스 내부의 문의 창구에 알려야 하고, 안내가 있는 경우
          이에 즉시 따라야 합니다.
        </li>
      </ol>
      <SizedBox height={8} />
      <span className="font-bold text-[18px]">제5조 (회원탈퇴 및 자격 상실 등)</span>
      <ol className="ps-4">
        <li className="list-decimal list-outside">
          "회원"은 "운영진"에 언제든지 탈퇴를 요청할 수 있으며 "운영진"은 즉시 회원탈퇴를
          처리합니다.
        </li>
        <li className="list-decimal list-outside">
          "회원"이 다음 각호의 사유에 해당하는 경우, "운영진"은 회원자격을 제한 및 정지시킬 수
          있습니다.
          <ul className="ps-4">
            <li className="list-disc list-outside">가입신청 시에 허위내용을 등록한 경우</li>
            <li className="list-disc list-outside">
              다른 사람의 서비스이용을 방해하거나 그 정보를 도용하는 등 전자상거래 질서를 위협하는
              경우
            </li>
            <li className="list-disc list-outside">
              "운영진"을 이용하여 법령 또는 이 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우
            </li>
          </ul>
        </li>
        <li className="list-decimal list-outside">
          "운영진"이 회원자격을 제한·정지시킨 후, "운영진"은 회원자격을 상실시킬 수 있습니다.
        </li>
        <li className="list-decimal list-outside">
          "운영진"이 회원자격을 상실시키는 경우에는 회원등록을 말소합니다.
        </li>
      </ol>
      <SizedBox height={8} />
      <span className="font-bold text-[18px]">제6조 (서비스 제공)</span>
      <ol className="ps-4">
        <li className="list-decimal list-outside">
          “운영진”은 다음 서비스를 제공합니다.
          <ul className="ps-4">
            <li className="list-disc list-outside">
              유저가 직접 제작할 수 있는 멀티 엔딩 웹소설 제작 플랫폼
            </li>
            <li className="list-disc list-outside">유저가 제작한 웹소설을 게시할 수 있는 게시판</li>
            <li className="list-disc list-outside">기타 "운영진"이 정하는 서비스</li>
          </ul>
        </li>
        <li className="list-decimal list-outside">
          “운영진”은 운영상, 기술상의 필요에 따라 제공하고 있는 서비스를 변경할 수 있습니다.
        </li>
        <li className="list-decimal list-outside">
          “운영진”은 이용자의 개인정보 및 서비스 이용 기록에 따라 서비스 이용에 차이를 둘 수
          있습니다.
        </li>
        <li className="list-decimal list-outside">
          “운영진”은 천재지변, 인터넷 장애, 경영 약화 등으로 서비스를 더 이상 제공하기 어려울 경우,
          서비스를 통보 없이 중단할 수 있습니다.
        </li>
        <li className="list-decimal list-outside">
          “운영진” 1항부터 전항까지와 다음 내용으로 발생한 피해에 대해 어떠한 책임을 지지 않습니다.
          <ul className="ps-4">
            <li className="list-disc list-outside">
              모든 서비스, 게시물, 이용 기록의 진본성, 무결성, 신뢰성, 이용가능성
            </li>
            <li className="list-disc list-outside">서비스 이용 중 타인과 상호 간에 합의한 내용</li>
            <li className="list-disc list-outside">
              게시물, 광고의 버튼, 하이퍼링크 등 외부로 연결된 서비스와 같이 회사가 제공하지 않은
              서비스에서 발생한 피해
            </li>
            <li className="list-disc list-outside">
              이용자의 귀책사유 또는 회사의 귀책 사유가 아닌 사유로 발생한 이용자의 피해
            </li>
          </ul>
        </li>
      </ol>
      <SizedBox height={8} />
      <span className="font-bold text-[18px]">제7조 (저작권의 귀속)</span>
      <ol className="ps-4">
        <li className="list-decimal list-outside">
          “운영진”은 유용하고 편리한 서비스를 제공하기 위해, 서비스 및 서비스 내부의 기능(멀티엔딩
          웹소설 제작, 웹소설 읽기, 좋아요 기능, 댓글 기능 등)의 체계와 다양한 기능을 직접 설계 및
          운영하고 있는 데이터베이스 제작자에 해당합니다.
        </li>
        <li className="list-decimal list-outside">
          “운영진”은 저작권법에 따라 데이터베이스 제작자는 복제권 및 전송권을 포함한 데이터베이스
          전부에 대한 권리를 가지고 있으며, 이는 법률에 따라 보호를 받는 대상입니다. 따라서 “회원”은
          데이터베이스 제작자인 “운영진”의 승인 없이 데이터베이스의 전부 또는 일부를 복제,배포,방송
          또는 전송할 수 없습니다.
        </li>
        <li className="list-decimal list-outside">
          “운영진”이 작성한 게시물에 대한 권리는 “운영진”에게 귀속되며, “회원”이 작성한 게시물에
          대한 권리는 “회원”에게 귀속됩니다.
        </li>
      </ol>
      <SizedBox height={8} />
      <span className="font-bold text-[18px]">제8조 (게시물의 게시 중단)</span>
      <span>
        “운영진” 은 관련법에 의거하여 “회원”의 게시물로 인한 법률상 이익 침해를 근거로, 다른 이용자
        또는 제3자가 회원 또는 “운영진”을 대상으로 하여 민형사상의 법적 조치를 취하거나 관련된
        게시물의 게시중단을 요청하는 경우, “운영진”은 해당 게시물에 대한 접근을 잠정적으로
        제한하거나 삭제할 수 있습니다.
      </span>
      <SizedBox height={8} />
      <span className="font-bold text-[18px]">제9조 (운영진의 면책)</span>
      <ol className="ps-4">
        <li className="list-decimal list-outside">
          “운영진”은 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는
          서비스 제공에 관하여 책임을 지지 않습니다.
        </li>
        <li className="list-decimal list-outside">
          “운영진”은 서비스용 설비의 보수, 교체, 정기점검, 공사 등 기타 이에 준하는 사유로 발생한
          손해에 대하여 책임을 지지 않습니다. 다만, 고의 또는 과실에 의한 경우에는 그러하지
          아니합니다.
        </li>
        <li className="list-decimal list-outside">
          “운영진” 은 회원의 고의 또는 과실로 인한 서비스 이용의 장애에 대하여는 책임을 지지
          않습니다. 다만, 회원에게 부득이하거나 정당한 사유가 있는 경우에는 그러하지 아니합니다.
        </li>
        <li className="list-decimal list-outside">
          회원이 서비스와 관련하여 게재한 정보나 자료 등의 신뢰성, 정확성 등에 대하여 운영진은 고의
          또는 중대한 과실이 없는 한 책임을 지지 않습니다.
        </li>
        <li className="list-decimal list-outside">
          “운영진”은 회원이 다른 회원 또는 타인과 서비스를 매개로 발생한 거래나 분쟁에 대해 개입할
          의무가 없으며, 이로 인한 손해에 대해 책임을 지지 않습니다.
        </li>
        <li className="list-decimal list-outside">
          “운영진”은 무료로 제공되는 서비스 이용과 관련하여 회원에게 발생한 손해에 대해서는 책임을
          지지 않습니다. 그러나 운영진의 고의 또는 중과실에 의한 경우에는 그러하지 아니합니다.
        </li>
        <li className="list-decimal list-outside">
          “운영진”은 회원이 모바일, 웹(PC) 기기 비밀번호 등을 관리하지 않아 발생하는 제3자 결제에
          대해 책임을 지지 않습니다. 다만, 운영진의 고의 또는 과실에 의한 경우에는 그러하지
          아니합니다.
        </li>
        <li className="list-decimal list-outside">
          “운영진”이 모바일, 웹(PC) 기기의 변경, 모바일, 웹(PC) 기기의 번호 변경, 운영체제(OS)
          버전의 변경, 해외 로밍, 통신사 변경 등으로 인해 콘텐츠 전부나 일부의 기능을 이용할 수 없는
          경우 운영진은 이에 대해 책임을 지지 않습니다. 다만, 운영진의 고의 또는 과실에 의한
          경우에는 그러하지 아니합니다.
        </li>
        <li className="list-decimal list-outside">
          회원이 “운영진”이 제공하는 콘텐츠나 계정정보를 삭제한 경우 “운영진”은 이에 대해 책임을
          지지 않습니다. 다만, “운영진”의 고의 또는 과실에 의한 경우에는 그러하지 아니합니다.
        </li>
      </ol>
      <SizedBox height={8} />
      <span className="font-bold text-[18px]">제10조 (저작권)</span>
      <ol className="ps-4">
        <li className="list-decimal list-outside">
          “회원”이 작성・게시한 웹소설 관한 저작권은, 해당 웹소설을 작성한 “회원”에게 귀속합니다.
        </li>
        <li className="list-decimal list-outside">
          회원이 서비스 내에 게시하는 게시물은 서비스, 관련 프로모션 등에 노출(해당 노출을 위해
          필요한 범위 내에서의 일부 수정, 복제, 편집 포함)될 수 있고, 서비스를 위한 연구목적으로
          활용될 수 있습니다. 이 경우 회사는 관련 법령을 준수하며, 회원은 언제든지 고객센터 또는
          서비스 내 관리기능을 통해 해당 게시물에 대해 삭제, 검색결과 제외, 비공개 등의 조치를 취할
          수 있습니다.
        </li>
        <li className="list-decimal list-outside">
          “운영진”은 제2항 이외의 방법으로 회원의 게시물을 이용하고자 하는 경우에는 전화, 팩스,
          전자우편 등을 통해 사전에 회원의 동의를 얻어야 합니다.
        </li>
        <li className="list-decimal list-outside">
          서비스 및 “운영진”이 작성한 저작물에 대한 저작권 및 지식재산권은 “운영진”에 귀속됩니다.
        </li>
      </ol>
      <SizedBox height={8} />
      <span className="font-bold text-[18px]">제11조 (게시물의 관리)</span>
      <ol className="ps-4">
        <li className="list-decimal list-outside">
          게시물에 대한 모든 책임은 게시자에게 있습니다.
        </li>
        <li className="list-decimal list-outside">
          회원의 게시물이 정보통신망 이용촉진 및 정보보호 등에 관한 법률 및 저작권법 등 관련 법령에
          위반되는 내용을 포함하는 경우, 권리자는 관련 법령이 정한 절차에 따라 해당 게시물의
          게시중단 및 삭제등을 요청할 수 있으며, “운영진”은 관련 법령에 따른 조치를 취하여야 합니다.
        </li>
        <li className="list-decimal list-outside">
          “운영진”은 전항에 따른 권리자의 요청이 없는 경우라도 권리침해가 인정될 만한 사유가 있거나
          기타 회사 정책 및 관련 법령에 위반되는 경우에는 관련 법령에 따라 해당 게시물에 대해 수정,
          삭제등의 임시 조치를 취할 수 있습니다.
        </li>
        <li className="list-decimal list-outside">
          “운영진”은 “운영진”의 정책에 따라 다음 각 호에 해당하는 경우 회원의 동의 없이 게시물의
          전부 또는 일부를 삭제하거나, 게시판에서 삭제할 수 있습니다.
          <ul className="ps-4">
            <li className="list-disc list-outside">
              회사 및 다른 회원 또는 제3자를 비방하거나 모함하여 명예를 손상시키는 내용이 포함된
              경우
            </li>
            <li className="list-disc list-outside">
              회사 또는 제3자의 저작권 등 지식재산권 및 기타 타인의 권리를 침해하는 내용의 경우
            </li>
            <li className="list-disc list-outside">회원 본인의 창작물이 아닌 경우</li>
            <li className="list-disc list-outside">
              인위적으로 작품 용량이나 편수를 조작하는 경우
            </li>
            <li className="list-disc list-outside">
              작품 내에서 작품 이외의 내용(공지사항, 광고 및 홍보 등)을 등록한 경우 작품 이외의 내용
              부분
            </li>
            <li className="list-disc list-outside">
              정상적인 작품이 아닌 경우(예컨대 작품의 내용이 없거나, 작품과 상관없는 다른 내용으로
              대체된 것)에는 문제가 되는 부분, 대부분(작품 전체의 2/3 이상)의 내용이 정상적이 아닐
              경우 작품 전체
            </li>
            <li className="list-disc list-outside">
              이 약관 또는 법령 및 공서양속에 반하는 내용인 경우
            </li>
            <li className="list-disc list-outside">
              기타 작품의 내용이 서비스 운영 방향과 다르거나, 본 조의 게시중단 또는 삭제의 사유가
              존재하여 게재에 부적합하다고 판단되는 경우
            </li>
            <li className="list-disc list-outside">아동ㆍ청소년을 성적 대상으로 묘사하는 작품</li>
            <li className="list-disc list-outside">
              노골적인 묘사가 아니더라도 “운영진”이 판단하기에 미성년자가 읽기에 부적절한 내용이
              포함되어 있는 경우(성 행위 묘사 등)
            </li>
            <li className="list-disc list-outside">
              상기 내용 외, “운영진”이 판단하기에 대중이 읽기에 적절치 않은 작품
            </li>
          </ul>
        </li>
        <li className="list-decimal list-outside">
          “운영진”은 게시판에 정보통신망이용촉진 및 정보보호 등에 관한 법률을 위반한
          청소년유해매체물이 게시되어 있는 경우에는 이를 지체 없이 삭제합니다. 다만, 만 19세 이상의
          이용자만 이용할 수 있는 게시판은 예외로 합니다.
        </li>
        <li className="list-decimal list-outside">
          “운영진”이 운영하는 게시판 등에 게시된 정보로 인하여 법률상 이익이 침해된 자는
          “운영진”에게 당해 정보의 삭제또는 반박내용의 게재를 요청할 수 있습니다. 이 경우 “운영진”은
          지체 없이 필요한 조치를 취하고 이를 즉시 신청인에게 통지합니다.
        </li>
        <li className="list-decimal list-outside">
          “운영진”은 회원이 게시물을 삭제한 이후 최대 1년 간 해당 정보를 보관할 수 있고, 보관 기간이
          지난 후에는 해당 정보를 삭제합니다. 단, 다음 각 호의 1에 해당하는 경우는 예외로 합니다.
          <ul className="ps-4">
            <li className="list-disc list-outside">회원의 부정이용 사실이 확인된 경우</li>
            <li className="list-disc list-outside">
              회원의 공개 게시물이 타인의 명예 및 저작권을 포함한 제3자의 법률상 이익을 침해하였다는
              사유로 다른 이용자 또는 제3자가 회원 또는 “운영진”을 대상으로 소송, 청구, 이의제기,
              형사고소 등의 제기를 통하여 관련 정보의 제공을 요청 받은 경우
            </li>
          </ul>
        </li>
      </ol>
      <SizedBox height={8} />
      <span className="font-bold text-[18px]">제12조 (금지행위)</span>
      <ol className="ps-4">
        <li className="list-decimal list-outside">“회원”은 다음과 같은 행위를 해서는 안됩니다.</li>
        <li className="list-decimal list-outside">
          개인정보 또는 계정 기만, 침해, 공유 행위
          <ul className="ps-4">
            <li className="list-disc list-outside">
              개인정보를 허위, 누락, 오기, 도용하여 작성하는 행위
            </li>
            <li className="list-disc list-outside">
              타인의 개인정보 및 계정을 수집, 저장, 공개, 이용하는 행위
            </li>
            <li className="list-disc list-outside">
              자신과 타인의 개인정보를 제3자에게 공개, 양도하는 행위
            </li>
            <li className="list-disc list-outside">다중 계정을 생성 및 이용하는 행위</li>
            <li className="list-disc list-outside">
              자신의 계정을 이용하여 타인의 요청을 이행하는 행위
            </li>
            <li className="list-disc list-outside">
              외설 또는 폭력적인 말이나 글, 화상, 음향, 기타 공서양속에 반하는 정보를 회사의
              사이트에 게시하는 행위
            </li>
          </ul>
        </li>
        <li className="list-decimal list-outside">
          시스템 부정행위
          <ul className="ps-4">
            <li className="list-disc list-outside">허가하지 않은 방식의 서비스 이용 행위</li>
            <li className="list-disc list-outside">“운영진”의 모든 재산에 대한 침해 행위</li>
          </ul>
        </li>
        <li className="list-decimal list-outside">
          업무 방해 행위
          <ul className="ps-4">
            <li className="list-disc list-outside">
              서비스 관리자 또는 이에 준하는 자격을 사칭하거나 허가없이 취득하여 직권을 행사하는
              행위
            </li>
            <li className="list-disc list-outside">
              “운영진” 및 타인의 명예를 손상시키거나 업무를 방해하는 행위
            </li>
            <li className="list-disc list-outside">
              서비스 내부 정보 일체를 허가 없이 이용, 변조, 삭제및 외부로 유출하는 행위
            </li>
          </ul>
        </li>
        <li className="list-decimal list-outside">
          이 약관, 개인정보 처리방침, 커뮤니티 이용규칙에서 이행 및 비이행을 명시한 내용에 반하는
          행위
        </li>
        <li className="list-decimal list-outside">
          기타 현행법에 어긋나거나 부적절하다고 판단되는 행위
        </li>
        <li className="list-decimal list-outside">
          “회원”이 1항에 해당하는 행위를 할 경우, “운영진”은 다음과 같은 조치를 영구적으로 취할 수
          있습니다.
          <ul className="ps-4">
            <li className="list-disc list-outside">
              회원의 서비스 이용 권한, 자격, 혜택 제한 및 회수
            </li>
            <li className="list-disc list-outside">
              회원과 체결된 이용계약을 회원의 동의나 통보 없이 파기
            </li>
            <li className="list-disc list-outside">회원가입, 정보 접근, 게시글 작성 거부</li>
            <li className="list-disc list-outside">
              회원의 커뮤니티, 게시물, 이용기록을 임의로 삭제, 중단, 변경
            </li>
            <li className="list-disc list-outside">그 외 회사가 필요하다고 판단되는 조치</li>
          </ul>
        </li>
        <li className="list-decimal list-outside">
          “운영진”은 1항부터 전항까지로 인해 발생한 피해에 대해 어떠한 책임을 지지 않으며, “회원”은
          귀책사유로 인해 발생한 모든 손해를 배상할 책임이 있습니다.
        </li>
      </ol>
      <SizedBox height={8} />
      <span className="font-bold text-[18px]">제13조 (기타)</span>
      <ol className="ps-4">
        <li className="list-decimal list-outside">
          이 약관은 2023년 7월 22일에 최신화 되었습니다.
        </li>
        <li className="list-decimal list-outside">
          이 약관에서 정하지 아니한 사항과 이 약관의 해석에 관하여는 관련법 또는 관례에 따릅니다.
        </li>
        <li className="list-decimal list-outside">
          이 약관에도 불구하고 다른 약관이나 서비스 이용 중 안내 문구 등으로 달리 정함이 있는
          경우에는 해당 내용을 우선으로 합니다.
        </li>
      </ol>
    </p>
  );
}

function PersonalInfoCollectionContent() {
  return (
    <p className="w-full flex flex-col gap-1">
      <span>
        텍스터즈는 개인정보보호법 등 관련 법령상의 개인정보보호 규정을 준수하며, 관련 법령에 의거한
        개인정보처리방침을 정하여 이용자 권익 보호에 최선을 다하고 있습니다.
      </span>
      <SizedBox height={8} />
      <span className="font-bold text-[18px]">제1조 개인정보의 수집 및 이용 목적</span>
      <span>텍스터즈가 수집한 개인정보는 다음의 목적을 위해 활용합니다.</span>
      <ol className="ps-4">
        <li className="list-decimal list-outside">
          회원 관리회원제서비스 이용에 따른 본인 확인, 개인식별, 불량회원의 부정 이용 방지와 비인가
          사용 방지, 가입 의사 확인, 가입 및 가입횟수 제한, 분쟁 조정을 위한 기록보존, 불만처리 등
          민원처리, 고지사항 전달
        </li>
        <li className="list-decimal list-outside">
          마케팅 및 광고에 활용신규 서비스(제품) 개발 및 특화, 접속 빈도 파악, 회원의 서비스 이용에
          대한 통계, 이벤트 등 광고성 정보 전달
        </li>
      </ol>
      <SizedBox height={8} />
      <span className="font-bold text-[18px]">제2조 수집하는 개인정보 항목 및 수집방법</span>
      <ol className="ps-4">
        <li className="list-decimal list-outside">
          텍스터즈 소셜 회원가입 시 SNS 연결 및 원활한 서비스 제공을 위해 아래와 같은 정보를
          수집합니다.
          <ul className="ps-4">
            <li className="list-disc list-outside">
              필수 수집 항목: 이름(별명), 소셜 이메일 주소, 소셜 고유 키 값
            </li>
            <li className="list-disc list-outside">네이버: 네이버 회원 고유 키 값, 이메일</li>
            <li className="list-disc list-outside">카카오: 카카오 회원 고유 키 값, 이메일</li>
            <li className="list-disc list-outside">구글: 구글 회원 고유 키 값, 이메일</li>
          </ul>
        </li>
        <li className="list-decimal list-outside">
          회사는 다음과 같은 방법으로 개인정보를 수집합니다.
          <ul className="ps-4">
            <li className="list-disc list-outside">홈페이지를 통한 회원가입</li>
            <li className="list-disc list-outside">생성정보 수집 툴을 통한 수집</li>
            <li className="list-disc list-outside">서비스 신청, 이용에 따른 수집</li>
          </ul>
        </li>
      </ol>
      <SizedBox height={8} />
      <span className="font-bold text-[18px]">제3조 아동의 개인정보보호</span>
      <span>
        회사는 법정대리인의 동의가 필요한 만14세 미만인 아동의 개인정보를 수집하지 않으며 회원가입을
        불허하고 있습니다.
      </span>
      <SizedBox height={8} />
      <span className="font-bold text-[18px]">제4조 보관기간</span>
      <span>
        정보 주체로부터 개인정보 수집 시에 동의 받은 개인정보 보유 및 이용기간 내에서만 개인정보를
        처리 및 보유하며, 다른 목적으로는 절대 이용하지 않습니다.단, 전자상거래 등에서의
        소비자보호에 관한 법률, 통신비밀보호법 등 관계법령의 규정에 의하여 보존할 필요가 있는 경우
        회사는 관계법령에서 정한 일정한 기간 동안 개인정보를 보관하며 보관기간은 아래와 같습니다.
      </span>
      <ol className="ps-4">
        <li className="list-decimal list-outside">
          계약 또는 청약철회 등에 관한 기록
          <ul className="ps-4">
            <li className="list-disc list-outside">
              보존 이유 : 전자상거래 등에서의 소비자보호에 관한 법률
            </li>
            <li className="list-disc list-outside">보존 기간 : 5년</li>
          </ul>
        </li>
        <li className="list-decimal list-outside">
          대금결제 및 재화 등의 공급에 관한 기록
          <ul className="ps-4">
            <li className="list-disc list-outside">
              보존 이유 : 전자상거래 등에서의 소비자보호에 관한 법률
            </li>
            <li className="list-disc list-outside">보존 기간 : 5년</li>
          </ul>
        </li>
        <li className="list-decimal list-outside">
          소비자의 불만 또는 분쟁처리에 관한 기록
          <ul className="ps-4">
            <li className="list-disc list-outside">
              보존 이유 : 전자상거래 등에서의 소비자보호에 관한 법률
            </li>
            <li className="list-disc list-outside">보존 기간 : 3년</li>
          </ul>
        </li>
        <li className="list-decimal list-outside">
          방문에 관한 기록(서비스 이용기록, 접속로그, 접속 IP 정보)
          <ul className="ps-4">
            <li className="list-disc list-outside">보존 이유 : 통신비밀보호법</li>
            <li className="list-disc list-outside">보존 기간 : 3개월</li>
          </ul>
        </li>
        <SizedBox height={8} />
        <span>
          회사는 이용자로부터 취득 또는 생성한 개인정보를 AWS (Amazon Web Services Inc.)가 보유하고
          있는 데이터베이스에 저장합니다. AWS는 서비스 이용에 따른 데이터 보관 및 처리를 행하며,
          이용자의 개인정보에 접근할 수 없습니다.
        </span>
      </ol>
      <SizedBox height={8} />
      <span className="font-bold text-[18px]">제5조 개인정보의 파기</span>
      <ol className="ps-4">
        <li className="list-decimal list-outside">
          관련 법령 및 개인정보처리방침에 따라 보유하는 정보를 제외한 모든 회원 및 계정 정보를
          삭제하기 위하여 일정기간 이후 탈퇴처리가 완료됩니다.
        </li>
        <li className="list-decimal list-outside">
          회사는 '개인정보 유효기간제'에 따라 1년간 서비스를 이용하지 않은 회원의 개인정보를 별도로
          분리하여 보관하고 있습니다.
        </li>
        <li className="list-decimal list-outside">
          회원탈퇴, 서비스 종료, 이용자에게 동의 받은 개인정보 보유기간의 도래와 같이 개인정보의
          수집 및 이용목적이 달성된 개인정보는 재생이 불가능한 방법으로 파기하고 있습니다. 법령에서
          보존의무를 부과한 정보에 대해서도 해당 기간 경과 후 지체 없이 재생이 불가능한 방법으로
          파기합니다. 전자적 파일 형태의 경우 복구 및 재생이 되지 않도록 기술적인 방법을 이용하여
          안전하게 삭제하며, 출력물 등은 분쇄하거나 소각하는 방식 등으로 파기합니다.
        </li>
      </ol>
      <SizedBox height={8} />
      <span className="font-bold text-[18px]">
        제6조 개인정보 자동 수집 장치의 설치, 운영 및 거부에 관한 사항
      </span>
      <ol className="ps-4">
        <li className="list-decimal list-outside">
          회원 개개인에게 개인화되고 맞춤화된 서비스를 제공하기 위해서 회사는 회원의 정보를 저장하고
          수시로 불러오는 '쿠키(cookie)'와 로그 분석툴인 Google Analytics 도구를 사용하고 있습니다.
          <ul className="ps-4">
            <li className="list-disc list-outside">
              쿠키란? 쿠키는 웹사이트를 운영하는데 이용되는 서버가 사용자의 브라우저에게 보내는
              조그마한 데이터 꾸러미로 회원 컴퓨터의 하드디스크에 저장됩니다.
            </li>
            <li className="list-disc list-outside">
              쿠키의 사용 목적회원과 비회원의 접속 빈도나 방문 시간 등을 분석, 이용자의 취향과
              관심분야를 파악하여 서비스 제공에 활용합니다.
            </li>
          </ul>
        </li>
        <li className="list-decimal list-outside">
          Google Analytics 분석 툴: 구글 애널리틱스(Google Analytics)는 Google Inc.,(이하
          "구글")에서 제공하는 웹 분석 서비스입니다. 구글 애널리틱스(Google Analytics)는 이용자와
          웹사이트 간의 상호 작용을 분석함으로써 웹사이트를 더욱 개선하기 위해 사용될 수 있는 웹
          분석 도구입니다.
        </li>
        <li className="list-decimal list-outside">
          Google Analytics 분석툴의 사용 목적Google Analytics의 쿠키 및 식별자를 이용하여 인구 통계,
          관심 분야에 대한 잠재고객 생성 및 리마케팅 목록을 기반으로 구글 디스플레이 네트워크와 검색
          광고 캠페인에 대한 관련 광고를 제공합니다.
        </li>
        <li className="list-decimal list-outside">
          쿠키 및 로그 분석 설정 거부 방법회원은 쿠키 설치에 대한 선택권을 가지고 있습니다. 따라서,
          회원은 웹브라우저에서 옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다
          확인을 거치거나, 아니면 모든 쿠키의 저장을 거부할 수 있습니다.
          <ul className="ps-4">
            <li className="list-disc list-outside">
              Chrome의 경우: 웹 브라우저 우측 상단의 더보기 &gt; 설정 &gt; 개인정보 및 보안 &gt;
              사이트 설정 &gt; 쿠키
            </li>
            <li className="list-disc list-outside">
              Google Analytics: Google Analytics 차단 브라우저 기능을
              사용(https://tools.google.com/dlpage/gaoptout)
            </li>
          </ul>
        </li>
        <li className="list-decimal list-outside">
          단, 쿠키 설치를 거부하였을 경우 일부 서비스의 이용이 어려울 수 있습니다.
        </li>
      </ol>
      <SizedBox height={8} />
      <span className="font-bold text-[18px]">제7조 동의를 거부할 권리 및 거부 경우의 불이익</span>
      <span>
        텍스터즈가 위와 같이 수집하는 개인정보에 대해 동의하지 않거나 개인정보를 기재하지 않음으로써
        거부할 수 있습니다. 다만, 이때 회원에게 제공되는 서비스가 제한될 수 있습니다.
      </span>
      <SizedBox height={8} />
      <span className="font-bold text-[18px]">제8조 권익침해 구제방법</span>
      <span>
        고객은 개인정보침해로 인한 신고나 상담이 필요하신 경우 "회사" 고객센터 또는 아래 기관에
        문의하시기 바랍니다.
      </span>
      <ul className="ps-4">
        <li className="list-disc list-outside">
          개인정보분쟁조정위원회(www.kopico.go.kr / 02-1833-6972)
        </li>
        <li className="list-disc list-outside">
          한국인터넷진흥원 개인정보침해신고센터(privacy.kisa.or.kr / 국번없이 118)
        </li>
        <li className="list-disc list-outside">
          정보보호마크인증위원회(www.eprivacy.or.kr / 02-550-9531~2)
        </li>
        <li className="list-disc list-outside">
          대검찰청 사이버범죄수사단(www.spo.go.kr / 국번없이 1301)
        </li>
        <li className="list-disc list-outside">
          경찰청 사이버안전국(cyberbureau.police.go.kr / 국번없이 182)
        </li>
      </ul>
      <SizedBox height={8} />
      <span className="font-bold text-[18px]">제9조 개인정보 보호책임자</span>
      <span>개인정보 보호책임자: “운영진”</span>
      <span>email: teamdiff.texters@gmail.com</span>
    </p>
  );
}
