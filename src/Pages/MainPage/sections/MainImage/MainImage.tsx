import React from "react";
import styles from "./MainImage.module.css";

const MainImage = () => {
    return (
        <div className={styles.MainImage}>
            <div className={styles.background}></div>
            <div className={styles.content}>
                <img src="/MainImageText.svg"></img>
            </div>
        </div>
    );
};

export default MainImage;