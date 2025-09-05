import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import "./index.css";

// Importação dos arquivos PDF
import matrizPrioridade from "../../Assets/materiais/matriz_prioridade.pdf";
import retroProj2025 from "../../Assets/materiais/retro_proj_2025.pdf";
import Loading from "../../Components/Loading";

export default function AreaDownload() {


  const [files, setFiles] = useState([]);
  const user = JSON.parse(localStorage.getItem("@user"));

  const [removeLoadin, setRemoveLoading] = useState(false)

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


  const [busca, setBusca] = useState("");
    const filesFiltrados = files.filter((file) =>
      file.nome.toLowerCase().includes(busca.toLowerCase())
    );


  return (
    <div className="pag_todo">
      <Navbar />
      <div className="detalhe_imagem_dash"></div>

      <div className="boas_vindas_cursos">
        <div>

        <h1>Materiais Extras</h1>
        <p>Materiais pensados especialmente para você!</p>
        <Link to="/" className="voltar_para_home"><NavigateBeforeIcon />Voltar</Link>
        </div>
        {/* Campo de busca */}
      <input
        type="text"
        placeholder="Buscar material..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="input_busca"
      />
      </div>

      {/* <div className="dash_cursos">
        {files.map((file, index) => (
          <div className="card_cursos" key={index}>
            <div className="textos_cursos">
              <h1>{file.name}</h1>
              <p>Clique no botão abaixo para baixar o arquivo.</p>
            </div>
            <a href={file.path} download>
              <div className="botao_cursos">
                <h2>Baixar</h2>
              </div>
            </a>
          </div>
        ))}
      </div> */}

      {!removeLoadin && <Loading />}

      <div className="dash_cursos">
        {filesFiltrados
          .filter((file) => file.publico === 0) // só arquivos públicos
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
    </div>
  );
}
