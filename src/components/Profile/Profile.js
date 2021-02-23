import axios from "axios";
import { useState, useEffect, useContext } from "react";
import AppContext from "../../context/app-context";
import Upload from './Upload/Upload';

const Profile = (props) => {
    const { decidee, setDecidee } = useContext(AppContext)

    const [editView, setEditView] = useState(false)



    const [input, setInput] = useState({
        username: '',
        email: ''

    })

    const handleChange = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
    }

    const handleUpdatedUserInfo = () => {
        console.log('TAS', 'Hello')
        let paraUsername = input.username === '' ? decidee.username : input.username
        let paraEmail = input.email === '' ? decidee.email : input.email
        console.log(paraUsername, paraEmail)
        axios.put(`/auth/user/${decidee.decidee_id}`, { username: paraUsername, email: paraEmail })
            .then(res => {
                console.log(res.data)
                setDecidee(res.data)
            })
            .catch(err => {
                console.log('TAS', err)
            })
    }



    const handleLogout = () => {
        axios.get('/auth/logout')
            .then(res => {
                // console.log('TAS', res.data)
                setDecidee(null)

            })
            .catch(err => {
                console.log('TAS', err)
            })
    }

    useEffect(() => {

        if (decidee === null) {
            console.log('TAS', decidee)
            props.history.push('/')
        }

    }, [decidee])



    return (
        <div>
            {editView
                ?
                (
                    <>
                        <h1>{decidee?.username}</h1>
                        <label>Username</label>
                        <input type="text" name="username" value={input.username} onChange={handleChange}></input>
                        <Upload 
                            decideeId={decidee?.decidee_id}
                            setDecidee={setDecidee}/>
                        <h1>Email: {decidee?.email}</h1>
                        <label>New Email</label>
                        <input type="email" name="email" value={input.email} onChange={handleChange}></input>
                        <button onClick={handleUpdatedUserInfo}>Update New Info</button>
                        <h1>Friend Code: {decidee?.decidee_id}</h1>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                )
                :
                (
                    <>
                        <h1>{decidee?.username}</h1>
                        <img src={decidee?.profile_pic} />
                        <h1>Email: {decidee?.email}</h1>
                        <h1>Friend Code: {decidee?.decidee_id}</h1>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                )}
            <button onClick={() => setEditView(!editView)}>Toggle</button>
        </div>

    )
}

export default Profile