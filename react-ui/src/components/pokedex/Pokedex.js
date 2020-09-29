import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchPokemon } from '../../redux/actions/pokemonActions'
import LoadSpinner from '../tools/LoadSpinner'
import PokemonTable from './PokemonTable';
import styles from '../../styling/master.scss';

export default function Pokedex() {
    const dispatch = useDispatch();
    const { fetched } = useSelector(state => state.pokemon);
    const { fetching } = useSelector(state => state.pokemon);
    const { items } = useSelector(state => state.pokemon);

    useEffect(() => {
        if (!fetched && !fetching)
            dispatch(fetchPokemon());
    })

    return (
        <div className="page">
            <LoadSpinner isLoading={!fetched || fetching}>
                <PokemonTable pokemon={items} />
            </LoadSpinner>
        </div>
    )
}