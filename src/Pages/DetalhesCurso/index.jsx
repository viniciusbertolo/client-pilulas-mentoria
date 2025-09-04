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







    // enquanto não encontrar, mostra carregando
    if (!curso) {
        return (
            <div className="pag_todo">
                <Navbar />
                <p style={{ textAlign: "center", marginTop: "50px", color: "#fafafa"}}>
                    Carregando curso...
                </p>
            </div>
        );
    }

    return (
        <div className="pag_todo">
            <Navbar />
            <div className="detalhe_imagem_dash">

            </div>

            <div className="boas_vindas_cursos">
                <h1>Curso {curso.nome}</h1>
                <p>Abaixo mais detalhes sobre o curso</p>
                <Link to="/todos-cursos" className="voltar_para_home"><NavigateBeforeIcon />Voltar</Link>
            </div>



            {!removeLoadin && <Loading />}

            <div className="dash_detalhes">
                <div className="video_preview_curso">
                    <ReactPlayer
                        className="video_player"
                        url={curso.URL_VIDEO_PREVIW}
                        controls
                        width="100%"
                    />
                </div>
                {/* <h1>{curso.nome}</h1> */}
                <p>{curso.descricao}</p>

                <div className="acoes_area">
                    <div className="botao_detalhes" onClick={() => createCheckout(curso.ID_CURSO, "50")}>Comprar curso</div>
                    <div className="botao_detalhes" onClick={() => codigo(curso.ID_CURSO)}>Código promocional</div>
                </div>
            </div>


        </div>
    );
}
