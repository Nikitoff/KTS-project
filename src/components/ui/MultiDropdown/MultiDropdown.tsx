import React, { useState, useRef, useEffect } from "react";
import styles from "./MultiDropdown.module.scss";
import ArrowDownIcon from "../Icon/ArrowDownIcon";
export type Option = {
  key: string;
  value: string;
};

export type MultiDropdownProps = {
  options: Option[];
  value: Option[];
  onChange: (value: Option[]) => void;
  getTitle: (value: Option[]) => string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

const MultiDropdown: React.FC<MultiDropdownProps> = ({
  options,
  value,
  onChange,
  getTitle,
  placeholder = "Выберите...",
  disabled,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedTitle = value.length > 0 ? getTitle(value) : "";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleItemClick = (option: Option) => {
    const isSelected = value.some((v) => v.key === option.key);
    let newValue: Option[];

    if (isSelected) {
      newValue = value.filter((v) => v.key !== option.key);
    } else {
      newValue = [option]; // Одиночный выбор
    }

    onChange(newValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`${styles.dropdownContainer} ${className}`.trim()}>
      <input
        type="text"
        value={selectedTitle}
        placeholder={!selectedTitle ? placeholder : ""}
        readOnly
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={styles.input}
      />

      <div className={styles.arrowIcon}>
        <ArrowDownIcon color="secondary" />
      </div>

      {isOpen && !disabled && (
        <div className={styles.dropdownMenu}>
          {options.map((option) => (
            <div
              key={option.key}
              className={`${styles.dropdownItem} ${value.some((v) => v.key === option.key) ? styles["dropdownItem active"] : ""
                }`}
              onClick={() => handleItemClick(option)}
            >
              {option.value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiDropdown;