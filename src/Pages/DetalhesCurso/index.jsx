// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import Navbar from "../../Components/Navbar";

// export default function DetalheCurso() {
//   const { id } = useParams(); // pega o ID da URL
//   const [cursos, setCursos] = useState([]);

//   useEffect(() => {
//     async function fetchCurso() {
//       try {
//         const resposta = await fetch(`https://backend-pilulas-mentoria.herokuapp.com/cursos`);
//         const data = await resposta.json();
//         setCursos(data);
//       } catch (error) {
//         console.error("Erro ao buscar cursos:", error);
//       }
//     }
//     fetchCurso();
//   }, [id]);

//   if (!cursos.length) return <p>Carregando curso...</p>;

//   const cursoFiltrado = cursos.filter((c) => c.ID_CURSO === Number(id));

//   if (!cursoFiltrado.length) {
//     return <p>Curso não encontrado.</p>;
//   }

//   return (
//     <div>
//       <Navbar />
//       <div className="dash_cursos">
//         {cursoFiltrado.map((value, key) => (
//           <div className="card_cursos" key={key}>
//             <div className="textos_cursos">
//               <h1>{value.nome}</h1>
//               <p>{value.descricao}</p>
//               <video src={value.URL_VIDEO_PREVIW} controls width="600" />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import "./index.css";
import ReactPlayer from "react-player";
import Loading from "../../Components/Loading";
import Swal from 'sweetalert2'

