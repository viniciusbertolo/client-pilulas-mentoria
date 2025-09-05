import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player/youtube";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import "./index.css";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import Loading from "../../Components/Loading";

export default function HomeCurso() {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("@user"));

  const [removeLoadin, setRemoveLoading] = useState(false)

  const [fases, setFases] = useState([]);
  const [relacionamento, setRelacionamento] = useState({});
  const [responseFaseAtual, setResponseFaseAtual] = useState({});



  async function obterFases() {
    const responseFase = await fetch(`https://backend-pilulas-mentoria.herokuapp.com/fases/${id}`, {
      method: "GET",
      headers: { "Content-type": "application/json" },
    });

    const respostaJson = await responseFase.json();
    setFases(respostaJson);
    console.log("FUNÇÂO OBTER FASES");
    setRemoveLoading(true);


    obterEtapaAtual();




  }

  console.log(relacionamento);

  async function obterEtapaAtual() {
    const response = await fetch(
      `https://backend-pilulas-mentoria.herokuapp.com/caminho-concluido/${user.email}/${id}`,
      {
        method: "GET",
        headers: { "Content-type": "application/json" },
      }
    );

    const respostaJson = await response.json();
    setRelacionamento(respostaJson[0]);
    setResponseFaseAtual(response)
    setRemoveLoading(true)

    console.log("FUNÇÂO OBTER ETAPA ATUAL");



    inserirPrimeiraEtapa()

  }




  function inserirPrimeiraEtapa() {
    const resposta = fetch(
      `https://backend-pilulas-mentoria.herokuapp.com/inserir-primeiro-caminho/${user.email}/${id}/1`,
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
      }
    );
    console.log("FUNÇÂO ONSERIR PRIMEIRA ETAPA");


  }

  useEffect(() => {
    obterFases();








  }, []);
  //   console.log(relacionamento);
  //   // setTimeout(() => {
  //   //   if(relacionamento === "undefined" && relacionamento === {} && relacionamento === null){
  //   //     inserirPrimeiraEtapa()
  //   //     console.log('This will run after 1 second!')
  //   //   }else{
  //   //     console.log("ACHAMOS DADOS NO BANCO");
  //   //     console.log(relacionamento);
  //   //     }
  //   //   }, 1000);




  var faseEspecifica;
  if (relacionamento) {
    faseEspecifica = relacionamento.NRO_FASE_ATUAL;
  } else {
    faseEspecifica = 0
    setTimeout(() => {
      window.location.reload()
    }, 500);
  }


  const [files, setFiles] = useState([]);


  useEffect(() => {
    async function obterMateriais() {
      const resposta = await fetch(`https://backend-pilulas-mentoria.herokuapp.com/materiais`, {
        method: "GET",
        headers: { "Content-type": "application/json" },
      });
      const respostaJson = await resposta.json();
      setFiles(respostaJson);
      setRemoveLoading(true)
    }
    obterMateriais();
  }, []);


  const [mostrar, setMostrar] = useState(false);

  return (
    <div className="pag_todo_game">
      <Navbar />
      <div className="boas_vindas_cursos">
        <div>

        <h1>É hora de aprender!</h1>
        <p>Selecione uma pilula e siga até o final do game</p>
        <Link to="/" className="voltar_para_home"><NavigateBeforeIcon />Voltar</Link>
        </div>
        {files.some((file) => Number(file.curso_relacionado) === Number(id)) && (
          <div
            className="botao_detalhes_show_hide"
            onClick={() => setMostrar(!mostrar)}
          >
            {mostrar ? "Fechar" : "Materiais extras"}
          </div>
        )}
      </div>
      
      {mostrar && (
        <div className="area_baixar_especifico">
          <div className="cabecalho_mt_ex">
            <h2>Materiais Extras</h2>
            <div
              className="botao_detalhes_show_hide"
              onClick={() => setMostrar(!mostrar)}
            >
              {mostrar ? "Fechar" : "Materiais extras"}
            </div>
          </div>

          {files
            .filter((file) => file.curso_relacionado == id) // só arquivos públicos
            .map((value, key) => (
              <div className="card_cursos" key={key}>

                {/* Imagem genérica do curso */}
                <div className="imagem_curso">
                  <img
                    src={value.foto_material || "https://wallpapers.com/images/featured/data-center-775ta0o0wf4nbyq3.jpg"}
                    alt={value.name}
                  />
                </div>

                <div className="textos_cursos">
                  <h1>{value.nome}</h1>
                  <a href={value.url_material} target="_blank" download>
                    <div className="botao_cursos">
                      Baixar
                    </div>
                  </a>
                  <small>
                    Ultima atualização:&ensp;
                    {new Date(value.updated_at).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </small>

                </div>


              </div>
            ))}
        </div>
      )}

      {!removeLoadin && <Loading />}
      <div class="main-timeline">
        {fases.map((value, key) =>
          value.NRO <= faseEspecifica ? (
            <div class="timeline" key={key}>
              <div class="timeline-content">

                <span class="timeline-year">{value.NRO}</span>
                <div class="timeline-icon">
                  <i class="fa fa-rocket" aria-hidden="true"></i>
                </div>
                <div class="content">
                  <h3 class="title">{value.nome}</h3>
                  <p class="description">{value.descricao}</p>
                  <Link
                    to={`/videoCurso/${id}/${value.NRO}`}
                    class="botao-video"
                  >

                    <h3 class="title">Clique aqui e assista o video</h3>
                  </Link>

                </div>
              </div>


            </div>
          ) : (
            <div class="timeline-off">
              <a class="timeline-content-off">
                <span class="timeline-year-off">{value.NRO}</span>
                <div class="timeline-icon">
                  <i class="fa fa-rocket" aria-hidden="true"></i>
                </div>
                <div class="content-off">
                  <h3 class="title-off">{value.nome}</h3>
                  <p class="description-off">{value.descricao}</p>
                </div>
              </a>
            </div>
          )
        )}
      </div>
      <div className="detalhe_imagem_home_curso">

      </div>
    </div>
  );
}
