import "./index.css";
import * as yup from "yup";
import { ErrorMessage, Formik, Form, Field } from "formik";
import Axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import logo_pilulas from "../../Assets/imgs/logo_pilulas.png";
import React, { Component } from "react";
import Swal from "sweetalert2";

function UploadRespostas() {
  const [numeroFase, setNumeroFase] = useState("");
  const [idCurso, setIdCurso] = useState();
  const [alternativa1, setAlternativa1] = useState("");
  const [alternativa2, setAlternativa2] = useState("");
  const [alternativa3, setAlternativa3] = useState("");
  const [alternativa4, setAlternativa4] = useState("");
  const [correta, setCorreta] = useState("");
  

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
    console.log(values.numeroFase);
    console.log(values.idCurso);
    console.log(values.alternativa1);
    console.log(values.alternativa2);
    console.log(values.alternativa3);
    console.log(values.alternativa4);
    console.log(values.correta);
    Axios.post("https://backend-pilulas-mentoria.herokuapp.com/upload-respostas", {
      numeroFase: values.numeroFase,
      idCurso: values.idCurso,
      alternativa1: values.alternativa1,
      alternativa2: values.alternativa2,
      alternativa3: values.alternativa3,
      alternativa4: values.alternativa4,
      correta: values.correta,
    }).then((response) => {
      // alert(response.data.msg);
      Swal.fire({
        icon: "success",
        title: "Cadastrado com sucesso!",
        text: `${response.data.msg}!`,
      });
      console.log(response);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  };

  const validationsRegister = yup.object().shape({
    correta: yup.string().required("Qual é a resposta da fase ?"),
    alternativa1: yup
      .string()
      .required("Digite a alternativa 1"),
    alternativa2: yup
      .string()
      .required("Digite a alternativa 2"),
    alternativa3: yup
      .string()
      .required("Digite a alternativa 3"),
    alternativa4: yup
      .string()
      .required("Digite a alternativa 4"),
    correta: yup
      .string()
      .required("Digite a alternativa correta"),
    idCurso: yup
      .string()
      .required("Campo obrigatorio"),
  });

  return (
    <div className="fundo-cadastro-cursos">
      <div className="body">
        <div className="card-cadastro">
          {/* <img src={logo_pilulas} alt="" className="logo_pilulas" /> */}
          <h1>Cadastrando as respostas</h1>
          <p>Vamos cadastrar as respostas das fases </p>

          <Formik
            initialValues={{}}
            onSubmit={handleSubmit}
            validationSchema={validationsRegister}
            render={({ isValid, setFieldValue }) => (
              <Form className="login-form">
                <label form="numeroFase">Número da fase:</label>

                <Field
                  name="numeroFase"
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
                <ErrorMessage
                  component="span"
                  name="idCurso"
                  className="form-error"
                />

                <label form="alternativa1">Alternativa 1:</label>

                <Field
                  name="alternativa1"
                  type="text"
                  className="form-field"
                  placeholder="Alternativa 1"
                />
                <ErrorMessage
                  component="span"
                  name="alternativa1"
                  className="form-error"
                />
                <br></br>
                <label form="alternativa2">Alternativa 2:</label>

                <Field
                  name="alternativa2"
                  type="text"
                  className="form-field"
                  placeholder="Alternativa 2"
                />
                <ErrorMessage
                  component="span"
                  name="alternativa2"
                  className="form-error"
                />
                <br></br>
                <label form="alternativa3">Alternativa 3:</label>

                <Field
                  name="alternativa3"
                  type="text"
                  className="form-field"
                  placeholder="Alternativa 3"
                />
                <ErrorMessage
                  component="span"
                  name="alternativa3"
                  className="form-error"
                />
                <br></br>
                <label form="alternativa4">Alternativa 4:</label>

                <Field
                  name="alternativa4"
                  type="text"
                  className="form-field"
                  placeholder="Alternativa 4"
                />
                <ErrorMessage
                  component="span"
                  name="alternativa4"
                  className="form-error"
                />
                <br></br>
                <label form="correta">Correta:</label>

                <Field
                  name="correta"
                  type="text"
                  className="form-field"
                  placeholder="Correta"
                />

<ErrorMessage
                  component="span"
                  name="correta"
                  className="form-error"
                />
                
                <br></br>

                

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

export default UploadRespostas;
