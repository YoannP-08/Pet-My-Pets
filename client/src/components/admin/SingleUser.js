import React, { useEffect, useState } from "react";
import styleSingle from "../../styles/SingleUser.module.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getOneUser,updateUser } from "../../actions/userAction";
import Avatar from "../../assets/avatar.svg"

const SingleUser = (props) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    document.body.style.background = "white";
    document.getElementsByClassName("App")[0].style.display = "flex";
    props.getOneUser(props.match.params.id);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setUser(props.user);
  }, [props.user]);


  const handleChange = (e) => {
    console.log( e.target.checked )
    setUser(user.isAdmin = e.target.checked )
    setUser({ ...user, [e.target.name]: e.target.value});


  };

  const onClick = () => {
    console.log(user)

    props.updateUser(user)
  }

  return (
    <div className={styleSingle.containerSingleUser}>
      <div className={styleSingle.containerBorder}>
        <div className={styleSingle.form}  onChange={handleChange}>
          <div className={styleSingle.containerAvatar}>
            <img src={Avatar} alt="avatar"></img>
          </div>
          <div>
            <label>First name</label>
            <input name="firstname" defaultValue={user.firstname || ""}></input>
          </div>
          <div>
            <label>Last name</label>
            <input name="lastname" defaultValue={user.lastname || ""}></input>
          </div>
          <div>
            <label>Username name</label>
            <input name="username" defaultValue={user.username || ""}></input>
          </div>
          <div>
            <label>Email</label>
            <input name="email" defaultValue={user.email || ""}></input>
          </div>
          <div>
            <label>Address</label>
            <input name="address" defaultValue={user.address || ""}></input>
          </div>
          <div>
            <label>City</label>
            <input name="city" defaultValue={user.city || ""}></input>
          </div>
          <div>
            <label>Postal code</label>
            <input name="zipCode" defaultValue={user.zipCode || ""}></input>
          </div>
            {user.isAdmin ? (
              <div>
                  <label>Admin</label>
                  <input type="checkbox" name="checkbox" defaultChecked={true}></input>
              </div>
            ):(
            <div>
                <label>Admin</label>
                <input type="checkbox" name="checkbox"></input>
              </div>
            )
            }
          <button onClick={onClick}>Update User</button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProp = (state) => ({
  user: state.users.user,
});

const mapDispatch = (dispatch) =>
  bindActionCreators(
    {
      getOneUser,
      updateUser,
    },
    dispatch,
  );

export default connect(mapStateToProp, mapDispatch)(SingleUser);
