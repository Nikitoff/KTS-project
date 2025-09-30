import React from "react";
import styles from "./Pagination.module.scss";

type PaginationProps = {
    current: number;
    total: number;
    onChange: (page: number) => void;
    prevIcon?: React.ReactNode;
    nextIcon?: React.ReactNode;
    className?: string;
    pageClassName?: string;
    dotsClassName?: string;
};

const Pagination: React.FC<PaginationProps> = ({
    current,
    total,
    onChange,
    prevIcon,
    nextIcon,
    className,
    pageClassName,
    dotsClassName,
}) => {
    const build = () => {
        const items: Array<{ key: string; page?: number; dots?: boolean; active?: boolean }> = [];
        const maxVisible = 5;
        if (total <= maxVisible) {
            for (let i = 1; i <= total; i++) items.push({ key: `p-${i}`, page: i, active: i === current });
        } else {
            items.push({ key: `p-1`, page: 1, active: current === 1 });
            if (current > 3) items.push({ key: `d-l`, dots: true });
            const start = Math.max(2, current - 1);
            const end = Math.min(total - 1, current + 1);
            for (let i = start; i <= end; i++) items.push({ key: `p-${i}`, page: i, active: i === current });
            if (current < total - 2) items.push({ key: `d-r`, dots: true });
            items.push({ key: `p-${total}`, page: total, active: current === total });
        }
        return items;
    };

    return (
        <div className={className}>
            <button className={styles.button} onClick={() => onChange(current - 1)} disabled={current === 1} aria-label="Previous page">
                <img src="/arrowleft.svg"></img>
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {build().map((item) =>
                    item.dots ? (
                        <span key={item.key} className={dotsClassName}>...</span>
                    ) : (
                        <button
                            key={item.key}
                            className={`${pageClassName} ${item.active ? `${pageClassName} active` : ""}`}
                            onClick={() => item.page && onChange(item.page)}
                            disabled={item.active}
                        >
                            {item.page}
                        </button>
                    )
                )}
            </div>
            <button className={styles.button} onClick={() => onChange(current + 1)} disabled={current >= total} aria-label="Next page">
                <img src="/arrowright.svg"></img>
            </button>
        </div>
    );
};

export default Pagination;


