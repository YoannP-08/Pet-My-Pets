import React, { useState } from "react"
import styleUsers from "../../styles/Users.module.css"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { removeUser } from "../../actions/userAction"
import AdUserModal from "../admin/AdUserModal"
import { Link } from "react-router-dom"
import Pagination from "./Pagination"
import Avatar from "../../assets/avatar.svg"




const Users = ({ usersPerPage, totalUsers, paginate, users, removeUser }) => {

    const [isOpen, setIsOpen] = useState(false)

    const deleteUser = (id) => {
        removeUser(id)

    }

    const openModal = () => {
        setIsOpen(!isOpen)
    }


    return (
        <div className={styleUsers.containerUsers}>
            <div className={styleUsers.background}>
                <div className={styleUsers.containerLogo}>
                    <h1>Users</h1>
                </div>
                <div className={styleUsers.btnDashboard}>
                    <button onClick={openModal}>New User</button>
                </div>
                {isOpen &&
                    <div className={styleUsers.transition}>
                        <div className={styleUsers.containerAddUser}>
                            <AdUserModal open={isOpen} close={setIsOpen} />
                        </div>
                        <div className={styleUsers.overlay}></div>
                    </div>
                }
                <div className={styleUsers.fullHeight}>
                    <table className={styleUsers.adminTable}>
                        <thead className={styleUsers.tableHead}>
                            <tr>
                                <th className={styleUsers.titleTab}><p>Name</p></th>
                                <th className={styleUsers.titleTab}><p>email</p></th>
                                <th className={styleUsers.titleTab}><p>Admin</p></th>
                                <th className={styleUsers.titleTab}><p>Delete User</p></th>
                            </tr>
                        </thead>
                        <tbody className={styleUsers.tableBody}>
                            {users.map((user, index) => (
                                <tr key={index}>
                                    <td>
                                        <Link className={styleUsers.profileOne} to={`/admin/dashboard/users/${user._id}`}>
                                            <img src={Avatar} alt="avatar" />
                                            <div>
                                                <span>{user.firstname}</span>
                                                <span>{user.lastname}</span>
                                            </div>
                                        </Link>
                                    </td>
                                    <td><Link className={styleUsers.profile} to={`/admin/dashboard/users/${user._id}`}>{user.email}</Link></td>
                                    {user.isAdmin === false ? (
                                        <td><Link className={styleUsers.profile} to={`/admin/dashboard/users/${user._id}`}>False</Link></td>
                                    ) : (
                                            <td><Link className={styleUsers.profile} to={`/admin/dashboard/users/${user._id}`}>True</Link></td>
                                        )}
                                    <td className={styleUsers.tdBtn}><div><button onClick={() => deleteUser(user._id)}>Delete</button></div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination usersPerPage={usersPerPage} totalUsers={totalUsers} paginate={paginate} />
            </div>
        </div>
    )
}

const mapDispatch = (dispatch) => bindActionCreators({
    removeUser
}, dispatch)


export default connect(null, mapDispatch)(Users)