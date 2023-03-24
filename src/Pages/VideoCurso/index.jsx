import { Link } from '@mui/material';
import React, { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import { Navigate, redirect, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../Components/Navbar';
import './index.css'

export default function VideoCurso() {

    const { id } = useParams();
    const { idCurso } = useParams();
    const user = JSON.parse(localStorage.getItem("@user"));
  console.log(id);
  console.log("ID DO CURSO:" + idCurso);
  console.log("USUARIO:" + user.email);

  const navigate = useNavigate();

  const [video, setVideo] = useState([])
  useEffect(() => {
    async function obterVideo(){
    const resposta = await fetch(`https://backend-pilulas-mentoria.herokuapp.com/videos/${idCurso}/${id}`,
        {
            method: 'GET',
            headers: { 'Content-type': 'application/json' }
        });
    const respostaJson = await resposta.json();
    setVideo(respostaJson[0])
    window.scrollTo(0,0);
    }
    obterVideo()
  }
  ,[])


  console.log(video) 

    const handleClick = () => {
        navigate(`/pergunta/${idCurso}/${id}`);
    }
  return (
    <div className='pag_todo'>
        <Navbar/>

            
        <div className="boas_vindas_cursos videos_texto">
          <h1>Pílula {id}</h1>
          <p>Assista o vídeo completo e responda a questão a seguir. Aguarde, você será redirecionado!</p>
        </div>
        <div className="video_curso">

        <ReactPlayer className="video_player" url={video.URL_VIDEO} controls onEnded={handleClick}  
          width='100%'
          />
          </div>
          <div className="material_apoio">
            <a href={video.materialExtra} target="_blank">
              Material complementar
            </a>            
          </div>
          
    </div>
  )
}
