import React from "react";
import DevPage from "./pages/developer/Developer";
import HomePage from "./components/Home";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UpdateSeason from "./pages/developer/UpdateSeason";
import Movie from "./pages/developer/Movie";
import Series from "./pages/developer/Series";
import NewSeason from "./pages/developer/NewSeason";
import List from "./pages/List";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<HomePage/>}/>
        <Route path="/devpage" element={<DevPage/>}/>
        <Route path="/devpage/series" element={<Series/>}/>
        <Route path="/devpage/Movie" element={<Movie/>}/>
        <Route path="/devpage/new-season" element={<NewSeason/>}/>
        <Route path="/devpage/updateseason" element={<UpdateSeason/>}/>
        <Route path="/devpage/movie" element={<Movie/>}/>
        <Route path="/myList" element={<List/>}/>


      </Routes>
    </BrowserRouter>

  );
}

export default App;

   