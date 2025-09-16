import * as React from 'react'
import '../../styles/styles.css';
import './Text.css';

export type TextProps = {
    /** Дополнительный класс */
    className?: string;
    /** Стиль отображения */
    view?: 'title' | 'button' | 'p-20' | 'p-18' | 'p-16' | 'p-14';
    /** Html-тег */
    tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'p' | 'span';
    /** Начертание шрифта */
    weight?: 'normal' | 'medium' | 'bold';
    /** Контент */
    children: React.ReactNode;
    /** Цвет */
    color?: 'primary' | 'secondary' | 'accent';
    /** Максимальное кол-во строк */
    maxLines?: number;
};

const Text: React.FC<TextProps> = ({ className, view, tag, weight, children, color, maxLines }) => {
    let Tag = tag ?? 'p';
    view = view ?? 'title';
    weight = weight ?? 'normal'
    color = color ?? 'primary';

    const extraStyle = (maxLines !== undefined) ? { style: {
        WebkitLineClamp: maxLines,
        lineClamp: maxLines,
    }} : {};

    const allClasses = [
        className,
        'text',
        `text-view-${view}`,
        `text-weight-${weight}`,
        (color !== undefined ) ? `text-color-${color}` : '',
        (maxLines !== undefined) ? 'text-limited' : '',
    ].filter(Boolean).join(' ');

    
    return <Tag {...extraStyle} className={allClasses}>{children}</Tag>
}

export default Text;
