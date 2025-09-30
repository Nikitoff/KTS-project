import React from "react";
import styles from "./NavigationMenu.module.scss";
import { useNavigate } from "react-router-dom";

const NavigationMenu = () => {
  const navItems = [
    { label: "Recipes", isActive: true },
    { label: "Meals Categories", isActive: false },
    { label: "Products", isActive: false },
    { label: "Menu Items", isActive: false },
    { label: "Meal Planning", isActive: false },
  ];
  const navigate = useNavigate();

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>
        <div className={styles.logoWrapper}>
          <img
            src="/logo-simple-framed-green-gradient 1.svg"
            alt="Logo"
            className={styles.logoIcon}
          />
          <span className={styles.logoText}>Food Client</span>
        </div>

        <div className={styles.navMenu}>
          {navItems.map((item) => (
            <div key={item.label} className={styles.navItem}>
              <a href="#" className={`${styles.navLink} ${item.isActive ? styles.active : ""}`}>
                {item.label}
              </a>
            </div>
          ))}
        </div>

        <div className={styles.navActions}>
          <img
            src="/heart.svg"
            alt="favorites"
            onClick={() => navigate("/favorites")}
            className={styles.heartIcon}
          />
          <img
            src="/userIcon.svg"
            alt="user"
            className={styles.userIcon}
          />
        </div>
      </div>
    </nav>
  );
};

export default NavigationMenu;