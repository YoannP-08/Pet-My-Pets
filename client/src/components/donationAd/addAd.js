import React, { useState } from 'react';
import { connect } from "react-redux";
import axios from "axios";
import Swal from 'sweetalert2';
import styleDonationads from "../../styles/DonationAds.module.css"
import { useForm } from "react-hook-form";

const AddAd = (props) => {
    const [title, setTitle] = useState("");
    const [description, setDesc] = useState("");
    const [animal, setAnimal] = useState("");
    const [photo, setPhoto] = useState();
    const [zipCode, setZipCode] = useState("");

    const { register, handleSubmit, errors } = useForm({ mode: 'onBlur', reValidateMode: 'onBlur' });

    const openSweetAlertOk = (message) => {
        Swal.fire({
            title: 'Success',
            text: message,
            icon: "success",
        })
    }

    const onSubmit = (e) => {
        // e.preventDefault();
        var formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("zipCode", zipCode);
        formData.append("animalType", animal);
        formData.append("user_id", props.user.user.id);
        formData.append('photo', photo);
        axios({
            method: 'post',
            url: '/donationads',
            data: formData,
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                'x-auth-token': props.user.token
            },
        })
            .then(res => { openSweetAlertOk(res.data.message) })
            .then(() => {
                axios.get(`/donationads`)
                    .then(res => {
                        props.setAllDonationsfiltered(res.data)
                        props.setAllDonations(res.data)
                        res.data.map(result => {
                            if (result.photo) {
                                return (props.arrayBufferToBase64(result._id, result.photo.data.data))
                            }
                            return null
                        })
                    })
            });
        setTitle('');
        setDesc('');
        setAnimal('');
        setPhoto();
        setZipCode('');
    }

    const onChangeTitle = (e) => {
        setTitle(e.target.value);
    }

    const onChangeDescription = (e) => {
        setDesc(e.target.value);
    }

    const onChangeAnimal = (e) => {
        setAnimal(e.target.value)
    }

    const onChangeZipCode = (e) => {
        setZipCode(e.target.value)
    }

    const onChangePhoto = (e) => {
        setPhoto(e.target.files[0])
    }

    const [myComponent, setComponent] = useState(false)

    const triggerComponent = (e) => {
        setComponent(!myComponent);
    };

    return (
        <div>
            {props.user ? (
                <form onSubmit={handleSubmit(onSubmit)} className={styleDonationads.formAd}>
                    <div className={styleDonationads.AddTitle}>
                        <span onClick={triggerComponent} className={styleDonationads.plus}>+</span>
                        <h1 onClick={triggerComponent} className={styleDonationads.subAddTitle}>ADD DONATION</h1>
                    </div>
                    {myComponent ?
                        <div className={styleDonationads.containerSubformAd}>
                            <div className={styleDonationads.subformAd}>
                                <div className={styleDonationads.formgroupadd}>
                                    <label className={styleDonationads.labelsubformAd}>Animal's name</label>
                                    <input
                                        className={styleDonationads.inputsubformAd}
                                        name="title"
                                        placeholder="Ex: Tom"
                                        value={title}
                                        onChange={onChangeTitle}
                                        ref={register({ required: true })}
                                    />
                                    {errors.title && errors.title.type === "required" && <span className={styleDonationads.alert}>This field is required</span>}
                                </div>
                                <div className={styleDonationads.formgroupadd}>
                                    <label className={styleDonationads.labelsubformAd}>Animal type</label>
                                    <input
                                        className={styleDonationads.inputsubformAd}
                                        name="animal"
                                        placeholder="Ex: dog, cat etc..."
                                        value={animal}
                                        onChange={onChangeAnimal}
                                        ref={register({ required: true })}
                                    />
                                    {errors.animal && errors.animal.type === "required" && <span className={styleDonationads.alert}>This field is required</span>}
                                </div>
                                <div className={styleDonationads.formgroupadd}>
                                    <label className={styleDonationads.labelsubformAd}>ZipCode</label>
                                    <input
                                        className={styleDonationads.inputsubformAd}
                                        name="zipcode"
                                        placeholder="Enter your zipCode"
                                        value={zipCode}
                                        onChange={onChangeZipCode}
                                        ref={register({ required: true })}
                                    />
                                    {errors.zipcode && errors.zipcode.type === "required" && <span className={styleDonationads.alert}>This field is required</span>}
                                </div>
                                <div className={styleDonationads.formgroupadd}>
                                    <label className={styleDonationads.labelsubformAd}>Photo</label>
                                    <input
                                        name="file"
                                        type="file"
                                        className={styleDonationads.inputsubformAd}
                                        onChange={onChangePhoto}
                                        ref={register({ required: true })}
                                    />
                                    {errors.file && errors.file.type === "required" && <span className={styleDonationads.alert}>This field is required</span>}
                                </div>
                                <div className={styleDonationads.formgroupadd}>
                                    <label className={styleDonationads.labelsubformAd}>Description</label>
                                    <textarea
                                        rows="5" cols="50"
                                        className={styleDonationads.textareasubformAd}
                                        name="description"
                                        placeholder="Description"
                                        value={description}
                                        onChange={onChangeDescription}
                                        ref={register({ required: true })}
                                    />
                                    {errors.description && errors.description.type === "required" && <span className={styleDonationads.alert}>This field is required</span>}
                                </div>
                            </div>
                            <div className={styleDonationads.divbuttonaddAd}>
                                <button className={styleDonationads.buttonaddAd} type="submit">
                                    SAVE
                            </button>
                            </div>
                        </div>
                        : null}
                </form>
            ) : (
                    null
                )}
        </div>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.userDetails
})

export default connect(
    mapStateToProps
)(AddAd);