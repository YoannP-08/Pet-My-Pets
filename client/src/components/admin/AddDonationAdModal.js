import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addNewDonationAd } from "../../actions/donationActions";
import styleAds from "../../styles/Ads.module.css"
import Cross from "../../assets/close.svg"



const AddDonationAdModal = ({ close, addNewDonationAd, user }) =>{
    const [title, setTitle ] = useState("")
    const [description, setDescription ] = useState("")
    const [animalType, setAnimalType ] = useState("")
    const [zipCode, setZipCode ] = useState("")
    const [photo, setPhoto ] = useState("")

    const submitForm = (e) => {
        e.preventDefault()
        //New Donation Ad obj//
        let newDonationAd = new FormData();
        newDonationAd.append('title', title);
        newDonationAd.append('description', description);
        newDonationAd.append('animalType', animalType);
        newDonationAd.append('zipCode', zipCode);
        newDonationAd.append('photo', photo);
        newDonationAd.append('user_id', user.user.id);

        // admin token to post add
        const token = user.token;

        //Call redux action//
        addNewDonationAd(newDonationAd, token);

        //Empty form after submit
        setTitle('');
        setDescription('');
        setAnimalType('');
        setZipCode('');
        setPhoto();

        //function to close modal//
        close();
    };

    return(
        <div className={styleAds.addModalContainer}>
            <div className={styleAds.headerAddModal}>
                <h1>Add New Donation Add</h1>
                <img  onClick={() => close()} src={Cross} alt="close"/>
            </div>
                <form onSubmit={submitForm}>
                    <div>
                        <label>Title</label>
                        <input type="text" name="title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                    </div>
                    <div>
                        <label>Description</label>
                        <input type="text" name="description" value={description} onChange={(e) => setDescription(e.target.value)}/>
                    </div>
                    <div>
                        <label>Animal Type</label>
                        <input type="text" name="animalType" value={animalType} onChange={(e) => setAnimalType(e.target.value)}/>
                    </div>
                    <div>
                        <label>Zip Code</label>
                        <input type="number" name="zipCode" value={zipCode} onChange={(e) => setZipCode(e.target.value)}/>
                    </div>
                    <div>
                        <label>Photo</label>
                        <input type="file" name="photo" onChange={(e) => setPhoto(e.target.files[0])}/>
                    </div>
                    <button>Add Donation</button>
                </form>
            </div>
    )
}

const mapStateToProps = state => ({
    user: state.auth.userDetails
});

const mapDispatch = (dispatch) => bindActionCreators({
    addNewDonationAd,
},dispatch)

export default connect(mapStateToProps, mapDispatch)(AddDonationAdModal)