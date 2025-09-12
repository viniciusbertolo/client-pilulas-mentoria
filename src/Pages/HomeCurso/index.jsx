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

  const [removeLoading, setRemoveLoading] = useState(false)

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


  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    async function fetchCurso() {
      try {
        const resposta = await fetch(
          `https://backend-pilulas-mentoria.herokuapp.com/cursos`
        );
        const data = await resposta.json();
        setCursos(data);
        setRemoveLoading(true)
      } catch (error) {
        console.error("Erro ao buscar cursos:", error);
      }
    }
    fetchCurso();
  }, [id]);

  const curso = cursos.find((c) => c.ID_CURSO === Number(id));

  console.log("Cursos: ", cursos)
  console.log("Curso: ", curso)




  // Paleta de "fallback" caso NENHUMA cor venha do backend
const defaultPalette = [
  { main: '#46b2bc', light: '#65c7d0' },
  { main: '#ea3c14', light: '#EF5720' },
  { main: '#8CC63E', light: '#6CAF29' },
  { main: '#F99324', light: '#FBB03B' },
  { main: '#0071BD', light: '#0050A3' },
];

  // Esta função já espera receber um código HEX (ex: "#8CC63E")
  const lightenColor = (hex, percent) => {
    // E também já trata o caso do HEX ser nulo
    if (!hex) return '#cccccc';
    let r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

    let p = percent / 100;
    r = Math.min(255, Math.round(r + (255 - r) * p));
    g = Math.min(255, Math.round(g + (255 - g) * p));
    b = Math.min(255, Math.round(b + (255 - b) * p));

    return `#${(r).toString(16).padStart(2, '0')}${(g).toString(16).padStart(2, '0')}${(b).toString(16).padStart(2, '0')}`;
  };


   let activePalette = defaultPalette;

  if (curso) {

    // DEBUG 3: Confirme que o código entrou nesta condição
    console.log("DEBUG 3: O objeto 'curso' existe. Tentando criar paleta dinâmica...", curso);
    
    const dynamicPalette = [];
    
    // Este 'if' garante que só adicionamos a cor se ela NÃO FOR NULA ou vazia.
    if (curso.corFase1) dynamicPalette.push({ main: curso.corFase1, light: lightenColor(curso.corFase1, 15) });
    if (curso.corFase2) dynamicPalette.push({ main: curso.corFase2, light: lightenColor(curso.corFase2, 15) });
    if (curso.corFase3) dynamicPalette.push({ main: curso.corFase3, light: lightenColor(curso.corFase3, 15) });
    if (curso.corFase4) dynamicPalette.push({ main: curso.corFase4, light: lightenColor(curso.corFase4, 15) });
    if (curso.corFase5) dynamicPalette.push({ main: curso.corFase5, light: lightenColor(curso.corFase5, 15) });

     // DEBUG 4: Veja o resultado da criação da paleta
    console.log("DEBUG 4: Paleta dinâmica criada:", dynamicPalette);

    if (dynamicPalette.length > 0) {
      activePalette = dynamicPalette;
    } else {
      console.warn("AVISO: Nenhuma cor válida foi encontrada no objeto 'curso'. Usando a paleta padrão.");
    }
  }


  // --- INÍCIO DA LÓGICA DA COR DE FUNDO (COM DEBUG) ---
  const pageStyle = {};

  // DEBUG 1: VAMOS INSPECIONAR O OBJETO 'CURSO' INTEIRO AQUI
  console.log("DEBUG FUNDO: Objeto 'curso' completo:", curso);

  // Assumindo que o nome da propriedade é 'corFundo'. Verifique no log acima qual é o nome correto!
  const nomeDaPropriedadeCorFundo = 'corFundo'; // <-- Altere esta linha se o nome for diferente

  if (curso && curso[nomeDaPropriedadeCorFundo]) {
    // DEBUG 2: Se encontrou a cor, vamos logar aqui
    console.log(`DEBUG FUNDO: Cor de fundo encontrada (${nomeDaPropriedadeCorFundo}):`, curso[nomeDaPropriedadeCorFundo]);
    pageStyle['--page-background-color'] = curso[nomeDaPropriedadeCorFundo];
  } else {
    // DEBUG 3: Se não encontrou, avisará no console
    console.warn(`AVISO FUNDO: Propriedade '${nomeDaPropriedadeCorFundo}' não encontrada no objeto 'curso'. Usando cor padrão.`);
  }
  // --- FIM DA LÓGICA DA COR DE FUNDO ---
  



  // return (
  //   <div className="pag_todo_game">
  //     <Navbar />
  //     <div className="boas_vindas_cursos">
  //       <div>

  //         <h1>É hora de aprender!</h1>
  //         <p>Selecione uma pilula e siga até o final do game</p>
  //         <Link to="/" className="voltar_para_home"><NavigateBeforeIcon />Voltar</Link>
  //       </div>
  //       {files.some((file) => Number(file.curso_relacionado) === Number(id)) && (
  //         <div
  //           className="botao_detalhes_show_hide"
  //           onClick={() => setMostrar(!mostrar)}
  //         >
  //           {mostrar ? "Fechar" : "Materiais extras"}
  //         </div>
  //       )}
  //     </div>

  //     {mostrar && (
  //       <div className="area_baixar_especifico">
  //         <div className="cabecalho_mt_ex">
  //           <h2>Materiais Extras</h2>
  //           <div
  //             className="botao_detalhes_show_hide"
  //             onClick={() => setMostrar(!mostrar)}
  //           >
  //             {mostrar ? "Fechar" : "Materiais extras"}
  //           </div>
  //         </div>

  //         {files
  //           .filter((file) => file.curso_relacionado == id) // só arquivos públicos
  //           .map((value, key) => (
  //             <div className="card_cursos" key={key}>

  //               {/* Imagem genérica do curso */}
  //               <div className="imagem_curso">
  //                 <img
  //                   src={value.foto_material || "https://wallpapers.com/images/featured/data-center-775ta0o0wf4nbyq3.jpg"}
  //                   alt={value.name}
  //                 />
  //               </div>

  //               <div className="textos_cursos">
  //                 <h1>{value.nome}</h1>
  //                 <a href={value.url_material} target="_blank" download>
  //                   <div className="botao_cursos">
  //                     Baixar
  //                   </div>
  //                 </a>
  //                 <small>
  //                   Ultima atualização:&ensp;
  //                   {new Date(value.updated_at).toLocaleString("pt-BR", {
  //                     day: "2-digit",
  //                     month: "2-digit",
  //                     year: "numeric",
  //                     hour: "2-digit",
  //                     minute: "2-digit"
  //                   })}
  //                 </small>

  //               </div>


  //             </div>
  //           ))}
  //       </div>
  //     )}

  //     {!removeLoadin && <Loading />}
  //     <div class="main-timeline">
  //       {fases.map((value, key) =>
  //         value.NRO <= faseEspecifica ? (
  //           <div class="timeline" key={key}>
  //             <div class="timeline-content">

  //               <span class="timeline-year">{value.NRO}</span>
  //               <div class="timeline-icon">
  //                 <i class="fa fa-rocket" aria-hidden="true"></i>
  //               </div>
  //               <div class="content">
  //                 <h3 class="title">{value.nome}</h3>
  //                 <p class="description">{value.descricao}</p>
  //                 <Link
  //                   to={`/videoCurso/${id}/${value.NRO}`}
  //                   class="botao-video"
  //                 >

  //                   <h3 class="title">Clique aqui e assista o video</h3>
  //                 </Link>

  //               </div>
  //             </div>


  //           </div>
  //         ) : (
  //           <div class="timeline-off">
  //             <a class="timeline-content-off">
  //               <span class="timeline-year-off">{value.NRO}</span>
  //               <div class="timeline-icon">
  //                 <i class="fa fa-rocket" aria-hidden="true"></i>
  //               </div>
  //               <div class="content-off">
  //                 <h3 class="title-off">{value.nome}</h3>
  //                 <p class="description-off">{value.descricao}</p>
  //               </div>
  //             </a>
  //           </div>
  //         )
  //       )}
  //     </div>
  //     <div className="detalhe_imagem_home_curso">

  //     </div>
  //   </div>
  // );

