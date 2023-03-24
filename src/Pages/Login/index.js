import "./index.css"
import * as yup from "yup";
import { ErrorMessage, Formik, Form, Field } from "formik";
import Axios from "axios";
import { Link } from 'react-router-dom';
import logo_pilulas from "../../Assets/imgs/logo_pilulas.png";
import Swal from 'sweetalert2'
import React, { Component }  from 'react';

function Login() {
  const handleLogin = (values) => {
    Axios.post("https://backend-pilulas-mentoria.herokuapp.com/login", {
      email: values.email,
      password: values.password,
    }).then((response) => {

      const page = response.data;

      if (page === true) {
        localStorage.setItem('@user',(response.config.data));
        window.location.reload();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `${response.data.msg}!`,
        })
        // alert(response.data.msg);
      }

    });
  };


  const validationsLogin = yup.object().shape({
    email: yup
      .string()
      .email("email inválido")
      .required("O email é obrigatório"),
    password: yup
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .required("A senha é obrigatória"),
  });


  return (
    <div className="body">
     

      <div className="right-login">
        <div className="card-login">
        <img src={logo_pilulas} alt="" className="logo_pilulas_login" />
          {/* <h1>LOGIN</h1> */}
          <Formik
            initialValues={{}}
            onSubmit={handleLogin}
            validationSchema={validationsLogin}
          >
            <Form className="login-form">
              <div className="form-group">
                <label form="email">Usuário</label>

                <Field name="email" type='email' className="form-field" placeholder="Email" />

                <ErrorMessage
                  component="span"
                  name="email"
                  className="form-error"
                />
              </div>

              {/*Outro campo*/}

              <div className="form-group">
                <label form="email">Senha</label>
                <Field name="password" type='password' className="form-field" placeholder="Senha" />

                <ErrorMessage
                  component="span"
                  name="password"
                  className="form-error"
                />
              </div>

              <button className="button" type="submit">
                ENTRAR
              </button>
              {/* <p class="termos">
                  Ainda não faz parte do Pílulas de Mentoria? 
                  <Link to={'/cadastro'} className="link_termos">
                  &nbsp;Clique aqui para se cadastrar!&nbsp;
                    </Link>
                    
                  </p> */}
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default Login;