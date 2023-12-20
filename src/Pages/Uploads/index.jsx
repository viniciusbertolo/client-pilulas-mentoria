import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { ErrorMessage, Formik, Form, Field } from "formik";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

function Uploads() {
  return (
    <div className="fundo-cadastro-cursos">
      <div className="body">
        <Link to={"/upload-curso"}>
          <button className="button" type="submit">
            CADASTRAR CURSO
          </button>
        </Link>
        <Link to={"/upload-aula"}>
          <button className="button" type="submit">
            CADASTRAR FASE
          </button>
        </Link>
        <Link to={"/upload-resposta"}>
          <button className="button" type="submit">
            CADASTRAR RESPOSTA
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Uploads;
