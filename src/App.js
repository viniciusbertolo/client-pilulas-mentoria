import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Home from './Pages/Home';
import Cadastro from './Pages/Cadastro';
import HomeCurso from "./Pages/HomeCurso";
import PoliticasPrivacidade from "./Pages/PoliticasPrivacidade";
import VideoCurso from "./Pages/VideoCurso";
import Pergunta from "./Pages/Pergunta";
import Error from "./Pages/404";

const user = localStorage.getItem('@user');
function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={user ? <Home/>: <Navigate to="/login"/>} />
          <Route path="/politicas" element={<PoliticasPrivacidade/>} />
          <Route path="/login" element={user ? <Navigate to="/"/> : <Login/>} />
          <Route path="/cursos" element={user ? <Dashboard/> : <Navigate to="/login"/>} />
          <Route path="/cursos/:id" element={user ? <HomeCurso/> : <Login/>} />
          <Route path="/videoCurso/:idCurso/:id" element={user ? <VideoCurso/> : <Login/>} />
          <Route path="/pergunta/:idCurso/:id" element={user ? <Pergunta/> : <Login/>} />
          <Route path="/cadastro" element={user ? <Navigate to="/"/> : <Cadastro/>} />
          <Route path="*" element={<Error/>} />
      </Routes>
    </Router>

  );
}

export default App;

