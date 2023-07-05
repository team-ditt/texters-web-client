import {ChangeEvent, useState} from "react";

type Validator = (text: string) => boolean;

export default function useTextInput(validator: Validator = (text: string) => true) {
  const [value, setValue] = useState("");
  const [isValid, setIsValid] = useState(true);

  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    const text = e.currentTarget.value;
    setIsValid(text ? validator(text) : true);
    setValue(text);
  };
  const reset = () => {
    setValue("");
    setIsValid(true);
  };

  return {value, isValid, onInput, reset};
}
