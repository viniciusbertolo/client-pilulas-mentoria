import { Formik, Field, Form } from "formik";
import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import "./index.css";
import Swal from 'sweetalert2'

export default function Pergunta() {

  const { id } = useParams();
  const { idCurso } = useParams();
  const user = JSON.parse(localStorage.getItem("@user"));

  console.log(id);
  console.log("ID DO CURSO:" + idCurso);
  console.log("USUARIO:" + user.email);
  console.log("FASE:" +id);
  const proximaEtapa = parseInt(id) + 1
  console.log("FASE NOVA:" +proximaEtapa);



  const [pergunta, setPergunta] = useState([])
  const [alternativas, setAlternativas] = useState([])
  async function obterPergunta(){
    const resposta = await fetch(`https://backend-pilulas-mentoria.herokuapp.com/perguntas/${idCurso}/${id}`,
        {
            method: 'GET',
            headers: { 'Content-type': 'application/json' }
        });
    const respostaJson = await resposta.json();
    setAlternativas(respostaJson[0])
  }
  
    async function obterQuestão(){
    const resposta = await fetch(`https://backend-pilulas-mentoria.herokuapp.com/questao/${idCurso}/${id}`,
        {
            method: 'GET',
            headers: { 'Content-type': 'application/json' }
        });
    const respostaJson = await resposta.json();
    setPergunta(respostaJson[0])
  }

 

  useEffect(() => {
    
  obterPergunta()
  obterQuestão()

 
  },[])



 

  
  const alternativasArray = [
    alternativas.alternativa1,
    alternativas.alternativa2,
    alternativas.alternativa3,
    alternativas.alternativa4,
  ]


  function randOrd() {
    return (Math.round(Math.random())-0.5);
}

  const alternativasSorteadas = alternativasArray.sort(randOrd);
  console.log(alternativasSorteadas);




  console.log(pergunta);
  console.log(alternativas);

 
  const navigate = useNavigate();
  function teste(valor){
    if(valor === alternativas.correta){
      function updateEtapa() {
        const resposta = fetch(
          `https://backend-pilulas-mentoria.herokuapp.com/pergunta-acertada/${user.email}/${idCurso}/${proximaEtapa}/${id}`,
          {
            method: "PUT",
            headers: { "Content-type": "application/json" },
          }
        );
        console.log("FUNÇÂO UPDATE ETAPA");
      }
      Swal.fire({
        title: 'Você tem certeza?',
        text: `Tem certeza que ${valor} responde a pergunta ${pergunta.pergunta}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Tenho certeza!'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Parabéns!',
            'Você acertou!',
            'success'
          )
          setTimeout(() => {
            
            navigate(`/cursos/${idCurso}`);
          }, 1500);
      updateEtapa()

        }
      })
      // alert("VOCE ACERTOU A PERGUNTA")

     
      
      
    }else{


      Swal.fire({
        title: 'Você tem certeza?',
        text: `Tem certeza que ${valor} responde a pergunta ${pergunta.pergunta}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Tenho certeza!'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Vishhh!',
            'Você errou! Tente novamente!',
            'error'
          )
          setTimeout(() => {
            
            navigate(`/videoCurso/${idCurso}/${id}`);
          }, 1500);
        }
      })
      // alert("VOCE ERROU A PERGUNTA")
      
    }
  }


 



  return (
    <div className="pag_todo">
      <Navbar/>
      <div>
        <h1 className="tituloPergunta">{pergunta.pergunta}</h1>
        
            <div role="group" aria-labelledby="my-radio-group">
            {alternativasSorteadas.map((value, key)=>(
                <label class="rad-label" key={key} onClick={()=>teste(value)}>
                <input type="radio" class="rad-input" name="rad"></input>
                <div class="rad-design"></div>
                <div class="rad-text">{value}</div>
                </label>

            ))}
            </div>
            
               

            
        
      </div>
      </div>
  );
  
}
