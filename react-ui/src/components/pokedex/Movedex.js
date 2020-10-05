import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchPokemonNames } from '../../redux/actions/pokemonActions';
import { fetchMoveNames, fetchDamageClassNames } from '../../redux/actions/movesActions';
import { fetchTypes } from '../../redux/actions/typesActions';
import MoveTable from './MTable';
import MoveSearchPanel from './MoveSearchPanel';
import styles from '../../styling/master.scss';

export default function Movedex() {
    const dispatch = useDispatch();
    const { typeData } = useSelector(state => state.types);
    const { pokemonNames } = useSelector(state => state.pokemon);
    const { moveNames } = useSelector(state => state.moves);
    const { damageClassNames } = useSelector(state => state.moves);

    useEffect(() => {
        if (pokemonNames.length === 0 || typeData.length === 0 
            || moveNames.length === 0 || damageClassNames.length === 0) {
            dispatch(fetchPokemonNames());
            dispatch(fetchTypes());
            dispatch(fetchMoveNames());
            dispatch(fetchDamageClassNames());
        }
    }, []);

    return (
        <div className="pokedex-wrapper">
            <MoveSearchPanel
                pokemonNames={pokemonNames}
                typeData={typeData}
                moveNames={moveNames}
                damageClassNames={damageClassNames}
            />
            <MoveTable/>
        </div>
    )
}