import * as React from 'react';

import { ReactComponent as WarningAccount } from '@assets/icons/warning-account.svg';
import ReactModal from 'react-modal';

type Props = ReactModal.Props & {
  icon?: React.FunctionComponent<any>;
  title: string;
  message?: string;
};

export default function Alert({
  icon = WarningAccount,
  title,
  message,
  onRequestClose,
  ...props
}: Props) {
  const ModalIcon = icon;

  return (
    <ReactModal
      overlayClassName="fixed inset-0 bg-overlay"
      className="absolute top-2/4 left-2/4 translate-x-[-50%] translate-y-[-50%] w-[240px] outline-none drop-shadow-md bg-white rounded-[8px] px-4 py-6 flex flex-col gap-[16px] items-center"
      closeTimeoutMS={200}
      onRequestClose={onRequestClose}
      appElement={document.getElementById('root') as HTMLElement}
      {...props}
    >
      <ModalIcon />
      <div className="w-full flex flex-col items-center gap-[8px]">
        <span className="text-subhead-1 text-black">{title}</span>
        {message ? (
          <span className="text-body-2 text-black">{message}</span>
        ) : null}
      </div>
      <button className="btn btn-medium btn-primary" onClick={onRequestClose}>
        OK
      </button>
    </ReactModal>
  );
}
