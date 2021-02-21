import axios from "axios";
import { useState, useEffect, useContext } from "react";
import AppContext from "../../context/app-context";


const Auth = (props) => {
    const { decidee, setDecidee, message } = useContext(AppContext)
    const [registerView, setRegisterView] = useState(false)

    const [input, setInput] = useState({
        userOrEmail: '',
        password: '',
        username: '',
        email: ''

    })

    const handleChange = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
    }

    const clearInput = () => {
        setInput({
            userOrEmail: '',
            password: '',
            username: '',
            email: ''
        })
    }

    useEffect(() => {
        axios.get('/auth/user')
            .then(res => setDecidee(res.data))
            .catch(err => console.log(err))
    }, [])



    const handleRegister = () => {
        axios.post('/auth/register', { username: input.username, email: input.email, password: input.password })
            .then(res => {
                // console.log('TAS', res.data)
                setDecidee(res.data)
                clearInput()
            })
            .catch(err => {
                console.log('TAS', err)
            })
    }

    const handleLogin = () => {
        axios.post('/auth/login', { userOrEmail: input.userOrEmail, password: input.password })
            .then(res => {
                // console.log('TAS', res.data)
                setDecidee(res.data)
                clearInput()
            })
            .catch(err => {
                console.log('TAS', err)
            })
    }

    useEffect(() => {
        if (decidee !== null) {
            props.history.push('/dash')
        }
        else {
            props.history.push('/')
        }
    }, [decidee])

    return (
        <div>
            <h1>Welcome to Hungree!</h1>
            <h3>When you are Hungry but need to Agree</h3>
            <h3>Login</h3>
            {!registerView
                ?
                (
                    <>
                        <label>Username/Email</label>
                        <input type="text" name="userOrEmail" value={input.userOrEmail} onChange={handleChange}></input>
                        <label>Password</label>
                        <input type="password" name="password" value={input.password} onChange={handleChange}></input>
                        <button onClick={handleLogin}>Login</button>
                    </>
                )
                :
                (
                    <>
                        <label>Email</label>
                        <input type="email" name="email" value={input.email} onChange={handleChange}></input>
                        <label>Username</label>
                        <input type="text" name="username" value={input.username} onChange={handleChange}></input>
                        <label>Password</label>
                        <input type="password" name="password" value={input.password} onChange={handleChange}></input>
                        <button onClick={handleRegister}>Register</button>
                    </>
                )}
            <button onClick={() => setRegisterView(!registerView)}>Toggle</button>
        </div>
    )

}

export default Auth;