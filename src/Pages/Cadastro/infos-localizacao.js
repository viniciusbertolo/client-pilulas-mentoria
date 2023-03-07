import "./index.css";
import * as yup from "yup";
import { ErrorMessage, Formik, Form, Field } from "formik";
import Axios from "axios";
import { Link } from "react-router-dom";
import { useState } from "react";
import DatePicker from "react-datepicker";
import logo_pilulas from "../../Assets/imgs/logo_pilulas.png";
import React, { Component }  from 'react';

import "react-datepicker/dist/react-datepicker.css";

function InfosLocalizacao({aoEnviar}) {

    const[cep, setCep] = useState();
  const[logradouro, setLogradouro] = useState();
  const[numero, setNumero] = useState();
  const[bairro, setBairro] = useState();
  const[cidade, setCidade] = useState();
  const[uf, setUf] = useState();
 


  const handleSubmit = (values) => {
    aoEnviar({ cep: values.cep, logradouro:values.logradouro, numero:values.numero, bairro:values.bairro, cidade:values.cidade, uf:values.uf });
   
  };

  const validationsRegister = yup.object().shape({
    
    logradouro: yup
      .string()
      .required("Preencha o CEP e fazemos o resto pra você!"),
    numero: yup.string().required("Qual é o número da sua casa ?"),
    bairro: yup.string().required("Preencha o CEP e fazemos o resto pra você!"),
    cidade: yup.string().required("Preencha o CEP e fazemos o resto pra você!"),
    uf: yup.string().required("Preencha o CEP e fazemos o resto pra você!"),
  });

  function onBlurCep(ev, setFieldValue) {
    const { value } = ev.target;

    const cep = value.replace(/[^0-9]/g, "");

    if (cep.length !== 8) {
      return;
    }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((res) => res.json())
      .then((data) => {
        setFieldValue("logradouro", data.logradouro);
        setFieldValue("bairro", data.bairro);
        setFieldValue("cidade", data.localidade);
        setFieldValue("uf", data.uf);
      });
  }

  return (
    <div>
      <div className="body">
        <div className="card-cadastro">
      {/* <img src={logo_pilulas} alt="" className="logo_pilulas" /> */}
          <h1>Informações de localização</h1>
          <p>Estamos quase lá. Agora só falta cadastrar o seu endereço.</p>

          <Formik
            initialValues={{}}
            onSubmit={handleSubmit}
            validationSchema={validationsRegister}
            render={({ isValid, setFieldValue }) => (
              <Form className="login-form">
                

                
                  <label form="cep">Cep</label>
                  <Field
                    name="cep"
                    type="text"
                    onBlur={(ev) => onBlurCep(ev, setFieldValue)}
                    className="form-field"
                    placeholder="Cep"
                  />
                
                  <label>Logradouro</label>
                  <Field name="logradouro" type="text" className="form-field" placeholder="Logradouro" />
                  <ErrorMessage
                    component="span"
                    name="logradouro"
                    className="form-error"
                  /><br></br>
                
                  <label>Número</label>
                  <Field name="numero" type="text" className="form-field" placeholder="Número" />
                  <ErrorMessage
                    component="span"
                    name="numero"
                    className="form-error"
                  /><br></br>
                
                  <label>Bairro</label>
                  <Field name="bairro" type="text" className="form-field" placeholder="Bairro" />
                  <ErrorMessage
                    component="span"
                    name="bairro"
                    className="form-error"
                  /><br></br>
                
                  <label>Cidade</label>
                  <Field name="cidade" type="text" className="form-field" placeholder="Cidade" />
                  <ErrorMessage
                    component="span"
                    name="cidade"
                    className="form-error"
                  /><br></br>
                
                  <label>Estado</label>
                  <Field name="uf" type="text" className="form-field" placeholder="Estado"/>
                  <ErrorMessage
                    component="span"
                    name="uf"
                    className="form-error"
                  /><br></br>


                <button className="button" type="submit">
                  PRÓXIMO
                </button>
                <p class="termos">
                 Já nos conhecemos? 
                  <Link to={'/login'} className="link_termos">
                  &nbsp;Clique aqui para fazer login!&nbsp;
                    </Link>
                    
                  </p>
              </Form>
            )}
          />
        </div>
      </div>
    </div>
  );
}

export default InfosLocalizacao;
