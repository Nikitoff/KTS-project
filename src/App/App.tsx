import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "../Pages/MainPage/MainPage";
import RecipePage from "../Pages/RecipePage/RecipePage";
import NavigationBar from "../components/ui/NavigationMenu/NavigationMenu"
import styles from '../App/App.module.css'
import { RootStoreContext, RootStore } from '../stores/RootStore';
import { observer } from "mobx-react-lite";

const rootStore = new RootStore();


const App = () => {
  return (
    <RootStoreContext.Provider value={rootStore}>
      <div className={styles.pageBackground}>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/recipe/:documentId" element={<RecipePage />} />
        </Routes>
      </div>
    </RootStoreContext.Provider>
  );
};

export default App;