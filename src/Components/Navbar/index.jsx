import React, { useEffect, useState } from "react";
import { Link, redirect } from "react-router-dom";
import IdleTimer from "../../IdleTimer";
import './index.css';
import LogoutIcon from '@mui/icons-material/Logout';
import logo from "../../Assets/imgs/logo_pilulas.png"
import Swal from 'sweetalert2'


export default function Navbar({ black }) {
  const [isTimeout, setIsTimeout] = useState(false);
  useEffect(() => {
    const timer = new IdleTimer({
      timeout: 3600, //expire after 10 seconds
      onTimeout: () => {
        localStorage.clear();
        window.location.reload();
        console.log("SAINDO");
        redirect("/login")

        setIsTimeout(true);
      },
      onExpired: () => {
        localStorage.clear();
        window.location.reload();
        console.log("SAINDO");
        redirect("/login")
        // do something if expired on load
        setIsTimeout(true);
      },
    });

    return () => {
      timer.cleanUp();
    };
  }, []);

  const logout = () => {

    Swal.fire({
      title: 'Você realmente quer sair?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, volto mais tarde!'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        window.location.reload();
        console.log("SAINDO");
      }
    })

  };

  return (
    // <div className="navbar">
    //   <LogoutIcon onClick={logout}></LogoutIcon>
    // </div>



    <header className={black ? 'black' : ''}>
      <div className="header--logo">
        <Link to="/">
          <img alt="Pilulas de Mentoria" src={logo}></img>
        </Link>
      </div>
      <div className="direita--header">

        <Link to="/cursos">
          <p>Meus cursos</p>
        </Link>
      <div className="header--user">
          <img src="https://i.pinimg.com/564x/b6/77/cd/b677cd1cde292f261166533d6fe75872.jpg" alt="Usuario" />
          <LogoutIcon className="logoutIcon" onClick={logout}></LogoutIcon>
      </div>
      </div>
    </header>
  )
}
