import React, { useState, useEffect } from "react";
import { Typography, Stepper, Step, StepLabel } from "@material-ui/core";
import InfosPessoais from "./infos-pessoais";
import InfosLocalizacao from "./infos-localizacao";
import InfosAcesso from "./infos-acesso";
import "./index.css"
import { Navigate } from "react-router-dom";
import Swal from 'sweetalert2/dist/sweetalert2.js'


function FormularioCadastro({ aoEnviar }) {
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [dadosColetados, setDados] = useState({});

  useEffect(() => {
    if (etapaAtual === formularios.length - 1) {
      aoEnviar(dadosColetados);
    }
  });

  const formularios = [
    <InfosPessoais aoEnviar={coletarDados} />,
    <InfosLocalizacao aoEnviar={coletarDados} />,
    <InfosAcesso aoEnviar={coletarDados} />,
    <Typography variant="h5">
      
      <Navigate to={'/'} />
      </Typography>,
  ];

  function coletarDados(dados) {
    setDados({ ...dadosColetados, ...dados });
    proximo();
  }
  function proximo() {
    setEtapaAtual(etapaAtual + 1);
  }
  return (
    <div className="card-cadastro-novo">
      <Stepper activeStep={etapaAtual} alternativeLabel className="stepper">
        <Step className="step">
          <StepLabel className="stepLabel"></StepLabel>
        </Step>
        <Step className="step">
          <StepLabel className="stepLabel"></StepLabel>
        </Step>
        <Step className="step">
          <StepLabel className="stepLabel"></StepLabel>
        </Step>
        <Step className="step">
          <StepLabel className="stepLabel"></StepLabel>
        </Step>
      </Stepper>
      {formularios[etapaAtual]}
    </div>
  );
}

export default FormularioCadastro;