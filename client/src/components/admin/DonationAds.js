import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import { getDonationAds, deleteDonationAd } from "../../actions/donationActions";
import Pagination from "./Pagination";
import AddDonationAdModal from "./AddDonationAdModal";

import styleAds from "../../styles/Ads.module.css";
import styleUsers from "../../styles/Users.module.css";

const DonationAds = ({ deleteDonationAd, donationAds, getDonationAds, user }) => {
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [donationAdsPerPage] = useState(6);
    const indexOfLastDonationAd =  currentPage * donationAdsPerPage;
    const indexOfLastFirstDonationAd = indexOfLastDonationAd - donationAdsPerPage;
    const currentDonations = donationAds.slice(indexOfLastFirstDonationAd, indexOfLastDonationAd);
    const totalDonationAds = donationAds.length;

    //Change page//
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const [isOpen,setIsOpen] = useState(false);

    useEffect(() =>{
        getDonationAds()
        document.body.style.background = "white"
        document.getElementsByClassName("App")[0].style.display = "flex"

        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const openModal = () => {
        setIsOpen(!isOpen)
    };

    const deleteAd = (id, token) => {
        deleteDonationAd(id, token);
    };

    return (
        <div className={styleUsers.containerUsers}>
            <div className={styleUsers.background}>
                <div className={styleUsers.containerLogo}>
                    <h1>Donation Ads</h1>
                </div>
                <div className={styleUsers.btnDashboard}>
                    <button onClick={openModal}>New Donation Ad</button>
                </div>
                {isOpen && 
                    <div className={styleUsers.transition}>
                        <div className={styleAds.containerAddUser}>
                            <AddDonationAdModal open={isOpen}  close={setIsOpen}/>
                        </div>
                        <div className={styleUsers.overlay}></div>
                    </div>
                }
                <div className={styleUsers.fullHeight}>
                    <table className={styleUsers.adminTable}>
                        <thead className={styleUsers.tableHead}>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Animal Type</th>
                                <th>ZipCode</th>
                                <th>Delete Ad</th>
                            </tr>
                        </thead>
                        <tbody className={styleUsers.tableBody}>
                            {currentDonations.map((donation,index) =>(
                            <tr key={index}> 
                                <Link to={`/admin/dashboard/donationads/${donation._id}`}><td>{donation.title}</td></Link>
                                <td>{donation.description}</td>
                                <td>{donation.animalType}</td>
                                <td>{donation.zipCode}</td>
                                <td><button onClick={() => deleteAd(donation._id, user.token)}>Delete</button></td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination usersPerPage={donationAdsPerPage} totalUsers={totalDonationAds} paginate={paginate} /> 
            </div>
        </div>
    )
;}

const mapStateToProp = state => ({
    donationAds: state.donationAds.donationAds,
    user: state.auth.userDetails
});

const mapDispatch = (dispatch) => bindActionCreators({
    getDonationAds,
    deleteDonationAd
},dispatch)

export default connect(mapStateToProp,mapDispatch)(DonationAds)