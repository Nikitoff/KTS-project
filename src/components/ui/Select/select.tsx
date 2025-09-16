"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./CustomSelect.module.css";

// Замена cn (если не используешь)
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

type SelectProps = {
  children: React.ReactNode;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
};

type SelectTriggerProps = {
  children: React.ReactNode;
};

type SelectContentProps = {
  children: React.ReactNode;
  position?: "popper" | "item-aligned";
};

type SelectItemProps = {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
};

type SelectGroupProps = {
  children: React.ReactNode;
};

type SelectLabelProps = {
  children: React.ReactNode;
};

type SelectSeparatorProps = {
  className?: string;
};

// Основной контекст для передачи значения
const SelectContext = React.createContext<{
  value: string;
  setValue: (value: string) => void;
} | null>(null);

const Select = ({ children, onValueChange, defaultValue = "" }: SelectProps) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (onValueChange) onValueChange(value);
  }, [value, onValueChange]);

  return (
    <SelectContext.Provider value={{ value, setValue }}>
      {children}
    </SelectContext.Provider>
  );
};

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ children }, ref) => {
    const context = React.useContext(SelectContext);
    if (!context) throw new Error("Select.Trigger must be used inside Select");

    const [open, setOpen] = useState(false);

    return (
      <button
        ref={ref}
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>{children || "Выберите значение"}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${styles.icon} ${open ? 'rotate-180' : ''}`}
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>

        {open && (
          <div className={styles.content} onClick={(e) => e.stopPropagation()}>
            {React.Children.map(children, child => {
              if (React.isValidElement(child) && child.type === SelectContent) {
                return React.cloneElement(child);
              }
              return null;
            })}
          </div>
        )}
      </button>
    );
  }
);

SelectTrigger.displayName = "SelectTrigger";

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ children }, ref) => {
    // В этом простом варианте мы не реализуем портал, но можно добавить через createPortal
    return <div ref={ref}>{children}</div>;
  }
);

SelectContent.displayName = "SelectContent";

const SelectGroup = ({ children }: SelectGroupProps) => {
  return <div>{children}</div>;
};

const SelectValue = ({ children }: { children: React.ReactNode }) => {
  const context = React.useContext(SelectContext);
  if (!context) return null;

  return <>{children}</>;
};

const SelectLabel = ({ children }: SelectLabelProps) => {
  return <div style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 'bold', color: '#666' }}>
    {children}
  </div>;
};

const SelectItem = ({ value, children, disabled }: SelectItemProps) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("Select.Item must be used inside Select");

  const { value: selectedValue, setValue } = context;

  const isSelected = selectedValue === value;

  return (
    <div
      className={cn(
        styles.item,
        isSelected && styles.selected,
        disabled && "opacity-50 cursor-not-allowed"
      )}
      onClick={() => {
        if (!disabled) {
          setValue(value);
          // Закрываем меню (через клик вне — реализовано в Trigger)
        }
      }}
      role="option"
      aria-selected={isSelected}
      tabIndex={0}
    >
      {children}
      {isSelected && (
        <span style={{ float: 'right' }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={styles.icon}
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </span>
      )}
    </div>
  );
};

const SelectSeparator = () => {
  return <div className={styles.separator} />;
};

// Экспортируем те же имена, что и Radix
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  // ScrollUp/Down кнопки опциональны — можно добавить позже
};
