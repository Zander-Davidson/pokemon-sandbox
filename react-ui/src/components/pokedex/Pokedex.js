import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchPokemons } from '../../actions/pokemonsActions'
import LoadSpinner from '../tools/LoadSpinner'
import PokemonTable from './PokemonTable';

class Pokedex extends Component {
    componentWillMount() {
        if (!this.props.fetched && !this.props.fetching)
            this.props.fetchPokemons()
    }

    render() {
        let content = this.props.fetching ?
            <LoadSpinner/> :
            <PokemonTable pokemon={this.props.pokemons}/>

        return content
    } 
}

Pokedex.propTypes = {
    fetchPokemons: PropTypes.func.isRequired,
    pokemons: PropTypes.array.isRequired,
    fetching: PropTypes.bool.isRequired,
    fetched: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
    pokemons: state.pokemons.items,
    fetching: state.pokemons.fetching,
    fetched: state.pokemons.fetched
})

export default connect(mapStateToProps, { fetchPokemons })(Pokedex)