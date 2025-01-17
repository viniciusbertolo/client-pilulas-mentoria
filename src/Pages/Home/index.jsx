import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import "./index.css";
import fotoCapa from "../../Assets/imgs/evento1.webp"

export default function Home(props) {
  return (
    <div className="pag_todo_featured">
      <Navbar />

      <section
        className="featured"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundImage: `url(${fotoCapa})`,
        }}
      >
        <div className="featured--vertical">
          <div className="featured--horizontal">
            <div className="featured--name">
              Bem-vindo ao Pilulas de Mentoria
            </div>

            <div className="featured--description">
              Aqui você conhecerá sua maior jornada para a evolução e o
              conhecimento, em trilhas de aprendizado com aulas rápidas e
              diferenciadas, muitas vezes, provocativas e impactantes, que
              apresentam quizzes, jogos, testes, muitos materiais de apoio e em
              todas, você terá exemplos de como usar na prática, lhe
              proporcionando maior retenção do que está sendo estudado. Agora é
              só escolher sua trilha e começar essa jornada de puro sucesso!
            </div>
            <br></br>
            <div className="featured--buttons">
              <Link to="/todos-cursos" className="featured--watchbutton">
                Cursos
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* <div className="detalhe_imagem_home"></div>
      <div className="texto_home_div">
        <Link to="/cursos" className="link_to_cursos">
          Ir para os cursos
        </Link>

        <h1 className="texto_home_titulo">Bem vindo ao Pílulas de Mentoria!</h1>
        <h2 className="texto_home">
          Você está entrando em uma das mais dinâmicas e inovadoras plataforma
          de cursos gamificados do Brasil!
          <br></br>
          <br></br>
          Aqui você conhecerá sua maior jornada para a evolução e o
          conhecimento, em trilhas de aprendizado com aulas rápidas e
          diferenciadas, muitas vezes, provocativas e impactantes, que
          apresentam quizzes, jogos, testes, muitos materiais de apoio e em
          todas, você terá exemplos de como usar na prática, lhe proporcionando
          maior retenção do que está sendo estudado.
          <br></br>
          <br></br>
          Agora é só escolher sua trilha e começar essa jornada de puro sucesso!
        </h2>
        <h1 className="texto_home_titulo">
          <Link to="/cursos" className="link_to_cursos_principal">
            Clique aqui e bora começar...
          </Link>
        </h1>
      </div> */}
    </div>
  );
}
