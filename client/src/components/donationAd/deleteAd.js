import React from 'react';
import { connect } from "react-redux";
import Swal from 'sweetalert2';
import axios from "axios";
import icondeletead from "../../assets/dustbin.svg"

const DeleteAd = (props) => {
    
    const deleteAd = () => {
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
                axios({
                    method: 'DELETE',
                    url: `/donationads/${props.id}`,
                    headers: {
                        'x-auth-token': props.user.token
                    },
                })
                props.setAllDonations(props.allDonations.filter((donation) => donation._id !== props.id))
                props.setAllDonationsfiltered(props.allDonationsfiltered.filter((donation) => donation._id !== props.id))
              Swal.fire(
                'Deleted!',
                'Your ad has been deleted.',
                'success'
              )
            }
          })
    }

    return (
        <img onClick={() => deleteAd()} src={icondeletead} alt="icondeletead" style={{ width: "1.3rem" }} />
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.userDetails
})

export default connect(
    mapStateToProps
)(DeleteAd);