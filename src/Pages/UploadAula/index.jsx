import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { ErrorMessage, Formik, Form, Field } from "formik";
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
      try {
        const response = await fetch(`https://backend-pilulas-mentoria.herokuapp.com/cursos`, {
          method: "GET",
          headers: { "Content-type": "application/json" },
        });

        const respostaJson = await response.json();
        setCursos(respostaJson);
      } catch (error) {
        console.error('Erro ao obter cursos:', error);
        // Trate o erro conforme necessário
      }
    }

    obterCursos();
  }, []);

  const handleSubmit = async (values) => {
    try {
      const response = await fetch('https://backend-pilulas-mentoria.herokuapp.com/upload-fase', {
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
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Cadastrado com sucesso!',
          text: `${data.msg}!`,
        });

        window.location.href = '/home'; // Redireciona para a página desejada
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao cadastrar',
          text: `${data.msg}!`,
        });
      }
    } catch (error) {
      console.error('Erro ao enviar a requisição:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao cadastrar',
        text: 'Ocorreu um erro ao cadastrar a fase. Tente novamente mais tarde.',
      });
    }
  };

  const validationsRegister = yup.object().shape({
    numero: yup.string().required("Informe o número da fase"),
    idCurso: yup.string().required("Selecione o curso"),
    nome: yup.string().required("Informe o nome da fase"),
    descricao: yup.string().required("Informe a descrição da fase"),
    url: yup.string().required("Informe a URL do vídeo"),
    pergunta: yup.string().required("Informe a pergunta da fase"),
    material: yup.string().required("Informe o material da fase"),
  });

  return (
    <div className="fundo-cadastro-cursos">
      <div className="body">
        <div className="card-cadastro">
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
                  placeholder="Número da fase"
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
                  placeholder="Nome da fase"
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
                  placeholder="Descrição da fase"
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
                  placeholder="URL do vídeo"
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
