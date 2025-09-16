// import React, { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import Navbar from "../../Components/Navbar";
// import "./index.css";
// import ReactPlayer from "react-player/youtube";
// import { Axios } from "axios";
// import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
// import Loading from "../../Components/Loading";

// export default function Dashboard(props) {
//   const [cursos, setCursos] = useState([]);
//   const user = JSON.parse(localStorage.getItem("@user"));

//   const [removeLoadin, setRemoveLoading] = useState(false)

//   const [relacionamento, setRelacionamento] = useState({});
//   const [responseFaseAtual, setResponseFaseAtual] = useState({});


//   const [cursosDoUsuario, setCursosDoUsuario] = useState([]);

  
  
//     const [fases, setFases] = useState([]);

//   useEffect(() => {
//     async function obterCursos() {
//       const resposta = await fetch(`https://backend-pilulas-mentoria.herokuapp.com/cursos`, {
//         method: "GET",
//         headers: { "Content-type": "application/json" },
//       });
//       const respostaJson = await resposta.json();
//       setCursos(respostaJson);
//       setRemoveLoading(true)
//     }
//     obterCursos();
//   }, []);



//   useEffect(() => {
//     // Obter cursos do usuário específico
//     async function obterCursosDoUsuario() {
//       const resposta = await fetch(`https://backend-pilulas-mentoria.herokuapp.com/usuario-curso/${user.email}`, {
//         method: "GET",
//         headers: { "Content-type": "application/json" },
//       });
//       const respostaJson = await resposta.json();
//       const cursosUsuario = respostaJson.map((curso) => curso.ID_CURSO);
//       setCursosDoUsuario(cursosUsuario);

//       // setCursosDoUsuario(respostaJson.ID_CURSO);
//     }
//     obterCursosDoUsuario();
//   }, []);

//   console.log(user.email);
//   console.log("Cursos:", cursos);
//   console.log("Cursos do usuário:", cursosDoUsuario); // Verificar os cursos do usuário

//   // function obterEtapaAtual(id) {
//   //   const response = fetch(
//   //     `http://localhost:3001/caminho-concluido/${user.email}/${id}`,
//   //     {
//   //       method: "GET",
//   //       headers: { "Content-type": "application/json" },
//   //     }
//   //   );

//   //   const respostaJson = response.json();
//   //   setRelacionamento(respostaJson[0]);
//   //   setResponseFaseAtual(response);
//   //   inserirPrimeiraEtapa(id);

//   //   console.log("FUNÇÂO OBTER ETAPA ATUAL");
//   // }

//   // function inserirPrimeiraEtapa(id) {
//   //   const resposta = fetch(
//   //     `http://localhost:3001/inserir-primeiro-caminho/${user.email}/${id}/1`,
//   //     {
//   //       method: "POST",
//   //       headers: { "Content-type": "application/json" },
//   //     }
//   //   );
//   //   console.log("FUNÇÂO ONSERIR PRIMEIRA ETAPA");
//   // }

//   console.log(cursos);

//   const [busca, setBusca] = useState("");
//     const cursosFiltrados = cursos.filter((curso) =>
//       curso.nome.toLowerCase().includes(busca.toLowerCase())
//     );













//     async function obterFases() {
//     const responseFase = await fetch(`https://backend-pilulas-mentoria.herokuapp.com/fases/${id}`, {
//       method: "GET",
//       headers: { "Content-type": "application/json" },
//     });

//     const respostaJson = await responseFase.json();
//     setFases(respostaJson);
//     setRemoveLoading(true);


//     obterEtapaAtual();




//   }


//   async function obterEtapaAtual() {
//     const response = await fetch(
//       `https://backend-pilulas-mentoria.herokuapp.com/caminho-concluido/${user.email}/${id}`,
//       {
//         method: "GET",
//         headers: { "Content-type": "application/json" },
//       }
//     );

//     const respostaJson = await response.json();
//     setRelacionamento(respostaJson[0]);
//     setResponseFaseAtual(response)
//     setRemoveLoading(true)


//   }


//   console.log("Fases:", fases)
//   console.log("Fase Atual:", responseFaseAtual)
















//   return (
//     <div className="pag_todo">
//       <Navbar />
//       <div className="detalhe_imagem_dash">

//       </div>

