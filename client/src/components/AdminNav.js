import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux";
import styleNav from "../styles/NavBar.module.css"
import { Link, useHistory } from "react-router-dom"
import logoutIcon from "../assets/logout.svg"
import users from "../assets/user.svg"
import dashboard from "../assets/dashboard.svg"
import ads from "../assets/ads.svg"
import posts from "../assets/post.svg"
import report from "../assets/report.svg"
import { logout } from "../actions/authActions";


const AdminNav = ({ logout }) => {
    const history = useHistory();

    const triggerLogout = () => {
        history.push("/");
        logout();
    };

    return (
        <div className={styleNav.adminNav}>
            <div className={styleNav.adminNavLogo}>
                <h2>PetMyPets</h2>
            </div>
            <div className={styleNav.adminNavLink}>
                <div className={styleNav.link}>
                    <div>
                        <img className={styleNav.dashboard} src={dashboard} alt="dashboard" />
                        <Link to="/admin/dashboard"><li>Dashboard</li></Link>
                    </div>
                    <div>
                        <img className={styleNav.users} src={users} alt="users" />
                        <Link to="/admin/dashboard"><li>Users</li></Link>
                    </div>
                    <div>
                        <img className={styleNav.posts} src={posts} alt="posts" />
                        <Link to="/admin/dashboard/posts"><li>Posts</li></Link>
                    </div>
                    <div>
                        <img className={styleNav.ads} src={ads} alt="adsOne" />
                        <Link to="/admin/dashboard/donationads"><li>Donation Ads</li></Link>
                    </div>
                    <div>
                        <img className={styleNav.ads} src={ads} alt="adsTwo" />
                        <Link to="/admin/dashboard/keeperads"><li>Keeper Ads</li></Link>
                    </div>
                    <div>
                        <img className={styleNav.ads} src={report} alt="reports" />
                        <Link to="/admin/dashboard/reports"><li>Reports</li></Link>
                    </div>
                    <div>
                        <img className={styleNav.ads} src={ads} alt="adsThree" />
                        <a href="/"><li>Website</li></a>
                    </div>
                </div>
                <div className={styleNav.adminLogOut}>
                    <img src={logoutIcon} alt="logout" />
                    <a onClick={triggerLogout} style={{ fontSize: '18px', cursor: 'pointer ', paddingLeft: '3%', paddingTop: '4%', textDecoration: 'none', color: 'black' }} href="/"> Logout </a>
                </div>
            </div>
        </div>
    )
}

const mapDispatch = (dispatch) => bindActionCreators({
    logout
}, dispatch)

export default connect(null, mapDispatch)(AdminNav);
