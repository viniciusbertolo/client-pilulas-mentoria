import React, { useEffect, useState } from "react";
import "./index.css";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import Loading from "../../Components/Loading";
import * as XLSX from "xlsx";

export default function ControleEmpresa() {
    const { empresa } = useParams(); // Obtém o nome da empresa a partir da URL
    const [removeLoading, setRemoveLoading] = useState(false);
    const [usuariosCursando, setUsuariosCursando] = useState([]);

    useEffect(() => {
        async function fetchUsuariosCursando() {
            try {
                const response = await fetch(
                    `https://backend-pilulas-mentoria.herokuapp.com/usuarios-cursando/${empresa}`,
                    {
                        method: "GET",
                        headers: { "Content-type": "application/json" },
                    }
                );

                const respostaJson = await response.json();
                setUsuariosCursando(respostaJson); // Armazena os dados na state
                setRemoveLoading(true);
            } catch (error) {
                console.error("Erro ao buscar usuários:", error);
                setRemoveLoading(true);
            }
        }

        fetchUsuariosCursando();
    }, [empresa]); // Atualiza quando o parâmetro "empresa" muda


    function exportToExcel(data, fileName = "usuarios_cursando.xlsx") {
        // Converte os dados em um formato aceito pelo Excel
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();

        // Adiciona a planilha ao workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");

        // Salva o arquivo Excel
        XLSX.writeFile(workbook, fileName);
    }





    return (
        <div className="pag_todo">
            <Navbar />

            <div className="detalhe_imagem_dash"></div>



            {!removeLoading && <Loading />}

            <div className="controle_pessoas">
                {removeLoading && usuariosCursando.length === 0 ? (
                    <p>Nenhum resultado encontrado para "{empresa}".</p>
                ) : (
                    <div className="controle_pessoas">
                        <div className="div_button_export">
                                <h1>Área de Controle - {empresa}</h1>

                            <button
                                className="export-button"
                                onClick={() => exportToExcel(usuariosCursando)}
                            >
                                Exportar para Excel
                            </button>
                        </div>
                        <table className="styled-table">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Cursando Curso</th>
                                    <th>Fase Atual</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuariosCursando.map((usuario, index) => (
                                    <tr key={index}>
                                        <td>{usuario.Nome_Usuario}</td>
                                        <td>{usuario.Cursando_Curso}</td>
                                        <td>{usuario.Fase_Atual || "N/A"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
