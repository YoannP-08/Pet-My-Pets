import React,{useState} from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { addUser } from "../../actions/userAction"
import styleUser from "../../styles/Users.module.css"
import Cross from "../../assets/close.svg"


const AdUserModal = ({close,addUser}) =>{


    const [firstname, setFirstName ] = useState("")
    const [lastname, setLastName ] = useState("")
    const [username, setUsername ] = useState("")
    const [email, setEmail ] = useState("")
    const [address, setAddress ] = useState("")
    const [city, setCity ] = useState("")
    const [zipCode, setZipCode ] = useState("")
    const [password, setPassword ] = useState("")
    const [isAdmin, setIsAdmin ] = useState(false)

    const submitForm = (e) => {
        e.preventDefault()
        //User obj//
        let newUser = {
            firstname,
            lastname,
            username,
            email,
            address,
            city,
            zipCode,
            password,
            isAdmin
        }


        addUser(newUser)

        setFirstName("")
        setLastName("")
        setUsername("")
        setEmail("")
        setAddress("")
        setCity("")
        setZipCode("")
        setPassword("")
        setIsAdmin(false)

        close()


    }

    return(
        <div className={styleUser.addModalContainer}>
            <div className={styleUser.headerAddModal}>
                <h1>Add User</h1>
                <img  onClick={() => close()} src={Cross} alt="close"/>
            </div>
                <form onSubmit={submitForm}>
                    <div>
                        <label>Firstname</label>
                        <input type="text" name="firstname" value={firstname} onChange={(e) => setFirstName(e.target.value)}/>
                    </div>
                    <div>
                        <label>Lastname</label>
                        <input type="text" name="lastname" value={lastname} onChange={(e) => setLastName(e.target.value)}/>
                    </div>
                    <div>
                        <label>Username</label>
                        <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                    <div>
                        <label>Email</label>
                        <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div>
                        <label>Address</label>
                        <input type="text" name="address" value={address} onChange={(e) => setAddress(e.target.value)}/>
                    </div>
                    <div>
                        <label>City</label>
                        <input type="city" name="city" value={city} onChange={(e) => setCity(e.target.value)}/>
                    </div>
                    <div>
                        <label>Zip</label>
                        <input type="text" name="zip" value={zipCode} onChange={(e) => setZipCode(e.target.value)}/>
                    </div>
                    <div>
                        <label>Password</label>
                        <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <div>
                        <label>isAdmin</label>
                        <input type="checkbox" name="isAdmin" value={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)}/>
                    </div>
                    <button>New User</button>
                </form>
            </div>
    )
}


const mapDispatch = (dispatch) => bindActionCreators({
    addUser
},dispatch)

export default connect(null,mapDispatch)(AdUserModal)