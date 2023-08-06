import React, { useEffect, useState } from "react";
import "./index.css";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import Loading from "../../Components/Loading";

export default function Relatorios() {
  const user = JSON.parse(localStorage.getItem("@user"));

  const [removeLoadin, setRemoveLoading] = useState(false);

  const [usuarios, setUsuarios] = useState([]);
  const [cursos, setCursos] = useState([]);

  async function obterUsuarios() {
    const response = await fetch(`http://localhost:3001/usuarios`, {
      method: "GET",
      headers: { "Content-type": "application/json" },
    });

    const respostaJson = await response.json();
    setUsuarios(respostaJson);
    // setRemoveLoading(true)
  }

  useEffect(() => {
    async function obterCursos() {
      const resposta = await fetch(`http://localhost:3001/cursos`, {
        method: "GET",
        headers: { "Content-type": "application/json" },
      });
      const respostaJson = await resposta.json();
      setCursos(respostaJson);
      setRemoveLoading(true);
    }
    obterCursos();

    obterUsuarios();
  }, []);

  // console.log(usuarios);

  return (
    <div className="pag_todo">
      <Navbar />

      <div className="detalhe_imagem_dash"></div>

      <div className="boas_vindas_cursos">
        <h1>Olá, você está na área de controle do Pilulas de Mentoria</h1>
        <Link to="/" className="voltar_para_home">
          <NavigateBeforeIcon />
          Voltar
        </Link>
      </div>

      {!removeLoadin && <Loading />}

      <div className="dash_cursos">
        {cursos.map((value, key) => (
          <div className="card_cursos" key={key}>
            <div
              className="textos_cursos"
              // onClick={() => obterEtapaAtual(value.ID_CURSO)}
            >
              <h1 className="titulo_curso_adm">{value.nome}</h1>
            </div>
            <Link to={`/controlePessoas/${value.ID_CURSO}`}>
              <h6 className="detalhes_pessoas_button">
                Ver colaboradores neste curso
              </h6>
            </Link>
          </div>
        ))}
      </div>

<div className="controle_pessoas">
  
      <table class="styled-table tabela_users">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th></th>
          </tr>
        </thead>

        {usuarios.map((value, key) => (
          <tbody>
            <tr key={key}>
              <td>{value.nome}</td>
              <td>{value.email}</td>
              <td>
                <Link to={`/usuarios-sistema/${value.email}`}>
                  <p className="detalhes_pessoas_button">Detalhes</p>
                </Link>
              </td>
            </tr>
          </tbody>
        ))}
      </table>
</div>
</div>


  );
}
