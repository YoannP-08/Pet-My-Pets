import React, { useState } from "react";
import ReactDOM from "react-dom";
import { login } from "../actions/authActions";
import styleModal from "../styles/Modal.module.css";
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import paw from "./../assets/pawblack.svg";


const ModalSignIn = (props) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register, handleSubmit, errors } = useForm({ mode: 'onBlur', reValidateMode: 'onBlur' });

    let history = useHistory();

    const onChangeEmail = (e) => {
        setEmail(e.target.value)
    }
    const onChangePassword = (e) => {
        setPassword(e.target.value)
    }
    const onSubmit = (e) => {
        const userConnected = {
            email: email,
            password: password,
        }
        //Attempt to login
        props.login(userConnected);
        setEmail("")
        setPassword("")
        setTimeout(props.hide, 1000)
        history.push('/');
    }

    return (
        props.isShowing ? ReactDOM.createPortal(
            <>
                <div className={styleModal.modalOverlay}>
                    <div className={styleModal.modalWrapper}>
                        <div className={styleModal.modal}>
                            <div className={styleModal.modalHeader}>
                                <div className={styleModal.subModalHeader}>
                                    <img className={styleModal.paw} src={paw} alt="paw" />
                                    <h3>SignIn</h3>
                                </div>
                                <button
                                    type="button"
                                    className={styleModal.modalCloseButton}
                                    onClick={props.hide}
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
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={onChangeEmail}
                                        ref={register({ required: true })}
                                    />
                                    {errors.email && errors.email.type === "required" && <span className={styleModal.alert}>This field is required</span>}
                                </div>
                                <div className={styleModal.modalFormGroup}>
                                    <label>Password</label>
                                    <input
                                        name="password"
                                        type="password"
                                        className={styleModal.inputModal}
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={onChangePassword}
                                        ref={register({ required: true })}
                                    />
                                    {errors.password && <span className={styleModal.alert}>This field is required</span>}
                                </div>
                                <div className={styleModal.modalFormGroupSave}>
                                    <button type="submit" className={styleModal.modalButton}>
                                        Sign in
                                    </button>
                                </div>
                                <Link onClick={props.hide} className={styleModal.changePassword} to="/resetpassword">
                                    Forgot your password ?
                                </Link>
                            </form>
                        </div>
                    </div>
                </div>
            </>,
            document.body
        ) : (
                null
            )
    )
}


const mapStateToProp = state => ({
    error: state.error,
})

const mapDispatch = (dispatch) => bindActionCreators({
    login
}, dispatch)

export default connect(mapStateToProp, mapDispatch)(ModalSignIn)