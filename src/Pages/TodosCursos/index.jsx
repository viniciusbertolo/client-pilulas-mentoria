import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import "./index.css";
import ReactPlayer from "react-player/youtube";
import { Axios } from "axios";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import Loading from "../../Components/Loading";
import Swal from 'sweetalert2'

export default function TodosCursos(props) {
  const [cursos, setCursos] = useState([]);
  const user = JSON.parse(localStorage.getItem("@user"));

  const [removeLoadin, setRemoveLoading] = useState(false)

  const [relacionamento, setRelacionamento] = useState({});
  const [responseFaseAtual, setResponseFaseAtual] = useState({});


  const [cursosDoUsuario, setCursosDoUsuario] = useState([]);

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



  useEffect(() => {
    // Obter cursos do usuário específico
    async function obterCursosDoUsuario() {
      const resposta = await fetch(`https://backend-pilulas-mentoria.herokuapp.com/usuario-curso/${user.email}`, {
        method: "GET",
        headers: { "Content-type": "application/json" },
      });
      const respostaJson = await resposta.json();
      const cursosUsuario = respostaJson.map((curso) => curso.ID_CURSO);
      setCursosDoUsuario(cursosUsuario);

      // setCursosDoUsuario(respostaJson.ID_CURSO);
    }
    obterCursosDoUsuario();
  }, []);

  console.log(user.email);
  console.log("Cursos:", cursos);
  console.log("Cursos do usuário:", cursosDoUsuario); // Verificar os cursos do usuário

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


  async function createCheckout(id, valor_curso) {
  try {
    const response = await fetch("https://backend-pilulas-mentoria.herokuapp.com/api/payments/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email_usuario: user.email,
        ID_CURSO: id,
        codigo: "TESTEPAGAMENTO",
        valor: valor_curso
      }),
    });

    const data = await response.json();

    if (data.url) {
      window.location.href = data.url; // redireciona para Stripe Checkout
    } else {
      console.error("Erro:", data);
    }
  } catch (err) {
    console.error("Erro ao criar checkout:", err);
  }
}


  const codigosPorCurso = {
    1: ['codigo1', 'codigo2', 'codigo3'],  // Códigos para o curso com ID 1
    2: ['dsm.ptp', 'codigo5', 'codigo6'],  // Códigos para o curso com ID 2
    74: ['agte.agss.01', 'codigo8', 'codigo9']   // Códigos para o curso com ID 3
  };
  
  const codigo = (ID_CURSO) => {
    Swal.fire({
      title: "Adicione o código do curso",
      input: "text",
      inputAttributes: {
        autocapitalize: "off"
      },
      showCancelButton: true,
      confirmButtonText: "Adicionar aos meus cursos",
      showLoaderOnConfirm: true,
      preConfirm: async (codigo) => {
        try {
          // Verifica se o código está na lista de códigos válidos para o curso
          if (!codigosPorCurso[ID_CURSO] || !codigosPorCurso[ID_CURSO].includes(codigo)) {
            return Swal.showValidationMessage(`Código inválido para o curso selecionado.`);
          }
  
          // Aqui, você pode fazer a requisição para o backend para inserir os dados no banco
          const email_usuario = user.email;  // Este é um exemplo. Substitua com o email do usuário da sessão.
          const response = await fetch(`https://backend-pilulas-mentoria.herokuapp.com/liberar-curso/${email_usuario}/${ID_CURSO}/${codigo}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            mode: 'no-cors'
          });
  
        //   if (!response.ok) {
        //     throw new Error('Erro ao inserir no banco de dados');
        //     console.log(user)
        //     console.log(ID_CURSO)
        //     console.log(codigo)
        //   }
  
           // Se a inserção for bem-sucedida, você pode mostrar uma confirmação
        Swal.fire({
            title: 'Sucesso!',
            text: 'O código foi adicionado ao seu curso.',
            icon: 'success'
          }).then(() => {
            // Redireciona para a página de cursos após a confirmação
            window.location.href = '/cursos';
          });
  
        } catch (error) {
          return Swal.showValidationMessage(`Erro: ${error.message}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    });
  };
  

  return (
    <div className="pag_todo">
      <Navbar />
      <div className="detalhe_imagem_dash">

      </div>

      <div className="boas_vindas_cursos">
        <h1>Olá, Bem-Vindo aos cursos do Pilulas de Mentoria</h1>
        <p>Selecione um curso e comece o aprendizado</p>
        <Link to="/" className="voltar_para_home"><NavigateBeforeIcon />Voltar</Link>
      </div>



      {!removeLoadin && <Loading />}

      <div className="dash_cursos">
        {cursos
          .map((value, key) => (
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
              {/* <Link to={`/cursos/${value.ID_CURSO}`}> */}
                {/* <div className="botao_cursos" onClick={() => codigo(value.ID_CURSO)}>

                  <h2>Código promocioal</h2>
                </div> */}
              {/* </Link> */}
              {/* <Link to={`/cursos/${value.ID_CURSO}`}> */}
                {/* <div className="botao_cursos" onClick={() => createCheckout(value.ID_CURSO, "50")}>

                  <h2>Comprar curso</h2>
                </div> */}
              {/* </Link> */}
              <Link to={`/detalhe-curso/${value.ID_CURSO}`}>
                <div className="botao_cursos">

                  <h2>Detalhes curso</h2>
                </div>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}
