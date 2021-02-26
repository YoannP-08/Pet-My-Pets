import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { connect } from "react-redux";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import useModal from "../../Authentication/UseModal";
import ModalUpdateAd from "./modalUpdateAd";
import styleDonationads from "../../styles/SingleDonationAds.module.css"
import loading from "../../assets/loading.gif"


const SingleDonation = (props) => {
    const { isShowing: isUpdateFormShowed, toggle: toggleUpdateForm } = useModal();
    const openSweetAlertOk = (message) => {
        Swal.fire({
            title: 'Success',
            text: message,
            icon: "success",
            confirmButtonText: "Ok",
        }).then((result) => {
            if (result.isConfirmed) {
                document.location.reload();
            }
        })
    }

    const history = useHistory();
    let { id } = useParams();
    const [donationad, setDonation] = useState({});
    const [userId, setUserId] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [objImg, setImg] = useState({});

    useEffect(() => {
        axios.get(`/donationads/${id}`)
            .then(res => {
                setDonation(res.data.data);
                setUsername(res.data.data.user_id.username);
                setEmail(res.data.data.user_id.email);
                setUserId(res.data.data.user_id._id);
                if (res.data.data.photo) {
                    return (arrayBufferToBase64(res.data.data._id, res.data.data.photo.data.data))
                }
            })
        document.body.style.background = "#2f3542"
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const arrayBufferToBase64 = ((id, buffer) => {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return setImg({ id: id, pic: btoa(binary) });
    })

    const deleteAd = () => {
        axios({
            method: 'DELETE',
            url: `/donationads/${id}`,
            headers: {
                'x-auth-token': props.user.token
            },
        })
            .then(res => { openSweetAlertOk(res.data.message) })
        history.push("/");

    }

    return (
        <div>
            { donationad ?
                <div className={styleDonationads.containerSingle}>
                    <div>{objImg ?
                        < img className={styleDonationads.imageSingle} alt="animals" src={`data:image/png;base64,${objImg.pic}`} />
                        : null}
                    </div>
                    <div className={styleDonationads.subContainerSingle}>
                        <div className={styleDonationads.titleSingle}>
                            <p>{donationad.title} </p>
                            <span className={styleDonationads.spanSingle} > | </span>
                            <p className={styleDonationads.animalSingle} >{donationad.animalType}</p>
                        </div>
                        <div className={styleDonationads.containerQuoteSingle}>
                            <span className={styleDonationads.quoteSingle}>“</span>
                            <div className={styleDonationads.descSingle} >{donationad.description}</div>
                            <span className={styleDonationads.quoteSingle2}>”</span>
                        </div>
                        <div className={styleDonationads.detailsSingle}>
                            <div className={styleDonationads.iconSingle}>
                                <svg className={styleDonationads.subIconSingle} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <p>{donationad.zipCode}</p>
                            </div>
                            <div className={styleDonationads.iconSingle}>
                                <svg className={styleDonationads.subIconSingle} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <p>{username}</p>
                            </div>
                            <div className={styleDonationads.iconSingle}>
                                <svg className={styleDonationads.subIconSingle} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <a className={styleDonationads.mailto} href={"mailto:" + { email }}>{email}</a>
                                <p></p>
                            </div>
                        </div>
                    </div>
                    {props.user ?
                        <div>
                            {userId === props.user.user.id ?
                                <div className={styleDonationads.modalIconSingle}>
                                    <svg onClick={() => deleteAd()} className={styleDonationads.trashIconSingle} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    <svg onClick={toggleUpdateForm} className={styleDonationads.editIconSingle} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    <ModalUpdateAd isShowing={isUpdateFormShowed} hide={toggleUpdateForm} donationad={donationad} setDonation={setDonation} setImg={setImg} arrayBufferToBase64={arrayBufferToBase64} />
                                </div>
                                :
                                null}
                        </div>
                        : null}
                </div>
                : (
                    <div className={styleDonationads.containerImg}>
                        <img style={{ width: 250 }} src={loading} alt="loading..." />
                        <h3 className={styleDonationads.loading}>
                            Please wait, page is loading
                        </h3>
                    </div>
                )
            }
        </div>
    )
}
const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.userDetails
})

export default connect(
    mapStateToProps
)(SingleDonation);
