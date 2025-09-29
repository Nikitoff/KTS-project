import AppRouter from "../config/router";
import NavigationBar from "components/ui/NavigationMenu/NavigationMenu"
import styles from './App.module.scss'
import { RootStoreContext, RootStore } from 'stores/RootStore';



const rootStore = new RootStore();


const App = () => {
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