import "./index.css";
import { Link } from "react-router-dom";
import React, { Component }  from 'react';

export default function Error() {
  return (
    
    <div class="container-error">

<div class="four-oh-four"> 
 			<center><h1>Page Not Found</h1></center> 
 			<center><h2>A página que você está tentando acessar não existe</h2></center> 
   
        <img src="http://2.bp.blogspot.com/-KYJVXsR7sUs/T5pvil01j-I/AAAAAAAAAmA/Xa55lJmlpAw/s1600/%D7%91%D7%9C%D7%A93.gif" />
            <Link className="back_home" to={`/cursos`}>
              Voltar pra home
            </Link>            
    
</div>
</div>
    

  );
}
