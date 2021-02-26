import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getOneDonationAd, updateDonationAd } from "../../actions/donationActions";

import styleSingle from "../../styles/SingleUser.module.css";
import styleSingleDonation from  "../../styles/SingleDonationAds.module.css"

const SingleDonationAd = ({ oneDonationAd, getOneDonationAd, match, updateDonationAd, user }) => {

    const [title, setTitle] = useState();
    const [description, setDesc] = useState();
    const [animal, setAnimal] = useState();
    const [zipCode, setZipCode] = useState();
    const [photo, setPhoto] = useState();


    useEffect(() => {
        document.body.style.background = "white";
        document.getElementsByClassName("App")[0].style.display = "flex";
        getOneDonationAd(match.params.id);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setTitle(oneDonationAd.title);
        setDesc(oneDonationAd.description);
        setAnimal(oneDonationAd.animalType);
        setZipCode(oneDonationAd.zipCode);
    }, [oneDonationAd]);

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

    const onSubmit = (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("zipCode", zipCode);
        formData.append("animalType", animal);
        formData.append("user_id", oneDonationAd.user_id._id);

        if (photo) {
            formData.append('photo', photo);
        };

        updateDonationAd(match.params.id, user.token, formData)
    }

    return (
        <div className={styleSingleDonation.containerSingleUser}>
        <div className={styleSingleDonation.containerBorder}>
            <form className={styleSingle.form}  onSubmit={onSubmit}>
                <div>
                    <label>Title</label>
                    <input name="title" type="text" value={title} onChange={onChangeTitle}></input>
                </div>
                <div>
                    <label>Description</label>
                    <input name="description" type="text" value={description} onChange={onChangeDescription}></input>
                </div>
                <div>
                    <label>Animal Type</label>
                    <input name="animalType" type="text" value={animal} onChange={onChangeAnimal}></input>
                </div>
                <div>
                    <label>Postal code</label>
                    <input name="zipCode" type="text" value={zipCode} onChange={onChangeZipCode}></input>
                </div>
                <div>
                    <label>Picture</label>
                    <input name="photo" type="file" onChange={onChangePhoto} ></input>
                </div>
                <button type="submit" >Update Ad</button>
            </form>
        </div>
        </div>
    );
};

const mapStateToProp = (state) => ({
    user: state.auth.userDetails,
    oneDonationAd: state.donationAds.donationAd
});

const mapDispatch = (dispatch) => bindActionCreators({
    getOneDonationAd,
    updateDonationAd
}, dispatch,);

export default connect(mapStateToProp, mapDispatch)(SingleDonationAd);
