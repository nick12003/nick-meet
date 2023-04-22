import { useState, useRef } from "react";

export default function useCompositions(defaultValue, onExecute, isClear) {
  const [value, setValue] = useState(defaultValue);
  const compositionLockRef = useRef(false);

  const handleExecute = (value) => {
    if (onExecute) {
      onExecute(value);
      if (isClear) {
        setValue("");
      }
    }
  };

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !compositionLockRef.current) {
      handleExecute(value);
    }
  };

  const onComposition = (event) => {
    if (event.type === "compositionend") {
      compositionLockRef.current = false;
    } else {
      compositionLockRef.current = true;
    }
  };

  return {
    value,
    setValue,
    onChange,
    onKeyDown,
    onComposition,
  };
}
