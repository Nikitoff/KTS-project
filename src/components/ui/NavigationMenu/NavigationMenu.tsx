import React from "react";
import styles from "./NavigationMenu.module.css";

const NavigationMenu = () => {
  const navItems = [
    { label: "Recipes", isActive: true },
    { label: "Meals Categories", isActive: false },
    { label: "Products", isActive: false },
    { label: "Menu Items", isActive: false },
    { label: "Meal Planning", isActive: false },
  ];

  return (
    <nav className={styles.navbar}>
      {/* Логотип */}
      <img
        src="/logo-simple-framed-green-gradient 1.svg"
        alt="Logo"
        className={styles.logoIcon}
      />
      <div className={styles.logoWrapper}>
        <span className={styles.logoText}>Food Client</span>
      </div>

      {/* Иконка пользователя */}
      <img
        src="/userIcon.svg"
        alt="Logo"
        className={styles.userIcon}
      />

      <img
        src="/heart.svg"
        alt="Logo"
        className={styles.heartIcon}
      />

      {/* Меню навигации */}
      <div className={styles.navMenu}>
        {navItems.map((item) => (
          <div key={item.label} className={styles.navItem}>
            <a
              href="#"
              className={`${styles.navLink} ${item.isActive ? styles["navLink.active"] : ""}`}
            >
              {item.label}
            </a>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default NavigationMenu;