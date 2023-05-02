import React, { useState } from 'react'
import "./index.css"
import { useParams } from 'react-router-dom';

export default function Relatorios() {
    const { id } = useParams();
    const user = JSON.parse(localStorage.getItem("@user"));


    const [removeLoadin, setRemoveLoading] = useState(false)

  const [fases, setFases] = useState([]);
  const [relacionamento, setRelacionamento] = useState({});
  const [responseFaseAtual, setResponseFaseAtual] = useState({});

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
    }

    
  return (
    <div>index</div>
  )
}
