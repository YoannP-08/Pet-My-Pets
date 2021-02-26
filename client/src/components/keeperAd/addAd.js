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
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [showWarning, setShowWarning] = useState(false);

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
        setShowWarning(false);
        if (start > end) {
            setShowWarning(true);
        }
        if (start <= end) {
            var formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("zipCode", zipCode);
            formData.append("animalType", animal);
            formData.append("user_id", props.user.user.id);
            formData.append('photo', photo);
            formData.append('start', start);
            formData.append('end', end);
            axios({
                method: 'post',
                url: '/keeperads',
                data: formData,
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                    'x-auth-token': props.user.token
                },
            })
                .then(res => { openSweetAlertOk(res.data.message) })
                .then(() => {
                    axios.get(`/keeperads`)
                        .then(res => {
                            props.setAllKeepersfiltered(res.data.data)
                            props.setAllKeepers(res.data.data)
                            res.data.data.map(result => {
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
            setStart('');
            setEnd('');
        }
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

    const onChangeStart = (e) => {
        setStart(e.target.value)
    }

    const onChangeEnd = (e) => {
        setEnd(e.target.value)
    }

    const [myComponent, setComponent] = useState(false)

    const triggerComponent = (e) => {
        setComponent(!myComponent);
    };

    return (
        <div className={styleDonationads.dropdown}>
            {props.user ? (
                <form onSubmit={handleSubmit(onSubmit)} className={styleDonationads.formAd}>
                    <div className={styleDonationads.AddTitle}>
                        <span onClick={triggerComponent} className={styleDonationads.plus}>+</span>
                        <h1 onClick={triggerComponent} className={styleDonationads.subAddTitle}> KEEPER AD</h1>
                        <div className="warning" style={{ display: showWarning ? 'block' : 'none', color: 'red' }}>WARNING : The End date must come after the Start date.</div>
                    </div>
                    {myComponent ?
                        <div className={styleDonationads.containerSubformAd}>
                            <div className={styleDonationads.subformAd}>
                                <div className={styleDonationads.formgroupadd}>
                                    <label className={styleDonationads.labelsubformAd}>Animal's name</label>
                                    <input
                                        className={styleDonationads.inputsubformAd}
                                        name="title"
                                        placeholder="ex : Tom"
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
                                    <label className={styleDonationads.labelsubformAd}>Description</label>
                                    <textarea
                                        className={styleDonationads.textareasubformAd}
                                        name="description"
                                        placeholder="Description"
                                        value={description}
                                        onChange={onChangeDescription}
                                        ref={register({ required: true })}
                                    />
                                    {errors.description && errors.description.type === "required" && <span className={styleDonationads.alert}>This field is required</span>}
                                </div>
                                <div className={styleDonationads.formgroupadd}>
                                    <label className={styleDonationads.labelsubformAd}>Start</label>
                                    <input
                                        className={styleDonationads.inputsubformAd}
                                        name="start"
                                        placeholder="Enter your start date"
                                        value={start}
                                        type="date"
                                        onChange={onChangeStart}
                                        ref={register({ required: true })}
                                    />
                                    {errors.start && errors.start.type === "required" && <span className={styleDonationads.alert}>This field is required</span>}
                                </div>
                                <div className={styleDonationads.formgroupadd}>
                                    <label className={styleDonationads.labelsubformAd}>End</label>
                                    <input
                                        className={styleDonationads.inputsubformAd}
                                        name="end"
                                        placeholder="Enter your end date"
                                        value={end}
                                        type="date"
                                        onChange={onChangeEnd}
                                        ref={register({ required: true })}
                                    />
                                    {errors.end && errors.end.type === "required" && <span className={styleDonationads.alert}>This field is required</span>}
                                </div>
                                <div className={styleDonationads.formgroupadd}>
                                    <label className={styleDonationads.labelsubformAd}>Photo</label>
                                    <input
                                        type="file"
                                        name="file"
                                        className={styleDonationads.inputsubformAd}
                                        onChange={onChangePhoto}
                                        ref={register({ required: true })}
                                    />
                                    {errors.file && errors.file.type === "required" && <span className={styleDonationads.alert}>This field is required</span>}
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