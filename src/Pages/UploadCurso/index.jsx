import "./index.css";
import * as yup from "yup";
import { ErrorMessage, Formik, Form, Field } from "formik";
import { useState } from "react";
import Swal from 'sweetalert2';
import React from 'react';


function UploadCurso() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [urlVideoPreview, setUrlVideoPreview] = useState('');

  const handleSubmit = async (values) => {
    try {
      const response = await fetch("https://backend-pilulas-mentoria.herokuapp.com/upload-curso", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: values.nome,
          descricao: values.descricao,
          urlVideoPreview: values.urlVideoPreview,
        }),
      });
  
      const responseData = await response.json();
  
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Cadastrado com sucesso!',
          text: `${responseData.msg}!`,
        });
  
        window.location.href = '/uploads'; // Redireciona para a página de cursos
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao cadastrar',
          text: `${responseData.msg}!`,
        });
      }
    } catch (error) {
      console.error('Erro ao enviar a requisição:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao cadastrar',
        text: 'Ocorreu um erro ao cadastrar o curso. Tente novamente mais tarde.',
      });
    }
  };
  
  

  const validationsRegister = yup.object().shape({
    nome: yup.string().required("Qual é o título do curso?"),
    descricao: yup.string().required("Nos diga qual é o conteúdo que iremos ver no curso"),
    urlVideoPreview: yup.string().required("Qual é a URL do vídeo de preview?"),
  });

  return (
    <div className="fundo-cadastro-cursos">
      <div className="body">
        <div className="card-cadastro">
          <h1>Cadastrando um curso</h1>
          <p>Primeiro de tudo, vamos cadastrar o curso</p>

          <Formik
            initialValues={{
              nome: nome,
              descricao: descricao,
              urlVideoPreview: urlVideoPreview,
            }}
            onSubmit={handleSubmit}
            validationSchema={validationsRegister}
          >
            {({ isValid, setFieldValue }) => (
              <Form className="login-form">
                <label htmlFor="nome">Nome:</label>
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
                /><br></br>

                <label htmlFor="descricao">Descrição:</label>
                <Field
                  name="descricao"
                  type="text"
                  className="form-field"
                  placeholder="O que veremos no curso?"
                />
                <ErrorMessage
                  component="span"
                  name="descricao"
                  className="form-error"
                /><br></br>

                <label htmlFor="urlVideoPreview">URL video preview:</label>
                <Field
                  name="urlVideoPreview"
                  type="text"
                  className="form-field"
                  placeholder="URL do vídeo de preview"
                />
                <ErrorMessage
                  component="span"
                  name="urlVideoPreview"
                  className="form-error"
                /><br></br>

                <button className="button" type="submit">
                  CADASTRAR
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default UploadCurso;
