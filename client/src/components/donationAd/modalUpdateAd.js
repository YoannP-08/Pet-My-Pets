import React, { useState } from 'react';
import { connect } from "react-redux";
import ReactDOM from "react-dom";
import axios from "axios";
import Swal from 'sweetalert2';
import styleModal from "../../styles/Modal.module.css";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";


const ModalUpdateAd = (props) => {
    const [description, setDesc] = useState(props.donationad.description);
    const [title, setTitle] = useState(props.donationad.title);
    const [animal, setAnimal] = useState(props.donationad.animalType);
    const [photo, setPhoto] = useState();
    const [zipCode, setZipCode] = useState(props.donationad.zipCode);

    const { register, handleSubmit, errors } = useForm({ mode: 'onBlur', reValidateMode: 'onBlur' });

    const openSweetAlertOk = (message) => {
        Swal.fire({
            title: 'Success',
            text: message,
            icon: "success",
        })
    }
    let { id } = useParams();

    const onSubmit = (e) => {
        var formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("zipCode", zipCode);
        formData.append("animalType", animal);
        formData.append("user_id", props.user.user.id);
        if (photo) {
            formData.append('photo', photo);
        }
        axios({
            method: 'PUT',
            url: `/donationads/${id}`,
            data: formData,
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                'x-auth-token': props.user.token
            },
        })
            .then(res => { openSweetAlertOk(res.data.message) })
            .then(() => {
                axios.get(`/donationads/${id}`)
                    .then(res => {
                        props.setDonation(res.data.data)
                        if (res.data.data.photo) {
                            return (arrayBufferToBase64(res.data.data._id, res.data.data.photo.data.data))
                        }
                    })
            })
        setTimeout(props.hide, 1000)
    }

    const arrayBufferToBase64 = ((id, buffer) => {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return props.setImg({ id: id, pic: btoa(binary) });
    })

    const onChangeDescription = (e) => {
        setDesc(e.target.value);
    }

    const onChangeTitle = (e) => {
        setTitle(e.target.value);
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

    return (
        props.isShowing ? ReactDOM.createPortal(
            <>
                <div className={styleModal.modalOverlay}>
                    <div className={styleModal.modalWrapper}>
                        <div className={styleModal.modal}>
                            <div className={styleModal.modalHeader}>
                                <h4>Update Ad</h4>
                                <button
                                    type="button"
                                    className={styleModal.modalCloseButton}
                                    onClick={props.hide}
                                >
                                    <span>&times;</span>
                                </button>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className={styleModal.formGroupModal}>
                                    <label className={styleModal.modalLabel}>Title</label>
                                    <input
                                        name="title"
                                        className={styleModal.inputModal}
                                        placeholder="Ex: Cute cate"
                                        value={title}
                                        onChange={onChangeTitle}
                                        ref={register({ required: true })}
                                    />
                                    {errors.title && errors.title.type === "required" && <p className={styleModal.alert}>This field is required</p>}
                                </div>
                                <div className={styleModal.formGroupModal}>
                                    <label className={styleModal.modalLabel}>Description</label>
                                    <input
                                        name="description"
                                        className={styleModal.inputModal}
                                        placeholder="Ex: he is very playful"
                                        value={description}
                                        onChange={onChangeDescription}
                                        ref={register({ required: true })}
                                    />
                                    {errors.description && errors.description.type === "required" && <p className={styleModal.alert}>This field is required</p>}
                                </div>
                                <div className={styleModal.formGroupModal}>
                                    <label className={styleModal.modalLabel}>Animal type</label>
                                    <input
                                        name="animal"
                                        className={styleModal.inputModal}
                                        placeholder="Ex: dog, cat etc..."
                                        value={animal}
                                        onChange={onChangeAnimal}
                                        ref={register({ required: true })}
                                    />
                                    {errors.animal && errors.animal.type === "required" && <p className={styleModal.alert}>This field is required</p>}
                                </div>
                                <div className={styleModal.formGroupModal}>
                                    <label className={styleModal.modalLabel}>Photo</label>
                                    <input
                                        name="file"
                                        type="file"
                                        className={styleModal.inputModal}
                                        onChange={onChangePhoto}
                                    />
                                </div>
                                <div className={styleModal.formGroupModal}>
                                    <label className={styleModal.modalLabel}>ZipCode</label>
                                    <input
                                        name="zipcode"
                                        className={styleModal.inputModal}
                                        placeholder="Enter your zipCode"
                                        value={zipCode}
                                        onChange={onChangeZipCode}
                                        ref={register({ required: true })}
                                    />
                                    {errors.zipcode && errors.zipcode.type === "required" && <p className={styleModal.alert}>This field is required</p>}
                                </div>
                                <button type="submit" style={{ marginTop: 50 }} className={styleModal.ModalbuttonUpd}>
                                    Save
                                </button>
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

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.userDetails
})

export default connect(
    mapStateToProps
)(ModalUpdateAd);