
import { Routes, Route } from "react-router-dom";
import MainPage from "../Pages/MainPage/MainPage";
import RecipePage from "../Pages/RecipePage/RecipePage";
import FavoritesPage from "../Pages/FavoritesPage/FavoritesPage";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/recipe/:documentId" element={<RecipePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
    );
};

export default AppRouter;


