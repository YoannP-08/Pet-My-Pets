import React,{Fragment, useEffect,useState} from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { getAllUsers } from "../../actions/userAction"
import Users from "./Users"




const Dashboard = (props) => {

    const [currentPage, setCurrentPage] = useState(1)
    const [usersPerPage] = useState(6)

    useEffect(() =>{
        props.getAllUsers()
        document.body.style.background = "white"
        document.getElementsByClassName("App")[0].style.display = "flex"

        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
 
    const indexOfLasUser =  currentPage * usersPerPage
    const indexOfLastFirstUser = indexOfLasUser - usersPerPage 
    const currentUsers = props.users.slice(indexOfLastFirstUser,indexOfLasUser)

    //Change page//

    const paginate = (pageNumber) => setCurrentPage(pageNumber)



    return(
        <Fragment>
                    <Users users={currentUsers} usersPerPage={usersPerPage} totalUsers={props.users.length} paginate={paginate}  />
        </Fragment>
    )
}

const mapStateToProp = state => ({
    users: state.users.users,
})

const mapDispatch = (dispatch) => bindActionCreators({
    getAllUsers
},dispatch)

export default connect(mapStateToProp,mapDispatch)(Dashboard)