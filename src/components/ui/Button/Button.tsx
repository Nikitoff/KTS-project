import React from 'react';
import Loader from '../Loader';
import './Button.module.scss';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {

    loading?: boolean;

    children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({
    children,
    loading = false,
    className,
    onClick,
    disabled: disabledProp = false,
    ...rest
}) => {

    const isDisabled = loading || disabledProp;

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        if (isDisabled) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        onClick?.(e);
    };

    const finalClassName = [
        'button',
        loading && 'button_loading',
        disabledProp && 'button_disabled', // только если передан disabled
        className]
        .filter(Boolean).join(' ');

    return (
        <button
            className={finalClassName}
            disabled={isDisabled}
            onClick={handleClick}
            {...rest}
        >
            {loading && <Loader size="s" />}
            <span className="button__text">{children}</span>
        </button>
    );
};

export default Button;
