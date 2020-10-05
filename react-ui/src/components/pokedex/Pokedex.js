import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchPokemonNames } from '../../redux/actions/pokemonActions';
import { fetchMoveNames } from '../../redux/actions/movesActions';
import { fetchAbilityNames } from '../../redux/actions/abilitiesActions';
import { fetchTypes } from '../../redux/actions/typesActions';
import PokemonTable from './PTable';
import PokemonSearchPanel from './PokemonSearchPanel';
import styles from '../../styling/master.scss';

export default function Pokedex() {
    const dispatch = useDispatch();
    const { typeData } = useSelector(state => state.types);
    const { pokemonNames } = useSelector(state => state.pokemon);
    const { abilityNames } = useSelector(state => state.abilities);
    const { moveNames } = useSelector(state => state.moves);

    useEffect(() => {
        if (pokemonNames.length === 0 || typeData.length === 0 
            || abilityNames.length === 0 || moveNames.length === 0) {
            dispatch(fetchPokemonNames());
            dispatch(fetchTypes());
            dispatch(fetchMoveNames());
            dispatch(fetchAbilityNames());
        }
    }, []);

    return (
        <div className="pokedex-wrapper">
            <PokemonSearchPanel
                pokemonNames={pokemonNames}
                typeData={typeData}
                moveNames={moveNames}
                abilityNames={abilityNames}
            />
            <PokemonTable/>
        </div>
    )
}