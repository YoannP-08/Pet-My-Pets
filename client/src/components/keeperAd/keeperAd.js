import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import DeleteAd from "./deleteAd";
import AddAd from "./addAd";
import styleDonationads from "../../styles/DonationAds.module.css";
import { Link } from "react-router-dom";
import marker from "../../assets/marker.svg";
import loading from "../../assets/loading.gif"
import styleHome from "../../styles/Home.module.css";
import Search from "../search/search";
import Pagination from "../donationAd/Pagination";

const KeeperAds = (props) => {
  const [allKeepers, setAllKeepers] = useState([]);
  const [objImg, setImgs] = useState([]);
  const [allKeepersfiltered, setAllKeepersfiltered] = useState([]);
  const [inputSearch, setInputSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [keeperAdsPerPage] = useState(6);

  useEffect(() => {
    axios.get(`/keeperads`).then((res) => {
      setAllKeepers(res.data.data);
      setAllKeepersfiltered(res.data.data);
      if (res.data.data.length !== 0) {
        res.data.data.map((result) => {
          if (result.photo) {
            return arrayBufferToBase64(result._id, result.photo.data.data);
          }
          return null
        });
      }
    });
    document.body.style.background = "#2f3542";
  }, []);

  const indexOfLastKeeperAd = currentPage * keeperAdsPerPage;
  const indexOfFirstKeeperAd = indexOfLastKeeperAd - keeperAdsPerPage;
  const currentKeeperAds = allKeepersfiltered.slice(
    indexOfFirstKeeperAd,
    indexOfLastKeeperAd,
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
    const filteredPets = allKeepers.filter((keeper) => {
      return (
        keeper.title.toLowerCase().includes(event.target.value.toLowerCase()) ||
        keeper.animalType
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        keeper.zipCode.toLowerCase().includes(event.target.value.toLowerCase())
      );
    });
    setInputSearch(event.target.value);
    setAllKeepersfiltered(filteredPets);
  };

  return (
    <div>
      <div className={styleHome.allLinks}>
        <Link className={styleHome.linkHome} to="/keeper">
          Keeper Ad
        </Link>
        <span className={styleHome.separation}>|</span>
        <Link className={styleHome.link} to="/">
          {" "}
          Donations{" "}
        </Link>
      </div>
      <AddAd
        setAllKeepers={setAllKeepers}
        allKeepers={allKeepers}
        arrayBufferToBase64={arrayBufferToBase64}
        setAllKeepersfiltered={setAllKeepersfiltered}
      ></AddAd>
      <Search searchOnChange={searchOnChange} inputSearch={inputSearch} />
      {allKeepers.length !== 0 ? (
        <>
          <div className={styleDonationads.itemContainer}>
            {currentKeeperAds.map((keeper, i) => {
              return keeper.user_id ? (
                <div key={i} className={styleDonationads.itemCard}>
                  <div className={styleDonationads.headercardad}>
                    <Link
                      className={styleDonationads.containerLink}
                      to={`/keeper/${keeper._id}`}
                    >
                      <div className={styleDonationads.subAnimalSingle}>
                        <p className={styleDonationads.nameAnimalSingle} > {keeper.title} </p> | <p className={styleDonationads.animalSingle}>{keeper.animalType}</p>
                      </div>
                    </Link>
                    <>
                      {props.user ? (
                        <div className={styleDonationads.deleteAd}>
                          {keeper.user_id._id === props.user.user.id ? (
                            <DeleteAd
                              id={keeper._id}
                              setAllKeepers={setAllKeepers}
                              allKeepers={allKeepers}
                              setAllKeepersfiltered={setAllKeepersfiltered}
                              allKeepersfiltered={allKeepersfiltered}
                            ></DeleteAd>
                          ) : null}
                        </div>
                      ) : null}
                    </>
                  </div>
                  {objImg.find((el) => el.id === keeper._id) ? (
                    <Link
                      className={styleDonationads.containerLink}
                      to={{ pathname: `/keeper/${keeper._id}` }}
                    >
                      <img
                        className={styleDonationads.imageAd}
                        alt="animals"
                        src={`data:image/png;base64,${objImg.find((el) => el.id === keeper._id).pic
                          }`}
                      />
                    </Link>
                  ) : null}
                  <div className={styleDonationads.bottomItemCard}>
                    <div className={styleDonationads.locationItemCard}>
                      <img
                        src={marker}
                        alt="marker"
                        style={{ width: "0.8rem", marginRight: 20 }}
                      />
                      <p>{keeper.zipCode}</p>
                    </div>
                    <div className={styleDonationads.locationItemCard}>
                      <svg style={{ width: "1.6rem", marginRight: 12, paddingRight: 8 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <p>From : {keeper.user_id.username}</p>
                    </div>
                    <p className={styleDonationads.dateItemCard}>
                      {" "}
                      <span className={styleDonationads.wordItemCard}>
                        Start
                      </span>{" "}
                      {keeper.start}
                    </p>
                    <p className={styleDonationads.dateItemCard}>
                      {" "}
                      <span className={styleDonationads.wordItemCard}>
                        End
                      </span>{" "}
                      {keeper.end}
                    </p>
                  </div>
                </div>
              ) : null;
            })}
          </div>
          <Pagination
            adsPerPage={keeperAdsPerPage}
            totalAds={allKeepers.length}
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

export default connect(mapStateToProps)(KeeperAds);
