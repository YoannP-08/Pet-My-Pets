import React, { useEffect } from "react";
import { connect } from 'react-redux';
import DonationAd from "./donationAd/donationAd";
import { Link } from "react-router-dom";
import styleHome from "../styles/Home.module.css"

const Home = () => {

    useEffect(() => {
        document.body.style.background = "#2f3542"

    }, [])

    return (
        <div>
            <div className={styleHome.allLinks} >
                <Link className={styleHome.link} to="/keeper">Keeper Ad</Link>
                <span className={styleHome.separation} >|</span>
                <Link className={styleHome.linkHome} to="/"> Donations </Link>
            </div>
            <DonationAd/>
        </div>
    )
};
const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.userDetails
})

export default connect(
    mapStateToProps
)(Home);
