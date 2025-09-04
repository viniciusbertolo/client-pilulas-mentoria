import "./index.css"
import * as yup from "yup";
import { ErrorMessage, Formik, Form, Field } from "formik";
import Axios from "axios";
import { Link } from 'react-router-dom';
import logo_pilulas from "../../Assets/imgs/logo_pilulas.png";
import Swal from 'sweetalert2'
import React, { Component, useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';

function Login() {
  const handleLogin = (values) => {
    Axios.post("https://backend-pilulas-mentoria.herokuapp.com/login", {
      email: values.email,
      password: values.password,
    }).then((response) => {

      const page = response.data;

      if (page === true) {
        // localStorage.setItem('@user', (response.config.data));
        // window.location.reload();

        localStorage.setItem('@user', response.config.data);
        const redirect = localStorage.getItem("redirectAfterLogin");
        if (redirect) {
          localStorage.removeItem("redirectAfterLogin"); // limpa pra não ficar preso
          window.location.href = redirect;
        } else {
          window.location.reload();
        }
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

  const [passwordShown, setPasswordShown] = useState(false);

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };


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

              <label form="email">Senha</label>
              <div className="form-group-2">
                <Field type={passwordShown ? "text" : "password"} name="password" className="form-field" placeholder="Senha" />
                <VisibilityIcon className="icon_eye" onClick={togglePassword}>Show Password</VisibilityIcon>


                {/* <ErrorMessage
                  component="span"
                  name="password"
                  className="form-error"
                /> */}
              </div>

              <br></br>
              <Link to="/nova-senha" className="voltar_para_home">Esqueci a minha senha</Link>
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
          <br></br>
          <Link to="/seja-um-membro" className="voltar_para_home">Sou novo por aqui</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;