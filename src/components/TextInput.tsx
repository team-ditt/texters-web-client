import * as React from 'react';

import { ReactComponent as InvalidInputIcon } from '@assets/icons/invalid-input.svg';
import classNames from 'classnames';

type Props = React.HTMLProps<HTMLInputElement> & {
  label?: string;
  supportingMessage?: string;
  invalid?: boolean;
  invalidMessage?: string;
};

export default React.forwardRef(function TextInput(
  {
    label,
    supportingMessage,
    invalid = false,
    invalidMessage,
    onInput,
    required,
    ...props
  }: Props,
  ref: React.ForwardedRef<any>,
) {
  return (
    <div className="flex-1 flex flex-col items-start gap-[4px]">
      {label ? (
        <div className="w-full px-1 flex flex-row items-center gap-[4px] text-black-500">
          <span
            className={classNames('text-caption text-inherit', {
              'text-point-red': invalid,
            })}
          >
            {label}
          </span>
          {required ? (
            <span className="text-caption text-point-red">*</span>
          ) : null}
        </div>
      ) : null}

      <input
        ref={ref}
        className={classNames(
          'w-full h-[48px] px-4 border border-black-400 rounded-[4px] text-body-2 text-black-700 focus:text-black',
          {
            'border-point-red': invalid,
            'focus:outline-point-red': invalid,
          },
        )}
        onInput={onInput}
        {...props}
      />

      {!invalid ? (
        <div className="w-full h-[18px] flex flex-row items-center gap-[4px]">
          <span className="px-1 text-caption text-black-500">
            {supportingMessage}
          </span>
        </div>
      ) : (
        <div className="w-full h-[18px] flex flex-row items-center gap-[4px]">
          <InvalidInputIcon />
          <span className="text-caption text-point-red">{invalidMessage}</span>
        </div>
      )}
    </div>
  );
});
