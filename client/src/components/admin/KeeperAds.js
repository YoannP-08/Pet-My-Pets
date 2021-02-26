import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import { getKeeperAds, deleteKeeperAd } from "../../actions/keeperAdsAction";
import Pagination from "./Pagination";
import AddKeeperAdModal from "./AddKeeperAdModal";
import styleUsers from "../../styles/Users.module.css";

const KeeperAds = ({ deleteKeeperAd, getKeeperAds, keeperAds, user }) => {
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [keeperAdsPerPage] = useState(6);
    const indexOfLastKeeperAd =  currentPage * keeperAdsPerPage;
    const indexOfLastFirstKeeperAd = indexOfLastKeeperAd - keeperAdsPerPage;
    const currentKeeperAds = keeperAds.slice(indexOfLastFirstKeeperAd, indexOfLastKeeperAd);
    const totalKeeperAds = keeperAds.length;

    //Change page//
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const [isOpen,setIsOpen] = useState(false);

    useEffect(() =>{
        getKeeperAds();
        document.body.style.background = "white";
        document.getElementsByClassName("App")[0].style.display = "flex";

        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const openModal = () => {
        setIsOpen(!isOpen);
    };

    const deleteAd = (id, token) => {
        deleteKeeperAd(id, token);
    };

    return (
        <div className={styleUsers.containerUsers}>
            <div className={styleUsers.background}>
                <div className={styleUsers.containerLogo}>
                    <h1>Keeper Ads</h1>
                </div>
                <div className={styleUsers.btnDashboard}>
                    <button onClick={openModal}>New Keeper Ad</button>
                </div>
                {isOpen && 
                    <div className={styleUsers.transition}>
                        <div className={styleUsers.containerAddUser}>
                            <AddKeeperAdModal open={isOpen}  close={setIsOpen}/>
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
                            {currentKeeperAds.map((keeper, index) => ( 
                            <tr key={index}> 
                                <Link to={`/admin/dashboard/keeperads/${keeper._id}`}><td>{keeper.title}</td></Link>
                                <td>{keeper.description}</td>
                                <td>{keeper.animalType}</td>
                                <td>{keeper.zipCode}</td>
                                <td><button onClick={() => deleteAd(keeper._id, user.token)}>Delete</button></td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination usersPerPage={keeperAdsPerPage} totalUsers={totalKeeperAds} paginate={paginate} /> 
            </div>
        </div>
    )
;}

const mapStateToProp = state => ({
    keeperAds: state.keeperAds.keeperAds,
    user: state.auth.userDetails
});

const mapDispatch = (dispatch) => bindActionCreators({
    getKeeperAds,
    deleteKeeperAd
}, dispatch);

export default connect(mapStateToProp, mapDispatch)(KeeperAds);