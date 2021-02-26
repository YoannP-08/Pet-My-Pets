import React, { useState } from "react";
import ReactDOM from "react-dom";
import styleModal from "../styles/Modal.module.css"
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import { register } from '../actions/authActions';
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import paw from "./../assets/pawblack.svg";

const ModalSignUp = (props) => {


    let history = useHistory();

    const [lastname, setLastname] = useState('');
    const [firstname, setFirstname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [city, setCity] = useState('');

    const { register, handleSubmit, errors } = useForm({ mode: 'onBlur', reValidateMode: 'onBlur' });

    const onChangeLastname = (e) => {
        setLastname(e.target.value);
    }

    const onChangeFirstname = (e) => {
        setFirstname(e.target.value);
    }

    const onChangeUsername = (e) => {
        setUsername(e.target.value);
    }

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const onChangePassword = (e) => {
        setPassword(e.target.value);
    }

    const onChangeAddress = (e) => {
        setAddress(e.target.value);
    }

    const onChangeZipCode = (e) => {
        setZipCode(e.target.value);
    }

    const onChangeCity = (e) => {
        setCity(e.target.value);
    }

    const onSubmit = (e) => {
        const newUser = {
            lastname: lastname,
            firstname: firstname,
            username: username,
            email: email,
            password: password,
            address: address,
            zipCode: zipCode,
            city: city,
            isAdmin: false
        }
        props.register(newUser);
        setLastname('')
        setFirstname('')
        setUsername('')
        setEmail('')
        setPassword('')
        setAddress('')
        setZipCode('')
        setCity('')
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
                                    <h3>SignUp</h3>
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
                                    <label>Firstname</label>
                                    <input
                                        name="firstname"
                                        type="text"
                                        className={styleModal.inputModal}
                                        value={firstname}
                                        onChange={onChangeFirstname}
                                        ref={register({ required: true })}
                                    />
                                    {errors.firstname && errors.firstname.type === "required" && <p className={styleModal.alert}>This field is required</p>}
                                </div>
                                <div className={styleModal.modalFormGroup}>
                                    <label>Lastname</label>
                                    <input
                                        name="lastname"
                                        type="text"
                                        className={styleModal.inputModal}
                                        value={lastname}
                                        onChange={onChangeLastname}
                                        ref={register({ required: true })}
                                    />
                                    {errors.lastname && errors.lastname.type === "required" && <p className={styleModal.alert}>This field is required</p>}
                                </div>
                                <div className={styleModal.modalFormGroup}>
                                    <label>Username</label>
                                    <input
                                        name="username"
                                        type="text"
                                        className={styleModal.inputModal}
                                        value={username}
                                        onChange={onChangeUsername}
                                        ref={register({ required: true, maxLength: 50 })}
                                    />
                                    {errors.username && errors.username.type === "required" && <p className={styleModal.alert}>This field is required</p>}
                                    {errors.username && errors.username.type === "maxLength" && <p className={styleModal.alert}>Your input exceed the max length (50)</p>}
                                </div>
                                <div className={styleModal.modalFormGroup}>
                                    <label>Email</label>
                                    <input
                                        name="email"
                                        type="email"
                                        className={styleModal.inputModal}
                                        value={email}
                                        onChange={onChangeEmail}
                                        ref={register({ required: true, minLength: 4 })}
                                    />
                                    {errors.email && errors.email.type === "required" && <p className={styleModal.alert}>This field is required</p>}
                                    {errors.email && errors.email.type === "minLength" && <p className={styleModal.alert}>Your email needs to be at least 4 caracters</p>}
                                </div>
                                <div className={styleModal.modalFormGroup}>
                                    <label>Address</label>
                                    <input
                                        name="address"
                                        type="text"
                                        className={styleModal.inputModal}
                                        value={address}
                                        onChange={onChangeAddress}
                                        ref={register({ required: true })}
                                    />
                                    {errors.address && errors.address.type === "required" && <p className={styleModal.alert}>This field is required</p>}
                                </div>
                                <div className={styleModal.modalFormGroup}>
                                    <label>ZipCode</label>
                                    <input
                                        name="zipcode"
                                        type="number"
                                        className={styleModal.inputModal}
                                        value={zipCode}
                                        onChange={onChangeZipCode}
                                        ref={register({ required: true, maxLength: 10 })}
                                    />
                                    {errors.zipcode && errors.zipcode.type === "required" && <p className={styleModal.alert}>This field is required</p>}
                                    {errors.zipcode && errors.zipcode.type === "maxLength" && <p className={styleModal.alert}>Your input exceed the max length (10)</p>}
                                </div>
                                <div className={styleModal.modalFormGroup}>
                                    <label>City</label>
                                    <input
                                        name="city"
                                        type="text"
                                        className={styleModal.inputModal}
                                        value={city}
                                        onChange={onChangeCity}
                                        ref={register({ required: true, minLength: 4 })}
                                    />
                                    {errors.city && errors.city.type === "required" && <p className={styleModal.alert}>This field is required</p>}
                                    {errors.city && errors.city.type === "minLength" && <p className={styleModal.alert}>Your city needs to be at least 4 caracters</p>}
                                </div>
                                <div className={styleModal.modalFormGroup}>
                                    <label>Password</label>
                                    <input
                                        name="password"
                                        type="password"
                                        className={styleModal.inputModal}
                                        value={password}
                                        onChange={onChangePassword}
                                        ref={register({ required: true, minLength: 4 })}
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
                                        ref={register({ validate: value => value === password || "The passwords do not match" })}
                                    />
                                    {errors.confirmPassword && <p className={styleModal.alert}>{errors.confirmPassword.message}</p>}
                                </div>
                                <div className={styleModal.modalFormGroupSave}>
                                    <button type="submit" className={styleModal.modalButton}>
                                        Register
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </>,
            document.body
        ) : (
                null)
    )
}

const mapStateToProps = state => ({
    error: state.error
});

const mapDispatch = (dispatch) => bindActionCreators({
    register
}, dispatch)

export default connect(mapStateToProps, mapDispatch)(
    ModalSignUp
);