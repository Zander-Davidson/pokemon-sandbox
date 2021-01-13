import React  from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import sandygast from '../sandygast.png'
import styles from '../styling/master.scss'
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';

export default function Header() {
    const dispatch = useDispatch();

    let history = useHistory();

    return (
        <div className='header'>
            <Navbar style={{padding: '0px 0px 0px 0px'}} expand="lg">
                <Link className='a' to="/home"><img className="logo" src={sandygast} /></Link>
                <Navbar.Brand style={{color:'white'}} href="/home">Pokemon Sandbox</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Link className='a' to="/home">Home</Link>
                        <Link className='a' to="/pokedex">Pokedex</Link>
                        <Link className='a' to="/movedex">Movedex</Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}