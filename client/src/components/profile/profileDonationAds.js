import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getDonationAds, deleteDonationAd } from '../../actions/donationActions';
import useModal from "../../Authentication/UseModal";
import DonationAdUpd from './profileDonationAdEditModal';
import styleDonationAd from '../../styles/profile/DonationAd.module.css';
import marker from '../../assets/marker.svg';
import Swal from 'sweetalert2';


const ProfileDonationAds = ({ deleteDonationAd, donationAds, getDonationAds, user }) => {
    const { isShowing: isUpdateFormShowed, toggle: toggleUpdateForm } = useModal();
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            getDonationAds();
        }; 
    });

    const arrayBufferToBase64 = ((buffer) => {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    });

    const deleteAd = (id, token) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.isConfirmed) {
                deleteDonationAd(id, token);
              Swal.fire(
                'Deleted!',
                'Your ad has been deleted.',
                'success'
              )
            }
          })
    };

    const triggerUseEffect = () => {
        isInitialMount.current = true;
    };

    return (
        <div className={styleDonationAd.container}>
            { donationAds.map((donationad, index) => (
                donationad.user_id._id === user.user.id ? (
                    <div key={index} className={styleDonationAd.card}>
                        <div className={styleDonationAd.cardHeader}> 
                            <p>{donationad.title}</p>
                            <p>|</p>
                            <p className={styleDonationAd.type}>{donationad.animalType}</p> 
                        </div>

                        <img className={styleDonationAd.cardImg} alt={donationad.title} src={`data:image/png;base64,${arrayBufferToBase64(donationad.photo.data.data)}`}/>
                        
                        <div className={styleDonationAd.quote}>
                            <span className={styleDonationAd.quoteOpening}>“</span>
                            <p className={styleDonationAd.description}> {donationad.description} </p>
                            <span className={styleDonationAd.quoteClosing}>”</span>
                        </div>

                        <div className={styleDonationAd.cardFooter}>
                            <img
                                src={marker}
                                alt="marker"
                                style={{ width: '0.8rem', marginRight: '1.5rem' }}
                            />
                            <p>{donationad.zipCode}</p>
                        </div>
                        
                        <div className={styleDonationAd.cardButtons}>
                            <button className={styleDonationAd.buttonUpd} onClick={toggleUpdateForm}> Update </button>
                            <DonationAdUpd isShowing={isUpdateFormShowed} hide={toggleUpdateForm} donationAd={donationad} refreshDonationAd={triggerUseEffect}/>
                            <button className={styleDonationAd.buttonDel}  onClick={() => deleteAd(donationad._id, user.token)}> Delete </button>
                        </div>
                    </div>
                ) : (
                    null
                )
            ))}
        </div>
    )
};

const mapStateToProp = state => ({
    donationAds: state.donationAds.donationAds,
    user: state.auth.userDetails
})


const mapDispatch = (dispatch) => bindActionCreators({
    getDonationAds,
    deleteDonationAd,
}, dispatch)

export default connect(mapStateToProp, mapDispatch)(ProfileDonationAds);
