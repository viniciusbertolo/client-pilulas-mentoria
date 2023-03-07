import "./index.css";
import * as yup from "yup";
import { ErrorMessage, Formik, Form, Field } from "formik";
import Axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import logo_pilulas from "../../Assets/imgs/logo_pilulas.png";
import React, { Component }  from 'react';

import "react-datepicker/dist/react-datepicker.css";

function InfosAcesso({aoEnviar}) {

   
  
  const[email, setEmail] = useState();
  const[senha, setSenha] = useState();

  const handleRegister = (values) => {

    // setEmail(values.email)
    // setSenha(values.password)


    aoEnviar({ email: values.email, senha:values.password });
    


  };

  const validationsRegister = yup.object().shape({
    email: yup
      .string()
      .email("E-mail inválido")
      .required("O e-mail é obrigatório"),
    password: yup
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .required("A senha é obrigatória"),
    confirmation: yup
      .string()
      .oneOf([yup.ref("password"), null], "As senhas são diferentes")
      .required("A confirmação da senha é obrigatória"),
   
  });

  

  return (
    <div>
      <div className="body">
        <div className="card-cadastro">
      {/* <img src={logo_pilulas} alt="" className="logo_pilulas" /> */}
          <h1>Informações de acesso</h1>
          <p>Um prazer conhecer você. Agora precisamos dos seus dados de acesso.</p>

          <Formik
            initialValues={{}}
            onSubmit={handleRegister}
            validationSchema={validationsRegister}
            render={({ isValid, setFieldValue }) => (
              <Form className="login-form">
                  <label form="email">Usuário</label>

                  <Field
                    name="email"
                    type="email"
                    className="form-field"
                    placeholder="Email"
                  />

                  <ErrorMessage
                    component="span"
                    name="email"
                    className="form-error"
                  /><br></br>

                

                {/*Outro campo*/}

                  <label form="email">Senha</label>
                  <Field
                    name="password"
                    type="password"
                    className="form-field"
                    placeholder="Senha"
                  />

                  <ErrorMessage
                    component="span"
                    name="password"
                    className="form-error"
                  /><br></br>

                {/*Confirmação*/}

                  <label form="email">Confirme sua senha</label>
                  <Field
                    name="confirmation"
                    type="password"
                    className="form-field"
                    placeholder="Senha"
                  />

                  <ErrorMessage
                    component="span"
                    name="confirmation"
                    className="form-error"
                  /><br></br>


                <button className="button" type="submit">
                  CADASTRAR
                </button>
                  <p class="termos">
                  Ao clicar em “Cadastrar”, você concorda com os 
                  <a href={'/politicas'} target="_blank" className="link_termos">
                  &nbsp;Termos e Condições, Política de Privacidade e Política de Cookies&nbsp;
                    </a>
                    do Pilulas de Mentoria.
                    <br></br>
                    <br></br>
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

export default InfosAcesso;
