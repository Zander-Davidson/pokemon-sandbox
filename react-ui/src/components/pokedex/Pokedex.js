import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchPokemon } from '../../redux/actions/pokemonActions'
import LoadSpinner from '../tools/LoadSpinner'
import PokemonTable from './PokemonTable';

export default function Pokedex() {
    const dispatch = useDispatch();
    const { pokemonFetched } = useSelector(state => state.pokemon);
    const { fetchingPokemon } = useSelector(state => state.pokemon);
    const { items } = useSelector(state => state.pokemon);

    useEffect(() => {
        if (!pokemonFetched && !fetchingPokemon)
            dispatch(fetchPokemon());
    })

    return (
        <LoadSpinner isLoading={!pokemonFetched || fetchingPokemon}>
            <PokemonTable pokemon={items} />
        </LoadSpinner>
    )
}