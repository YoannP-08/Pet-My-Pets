import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
// import { Link } from "react-router-dom";
import { getOneKeeperAd, updateKeeperAd } from "../../actions/keeperAdsAction";
import styleSingle from "../../styles/SingleUser.module.css";

const SingleKeeperAd = ({ oneKeeperAd, getOneKeeperAd, match, updateKeeperAd, user }) => {
    const [title, setTitle] = useState();
    const [description, setDesc] = useState();
    const [animal, setAnimal] = useState();
    const [zipCode, setZipCode] = useState();
    const [photo, setPhoto] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();

    useEffect(() => {
        document.body.style.background = "white";
        document.getElementsByClassName("App")[0].style.display = "flex";
        getOneKeeperAd(match.params.id);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setTitle(oneKeeperAd.title);
        setDesc(oneKeeperAd.description);
        setAnimal(oneKeeperAd.animalType);
        setZipCode(oneKeeperAd.zipCode);
        setStartDate(oneKeeperAd.start);
        setEndDate(oneKeeperAd.end);
    }, [oneKeeperAd]);

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

    const onChangeStartDate = (e) => {
        setStartDate(e.target.value)
    };

    const onChangeEndDate = (e) => {
        setEndDate(e.target.value)
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
        formData.append('start', startDate);
        formData.append('end', endDate);
        formData.append("user_id", oneKeeperAd.user_id._id);

        if (photo) {
            formData.append('photo', photo);
        };

        updateKeeperAd(match.params.id, user.token, formData)
    };

    return (
        <div className={styleSingle.containerSingleUser}>
        <div className={styleSingle.containerBorder}>
            <form className={styleSingle.form} onSubmit={onSubmit}>
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
                    <label>Postal Code</label>
                    <input name="zipcode" type="text" value={zipCode} onChange={onChangeZipCode}></input>
                </div>
                <div>
                    <label>Start Date</label>
                    <input name="zipCode" type="text" value={startDate} onChange={onChangeStartDate}></input>
                </div>
                <div>
                    <label>End Date</label>
                    <input name="endDate" type="text" value={endDate} onChange={onChangeEndDate}></input>
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
    oneKeeperAd: state.keeperAds.keeperAd
});

const mapDispatch = (dispatch) => bindActionCreators({
    getOneKeeperAd,
    updateKeeperAd
}, dispatch,);

export default connect(mapStateToProp, mapDispatch)(SingleKeeperAd);
