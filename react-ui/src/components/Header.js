import React  from 'react'
import { Navbar, Nav, Button, Form, FormControl } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import sandygast from '../sandygast.png'
import styles from '../styling/master.scss'
import { logout } from "../redux/actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';

export default function Header() {
    const dispatch = useDispatch();

    const { isLoggedIn } = useSelector(state => state.auth);
    const { loggingIn } = useSelector(state => state.auth);
    const { signingUp } = useSelector(state => state.auth);
    const { username } = useSelector(state => state.auth);
    const { icon_url } = useSelector(state => state.auth);

    let history = useHistory();

    const handleLogin = () => {
        if (isLoggedIn) {
            dispatch(logout());
            history.push("/home");
            window.location.reload();
        } else {
            history.push("/login");
            window.location.reload();
        }
    }

    const handleSignup = () => {
        history.push("/signup");
        window.location.reload();
    }

    let signupButton = !isLoggedIn ? 
        <Button className="btn" onClick={handleSignup} variant="success">Sign up</Button> 
        : <span style={{color:'white', margin:'5px'}}><img className="icon" src={icon_url}/>{username}</span>;

    let loginButton = <Button className="btn" onClick={handleLogin} variant="light" disabled={loggingIn}>{isLoggedIn ? "Log out" : "Log in"}</Button>;

    return (
        <div className='header'>
            <Navbar style={{padding: '0px 0px 0px 0px'}} expand="lg">
                <Link className='a' to="/home"><img className="img" src={sandygast} /></Link>
                <Navbar.Brand style={{color:'white'}} href="/home">Pokemon Sandbox</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Link className='a' to="/home">Home</Link>
                        <Link className='a' to="/pokedex">Pokedex</Link>
                        <Link className='a' to="/movedex">Movedex</Link>
                        <Link className='a' to="/teambuilder">Team Builder</Link>
                        {/* <Link className='a' to="/damage-calculator">Damage Calculator</Link> */}
                    </Nav>
                    
                    {signupButton}
                    {loginButton}
                    {/* <Form inline>
                        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                        <Button variant="outline-success">Search</Button>
                    </Form> */}
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}