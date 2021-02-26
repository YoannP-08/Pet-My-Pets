import React, { useState } from 'react';
import { connect } from 'react-redux';
import DeleteProfile from './profileDelete';
import { userUpdateAccount } from '../../actions/authActions';
import { useForm } from 'react-hook-form';
import styleAccount from '../../styles/profile/Account.module.css';
import paw from '../../assets/paw.png';

//to replace when css file will exist
import styleModal from "../../styles/Modal.module.css"

const Profile = ({ user, userUpdateAccount }) => {
    const [firstname, setFirstname] = useState(user.user.firstname);
    const [lastname, setlastname] = useState(user.user.lastname);
    const username = user.user.username;
    const [email, setEmail] = useState(user.user.email);
    const [address, setAddress] = useState(user.user.address);
    const [city, setCity] = useState(user.user.city);
    const [zipcode, setZipcode] = useState(user.user.zipCode);

    const { register, handleSubmit, errors } = useForm({ mode: 'onBlur', reValidateMode: 'onBlur' });

    const onChangeFirstname = (e) => {
        setFirstname(e.target.value);
    };

    const onChangeLastname = (e) => {
        setlastname(e.target.value);
    };

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    };

    const onChangeAddress = (e) => {
        setAddress(e.target.value);
    };

    const onChangeCity = (e) => {
        setCity(e.target.value);
    };

    const onChangeZipCode = (e) => {
        setZipcode(e.target.value);
    };

    const submitBasicInfo = async (e) => {
        const userUpd = {
            firstname: firstname,
            lastname: lastname,
            email: email,
            address: address,
            city: city,
            zipCode: zipcode,
            token: user.token,
            userId: user.user.id
        };
        userUpdateAccount(userUpd);
    };

    return (
        <div>
            { user ? (
                <div className={styleAccount.containerAccount}>
                    <form onSubmit={handleSubmit(submitBasicInfo)} className={styleAccount.form}>
                        <div className={styleAccount.formGroup}>
                            <label className={styleAccount.formLabel}>First Name</label>
                            <input
                                className={styleAccount.inputField}
                                name="fname"
                                placeholder="John"
                                type="text"
                                value={firstname}
                                onChange={onChangeFirstname}
                                ref={register({required: true})}
                            />
                            {errors.fname && errors.fname.type === "required" && <p className={styleModal.alert}>This field is required</p>}
                        </div>

                        <div className={styleAccount.formGroup}>
                            <label className={styleAccount.formLabel}>Last Name</label>
                            <input
                                className={styleAccount.inputField}
                                name="lname"
                                placeholder="Smith"
                                type="text"
                                value={lastname}
                                onChange={onChangeLastname}
                                ref={register({required: true})}
                            />
                            {errors.lname && errors.lname.type === "required" && <p className={styleModal.alert}>This field is required</p>}
                        </div>

                        <div className={styleAccount.formGroup}>
                            <label className={styleAccount.formLabel}>Username</label>
                            <input
                                className={styleAccount.inputField}
                                type="text"
                                value={username}
                                readOnly
                            />
                        </div>

                        <div className={styleAccount.formGroup}>
                            <label className={styleAccount.formLabel}>Email</label>
                            <input
                                className={styleAccount.inputField}
                                name="email"
                                placeholder="test@test.com"
                                type="email"
                                value={email}
                                onChange={onChangeEmail}
                                ref={register({required: true})}
                            />
                            {errors.email && errors.email.type === "required" && <p className={styleModal.alert}>This field is required</p>}
                        </div>

                        <div className={styleAccount.formGroup}>
                            <label className={styleAccount.formLabel}>Address</label>
                            <input
                                className={styleAccount.inputField}
                                name="address"
                                placeholder="57 rue de la colonie"
                                type="text"
                                value={address}
                                onChange={onChangeAddress}
                                ref={register({required: true})}
                            />
                            {errors.address && errors.address.type === "required" && <p className={styleModal.alert}>This field is required</p>}
                        </div>

                        <div className={styleAccount.formGroup}>
                            <label className={styleAccount.formLabel}>City</label>
                            <input
                                className={styleAccount.inputField}
                                name="city"
                                placeholder="Paris"
                                type="text"
                                value={city}
                                onChange={onChangeCity}
                                ref={register({required: true})}
                            />
                            {errors.city && errors.city.type === "required" && <p className={styleModal.alert}>This field is required</p>}
                        </div>

                        <div className={styleAccount.formGroup}>
                            <label className={styleAccount.formLabel}>ZipCode</label>
                            <input
                                className={styleAccount.inputField}
                                name="zipcode"
                                placeholder="75013"
                                type="number"
                                value={zipcode}
                                onChange={onChangeZipCode}
                                ref={register({required: true})}
                            />
                            {errors.zipcode && errors.zipcode.type === "required" && <p className={styleModal.alert}>This field is required</p>}
                        </div>

                        <div className={styleAccount.paw}>
                            <input className={styleAccount.pawIcon} type="image" src={paw} name="submit" alt="submit"/>
                            <p>Update your account</p>
                        </div>
                    </form>
                    <DeleteProfile user={user} />
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

export default connect(mapStateToProps, { userUpdateAccount })(Profile);