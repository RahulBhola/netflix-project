import React from "react";
import DevPage from "./components/developer/Developer";
import HomePage from "./components/Home";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UpdateSeason from "./components/developer/UpdateSeason";
import Movie from "./components/developer/Movie";
import Series from "./components/developer/Series";
import NewSeason from "./components/developer/NewSeason";

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

      </Routes>
    </BrowserRouter>

  );
}

export default App;

   