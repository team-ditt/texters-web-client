import {Modal, SizedBox} from "@/components";
import {OfficialDocumentType} from "@/constants";
import {useModal} from "@/hooks";
import {ReactComponent as CheckboxIcon} from "assets/icons/checkbox.svg";
import {ReactComponent as RightArrowIcon} from "assets/icons/right-arrow.svg";
import {Dispatch, SetStateAction, useEffect, useState} from "react";

type Props = {
  allAgreed: boolean;
  setAllAgreed: Dispatch<SetStateAction<boolean>>;
};

export default function TermsAndConditionsForm({allAgreed, setAllAgreed}: Props) {
  const [agreedToTermsAndConditions, setAgreedToTermsAndConditions] = useState(false);
  const [agreedToPrivacyPolicy, setAgreedToPrivacyPolicy] = useState(false);
  const [agreedToOver14, setAgreedToOver14] = useState(false);

  const {isOpen, openModal, closeModal} = useModal();
  const [documentType, setDocumentType] = useState<OfficialDocumentType>("terms and conditions");

  const onToggleAllGreed = () => {
    const toBe = !allAgreed;
    setAgreedToTermsAndConditions(toBe);
    setAgreedToPrivacyPolicy(toBe);
    setAgreedToOver14(toBe);
  };
  const onToggleAgreedToTermsAndConditions = () => setAgreedToTermsAndConditions(state => !state);
  const onToggleAgreedToPrivacyPolicy = () => setAgreedToPrivacyPolicy(state => !state);
  const onToggleAgreedToOver14 = () => setAgreedToOver14(state => !state);

  const onOpenModal = (type: OfficialDocumentType) => {
    setDocumentType(type);
    openModal();
  };
  const onAgree = () => {
    switch (documentType) {
      case "terms and conditions":
        return setAgreedToTermsAndConditions(true);
      case "privacy policy":
        return setAgreedToPrivacyPolicy(true);
    }
  };

  useEffect(() => {
    if (!allAgreed) return;
    setAgreedToTermsAndConditions(allAgreed);
    setAgreedToPrivacyPolicy(allAgreed);
    setAgreedToOver14(allAgreed);
  }, [allAgreed]);

  useEffect(() => {
    setAllAgreed(agreedToTermsAndConditions && agreedToPrivacyPolicy && agreedToOver14);
  }, [agreedToTermsAndConditions, agreedToPrivacyPolicy, agreedToOver14]);

  return (
    <>
      <div className="grow-[4]">
        <div className="flex items-center">
          <CheckBox isChecked={allAgreed} onToggle={onToggleAllGreed} />
          <SizedBox width={12} />
          <button className="text-[17px] font-bold" onClick={onToggleAllGreed}>
            전체 동의하기
          </button>
        </div>
        <SizedBox height={12} />
        <div className="border-[#A9A9A9] border-t-[1.5px]" />
        <SizedBox height={20} />
        <div className="flex items-start">
          <CheckBox
            isChecked={agreedToTermsAndConditions}
            onToggle={onToggleAgreedToTermsAndConditions}
          />
          <SizedBox width={12} />
          <div className="flex flex-col items-start">
            <button className="text-[14px]" onClick={onToggleAgreedToTermsAndConditions}>
              (필수) 텍스터즈의 서비스 약관에 동의합니다.
            </button>
            <button
              className="flex items-center gap-1 text-[13px] text-[#C1C1C1]"
              onClick={() => onOpenModal("terms and conditions")}>
              자세히보기
              <RightArrowIcon />
            </button>
          </div>
        </div>
        <SizedBox height={16} />
        <div className="flex items-start">
          <CheckBox isChecked={agreedToPrivacyPolicy} onToggle={onToggleAgreedToPrivacyPolicy} />
          <SizedBox width={12} />
          <div className="flex flex-col">
            <button className="text-[14px]" onClick={onToggleAgreedToPrivacyPolicy}>
              (필수) 텍스터즈의 개인정보 수집 및 이용에 동의합니다.
            </button>
            <button
              className="flex items-center gap-1 text-[13px] text-[#C1C1C1]"
              onClick={() => onOpenModal("privacy policy")}>
              자세히보기
              <RightArrowIcon />
            </button>
          </div>
        </div>
        <SizedBox height={16} />
        <div className="flex items-start">
          <CheckBox isChecked={agreedToOver14} onToggle={onToggleAgreedToOver14} />
          <SizedBox width={12} />
          <div className="flex flex-col">
            <button className="text-[14px]" onClick={onToggleAgreedToOver14}>
              (필수) 만 14세 이상입니다.
            </button>
          </div>
        </div>
      </div>

      <Modal.OfficialDocument
        isOpen={isOpen}
        type={documentType}
        onAgree={onAgree}
        onRequestClose={closeModal}
      />
    </>
  );
}

function CheckBox({isChecked, onToggle}: {isChecked: boolean; onToggle: () => void}) {
  return (
    <button
      className="w-[22px] h-[22px] min-w-[22px] min-h-[22px] rounded border border-[#A9A9A9] bg-transparent transition-colors duration-100 flex justify-center items-center"
      style={{
        borderColor: isChecked ? "#666666" : "#A9A9A9",
        backgroundColor: isChecked ? "#666666" : "transparent",
      }}
      onClick={onToggle}>
      <CheckboxIcon />
    </button>
  );
}
