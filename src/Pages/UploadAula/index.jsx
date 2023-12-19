import "./index.css";
import * as yup from "yup";
import { ErrorMessage, Formik, Form, Field } from "formik";
import Axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import logo_pilulas from "../../Assets/imgs/logo_pilulas.png";
import React, { Component } from "react";
import Swal from "sweetalert2";

function UploadAula() {
  const [numero, setNumero] = useState("");
  const [idCurso, setIdCurso] = useState();
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [url, setUrl] = useState("");
  const [pergunta, setPergunta] = useState("");
  const [material, setMaterial] = useState("");

  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    async function obterCursos() {
      const response = await fetch(`https://backend-pilulas-mentoria.herokuapp.com/cursos`, {
        method: "GET",
        headers: { "Content-type": "application/json" },
      });

      const respostaJson = await response.json();
      setCursos(respostaJson);
    }

    obterCursos();
  }, []);

  
  const handleSubmit = (values) => {
    console.log(values.numero);
    console.log(values.idCurso);
    console.log(values.nome);
    console.log(values.descricao);
    console.log(values.url);
    console.log(values.pergunta);
    console.log(values.material);
  
    fetch('https://backend-pilulas-mentoria.herokuapp.com/upload-fase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        numero: values.numero,
        idCurso: values.idCurso,
        nome: values.nome,
        descricao: values.descricao,
        url: values.url,
        pergunta: values.pergunta,
        material: values.material,
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Sucesso
          Swal.fire({
            icon: 'success',
            title: 'Cadastrado com sucesso!',
            text: `${data.msg}!`,
          });
  
          // Redirecionar para a página desejada (por exemplo, a home)
          window.location.href = '/home'; // Altere a URL conforme necessário
        } else {
          // Erro
          Swal.fire({
            icon: 'error',
            title: 'Erro ao cadastrar',
            text: `${data.msg}!`,
          });
        }
      })
      .catch(error => {
        console.error('Erro ao enviar a requisição:', error);
        // Trate o erro conforme necessário
      });
  };
  

  const validationsRegister = yup.object().shape({
    nome: yup.string().required("Qual é o titulo da fase ?"),
    descricao: yup
      .string()
      .required("Nos diga qual é o conteúdo que iremos ver na fase"),
    url: yup.string().required("Qual é a URL do video ?"),
  });

  return (
    <div className="fundo-cadastro-cursos">
      <div className="body">
        <div className="card-cadastro">
          {/* <img src={logo_pilulas} alt="" className="logo_pilulas" /> */}
          <h1>Cadastrando uma fase</h1>
          <p>Vamos cadastrar as fases </p>

          <Formik
            initialValues={{}}
            onSubmit={handleSubmit}
            validationSchema={validationsRegister}
            render={({ isValid, setFieldValue }) => (
              <Form className="login-form">
                <label form="numero">Número da fase:</label>

                <Field
                  name="numero"
                  type="text"
                  className="form-field"
                  placeholder="numero da fase"
                />

                <label form="idCurso">Curso</label>
                <Field as="select" name="idCurso" className="form-field">
                  {cursos.map((value, key) => (
                      <option value={value.ID_CURSO} key={key}>
                        {value.nome}
                      </option>
                    ))}
                </Field>

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

                <label form="url">URL video:</label>
                <Field
                  name="url"
                  type="text"
                  className="form-field"
                  placeholder="URL do video"
                />
                <ErrorMessage
                  component="span"
                  name="url"
                  className="form-error"
                />
                <br></br>

                <label form="pergunta">Pergunta da fase:</label>
                <Field
                  name="pergunta"
                  type="text"
                  className="form-field"
                  placeholder="Pergunta da fase"
                />

                <label form="material">Material da fase:</label>
                <Field
                  name="material"
                  type="text"
                  className="form-field"
                  placeholder="Material da fase"
                />

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

export default UploadAula;
