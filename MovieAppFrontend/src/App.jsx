import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";
import Home, { HOME_PAGE_PATH } from "./pages/Home";
import AddMovie, { ADD_MOVIE_PAGE_PATH } from "./pages/AddMovie";
import MovieDetail, { MOVIE_DETAIL_PAGE_PATH } from "./pages/MovieDetail";

console.log(import.meta.env)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path={HOME_PAGE_PATH} element={<Home />} />
        <Route exact path={ADD_MOVIE_PAGE_PATH} element={<AddMovie />} />
        <Route exact path={MOVIE_DETAIL_PAGE_PATH} element={<MovieDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
