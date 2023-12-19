import "./index.css";
import * as yup from "yup";
import { ErrorMessage, Formik, Form, Field } from "formik";
import Axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import logo_pilulas from "../../Assets/imgs/logo_pilulas.png";
import React, { Component } from "react";
import Swal from "sweetalert2";

function UploadCurso() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [urlVideoPreview, setUrlVideoPreview] = useState("");

  const handleSubmit = (values) => {
    console.log("Nome:", values.nome);
    console.log("Descrição:", values.descricao);
    console.log("URL do Video Preview:", values.urlVideoPreview);

    fetch("https://backend-pilulas-mentoria.herokuapp.com/upload-curso", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: values.nome,
        descricao: values.descricao,
        urlVideoPreview: values.urlVideoPreview,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Sucesso
          Swal.fire({
            icon: "success",
            title: "Cadastrado com sucesso!",
            text: `${data.msg}!`,
          });

          // Redirecione para a página desejada (por exemplo, a home)
          window.location.href = "/home"; // Altere a URL conforme necessário
        } else {
          // Erro
          Swal.fire({
            icon: "error",
            title: "Erro ao cadastrar",
            text: `${data.msg}!`,
          });
        }
      })
      .catch((error) => {
        console.error("Erro ao enviar a requisição:", error);
        // Trate o erro conforme necessário
      });
  };

  const validationsRegister = yup.object().shape({
    nome: yup.string().required("Qual é o titulo do curso ?"),
    descricao: yup
      .string()
      .required("Nos diga qual é o conteúdo que iremos ver no curso"),
    urlVideoPreview: yup
      .string()
      .required("Qual é a URL do video de preview ?"),
  });

  return (
    <div className="fundo-cadastro-cursos">
      <div className="body">
        <div className="card-cadastro">
          {/* <img src={logo_pilulas} alt="" className="logo_pilulas" /> */}
          <h1>Cadastrando um curso</h1>
          <p>Primeiro de tudo, vamos cadastrar o curso </p>

          <Formik
            initialValues={{
              nome: nome,
              descricao: descricao,
              urlVideoPreview: urlVideoPreview,
            }}
            onSubmit={handleSubmit}
            validationSchema={validationsRegister}
            render={({ isValid, setFieldValue }) => (
              <Form className="login-form">
                <label form="nome">Nome:</label>

                <Field
                  name="nome"
                  type="text"
                  className="form-field"
                  placeholder="Nome do curso"
                />
                <ErrorMessage
                  component="span"
                  name="nome"
                  className="form-error"
                />
                <br></br>

                <label form="descricao">Descrição:</label>
                <Field
                  name="descricao"
                  type="text"
                  className="form-field"
                  placeholder="O que veremos no curso ?"
                />
                <ErrorMessage
                  component="span"
                  name="descricao"
                  className="form-error"
                />
                <br></br>

                <label form="urlVideoPreview">URL video preview:</label>
                <Field
                  name="urlVideoPreview"
                  type="text"
                  className="form-field"
                  placeholder="URL do video de preview"
                />
                <ErrorMessage
                  component="span"
                  name="urlVideoPreview"
                  className="form-error"
                />
                <br></br>

                {/* <label form="profissao">Profissão</label>
                  <Field as="select" name="profissao" className="form-field">
                    {profissoes.profissoes.map((value, key) => (
                      <option value={value} key={key}>
                        {value}
                      </option>
                    ))}
                  </Field> */}

                <button className="button" type="submit">
                  CADASTRAR
                </button>
              </Form>
            )}
          />
        </div>
      </div>
    </div>
  );
}

export default UploadCurso;
