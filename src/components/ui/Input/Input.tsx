import React from "react";
import styles from "./Input.module.scss";

export type InputProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    afterSlot?: React.ReactNode;
    disabled?: boolean;
    className?: string;
};

const Input: React.FC<InputProps> = ({ value, onChange, placeholder, afterSlot, disabled }) => {
    return (
        <div className={styles.inputContainer}>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className={styles.input}
            />
            {afterSlot && <div className={styles.afterSlot}>{afterSlot}</div>}
        </div>
    );
};

export default Input;