import AppRouter from "../config/router";
import NavigationBar from "components/ui/NavigationMenu/NavigationMenu"
import styles from './App.module.scss'
import { RootStoreContext, RootStore } from 'stores/RootStore';
import { useEffect, useState } from 'react';
import Loader from "components/ui/Loader/Loader";

const App = () => {
  const [rootStore] = useState(() => new RootStore());
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await rootStore.recipeStore.initialize();
      } catch (error) {
        console.error('Ошибка инициализации приложения:', error);
      } finally {
        setIsInitialized(true);
      }
    };
    init();
  }, [rootStore]);

  if (!isInitialized) {
    return (
      <div className={styles.pageBackground}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Loader></Loader>
        </div>
      </div>
    );
  }

  return (
    <RootStoreContext.Provider value={rootStore}>
      <div className={styles.pageBackground}>
        <NavigationBar />
        <AppRouter />
      </div>
    </RootStoreContext.Provider>
  );
};

export default App;