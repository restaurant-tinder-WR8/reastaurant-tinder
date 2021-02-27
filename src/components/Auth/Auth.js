import axios from "axios";
import { useState, useEffect, useContext } from "react";
import AppContext from "../../context/app-context";
import logo from '../../assets/hungree.svg'
import './Auth.scss'


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
            <div className="login-master-container">
            <section className="login-section">
            <h1>Welcome to Hungree!</h1>
            
            {!registerView
                ?
                (
                    <>
                        <h3>Login</h3>
                        <input type="text" name="userOrEmail" placeholder="Username/Email" value={input.userOrEmail} onChange={handleChange}></input>
                        <input type="password" name="password" placeholder="Password" value={input.password} onChange={handleChange}></input>
                        <button onClick={handleLogin}>Login</button>
                        <p>Don't have an account? <span onClick={() => setRegisterView(!registerView)}>Register here.</span></p>
                    </>
                )
                :
                (
                    <>
                        <h3>Register</h3>
                        <input type="email" name="email" placeholder="Email" value={input.email} onChange={handleChange}></input>
                        <input type="text" name="username" placeholder="Username" value={input.username} onChange={handleChange}></input>
                        <input type="password" name="password" placeholder="Password" value={input.password} onChange={handleChange}></input>
                        <button onClick={handleRegister}>Register</button>
                        <p>Have an account? <span onClick={() => setRegisterView(!registerView)}>Login here.</span></p>
                    </>
                )}
           
            </section>
            </div>
            <div className="logo-master-container">
            <section className="logo-container">
            <img src={logo} alt='Logo' className='Logo'/>
            <h1>hungree</h1>
            </section>
            </div>
        </div>
    )

}

export default Auth;