import { Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "../styles/GlobalStyle";
import { theme } from "../styles/theme";
import { AppLayout } from "./AppLayout";
import { Home } from "../pages/Home";
import { Ingredients } from "../pages/Ingredients";
import { Recipes } from "../pages/Recipes";
import { ShoppingList } from "../pages/ShoppingList";
import { Favorites } from "../pages/Favorites";

export function App() {
  return (
    <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/ingredients" element={<Ingredients />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/shopping-list" element={<ShoppingList />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Route>
    </Routes>

    </ThemeProvider>
  
  );
}
