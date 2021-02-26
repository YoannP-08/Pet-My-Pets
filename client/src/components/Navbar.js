import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link, useHistory } from "react-router-dom";
import styleNavBar from "../styles/NavBar.module.css";
import { logout } from '../actions/authActions';
import useModal from "../Authentication/UseModal";
import ModalSignIn from "../Authentication/ModalSignIn";
import ModalSignUp from "../Authentication/ModalSignUp";
import AdminNav from "../components/AdminNav";


const Navbar = ({ logout, user }) => {
    const history = useHistory();

    const triggerLogout = () => {
        history.push("/");
        logout();
    };

    const { isShowing: isLoginFormShowed, toggle: toggleLoginForm } = useModal();
    const { isShowing: isRegistrationFormShowed, toggle: toggleRegistrationForm } = useModal();

    let userDetails
    if (localStorage.getItem("user")) {
        userDetails = JSON.parse(localStorage.getItem("user"));
    }

    return (
        <div className={window.location.href.includes("/admin/dashboard") && styleNavBar.adminWidth}>
            {
                userDetails ? (
                    <div >
                        {
                            window.location.href.includes("/admin/dashboard") ? (
                                <AdminNav />
                            ) : (
                                    <div className={styleNavBar.containerNav}>
                                        <div className={styleNavBar.containerLogo}>
                                            <h3>PetMyPets</h3>
                                        </div>
                                        <div className={styleNavBar.containerLink}>
                                            <ul>
                                                <Link style={{ paddingRight: '3%' }} to="/"><li>Home</li></Link>
                                                <Link style={{ paddingRight: '3%' }} to="/profile"><li>Profile</li></Link>
                                                <Link style={{ paddingRight: '3%' }} to="/vet"><li>Vet</li></Link>
                                                <Link style={{ paddingRight: '3%' }} to="/forum"><li>Forum</li></Link>
                                                <a  style={{display:userDetails.user.isAdmin ? "block" :"none",paddingRight: '3%' }}href="/admin/dashboard"><li>Admin</li></a>
                                                <li onClick={triggerLogout} style={{ fontSize: '18px', cursor: 'pointer ', paddingLeft: '3%' }}> Logout </li>

                                            </ul>
                                        </div>
                                    </div>
                                )
                        }
                    </div >
                ) : (
                        <div className={window.location.href.includes("/admin/dashboard") ? styleNavBar.none : styleNavBar.containerNav}>
                            <div className={styleNavBar.containerLogo}>
                                <h3>PetMyPets</h3>
                            </div>
                            <div className={styleNavBar.containerLink}>
                                <ul>
                                    <Link style={{ paddingRight: '3%' }} to="/"><li>Home</li></Link>
                                    <li style={{ fontSize: '18px', cursor: 'pointer', paddingRight: '3%' }} onClick={toggleLoginForm}>SignIn</li>
                                    <ModalSignIn isShowing={isLoginFormShowed} hide={toggleLoginForm} />
                                    <li style={{ fontSize: '18px', cursor: 'pointer', paddingRight: '3%' }} onClick={toggleRegistrationForm}>SignUp</li>
                                    <ModalSignUp isShowing={isRegistrationFormShowed} hide={toggleRegistrationForm} />
                                    <Link style={{ paddingRight: '3%' }} to="/vet"><li>Vet</li></Link>
                                    <Link style={{ paddingRight: '3%' }} to="/forum"><li>Forum</li></Link>
                                </ul>
                            </div>
                        </div>

                    )}
        </div >
    )
};

const mapStateToProp = state => ({
    user: state.auth.userDetails
})


const mapDispatch = (dispatch) => bindActionCreators({
    logout
}, dispatch)

export default connect(mapStateToProp, mapDispatch)(Navbar);
