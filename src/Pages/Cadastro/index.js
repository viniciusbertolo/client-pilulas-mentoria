// import React, { Component } from "react";
// import FormularioCadastro from "./FormularioCadastro.js";
// import { Container, Typography } from "@material-ui/core";
// import Axios, * as others from 'axios';
// import "./index.css"
// import Swal from 'sweetalert2'
// import logo_pilulas from "../../Assets/imgs/logo_pilulas.png";






// class Cadastro extends Component {
//   render() {
//     return (
//       <Container className="container" component="article" maxWidth="md">
        
        
//           <FormularioCadastro aoEnviar={aoEnviarForm} />
//       </Container>
//     );
//   }
// }


//   const aoEnviarForm = (dados) => {
//     console.log(dados.email);
//     Axios.post("https://backend-pilulas-mentoria.herokuapp.com/register", {
//       email: dados.email,
//       password: dados.senha,
//       empresa: dados.empresa,
//       profissao: dados.profissao,
//       nome: dados.nomeCompleto,
//       phone: dados.phone,
//       cep: dados.cep,
//       logradouro: dados.logradouro,
//       numero: dados.numero,
//       bairro: dados.bairro,
//       cidade: dados.cidade,
//       estado: dados.uf,
//       data_nascimento: dados.dataNasc,
//     }).then((response) => {
//       // alert(response.data.msg);
//       Swal.fire({
//         icon: 'success',
//         title: 'Bem Vindo(a)!',
//         text: `${response.data.msg}!`,
//       })
//       console.log(response);
//       setTimeout(() => {
        
//         window.location.reload();
//       }, 2000);
     
//     });
//   };


// export default Cadastro;





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
      <Container
        className="container"
        component="article"
        maxWidth="md"
      >
        <FormularioCadastro aoEnviar={aoEnviarForm} />
      </Container>
    );
  }
}


// ==========================================================
// FUNÇÃO DE CADASTRO
// ==========================================================

const aoEnviarForm = async (dados) => {
  try {

    console.log("Dados recebidos:", dados);


    // ========================================================
    // 1. CADASTRAR USUÁRIO
    // ========================================================

    const response = await Axios.post(
      "https://backend-pilulas-mentoria.herokuapp.com/register",
      {
        email: dados.email,
        password: dados.senha,
        empresa: dados.empresa,
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
      }
    );


    console.log("Resposta do cadastro:", response.data);


    // ========================================================
    // 2. VERIFICA SE O CADASTRO FOI REALIZADO
    // ========================================================

    // Se o backend retornar algum erro com status HTTP,
    // o Axios já cairá no catch.
    //
    // Portanto, chegando aqui, podemos continuar.


    // ========================================================
    // 3. LOGIN AUTOMÁTICO
    // ========================================================

    const loginResponse = await Axios.post(
      "https://backend-pilulas-mentoria.herokuapp.com/login",
      {
        email: dados.email,
        password: dados.senha,
      }
    );


    console.log(
      "Resposta do login automático:",
      loginResponse.data
    );


    // ========================================================
    // 4. VERIFICA SE O LOGIN FOI REALIZADO
    // ========================================================

    if (loginResponse.data === true) {


      // ======================================================
      // 5. SALVA O USUÁRIO NO LOCALSTORAGE
      // ======================================================

      const usuario = {
        email: dados.email,
        nome: dados.nomeCompleto,
      };


      localStorage.setItem(
        "@user",
        JSON.stringify(usuario)
      );


      console.log(
        "Usuário salvo no localStorage:",
        usuario
      );


      // ======================================================
      // 6. BUSCA OS CURSOS DO USUÁRIO
      // ======================================================

      const cursosResponse = await Axios.get(
        `https://backend-pilulas-mentoria.herokuapp.com/usuario-curso/${dados.email}`
      );


      const cursosDoUsuario = cursosResponse.data;


      console.log(
        "Cursos encontrados:",
        cursosDoUsuario
      );


      // ======================================================
      // 7. MENSAGEM DE BOAS-VINDAS
      // ======================================================

      await Swal.fire({
        icon: "success",
        title: "Bem Vindo(a)!",
        text: `${response.data.msg}!`,
        timer: 1500,
        showConfirmButton: false,
      });


      // ======================================================
      // 8. REDIRECIONAMENTO
      // ======================================================

      if (
        Array.isArray(cursosDoUsuario) &&
        cursosDoUsuario.length > 0
      ) {

        // ================================================
        // USUÁRIO POSSUI CURSO
        // ================================================

        window.location.href = "/meus-cursos";

      } else {

        // ================================================
        // USUÁRIO NÃO POSSUI CURSO
        // ================================================

        window.location.href = "/todos-cursos";
      }


    } else {


      // ======================================================
      // 9. CADASTRO OK, MAS LOGIN AUTOMÁTICO FALHOU
      // ======================================================

      Swal.fire({
        icon: "error",
        title: "Erro no login",
        text:
          loginResponse.data?.msg ||
          "O cadastro foi realizado, mas não foi possível fazer o login automático.",
      });
    }


  } catch (error) {


    // ========================================================
    // 10. TRATAMENTO DE ERROS
    // ========================================================

    console.error(
      "Erro no cadastro/login:",
      error
    );


    Swal.fire({
      icon: "error",
      title: "Oops...",
      text:
        error.response?.data?.msg ||
        "Ocorreu um erro ao realizar o cadastro.",
    });
  }
};


// ==========================================================
// EXPORT
// ==========================================================

export default Cadastro;
