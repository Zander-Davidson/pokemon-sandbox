import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchMoves } from '../../redux/actions/movesActions'
import LoadSpinner from '../tools/LoadSpinner'
import MoveTable from './MoveTable';

export default function Movedex() {
    const dispatch = useDispatch();
    const { fetched } = useSelector(state => state.moves);
    const { fetching } = useSelector(state => state.moves);
    const { items } = useSelector(state => state.moves);

    useEffect(() => {
        if (!fetched && !fetching)
            dispatch(fetchMoves());
    });

    return (
        <LoadSpinner isLoading={!fetched || fetching}>
            <MoveTable moves={items} />
        </LoadSpinner>
    )
}