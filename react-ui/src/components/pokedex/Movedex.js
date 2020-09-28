import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchMoves } from '../../redux/actions/movesActions'
import LoadSpinner from '../tools/LoadSpinner'
import MoveTable from './MoveTable';

export default function Movedex() {
    const dispatch = useDispatch();
    const { movesFetched } = useSelector(state => state.moves);
    const { fetchingMoves } = useSelector(state => state.moves);
    const { items } = useSelector(state => state.moves);

    useEffect(() => {
        if (!movesFetched && !fetchingMoves)
            dispatch(fetchMoves());
    })

    return (
        <LoadSpinner isLoading={!movesFetched || fetchingMoves}>
            <MoveTable moves={items} />
        </LoadSpinner>
    )
}