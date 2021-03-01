import axios from "axios";
import { useState, useEffect, useContext } from "react";
import AppContext from "../../context/app-context";
import { disconnectSocket } from '../../Sockets/ChatSocket';
import Upload from './Upload/Upload';
import './Profile.scss';

const Profile = (props) => {
    const { decidee, setDecidee } = useContext(AppContext);

    const [editInfoView, setEditInfoView] = useState(false);
    const [editPicView, setEditPicView] = useState(false);



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
        let paraUsername = input.username === '' ? decidee.username : input.username
        let paraEmail = input.email === '' ? decidee.email : input.email

        axios.put(`/auth/user/${decidee.decidee_id}`, { username: paraUsername, email: paraEmail })
            .then(res => {
                setDecidee(res.data)
            })
            .catch(err => {
                console.log('TAS', err)
            })
    }



    const handleLogout = () => {
        axios.get('/auth/logout')
            .then(res => {
                setDecidee(null)
                disconnectSocket();
            })
            .catch(err => {
                console.log('TAS', err)
            })
    }

    const togglePicView = () => {
        setEditPicView(!editPicView);
    }

    useEffect(() => {

        if (decidee === null) {
            props.history.push('/')
        }

    }, [decidee])



    return (
        <div className='Profile'>
            <h1 className='main-prof-title'>Profile</h1>
            <main className='profile-main'>
                {editPicView
                    ?
                    (
                        <div className='edit-pic-cont'>
                            <Upload
                                decideeId={decidee?.decidee_id}
                                setDecidee={setDecidee}
                                toggleFn={togglePicView} />
                            <button className='profile-btns pointer' onClick={togglePicView}>Cancel</button>
                        </div>
                    )
                    :
                    (
                        <div className='pic-container'>
                            <img className='profile-img' src={decidee?.profile_pic} />
                            <button className='profile-btns pointer' onClick={togglePicView}>Edit Picture</button>
                        </div>
                    )}
                <section className='profile-info-cont'>
                    {editInfoView
                        ?
                        (
                            <div className='profile-info'>
                                <h1>Username: {decidee?.username}</h1>
                                <label>Enter New Username:</label>
                                <input type="text" name="username" value={input.username} onChange={handleChange}></input>
                                <h1>Email: {decidee?.email}</h1>
                                <label>Enter New Email:</label>
                                <input type="email" name="email" value={input.email} onChange={handleChange}></input>
                                <button onClick={handleUpdatedUserInfo}>Update New Info</button>
                                <button className='profile-btns pointer' onClick={() => setEditInfoView(!editInfoView)}>Cancel</button>
                            </div>
                        )
                        :
                        (
                            <div className='profile-info'>
                                <h1>Username: {decidee?.username}</h1>
                                <h1>Email: {decidee?.email}</h1>
                                <h1>Friend Code: {decidee?.decidee_id}</h1>
                                <button className='profile-btns pointer' onClick={() => setEditInfoView(!editInfoView)}>Edit Info</button>
                            </div>
                        )}
                    <button className='profile-btns pointer' onClick={handleLogout}>Logout</button>
                </section>
            </main>
        </div>

    )
}

export default Profile;