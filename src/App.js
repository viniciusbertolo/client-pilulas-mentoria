import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Home from './Pages/Home';
import Cadastro from './Pages/Cadastro';
import CadastroInternacional from './Pages/CadastroInternacional';
import HomeCurso from "./Pages/HomeCurso";
import PoliticasPrivacidade from "./Pages/PoliticasPrivacidade";
import VideoCurso from "./Pages/VideoCurso";
import Pergunta from "./Pages/Pergunta";
import Error from "./Pages/404";
import LpGirandoChave from "./Pages/Lp-girando-chave";
import Relatorios from "./Pages/Relatorios";
import Controle from "./Pages/Controle";
import UsuariosSistema from "./Pages/UsuariosSistema";
import UploadCurso from "./Pages/UploadCurso";
import UploadAula from "./Pages/UploadAula";
import UploadRespostas from "./Pages/UploadRespostas";
import Uploads from "./Pages/Uploads";
import TodosCursos from "./Pages/TodosCursos";
import ControleEmpresa from "./Pages/ControleEmpresa";
import AreaDownload from "./Pages/AreaDownloads";
import UpdateSenha from "./Pages/UpdateSenha/updateSenha";

const user = localStorage.getItem('@user');

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={user ? <Home/>: <Navigate to="/login"/>} />
          <Route path="/politicas" element={<PoliticasPrivacidade/>} />
          <Route path="/nova-senha" element={<UpdateSenha/>} />
          <Route path="/login" element={user ? <Navigate to="/"/> : <Login/>} />
          <Route path="/materiais" element={user ? <AreaDownload/> : <Navigate to="/login"/>} />
          <Route path="/todos-cursos" element={user ? <TodosCursos/> : <Navigate to="/login"/>} />
          <Route path="/cursos" element={user ? <Dashboard/> : <Navigate to="/login"/>} />
          <Route path="/cursos/:id" element={user ? <HomeCurso/> : <Login/>} />
          <Route path="/videoCurso/:idCurso/:id" element={user ? <VideoCurso/> : <Login/>} />
          <Route path="/pergunta/:idCurso/:id" element={user ? <Pergunta/> : <Login/>} />
          <Route path="/seja-um-membro" element={user ? <Navigate to="/"/> : <Cadastro/>} />
          <Route path="/seja-um-membro-internacional" element={user ? <Navigate to="/"/> : <CadastroInternacional/>} />
          <Route path="/girando-a-chave" element={<LpGirandoChave/>} />
          <Route path="/relatorios" element={user ? <Relatorios/> : <Navigate to="/login"/>} />
          <Route path="/controlePessoas/:id" element={user ? <Controle/> : <Navigate to="/login"/>} />
          <Route path="/usuarios-sistema/:email" element={user ? <UsuariosSistema/> : <Navigate to="/login"/>} />
          <Route path="/controle-empresa/:empresa" element={user ? <ControleEmpresa/> : <Navigate to="/login"/>} />
          <Route path="/upload-curso" element={user ? <UploadCurso/> : <Navigate to="/login"/>} />
          <Route path="/upload-aula" element={user ? <UploadAula/> : <Navigate to="/login"/>} />
          <Route path="*" element={<Error/>} />
          <Route path="/upload-resposta" element={user ? <UploadRespostas/> : <Navigate to="/login"/>} />
          <Route path="/uploads" element={user ? <Uploads/> : <Navigate to="/login"/>} />
          <Route path="*" element={<Error/>} />
      </Routes>
    </Router>

  );
}

export default App;

