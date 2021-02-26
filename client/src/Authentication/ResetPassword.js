import React, { useState } from "react";
import styleModal from "../styles/Modal.module.css";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import axios from 'axios';
import Swal from 'sweetalert2';

const ResetPassword = (props) => {

    const [email, setEmail] = useState('');   
    const { register, handleSubmit, errors } = useForm({ mode: 'onBlur', reValidateMode: 'onBlur' });
    
    let history = useHistory();

    const onChangeEmail = (e) => {
        setEmail(e.target.value)
    }

    const openSweetAlertOk = (message) => {
        Swal.fire({
            title: 'Success',
            text: message,
            icon: "success",
            confirmButtonText: "Ok",
        }).then((result) => {
            if (result.isConfirmed) {
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
        const userEmail = {
            email: email
        }
        //Attempt to login
        resetpassword(userEmail);
        setEmail("")
        // setTimeout(props.hide, 1000)
        // history.push('/');
    }

    const resetpassword = (email) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    
        // Request body
        const body = JSON.stringify(email);
    
        axios.post('/users/reset-password', body, config)
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
                                <h3>Reset Password</h3>
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
                                    <label>Email</label>
                                    <input
                                        name="email"
                                        type="email"
                                        className={styleModal.inputModal}
                                        placeholder="Please enter your email"
                                        value={email}
                                        onChange={onChangeEmail}
                                        ref={register({required: true})}
                                    />
                                    {errors.email && errors.email.type === "required" && <span className={styleModal.alert}>This field is required</span>}
                                </div>
                                <div className={styleModal.modalFormGroup}>
                                    <button type="submit" className={styleModal.modalButton}>
                                        Reset my Password
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

export default ResetPassword