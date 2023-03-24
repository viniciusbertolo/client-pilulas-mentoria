import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import "./index.css";
import ReactPlayer from "react-player/youtube";
import { Axios } from "axios";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import Loading from "../../Components/Loading";

export default function Dashboard(props) {
  const [cursos, setCursos] = useState([]);
  const user = JSON.parse(localStorage.getItem("@user"));

  const [removeLoadin, setRemoveLoading] = useState(false)

  const [relacionamento, setRelacionamento] = useState({});
  const [responseFaseAtual, setResponseFaseAtual] = useState({});

  useEffect(() => {
    async function obterCursos() {
      const resposta = await fetch(`https://backend-pilulas-mentoria.herokuapp.com/cursos`, {
        method: "GET",
        headers: { "Content-type": "application/json" },
      });
      const respostaJson = await resposta.json();
      setCursos(respostaJson);
      setRemoveLoading(true)
    }
    obterCursos();
  }, []);

  // function obterEtapaAtual(id) {
  //   const response = fetch(
  //     `http://localhost:3001/caminho-concluido/${user.email}/${id}`,
  //     {
  //       method: "GET",
  //       headers: { "Content-type": "application/json" },
  //     }
  //   );

  //   const respostaJson = response.json();
  //   setRelacionamento(respostaJson[0]);
  //   setResponseFaseAtual(response);
  //   inserirPrimeiraEtapa(id);

  //   console.log("FUNÇÂO OBTER ETAPA ATUAL");
  // }

  // function inserirPrimeiraEtapa(id) {
  //   const resposta = fetch(
  //     `http://localhost:3001/inserir-primeiro-caminho/${user.email}/${id}/1`,
  //     {
  //       method: "POST",
  //       headers: { "Content-type": "application/json" },
  //     }
  //   );
  //   console.log("FUNÇÂO ONSERIR PRIMEIRA ETAPA");
  // }

  console.log(cursos);

  return (
    <div className="pag_todo">
      <Navbar />
      <div className="detalhe_imagem_dash">
          
        </div>

      <div className="boas_vindas_cursos">
        <h1>Olá, Bem-Vindo aos cursos do Pilulas de Mentoria</h1>
        <p>Selecione um curso e comece o aprendizado</p>
        <Link to="/" className="voltar_para_home"><NavigateBeforeIcon/>Voltar</Link>
      </div>

      

      {!removeLoadin && <Loading />}

      <div className="dash_cursos">
        {cursos.map((value, key) => (
          <div className="card_cursos" key={key}>
            <div className="video_preview_curso">
              <ReactPlayer
                className="video_player"
                url={value.URL_VIDEO_PREVIW}
                controls
                onEnded={() => alert("teste")}
                width="100%"
              />
            </div>
              <div
                className="textos_cursos"
                // onClick={() => obterEtapaAtual(value.ID_CURSO)}
              >
                <h1>{value.nome}</h1>
                <p>{value.descricao}</p>
              </div>
            <Link to={`/cursos/${value.ID_CURSO}`}>
              <div className="botao_cursos">
                
              <h2>Ir para o curso</h2>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
