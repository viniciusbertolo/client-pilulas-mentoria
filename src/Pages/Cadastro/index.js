import React, { Component } from "react";
import FormularioCadastro from "./FormularioCadastro.js";
import { Container, Typography } from "@material-ui/core";
import Axios, * as others from 'axios';
import "./index.css"
import Swal from 'sweetalert2'
import logo_pilulas from "../../Assets/imgs/logo_pilulas.png";






class Cadastro extends Component {
  render() {
    return (
      <Container className="container" component="article" maxWidth="md">
        
        
          <FormularioCadastro aoEnviar={aoEnviarForm} />
      </Container>
    );
  }
}


  const aoEnviarForm = (dados) => {
    console.log(dados.email);
    Axios.post("https://backend-pilulas-mentoria.herokuapp.com/register", {
      email: dados.email,
      password: dados.senha,
      profissao: dados.profissao,
      nome: dados.nomeCompleto,
      phone: dados.phone,
      cep: dados.cep,
      logradouro: dados.logradouro,
      numero: dados.numero,
      bairro: dados.bairro,
      cidade: dados.cidade,
      estado: dados.uf,
      data_nascimento: dados.dataNasc,
    }).then((response) => {
      // alert(response.data.msg);
      Swal.fire({
        icon: 'success',
        title: 'Bem Vindo(a)!',
        text: `${response.data.msg}!`,
      })
      console.log(response);
      setTimeout(() => {
        
        window.location.reload();
      }, 2000);
     
    });
  };


export default Cadastro;