import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import axios from 'axios';
import { Provider } from 'react-redux';
import store from './store';
import Dashboard from "./components/admin/Dashboard";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Forum from "./components/Forum/Forum";
import Vet from "./components/Vet/Vet";
import Donation from "./components/donationAd/donationAd";
import Keeper from "./components/keeperAd/keeperAd";
import SingleKeeper from "./components/keeperAd/singleKeeper"

import SingleUser from "./components/admin/SingleUser"
//import Ads from "../src/components/admin/Ads"
import DonationAds from "../src/components/admin/DonationAds"
import SingleDonationAd from "../src/components/admin/SingleDonationAd"
import KeeperAds from "../src/components/admin/KeeperAds"
import SingleKeeperAd from "../src/components/admin/SingleKeeperAd"
import Reports from "../src/components/admin/Reports"

import Posts from "../src/components/admin/Posts"
import SingleDonation from "./components/donationAd/singleDonation";
import SinglePost from "./components/admin/SinglePost"

import ResetPassword from './Authentication/ResetPassword';
import ResetPasswordHash from './Authentication/ResetPasswordHash'
import ProfileDashboard from './components/profile/profileDashboard';



import "./styles/App.css";

axios.defaults.baseURL = 'https://back-petsmypets.herokuapp.com/api/';
//axios.defaults.baseURL = 'http://localhost:4000/api/';


const App = () => {

  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/vet" exact component={Vet} />
            <Route path="/forum" exact component={Forum} />
            <Route path="/profile" exact component={ProfileDashboard} />
            <Route path="/donation" exact component={Donation} />
            <Route path="/keeper" exact component={Keeper} />
            <Route path="/admin/dashboard" exact component={Dashboard} />
            <Route path="/admin/dashboard/users/:id" exact component={SingleUser} />
            <Route path="/admin/dashboard/donationads" exact component={DonationAds} />
            <Route path="/admin/dashboard/donationads/:id" exact component={SingleDonationAd} />
            <Route path="/admin/dashboard/keeperads" exact component={KeeperAds} />
            <Route path="/admin/dashboard/keeperads/:id" exact component={SingleKeeperAd} />
            <Route path="/admin/dashboard/posts" exact component={Posts} />
            <Route path="/admin/dashboard/reports" exact component={Reports} />
            <Route path="/admin/dashboard/posts/:id" exact component={SinglePost} />
            <Route path="/donationads/:id" exact component={SingleDonation} />
            <Route path="/keeper/:id" exact component={SingleKeeper} />
            <Route path="/resetpassword" exact component={ResetPassword} />
            <Route path="/resetpassword/:id" exact component={ResetPasswordHash} />
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}

export default App

