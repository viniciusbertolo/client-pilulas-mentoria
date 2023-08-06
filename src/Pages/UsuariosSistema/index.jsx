import React, { useEffect, useState } from "react";
import "./index.css";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import Loading from "../../Components/Loading";

export default function UsuariosSistema() {
  const user = JSON.parse(localStorage.getItem("@user"));
  const { email } = useParams();

  const [removeLoadin, setRemoveLoading] = useState(false);

  const [detalhesUsuario, setDetalhesUsuario] = useState([]);

  useEffect(() => {
    async function obterDetalhesUsuario() {
      const response = await fetch(
        `http://localhost:3001/detalhes-usuario/${email}`,
        {
          method: "GET",
          headers: { "Content-type": "application/json" },
        }
      );

      const respostaJson = await response.json();
      setDetalhesUsuario(respostaJson);
      setRemoveLoading(true);
    }

    obterDetalhesUsuario();
  }, []);

  console.log(detalhesUsuario);

  return (
    <div className="pag_todo">
      <Navbar />

      <div className="detalhe_imagem_dash"></div>

      <div className="boas_vindas_cursos">
        <h1>Olá, você está na área de controle do Pilulas de Mentoria</h1>
        <Link to="/relatorios" className="voltar_para_home">
          <NavigateBeforeIcon />
          Voltar
        </Link>
      </div>

      {!removeLoadin && <Loading />}

      <div className="controle_pessoas">

          {detalhesUsuario.map((value, key) => (
        <table class="styled-table tabela-detalhes-pessoa" key={key}>
            <tr>
              <th>Nome</th>
              <td>{value.nome}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{value.email}</td>
            </tr>
            <tr>
              <th>Telefone</th>
              <td>{value.phone}</td>
            </tr>
            <tr>
              <th>Data de Nascimento</th>
              <td>{value.data_nascimento}</td>
            </tr>
            <tr>
              <th>CEP</th>
              <td>{value.cep}</td>
            </tr>
            <tr>
              <th>Logradouro</th>
              <td>{value.logradouro}</td>
            </tr>
            <tr>
              <th>Número</th>
              <td>{value.numero}</td>
            </tr>
            <tr>
              <th>Bairro</th>
              <td>{value.bairro}</td>
            </tr>
            <tr>
              <th>Cidade</th>
              <td>{value.cidade}</td>
            </tr>
            <tr>
              <th>Estado</th>
              <td>{value.estado}</td>
            </tr>
            <tr>
              <th>Profissão</th>
              <td>{value.profissão}</td>
            </tr>
            <tr>
              <th>Empresa</th>
              <td>{value.empresa}</td>
            </tr>
              
        </table>
          ))}
      </div>
    </div>
  );
}
