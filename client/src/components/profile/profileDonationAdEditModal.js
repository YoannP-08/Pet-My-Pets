import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactDOM from 'react-dom';
import { updateDonationAd } from '../../actions/donationActions';
import styleModal from '../../styles/Modal.module.css';
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';

const ProfileDonationAdEditModal = ({ donationAd, isShowing, hide, updateDonationAd, refreshDonationAd, user }) => {
    // const [adId, setAdId] = useState(donationAd._id);
    const adId = donationAd._id;
    const [title, setTitle] = useState(donationAd.title);
    const [description, setDesc] = useState(donationAd.description);
    const [animal, setAnimal] = useState(donationAd.animalType);
    const [zipCode, setZipCode] = useState(donationAd.zipCode);
    const [photo, setPhoto] = useState();

    const { register, handleSubmit, errors } = useForm({ mode: 'onBlur', reValidateMode: 'onBlur' });

    const openSweetAlertOk = () => {
        Swal.fire({
            title: 'Success',
            text: 'Your ads has been successfully updated',
            icon: "success",
        })
    }

    const onSubmit = (e) => {
        var formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("zipCode", zipCode);
        formData.append("animalType", animal);
        formData.append("user_id", user.user.id);

        if (photo) {
            formData.append('photo', photo);
        };

        updateDonationAd(adId, user.token, formData)
        refreshDonationAd();
        setTimeout(hide, 100);
        openSweetAlertOk();
    };
    
    const onChangeTitle = (e) => {
        setTitle(e.target.value);
    };
    
    const onChangeDescription = (e) => {
        setDesc(e.target.value);
    };

    const onChangeAnimal = (e) => {
        setAnimal(e.target.value)
    };

    const onChangeZipCode = (e) => {
        setZipCode(e.target.value)
    };

    const onChangePhoto = (e) => {
        setPhoto(e.target.files[0])
    };

    return (
        isShowing ? ReactDOM.createPortal(
            <>
                <div className={styleModal.modalOverlay}>
                    <div className={styleModal.modalWrapper}>
                        <div className={styleModal.modal}>
                            <div className={styleModal.modalHeader}>
                                <h4>Update Ad</h4>
                                <button
                                    type="button"
                                    className={styleModal.modalCloseButton}
                                    onClick={hide}
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
});

const mapDispatch = (dispatch) => bindActionCreators({
    updateDonationAd,
}, dispatch);

export default connect(mapStateToProps, mapDispatch)(ProfileDonationAdEditModal);