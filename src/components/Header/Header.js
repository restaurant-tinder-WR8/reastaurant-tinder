import { withRouter, Link } from 'react-router-dom'
import './Header.scss'

const Header = (props) => {

    return(
        <header className='header-container'>
            <h1>Hungree</h1>
            {props.location.pathname !== '/dash'
            ? (
                <nav>
                <Link to='/dash' className='nav-links'>Dashboard</Link>
                </nav>
            ):  
                <nav>
                    <Link to='/profile' className='nav-links'>Profile</Link>
                </nav>
            }
        </header>
    )
}

export default withRouter(Header)