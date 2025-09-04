import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import "./index.css";

// Importação dos arquivos PDF
import matrizPrioridade from "../../Assets/materiais/matriz_prioridade.pdf";
import retroProj2025 from "../../Assets/materiais/retro_proj_2025.pdf";

export default function AreaDownload() {
  const files = [
    { name: "Matriz de Prioridade", path: matrizPrioridade },
    { name: "Retrospectiva e projeções 2025", path: retroProj2025 },
  ];

  return (
    <div className="pag_todo">
      <Navbar />
      <div className="detalhe_imagem_dash"></div>

      <div className="boas_vindas_cursos">
        <h1>Área de Downloads</h1>
        <p>Baixe seus arquivos disponíveis abaixo</p>
        <Link to="/" className="voltar_para_home">
          <NavigateBeforeIcon />
          Voltar
        </Link>
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

      <div className="dash_cursos">
        {files
          .map((value, key) => (
            <div className="card_cursos" key={key}>

              {/* Imagem genérica do curso */}
              <div className="imagem_curso">
                <img
                  src={"https://wallpapers.com/images/featured/data-center-775ta0o0wf4nbyq3.jpg"}
                  alt={value.name}
                />
              </div>

              <div className="textos_cursos">
                <h1>{value.name}</h1>
                <br></br>
                <a href={value.path} download>
                  <div className="botao_cursos">
                    Baixar
                  </div>
                </a>
              </div>


            </div>
          ))}
      </div>
    </div>
  );
}
