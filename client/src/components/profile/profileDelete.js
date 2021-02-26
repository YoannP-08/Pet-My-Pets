import React from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import { userDeleteAccount } from '../../actions/authActions';
import styleDelete from '../../styles/profile/DeleteAccount.module.css';
import Swal from 'sweetalert2';

const DeleteProfile = ( { user, userDeleteAccount } ) => {

    const history = useHistory();

    const deleteAccount = async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/users/${user.user.id}`, {
                    headers: {
                        'x-auth-token': user.token
                    }
                });
                
              Swal.fire(
                'Deleted!',
                'Your account has been deleted.',
                'success'
              )
              history.push("/");
              userDeleteAccount();
            }
          })
    };

    return (
        <div className={styleDelete.container}>
            <button className={styleDelete.button} onClick={deleteAccount} >
                Delete Account
            </button>
        </div>
    );
};

const mapDispatch = (dispatch) => bindActionCreators({
    userDeleteAccount
}, dispatch)

export default connect(null, mapDispatch)(DeleteProfile);