//       <div className="boas_vindas_cursos">
//         <div>

//         <h1>Meus Cursos</h1>
//         <p>Selecione um curso e continue o aprendizado</p>
//         <Link to="/" className="voltar_para_home"><NavigateBeforeIcon />Voltar</Link>
//         </div>
//         {/* Campo de busca */}
//       <input
//         type="text"
//         placeholder="Buscar cursos..."
//         value={busca}
//         onChange={(e) => setBusca(e.target.value)}
//         className="input_busca"
//       />
//       </div>



//       {!removeLoadin && <Loading />}

//       {/* <div className="dash_cursos">
//         {cursos
//           .filter((curso) => cursosDoUsuario.includes(curso.ID_CURSO))  
//           .map((value, key) => (
//             <div className="card_cursos" key={key}>
//               <div className="video_preview_curso">
//                 <ReactPlayer
//                   className="video_player"
//                   url={value.URL_VIDEO_PREVIW}
//                   controls
//                   onEnded={() => alert("teste")}
//                   width="100%"
//                 />
//               </div>
//               <div
//                 className="textos_cursos"
              
//               >
//                 <h1>{value.nome}</h1>
//                 <p>{value.descricao}</p>
//               </div>
//               <Link to={`/cursos/${value.ID_CURSO}`}>
//                 <div className="botao_cursos">

//                   <h2>Ir para o curso</h2>
//                 </div>
//               </Link>
//             </div>
//           ))}
//       </div> */}

//       <div className="dash_cursos">
//               {cursosFiltrados
//               .filter((curso) => cursosDoUsuario.includes(curso.ID_CURSO)) 
//               .map((value, key) => (
//                 <div className="card_cursos" key={key}>
      
//                   {/* Imagem genérica do curso */}
//                   <div className="imagem_curso">
//                     <img
//                       src={value.imagem || "https://wallpapers.com/images/hd/tree-resembling-cerebral-cortex-xgqhghhr3d8pr4lt.jpg"}
//                       alt={value.nome}
//                     />
//                   </div>
      
//                   <div className="textos_cursos">
//                     <h1>{value.nome}</h1>
//                     <Link to={`/cursos/${value.ID_CURSO}`}>
//                     <br></br>
//                     <div className="botao_cursos">
//                       Acessar curso
//                     </div>
//                   </Link>
//                   </div>
      
                  
//                 </div>
//               ))}
//             </div>
//     </div>
//   );
// }






















import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import "./index.css";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import Loading from "../../Components/Loading";
import jsPDF from 'jspdf'; // <--- 1. IMPORTAR A BIBLIOTECA
import logo from '../../Assets/imgs/logo_pilulas.png'; 
import assinatura from '../../Assets/imgs/assinatura_branco.png';

