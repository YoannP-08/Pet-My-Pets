import React, { useEffect, useState } from "react";
import DeleteAd from "./deleteAd";
import { connect } from "react-redux";
import axios from "axios";
import AddAd from "./addAd";
import styleDonationads from "../../styles/DonationAds.module.css";
import { Link } from "react-router-dom";
import marker from "../../assets/marker.svg";
import loading from "../../assets/loading.gif"
import Search from "../search/search";
import Pagination from "./Pagination";

const DonationAd = (props) => {
  const [allDonations, setAllDonations] = useState([]);
  const [objImg, setImgs] = useState([]);
  const [inputSearch, setInputSearch] = useState("");
  const [allDonationsfiltered, setAllDonationsfiltered] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [donationsPerPage] = useState(6);


  useEffect(() => {
    axios.get(`/donationads`).then((res) => {
      setAllDonations(res.data);
      setAllDonationsfiltered(res.data);
      res.data.map((result) => {
        if (result.photo) {
          return arrayBufferToBase64(result._id, result.photo.data.data);
        }
        return null
      });
    });
    document.body.style.background = "#2f3542";
  }, []);

  const indexOfLastDonation = currentPage * donationsPerPage;
  const indexOfFirstDonation = indexOfLastDonation - donationsPerPage;
  const currentDonations = allDonationsfiltered.slice(
    indexOfFirstDonation,
    indexOfLastDonation,
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const arrayBufferToBase64 = (id, buffer) => {
    var binary = "";
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return setImgs((pic) => [...pic, { id: id, pic: btoa(binary) }]);
  };

  const searchOnChange = async (event) => {
    const filteredPets = allDonations.filter((donation) => {
      return (
        donation.title
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        donation.animalType
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        donation.zipCode
          .includes(event.target.value)
      );
    });
    setInputSearch(event.target.value);
    setAllDonationsfiltered(filteredPets);
  };

  return (
    <div>
      <AddAd
        setAllDonations={setAllDonations}
        allDonations={allDonations}
        arrayBufferToBase64={arrayBufferToBase64}
        setAllDonationsfiltered={setAllDonationsfiltered}
      ></AddAd>
      <Search searchOnChange={searchOnChange} inputSearch={inputSearch} />
      {allDonations.length !== 0 ? (
        <>
          <div className={styleDonationads.itemContainer}>
            {currentDonations.map((donation, i) => {
              return donation.user_id ? (
                <div key={i} className={styleDonationads.itemCard}>
                  <div className={styleDonationads.headercardad}>
                    <Link
                      className={styleDonationads.containerLink}
                      to={{ pathname: `/donationads/${donation._id}` }}
                    >
                      <div className={styleDonationads.subAnimalSingle}>
                        <p className={styleDonationads.nameAnimalSingle} > {donation.title} </p> | <p className={styleDonationads.animalSingle}>{donation.animalType}</p>
                      </div>

                    </Link>
                    <>
                      {props.user ? (
                        <div className={styleDonationads.deleteAd}>
                          {donation.user_id._id === props.user.user.id ? (
                            <DeleteAd
                              id={donation._id}
                              setAllDonations={setAllDonations}
                              allDonations={allDonations}
                              setAllDonationsfiltered={setAllDonationsfiltered}
                              allDonationsfiltered={allDonationsfiltered}
                            ></DeleteAd>
                          ) : null}
                        </div>
                      ) : null}
                    </>
                  </div>
                  {objImg.find((el) => el.id === donation._id) ? (
                    <Link
                      className={styleDonationads.containerLink}
                      to={{ pathname: `/donationads/${donation._id}` }}
                    >
                      <img
                        className={styleDonationads.imageAd}
                        alt="animals"
                        src={`data:image/png;base64,${objImg.find((el) => el.id === donation._id).pic
                          }`}
                      />
                    </Link>
                  ) : null}
                  <div className={styleDonationads.bottomItemCard}>
                    <div className={styleDonationads.locationItemCard}>
                      <img
                        src={marker}
                        alt="marker"
                        style={{ width: "0.8rem", marginRight: 28 }}
                      />
                      <p>{donation.zipCode}</p>
                    </div>
                    <div className={styleDonationads.locationItemCard}>
                      <svg style={{ width: "1.8rem", marginRight: 12, paddingRight: 8 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <p>From : {donation.user_id.username}</p>
                    </div>
                  </div>
                </div>
              ) : null;
            })}
          </div>
          <Pagination
            adsPerPage={donationsPerPage}
            totalAds={allDonations.length}
            paginate={paginate}
          />
        </>
      ) : (
          <div className={styleDonationads.containerImg}>
            <img style={{ width: 250 }} src={loading} alt="loading..." />
            <h3 className={styleDonationads.loading}>
              Please wait, page is loading
          </h3>
          </div>
        )}
    </div>
  );
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.userDetails,
});

export default connect(mapStateToProps)(DonationAd);