return (
    <div className="pag_todo_game" style={pageStyle}>
      <Navbar />
      <div className="boas_vindas_cursos">
        <div>
          <h1>É hora de aprender!</h1>
          <p>Selecione uma pílula e siga até o final do game</p>
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
            .filter((file) => file.curso_relacionado == id)
            .map((value, key) => (
              <div className="card_cursos" key={key}>
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
                    Última atualização:&ensp;
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

      {/* A condição de loading aqui foi ajustada na resposta anterior para incluir `!curso`. 
          Se você manteve a lógica completa, ela já deve estar correta. */}
      {!removeLoading || !curso ? <Loading /> : null}

      <div className="main-timeline">
        {fases.map((value, key) => {
          // --- INÍCIO DA LÓGICA ADICIONADA ---
          // 1. Pega a cor correta da paleta ativa (dinâmica ou padrão)
          const currentColor = activePalette[key % activePalette.length];
          
          // 2. Cria o objeto de estilo com as variáveis CSS
          const timelineStyle = {
            '--main-color': currentColor.main,
            '--light-color': currentColor.light,
          };
          // --- FIM DA LÓGICA ADICIONADA ---

          return value.NRO <= faseEspecifica ? (
            // 3. Aplica o estilo ao elemento div principal
            <div className="timeline" key={key} style={timelineStyle}>
              <div className="timeline-content">
                <span className="timeline-year">{value.NRO}</span>
                <div className="timeline-icon">
                  <i className="fa fa-rocket" aria-hidden="true"></i>
                </div>
                <div className="content">
                  <h3 className="title">{value.nome}</h3>
                  <p className="description">{value.descricao}</p>
                  <Link
                    to={`/videoCurso/${id}/${value.NRO}`}
                    className="botao-video"
                  >
                    <h3 className="title">Clique aqui e assista o vídeo</h3>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="timeline-off" key={key}>
              <a className="timeline-content-off">
                <span className="timeline-year-off">{value.NRO}</span>
                <div className="timeline-icon">
                  <i className="fa fa-rocket" aria-hidden="true"></i>
                </div>
                <div className="content-off">
                  <h3 className="title-off">{value.nome}</h3>
                  <p className="description-off">{value.descricao}</p>
                </div>
              </a>
            </div>
          );
        })}
      </div>
      <div className="detalhe_imagem_home_curso"></div>
    </div>
  );


}







