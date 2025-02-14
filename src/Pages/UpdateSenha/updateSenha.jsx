import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import Axios from "axios";
import Swal from "sweetalert2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "./updateSenha.css";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { Link, useNavigate } from "react-router-dom";

export default function UpdateSenha() {
    const [passwordShown, setPasswordShown] = useState(false);

    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

   

    const handleUpdate = async (values) => {
        try {
            const response = await Axios.put(
                `https://backend-pilulas-mentoria.herokuapp.com/update-senha/${values.email}/${values.password}`
            );

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Sucesso!",
                    text: "Senha atualizada com sucesso!",
                });
                window.location.href = "/"
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Erro",
                    text: "Erro ao atualizar a senha.",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Erro na requisição.",
            });
        }
    };

    const validationsUpdateSenha = yup.object().shape({
        email: yup.string().email("E-mail inválido").required("O e-mail é obrigatório"),
        password: yup.string().min(8, "A senha deve ter pelo menos 8 caracteres").required("A senha é obrigatória"),
    });

    return (
        <div className="body">
            <div className="right-login">
                <div className="card-login">
                    <Link to="/" className="voltar_para_home"><NavigateBeforeIcon />Voltar</Link>
                    <br></br>
                    <br></br>
                    <h2>Atualizar Senha</h2>
                    <Formik
                        initialValues={{ email: "", password: "" }}
                        onSubmit={handleUpdate}
                        validationSchema={validationsUpdateSenha}
                    >
                        <Form className="login-form">
                            <div className="form-group">
                                <label htmlFor="email">E-mail</label>
                                <Field name="email" type="email" className="form-field" placeholder="Email" />
                                <ErrorMessage component="span" name="email" className="form-error" />
                            </div>

                            <label htmlFor="password">Nova Senha</label>
                            <div className="form-group-2">
                                <Field type={passwordShown ? "text" : "password"} name="password" className="form-field" placeholder="Senha" />
                                <VisibilityIcon className="icon_eye" onClick={togglePassword} />
                                <ErrorMessage component="span" name="password" className="form-error" />
                            </div>

                            <button className="button" type="submit">
                                ATUALIZAR
                            </button>
                        </Form>
                    </Formik>
                </div>
            </div>
        </div>
    );
}
