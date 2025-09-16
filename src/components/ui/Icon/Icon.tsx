import * as React from 'react'

export type IconProps = React.SVGAttributes<SVGElement> & {
    className?: string;
    color?: 'primary' | 'secondary' | 'accent';
};

const Icon: React.FC<React.PropsWithChildren<IconProps>> = ({
 className,
 color,
 width = 24,
 height =24 ,
 children,
 style,
...rest
}) => {
 // Если height не задан, делаем пропорционально width
// const finalHeight = height ?? (width === 24 ? 24 : 'auto');

 return (
 <svg
 className={className}
 width={width}
 height={height}
 viewBox="0 0 24 24"
 fill="none"
 xmlns="http://www.w3.org/2000/svg"
 style={{
 color: 'inherit',
...(color === 'primary' && { color: '#000000' }),
...(color === 'secondary' && { color: '#00000033' }),
...(color === 'accent' && { color: '#518581' }),
...style,
 }}
 {...rest}
 >
 {children}
 </svg>
 );
};

export default Icon;
