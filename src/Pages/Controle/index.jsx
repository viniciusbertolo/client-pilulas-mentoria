import React, { useEffect, useState } from "react";
import "./index.css";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import Loading from "../../Components/Loading";

export default function Controle() {
  const user = JSON.parse(localStorage.getItem("@user"));
  const { id } = useParams();

  const [removeLoadin, setRemoveLoading] = useState(false);

  const [faseColaborador, setFaseColaborador] = useState([]);

  useEffect(() => {
    async function obterFasesPessoas() {
      const response = await fetch(
        `https://backend-pilulas-mentoria.herokuapp.com/caminho-concluido/${id}`,
        {
          method: "GET",
          headers: { "Content-type": "application/json" },
        }
      );

      const respostaJson = await response.json();
      setFaseColaborador(respostaJson);
      setRemoveLoading(true);
    }

    obterFasesPessoas();
  }, []);

  console.log(faseColaborador);

  return (
    <div className="pag_todo">
      <Navbar />

      <div className="detalhe_imagem_dash"></div>

      <div className="boas_vindas_cursos">
        <h1>Olá, você está na área de controle do Pilulas de Mentoria</h1>
        <Link to="/relatorios" className="voltar_para_home">
          <NavigateBeforeIcon />
          Voltar
        </Link>
      </div>

      {!removeLoadin && <Loading />}

      <div className="controle_pessoas">
        <table class="styled-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Curso</th>
              <th>Fase</th>
            </tr>
          </thead>

          {faseColaborador.map((value, key) => (
            <tbody>
              <tr key={key}>
                <td>{value.emailUsuario}</td>
                <td>{value.ID_usuario}</td>
                <td>{value.NRO_FASE_ATUAL}</td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
}
