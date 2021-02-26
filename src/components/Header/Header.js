import { withRouter, Link } from 'react-router-dom'
import logo from '../../assets/hungree.svg'
import './Header.scss'

const Header = (props) => {

    return (
        <>
            {props.location.pathname === '/dash' || props.location.pathname === '/profile'
                ? (
                    <header className='header-container'>

                        <div className='title-container'>
                            <img src={logo} alt="Logo" className='logo' />
                            <h1 className="title">hungree</h1>
                        </div>

                        {props.location.pathname !== '/dash'
                            ? (
                                <nav>
                                    <Link to='/dash' className='nav-links'>Dashboard</Link>
                                </nav>
                            ) :
                            <nav>
                                <Link to='/profile' className='nav-links'>Profile</Link>
                            </nav>
                        }
                    </header>
                ) : null}
        </>
    )
}

export default withRouter(Header)