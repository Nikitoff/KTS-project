import React from 'react';
import styles from './Loader.module.scss';




export type LoaderProps = {
    /** Размер */
    size?: 's' | 'm' | 'l';
    /** Дополнительный класс */
    className?: string;
};

const Loader: React.FC<LoaderProps> = ({ size = 'l', className = '' }) => {
    return (
        <div className={`${styles.loader} ${styles[`loader_size_${size}`]} ${className}`}>
            {size === 's' && <img src="/loaderS.svg" alt="loader" className={styles.animatedSvg} />}
            {size === 'm' && <img src="/loaderM.svg" alt="loader" className={styles.animatedSvg} />}
            {size === 'l' && <img src="/loaderL.svg" alt="loader" className={styles.animatedSvg} />}
        </div>
    );
};

export default Loader;