export default function Dashboard(props) {
  const [cursos, setCursos] = useState([]);
  const [detalhesUsuario, setDetalhesUsuario] = useState([]);
  const [cursosDoUsuario, setCursosDoUsuario] = useState([]);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [busca, setBusca] = useState("");
  const [progressData, setProgressData] = useState({});
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  
  const user = JSON.parse(localStorage.getItem("@user")) || {};

  useEffect(() => {
    async function fetchInitialData() {
      if (!user.email) {
        setRemoveLoading(true);
        setIsLoadingProgress(false);
        return;
      }
      try {
        const [cursosResponse, userCursosResponse, detalhesUsuariosResponse] = await Promise.all([
          fetch(`https://backend-pilulas-mentoria.herokuapp.com/cursos`),
          fetch(`https://backend-pilulas-mentoria.herokuapp.com/usuario-curso/${user.email}`),
          fetch(`https://backend-pilulas-mentoria.herokuapp.com/detalhes-usuario/${user.email}`)
        ]);

        const cursosJson = await cursosResponse.json();
        const usuariosJson = await detalhesUsuariosResponse.json();
        const userCursosJson = await userCursosResponse.json();
        const cursosUsuarioIds = userCursosJson.map((rel) => rel.ID_CURSO);
        
        setCursos(cursosJson);
        setCursosDoUsuario(cursosUsuarioIds);
        setDetalhesUsuario(usuariosJson)
      } catch (error) {
        console.error("Erro ao buscar dados iniciais:", error);
      } finally {
        setRemoveLoading(true);
      }
    }
    fetchInitialData();
  }, [user.email]);



  useEffect(() => {
    if (cursosDoUsuario.length === 0) {
      setIsLoadingProgress(false);
      return;
    }

    async function fetchAllProgress() {
      const promises = cursosDoUsuario.map(async (cursoId) => {
        try {
          const [fasesResponse, progressoResponse] = await Promise.all([
            fetch(`https://backend-pilulas-mentoria.herokuapp.com/fases/${cursoId}`),
            fetch(`https://backend-pilulas-mentoria.herokuapp.com/caminho-concluido/${user.email}/${cursoId}`)
          ]);

          const fasesData = await fasesResponse.json();
          const progressoData = await progressoResponse.json();

          const totalFases = fasesData.length || 0;
          
          // ==================================================================
          // CÓDIGO CORRIGIDO AQUI
          // ==================================================================
          let faseAtual = 0;
          if (progressoData && progressoData.length > 0) {
            // Pega todos os números de fase da resposta
            const fasesConcluidas = progressoData.map(item => item.NRO_FASE_ATUAL);
            // Encontra o maior número de fase no array
            faseAtual = Math.max(...fasesConcluidas);
          }
          // ==================================================================
          
          return {
            cursoId,
            progress: { totalFases, faseAtual }
          };
        } catch (error) {
          console.error(`Erro ao buscar progresso do curso ${cursoId}:`, error);
          return {
            cursoId,
            progress: { totalFases: 0, faseAtual: 0 }
          };
        }
      });

      const results = await Promise.all(promises);
      
      const progressObject = results.reduce((acc, result) => {
        acc[result.cursoId] = result.progress;
        return acc;
      }, {});

      setProgressData(progressObject);
      setIsLoadingProgress(false);
    }

    fetchAllProgress();
  }, [cursosDoUsuario, user.email]); 

  
  const cursosFiltrados = cursos
    .filter((curso) =>
      cursosDoUsuario.includes(curso.ID_CURSO) &&
      curso.nome.toLowerCase().includes(busca.toLowerCase())
    );



  // ==================================================================
// 2. FUNÇÃO PARA GERAR O PDF DO CERTIFICADO (VERSÃO ATUALIZADA)
// ==================================================================
// const handleDownloadCertificado = (cursoNome) => {
//   const doc = new jsPDF({
//     orientation: 'landscape',
//     unit: 'mm',
//     format: 'a4'
//   });

//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();

//   // --- 1. Adicionar Fundo Preto ---
//   doc.setFillColor(20, 20, 20); // Cor preta (RGB)
//   doc.rect(0, 0, pageWidth, pageHeight, 'F'); // 'F' significa 'Fill' (Preencher)

//   // --- 2. Adicionar Borda Laranja ---
//   doc.setDrawColor(255, 84, 0); // Cor laranja (RGB)
//   doc.setLineWidth(4); // Define a espessura da borda
//   doc.rect(5, 5, pageWidth - 10, pageHeight - 10, 'S'); // 'S' significa 'Stroke' (Contorno)

//   // --- 3. Definir a cor do texto para branco ---
//   doc.setTextColor(255, 255, 255); // Cor branca (RGB)

//   // --- 4. Adicionar a Logo ---
//   // Adiciona a imagem importada. (logo, formato, x, y, largura, altura)
//   // Centralizando a logo: (larguraDaPagina / 2) - (larguraDaLogo / 2)
//   doc.addImage(logo, 'PNG', (pageWidth / 2) - 25, 20, 50, 25);

//   // Adiciona um título centralizado (abaixo da logo)
//   doc.setFontSize(22);
//   doc.setFont(undefined, 'bold');
//   doc.text("CERTIFICADO DE CONCLUSÃO", pageWidth / 2, 60, { align: 'center' });

//   // Adiciona o texto principal do certificado
//   doc.setFontSize(16);
//   doc.setFont(undefined, 'normal');
//   const textoCertificado = `Certificamos que ${detalhesUsuario[0].nome || 'Nome do Aluno'} concluiu com sucesso o curso de`;
//   doc.text(textoCertificado, pageWidth / 2, 90, { align: 'center' });

//   // Adiciona o nome do curso com destaque
//   doc.setFontSize(24);
//   doc.setFont(undefined, 'bold');
//   doc.text(cursoNome, pageWidth / 2, 110, { align: 'center' });
  
//   // Adiciona a data de conclusão
//   const data = new Date();
//   const dia = String(data.getDate()).padStart(2, '0');
//   const mes = String(data.getMonth() + 1).padStart(2, '0');
//   const ano = data.getFullYear();
//   const dataFormatada = `${dia}/${mes}/${ano}`;
  
//   doc.setFontSize(12);
//   doc.setFont(undefined, 'normal');
//   doc.text(`Certificado emitido em: ${dataFormatada}`, pageWidth / 2, 135, { align: 'center' });

//   // --- 5. Adicionar a Imagem da Assinatura ---
//   // Centralizando a assinatura
//   doc.addImage(assinatura, 'PNG', (pageWidth / 2) - 30, 150, 60, 30);
  
//   // Linha acima da assinatura (opcional, pode remover se a imagem já tiver)
//   doc.setDrawColor(255, 255, 255); // Linha branca
//   doc.setLineWidth(0.5);
//   doc.line(110, 180, pageWidth - 110, 180); // (x1, y1, x2, y2)
  
//   doc.text("Assinatura do Responsável", pageWidth / 2, 188, { align: 'center' });

//   // Salva o PDF com um nome dinâmico
//   doc.save(`Certificado-${cursoNome.replace(/\s+/g, '_')}.pdf`);
// };



// ==================================================================
// FUNÇÃO AUXILIAR (NÃO PRECISA ALTERAR)
// ==================================================================
const calculateImageDimensions = (imgOriginalWidth, imgOriginalHeight, maxWidth, maxHeight) => {
  const originalRatio = imgOriginalWidth / imgOriginalHeight;
  const maxRatio = maxWidth / maxHeight;
  let newWidth, newHeight;

  if (originalRatio > maxRatio) {
    newWidth = maxWidth;
    newHeight = newWidth / originalRatio;
  } else {
    newHeight = maxHeight;
    newWidth = newHeight * originalRatio;
  }
  return { width: newWidth, height: newHeight };
};


// ==================================================================
// SUA FUNÇÃO DE GERAR O PDF (AJUSTADA COM SEUS ESTILOS)
// ==================================================================
const handleDownloadCertificado = (cursoNome) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // --- 1. Fundo (Sua cor) ---
  doc.setFillColor(20, 20, 20); 
  doc.rect(0, 0, pageWidth, pageHeight, 'F'); 

  // --- 2. Borda (Sua cor e espessura) ---
  doc.setDrawColor(255, 84, 0); 
  doc.setLineWidth(4); 
  doc.rect(5, 5, pageWidth - 10, pageHeight - 10, 'S'); 

  // --- 3. Cor do texto ---
  doc.setTextColor(255, 255, 255); 

  // --- 4. Adicionar a Logo (SEM DISTORÇÃO) ---
  
  // <-- ATENÇÃO AQUI: Coloque a largura e altura REAIS da sua logo em pixels
  const logoOriginalWidth = 500; 
  const logoOriginalHeight = 158; 
  
  // Caixa máxima para a logo (baseado no seu código)
  const logoMaxWidth = 50;
  const logoMaxHeight = 25;

  const logoDims = calculateImageDimensions(
    logoOriginalWidth, 
    logoOriginalHeight, 
    logoMaxWidth, 
    logoMaxHeight
  );

  const logoX = (pageWidth / 2) - (logoDims.width / 2);
  doc.addImage(logo, 'PNG', logoX, 30, logoDims.width, logoDims.height);

  // --- Textos do certificado (Seu layout) ---
  doc.setFontSize(22);
  doc.setFont(undefined, 'bold');
  doc.text("CERTIFICADO DE CONCLUSÃO", pageWidth / 2, 60, { align: 'center' });

  doc.setFontSize(16);
  doc.setFont(undefined, 'normal');
  const textoCertificado = `Certificamos que ${detalhesUsuario[0].nome || 'Nome do Aluno'} concluiu com sucesso o curso`;
  doc.text(textoCertificado, pageWidth / 2, 90, { align: 'center' });

  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text(cursoNome, pageWidth / 2, 110, { align: 'center' });
  
  const data = new Date();
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  const dataFormatada = `${dia}/${mes}/${ano}`;
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text(`Certificado emitido em: ${dataFormatada}`, pageWidth / 2, 135, { align: 'center' });

  // --- 5. Adicionar a Imagem da Assinatura (SEM DISTORÇÃO) ---
  
  // <-- ATENÇÃO AQUI: Coloque a largura e altura REAIS da sua assinatura em pixels
  const assinaturaOriginalWidth = 1068;
  const assinaturaOriginalHeight = 313;

  // Caixa máxima para a assinatura (baseado no seu código)
  const assinaturaMaxWidth = 60;
  const assinaturaMaxHeight = 60;

  const assinaturaDims = calculateImageDimensions(
    assinaturaOriginalWidth,
    assinaturaOriginalHeight,
    assinaturaMaxWidth,
    assinaturaMaxHeight
  );
  
  const assinaturaX = (pageWidth / 2) - (assinaturaDims.width / 2);
  doc.addImage(assinatura, 'PNG', assinaturaX, 160, assinaturaDims.width, assinaturaDims.height);
  
  doc.setDrawColor(255, 255, 255); 
  doc.setLineWidth(0.5);
  doc.line(110, 180, pageWidth - 110, 180);
  
  doc.text("Assinatura do Responsável", pageWidth / 2, 188, { align: 'center' });

  doc.save(`Certificado-${cursoNome.replace(/\s+/g, '_')}.pdf`);
};

  return (
    <div className="pag_todo">
      <Navbar />
      <div className="detalhe_imagem_dash"></div>
      <div className="boas_vindas_cursos">
        <div>
          <h1>Meus Cursos</h1>
          <p>Selecione um curso e continue o aprendizado</p>
          <Link to="/" className="voltar_para_home"><NavigateBeforeIcon />Voltar</Link>
        </div>
        <input
          type="text"
          placeholder="Buscar cursos..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="input_busca"
        />
      </div>

      {!removeLoading && <Loading />}

      <div className="dash_cursos">
        {removeLoading && cursosFiltrados.map((value) => {
          const progress = progressData[value.ID_CURSO];
          const faseAtualNum = Number(progress?.faseAtual) || 0;
          const totalFasesNum = Number(progress?.totalFases) || 0;
          const progressPercentage = totalFasesNum > 0
              ? (faseAtualNum / totalFasesNum) * 100
              : 0;
          const roundedPercentage = Math.round(progressPercentage);

          return (
            <div className="card_cursos" key={value.ID_CURSO}>
              <div className="imagem_curso">
                <img
                  src={value.imagem || "https://wallpapers.com/images/hd/tree-resembling-cerebral-cortex-xgqhghhr3d8pr4lt.jpg"}
                  alt={value.nome}
                />
              </div>
              <div className="textos_cursos">
                <h1>{value.nome}</h1>
                <div className="progress_section">
                  {isLoadingProgress || !progress ? (
                    <p>Carregando progresso...</p>
                  ) : (
                    <>
                      <div className="progress-info">
                        <span>Progresso: {faseAtualNum} / {totalFasesNum} fases</span>
                      </div>
                      <div className="progress-bar-wrapper">
                        <div className="progress-bar-container">
                          <div 
                            className="progress-bar-fill" 
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                        <span className="progress-percentage-text">
                          {roundedPercentage}%
                        </span>
                      </div>
                    </>
                  )}
                </div>
                {/* <Link to={`/cursos/${value.ID_CURSO}`}>
                  <div className="botao_cursos">
                    Acessar curso
                  </div>
                </Link> */}

                {/* ================================================================== */}
                {/* ALTERAÇÃO PRINCIPAL AQUI */}
                {/* ================================================================== */}
                <div className="botoes_card_container">
                  <Link to={`/cursos/${value.ID_CURSO}`} className="botao_cursos">
                    <div>
                      Acessar curso
                    </div>
                  </Link>

                  {/* O botão de certificado só aparece se a porcentagem for 100 */}
                  {roundedPercentage === 100 && (
                    <button 
                      className="botao_cursos"
                      onClick={() => handleDownloadCertificado(value.nome)}
                    >
                      Baixar Certificado
                    </button>
                  )}
                </div>
                {/* ================================================================== */}

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}