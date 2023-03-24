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
  if(relacionamento){
    faseEspecifica = relacionamento.NRO_FASE_ATUAL;
  }else{
    faseEspecifica = 0
    setTimeout(() => {
      window.location.reload()
    }, 500);
  }




  return (
    <div className="pag_todo_game">
      <Navbar/>
      <div className="boas_vindas_cursos">
        <h1>É hora de aprender!</h1>
        <p>Selecione uma pilula e siga até o final do game</p>
        <Link to="/cursos" className="voltar_para_home"><NavigateBeforeIcon/>Voltar</Link>
      </div>
      {!removeLoadin && <Loading />}
      <div class="main-timeline">
        {fases.map((value, key) =>
          value.NRO <= faseEspecifica ? (
            <div class="timeline" key={key}>
              <div  class="timeline-content">

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
