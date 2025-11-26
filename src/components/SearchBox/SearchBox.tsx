import type { ChangeEvent } from "react";
import { useDebounce } from "use-debounce";
import { useEffect, useState } from "react";
import css from "./SearchBox.module.css";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  const [inputValue, setInputValue] = useState(value);
  const [debouncedValue] = useDebounce(inputValue, 500);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Search notes"
      value={inputValue}
      onChange={handleChange}
      className={css.input}
    />
  );
}
