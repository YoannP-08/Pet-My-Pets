import React, { useState } from "react";
import styleModal from "../styles/Modal.module.css";
import { useForm } from "react-hook-form";
import { useParams, useHistory } from "react-router-dom";
import axios from 'axios';
import Swal from 'sweetalert2';

const ResetPasswordHash = (props) => {

    const bcrypt = require('bcryptjs');
    const [password, setPassword] = useState('');  
   
    const { register, handleSubmit, errors } = useForm({ mode: 'onBlur', reValidateMode: 'onBlur' });
    let { id } = useParams();
    let history = useHistory();

    const onChangePassword = (e) => {
        setPassword(e.target.value)
    }

    const openSweetAlertOk = (message) => {
        Swal.fire({
            title: 'Success',
            text: message,
            icon: "success",
            confirmButtonText: "Ok",
        }).then((result) => {
            if (result.isConfirmed) {
                // document.location.reload();
                history.push('/')
            }
        })
    }
    
    const openSweetAlertError = (message) => {
        Swal.fire({
            title: 'Error',
            text: message,
            icon: "error",
        })
    }
    
    const onSubmit = (e) => {
        // e.preventDefault();
        const userPassword = {
            hash: id,
            password: password
        }
        //Attempt to login
        resetpassword(userPassword);
        setPassword("")
        // setTimeout(props.hide, 1000)
        // history.push('/');
    }

    const resetpassword = async (userPassword) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        let salt = bcrypt.genSaltSync(10);
        let pwdHashed = bcrypt.hashSync(userPassword.password, salt);
        const newPassword = {
            hash: userPassword.hash,
            password: pwdHashed
        }
        // Request body
        const body = JSON.stringify(newPassword);
    
        await axios.patch('/users/reset-password/confirmation', body, config)
            .then(res => openSweetAlertOk(res.data.message))
            .catch(err => {
                openSweetAlertError(err.response.data.Error)
            })
    }

    return (
            <>
                <div className={styleModal.modalOverlay}>
                    <div className={styleModal.modalWrapper}>
                        <div className={styleModal.modal}>
                            <div className={styleModal.modalHeader}>
                                <h3>Reset Your Password</h3>
                                <button
                                    type="button"
                                    className={styleModal.modalCloseButton}
                                    onClick={() => history.push('/')}
                                >
                                    <span>&times;</span>
                                </button>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)}>
                            <div className={styleModal.modalFormGroup}>
                                    <label>Password</label>
                                    <input
                                        name="password"
                                        type="password"
                                        className={styleModal.inputModal}
                                        placeholder="Enter your new password"
                                        value={password}
                                        onChange={onChangePassword}
                                        ref={register({required: true, minLength: 4})}
                                    />
                                    {errors.password && errors.password.type === "required" && <p className={styleModal.alert}>This field is required</p>}
                                    {errors.password && errors.password.type === "minLength" && <p className={styleModal.alert}>Your password needs to be at least 4 caracters</p>}
                                </div>
                                <div className={styleModal.modalFormGroup}>
                                    <label>Confirm Password</label>
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        className={styleModal.inputModal}
                                        placeholder="Confirm your new password"
                                        ref={register({validate: value => value === password || "The passwords do not match"})}
                                    />
                                    {errors.confirmPassword && <p className={styleModal.alert}>{errors.confirmPassword.message}</p>}
                                </div>
                                <div className={styleModal.modalFormGroup}>
                                    <button type="submit" className={styleModal.modalButton}>
                                        Change Your Password
                                    </button>
                                </div>
                                {/* <p className="forgot-password text-right">
                                    Create an account ? <a href="/signup">Sign up</a>
                                </p> */}
                            </form>
                        </div>
                    </div>
                </div>
            </>
    )
}

export default ResetPasswordHash