import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "../Pages/MainPage/MainPage";
import RecipePage from "../Pages/RecipePage/RecipePage";
import NavigationBar from "../components/ui/NavigationMenu/NavigationMenu"
import styles from '../App/App.module.css'

const App = () => {
  return (
    <div className={styles.pageBackground}>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/recipe/:documentId" element={<RecipePage />} />
      </Routes>
    </div>
  );
};

export default App;