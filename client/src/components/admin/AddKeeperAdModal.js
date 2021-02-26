import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addNewKeeperAd } from "../../actions/keeperAdsAction";
import styleKepperAd from "../../styles/Ads.module.css";
import Cross from "../../assets/close.svg"


const AddKeeperAddModal = ({ close, addNewKeeperAd, user }) =>{
    const [title, setTitle ] = useState("");
    const [description, setDescription ] = useState("");
    const [animalType, setAnimalType ] = useState("");
    const [zipCode, setZipCode ] = useState("");
    const [photo, setPhoto ] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const submitForm = (e) => {
        e.preventDefault()
        //New Keeper Ad obj//
        let newKeeperAd = new FormData();
        newKeeperAd.append('title', title);
        newKeeperAd.append('description', description);
        newKeeperAd.append('animalType', animalType);
        newKeeperAd.append('zipCode', zipCode);
        newKeeperAd.append('photo', photo);
        newKeeperAd.append('start', startDate);
        newKeeperAd.append('end', endDate);
        newKeeperAd.append('user_id', user.user.id);

        // admin token to post add
        const token = user.token;

        //Call redux action//
        addNewKeeperAd(newKeeperAd, token);

        //Empty form after submit
        setTitle('');
        setDescription('');
        setAnimalType('');
        setZipCode('');
        setPhoto();
        setStartDate('');
        setEndDate('');

        //function to close modal//
        close();
    };

    return(
        <div className={styleKepperAd.addModalContainer}>
            <div className={styleKepperAd.headerAddModal}>
                <h1>Add New Keeper Add</h1>
                <img  onClick={() => close()} src={Cross} alt="close"/>
            </div>
            <div>
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
                        <label>Start Date</label>
                        <input type="text" name="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
                    </div>
                    <div>
                        <label>End Date</label>
                        <input type="text" name="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
                    </div>
                    <div>
                        <label>Photo</label>
                        <input type="file" name="photo" onChange={(e) => setPhoto(e.target.files[0])}/>
                    </div>
                    <button>Add Keeper Ad</button>
                </form>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    user: state.auth.userDetails
});

const mapDispatch = (dispatch) => bindActionCreators({
    addNewKeeperAd,
}, dispatch)

export default connect(mapStateToProps, mapDispatch)(AddKeeperAddModal);