export default function DetalheCurso() {
    const { id } = useParams();
    const [cursos, setCursos] = useState([]);
    const [removeLoadin, setRemoveLoading] = useState(false)
    const user = JSON.parse(localStorage.getItem("@user"));
    const [fases, setFases] = useState([]);

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



    // 2. Buscar fases depois que já tiver curso
    useEffect(() => {
        if (!curso) return; // evita rodar antes da hora

        async function obterFases() {
            try {
                const responseFase = await fetch(
                    `https://backend-pilulas-mentoria.herokuapp.com/fases/${curso.ID_CURSO}`,
                    {
                        method: "GET",
                        headers: { "Content-type": "application/json" },
                    }
                );
                const respostaJson = await responseFase.json();
                setFases(respostaJson);
                console.log(respostaJson);
            } catch (error) {
                console.error("Erro ao buscar fases:", error);
            }
        }

        obterFases();
    }, [curso]); // roda só quando curso estiver definido

    console.log(cursos)

    console.log(curso)








    // const codigosPorCurso = {
    //     1: ['codigo1', 'codigo2', 'codigo3'],  // Códigos para o curso com ID 1
    //     2: ['dsm.ptp', 'codigo5', 'codigo6'],  // Códigos para o curso com ID 2
    //     74: ['agte.agss.01', 'codigo8', 'codigo9']   // Códigos para o curso com ID 3
    // };

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
                    // if (!codigosPorCurso[ID_CURSO] || !codigosPorCurso[ID_CURSO].includes(codigo)) {
                    //     return Swal.showValidationMessage(`Código inválido para o curso selecionado.`);
                    // }

                    // Cria um array com os códigos que vieram do banco para este curso
                    const codigosValidos = [
                        curso.cod1,
                        curso.cod2,
                        curso.cod3,
                        curso.cod4,
                        curso.cod5
                    ].filter(Boolean); // remove null/undefined
                    console.log(codigosValidos)

                    // Verifica se o código digitado existe nos campos do banco
                    if (!codigosValidos.includes(codigo)) {
                        return Swal.showValidationMessage(
                            `Código inválido para o curso selecionado.`
                        );
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
                    Swal.fire({
                        title: 'Sucesso!',
                        text: 'O curso foi adicionado.',
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







    




    const [timeLeft, setTimeLeft] = useState(500 * 60); // 5 minutos em segundos

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0) {
                    clearInterval(interval); // para o timer quando chegar a 0
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval); // limpa o intervalo ao desmontar
    }, []);

    // Cálculo de horas, minutos e segundos
    const hours = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
    const seconds = String(timeLeft % 60).padStart(2, "0");


    // enquanto não encontrar, mostra carregando
    if (!curso) {
        return (
            <div className="pag_todo">
                <Navbar />
                <p style={{ textAlign: "center", marginTop: "50px", color: "#fafafa" }}>
                    Carregando curso...
                </p>
            </div>
        );
    }
    return (
        <div className="pag_todo">

            <Navbar />
            <div className="detalhe_imagem_detalhes_curso"></div>
            <div id="timer" className="timer">
                A promoção acaba em {hours}:{minutes}:{seconds}!
            </div>
            
            <div className="dash_detalhes">
                <div className="video_preview_curso">
                    <ReactPlayer className="video_player" url={curso.URL_VIDEO_PREVIW} controls width="100%" />
                    <p>{curso.descricao}</p>
                </div>

                <div className="course_info_box">
                    <Link to="/todos-cursos" className="voltar_para_home"><NavigateBeforeIcon />Voltar</Link>
                    <h2>{curso.nome}</h2>
                    <p>Um curso com o <a className="link_alex" href="https://alexborn.com.br/" target="_blank" >Pesquisador Neurocientista Alex Born</a></p>
                    <p>São {fases.length} aulas / pílulas de conhecimento diário para você!</p>
                    <p className="preco_original">De R$ {(curso.preco * 1.75 / 100).toFixed(2).replace('.', ',')}</p>
                    <p className="preco_final">Por R$ {(curso.preco / 100).toFixed(2).replace('.', ',')}</p>

                    <div className="acoes_area">
                        {/* <div className="botao_detalhes" onClick={() => createCheckout(curso.ID_CURSO, curso.preco)}>Comprar curso</div> */}
                        <div className="botao_detalhes" onClick={() => {
                            if (!user) {
                                localStorage.setItem("redirectAfterLogin", window.location.pathname);
                                window.location.href = "/login";
                                return;
                            }
                            createCheckout(curso.ID_CURSO, curso.preco)
                            // createCheckout(curso.ID_CURSO, curso.preco)}
                        }}>
                            Comprar curso
                        </div>
                        <div className="botao_detalhes" onClick={() => {
                            if (!user) {
                                localStorage.setItem("redirectAfterLogin", window.location.pathname);
                                window.location.href = "/login";
                                return;
                            }
                            codigo(curso.ID_CURSO);
                            // onClick={() => codigo(curso.ID_CURSO)}
                        }}>
                            Código promocional
                        </div>
                    </div>
                </div>
                <div className="fases_container">
                    <h3>Conteúdo do curso</h3>
                    <ul className="lista_fases">
                        {fases.map((fase, index) => (
                            <li key={index} className="fase_item">
                                {fase.nome}
                            </li>
                        ))}
                    </ul>
                </div>

            </div>



        </div>




        // <div className="detalhe_imagem_dash">
        // </div>
        // <div className="boas_vindas_cursos">
        //     <h1>Curso {curso.nome}</h1>
        //     <p>Abaixo mais detalhes sobre o curso</p>
        //     <Link to="/todos-cursos" className="voltar_para_home"><NavigateBeforeIcon />Voltar</Link>
        // </div>
        // {!removeLoadin && <Loading />}
        // <div className="dash_detalhes">
        //     <div className="video_preview_curso">
        //         <ReactPlayer
        //             className="video_player"
        //             url={curso.URL_VIDEO_PREVIW}
        //             controls
        //             width="100%"
        //         />
        //     </div>
        //     {/* <h1>{curso.nome}</h1> */}
        //     <p>{curso.descricao}</p>
        //     <p>De R${(curso.preco * 1.75 / 100).toFixed(2).replace('.', ',')}</p>
        //     <p>Por R${(curso.preco / 100).toFixed(2).replace('.', ',')}</p>
        //     <p>São {fases.length} pilulas para você!</p>

        //     <div className="acoes_area">
        //         {/* <div className="botao_detalhes" onClick={() => createCheckout(curso.ID_CURSO, curso.preco)}>Comprar curso</div> */}
        //         <div className="botao_detalhes" onClick={() => {
        //             if (!user) {
        //                 localStorage.setItem("redirectAfterLogin", window.location.pathname);
        //                 window.location.href = "/login";
        //                 return;
        //             }
        //             createCheckout(curso.ID_CURSO, curso.preco)
        //             // createCheckout(curso.ID_CURSO, curso.preco)}
        //         }}>
        //             Comprar curso
        //         </div>
        //         <div className="botao_detalhes" onClick={() => {
        //             if (!user) {
        //                 localStorage.setItem("redirectAfterLogin", window.location.pathname);
        //                 window.location.href = "/login";
        //                 return;
        //             }
        //             codigo(curso.ID_CURSO);
        //             // onClick={() => codigo(curso.ID_CURSO)}
        //         }}>
        //             Código promocional
        //         </div>
        //     </div>
        // </div>

    );
}
