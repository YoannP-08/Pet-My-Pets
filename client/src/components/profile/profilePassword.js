import React, { useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import stylePassword from '../../styles/profile/Password.module.css';
import paw from '../../assets/paw.png';

const bcrypt = require('bcryptjs');

const ProfilePassword = ({ user }) => {
    const[crtPassword, setCrtPassword] = useState('');
    const[newPassword, setNewPassword] = useState('');
    const[newPasswordConfirmation, setNewPasswordConfirmation] = useState('');

    const { register, handleSubmit, errors } = useForm({ mode: 'onBlur', reValidateMode: 'onBlur' });

    const openSweetAlertOk = () => {
        Swal.fire({
            title: 'Success',
            text: 'Password Successfully Changed',
            icon: "success",
            confirmButtonText: "Ok",
        }).then((result) => {
            if (result.isConfirmed) {
                // document.location.reload();
                
            }
        })
    }

    const openSweetAlertError = () => {
        Swal.fire({
            title: 'Error',
            text: 'Current Password do not match',
            icon: "error",
            confirmButtonText: "Ok",
        }).then((result) => {
            if (result.isConfirmed) {
                // document.location.reload();
                
            }
        })
    }
    
    const onChangeCrtPassword = (e) => {
        setCrtPassword(e.target.value);
    };

    const onChangeNewPassword = (e) => {
        setNewPassword(e.target.value);
    };

    const onChangeNewPasswordConfirmation = (e) => {
        setNewPasswordConfirmation(e.target.value);
    };

    const submitNewPwd = async (e) => {
        if (newPassword === newPasswordConfirmation) {
            let salt = bcrypt.genSaltSync(10);
            let pwdHashed = bcrypt.hashSync(newPassword, salt);
            const pwdUpd = {
                current_password: crtPassword,
                new_password: pwdHashed
            };

            try{
                await axios({
                    method: 'patch',
                    url: `/users/${user.user.id}`,
                    headers: {
                        'x-auth-token': user.token
                    },
                    data: pwdUpd
                })
                .then(res => res)
                setCrtPassword('')
                setNewPassword('')
                setNewPasswordConfirmation('')
                openSweetAlertOk()
            }catch{
                setCrtPassword('')
                setNewPassword('')
                setNewPasswordConfirmation('')
                openSweetAlertError()
            }
        } else {
            console.log('error - passwords dont match.')
        };
    };

    return (
        <div>
            { user ? (
                <div className={stylePassword.containerPassword}>
                    <form onSubmit={handleSubmit(submitNewPwd)} className={stylePassword.form}>
                        <div className={stylePassword.formGroup}>
                            <label className={stylePassword.label}>Current Password</label>
                            <input
                                className={stylePassword.input}
                                name="password"
                                type="password"
                                value={crtPassword}
                                onChange={onChangeCrtPassword}
                            />
                        </div>

                        <div className={stylePassword.formGroup}>
                            <label className={stylePassword.label}>New Password</label>
                            <input
                                className={stylePassword.input}
                                name="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={onChangeNewPassword}
                                ref={register({minLength: 4, required: true})}
                            />
                            {errors.newPassword && errors.newPassword.type === "minLength" && <p className={stylePassword.alert}>Your password needs to be at least 4 caracters</p>}
                            {errors.newPassword && errors.newPassword.type === "required" && <p className={stylePassword.alert}>fields required</p>}
                        </div>

                        <div className={stylePassword.formGroup}>
                            <label className={stylePassword.label}>New Password Confirmation</label>
                            <input
                                className={stylePassword.input}
                                name="newPasswordConfirmation"
                                type="password"
                                value={newPasswordConfirmation}
                                onChange={onChangeNewPasswordConfirmation}
                                ref={register({validate: value => value === newPassword || "The passwords do not match"})}
                            />
                            {errors.newPasswordConfirmation && <p className={stylePassword.alert}>{errors.newPasswordConfirmation.message}</p>}
                        </div>

                        <div className={stylePassword.paw}>
                            <input className={stylePassword.pawIcon} type="image" src={paw} name="submit" alt="submit"/>
                            <p>Update your account</p>
                        </div>
                    </form>
                </div>
            ) : (
                null
            )}
        </div>
    );
};

const mapStateToProps = state => ({
    user: state.auth.userDetails
});

export default connect(mapStateToProps)(ProfilePassword);