import React from 'react'
import { Navbar, Nav, Button, Form, FormControl } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import sandygast from '../sandygast.png'
import styles from './styles.css'

export default function Header() {
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
                        <Link className='a' to="/team-builder">Team Builder</Link>
                        {/* <Link className='a' to="/damage-calculator">Damage Calculator</Link> */}
                    </Nav>
                    {/* <Form inline>
                        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                        <Button variant="outline-success">Search</Button>
                    </Form> */}
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}