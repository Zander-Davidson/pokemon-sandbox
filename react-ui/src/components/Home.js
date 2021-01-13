import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../styling/master.scss';

export default function Home() {
    return (
        <div className="home-page-wrapper">
            <div>
                <div className="home-card">
                    <h2>Find your Perfect Pokemon</h2>
                    <p>Refine your Pokemon search with custom filters and sorting in the
                        <Link to='/pokedex'>{' '}Pokedex{' '}</Link> or <Link to='/movedex'>{' '}Movedex</Link>!
                    </p>
                </div>
                <div className="home-card">
                    <h2>About this Project</h2>
                    <p>
                        This website is developed and maintained by Zander Davidson. Check out my other work at <a href="https://zanderdavidson.dev">zanderdavidson.dev</a>.
                        Email me at alexander.davidson98@gmail.com for any questions or comments.
                    </p>
                    <p>
                        <h4>Neo4j Graph Database</h4>
                        <p>
                            All Pokemon data was pulled from <a href="https://pokeapi.co/">PokeApi</a> and inserted into
                            a <a href="https://neo4j.com/">Neo4j</a> graph database. A graph database was perfect for this use case due to the interrelated
                            nature of Pokemon game data. For example, there are hundreds of Pokemon, each having a handful of attributes
                            and learning dozens of moves from a large pool, and moves themselves have their own attributes. Neo4j
                            provides a more flexible database that accommodates this kind of data, and <a href="https://neo4j.com/developer/cypher/">Cypher</a> queries makes
                            for natural data navigation.
                        </p>
                        <h4>Node.js Back End</h4>
                        <p>
                            A <a href="https://nodejs.org/en/">Node.js</a> back end serves the React app and handles all HTTP queries for Pokemon data.
                            The Cypher queries used for this project remained relatively small, so they are written
                            in the source code instead of Java stored procedures.
                        </p>
                        <h4>React/Redux Front End</h4>
                        <p>
                            On your end, the <Link to='/pokedex'>{' '}Pokedex{' '}</Link> and <Link to='/movedex'>{' '}Movedex</Link>{' '} let you harness
                            the speed of Cypher queries using a familiar, filter-based search interface.
                        </p>
                        <p>
                            I am in no way affiliated with Nintendo, The Pokemon Company, Gamefreak, Creatures Inc., or any other
                            associates related to the Pokemon brand and games. Pokemon Sandbox is free to use and makes no money from advertising
                            or any other source. This website does not collect userdata or store browser cookies.
                        </p>   
                    </p>
                </div>
            </div>
        </div>
    )
}