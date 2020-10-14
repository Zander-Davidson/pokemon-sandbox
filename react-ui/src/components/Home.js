import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../styling/master.scss';

export default function Home() {
    return (
        <div className="home-page-wrapper">
            <div>
                <div className="home-card">
                    <h2>Explore</h2>
                    <p>Refine your Pokemon search with custom filters and sorting in the
                        <Link to='/pokedex'>{' '}Pokedex{' '}</Link> or <Link to='/movedex'>{' '}Movedex</Link>!
                    </p>
                </div>
                <div className="home-card">
                    <h2>Build</h2>
                    <p>(Coming soon) Build the competitive Pokemon team of your dreams with the
                        <Link to='/teambuilder'>{' '}Teambuilder</Link>.
                        Create a free account to save your teams in the cloud!
                    </p>
                </div>
                <div className="home-card">
                    <h2>Share</h2>
                    <p>(Coming soon) Browse teams created by the Pokemon Sandbox community,
                        and publish your own to share the love :)
                    </p>
                </div>
            </div>
        </div>
    )
}