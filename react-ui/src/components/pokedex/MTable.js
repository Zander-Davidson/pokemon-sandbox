import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchMoves, setMoveOffset } from '../../redux/actions/movesActions'
import LoadSpinner from '../tools/LoadSpinner'
import { StickyTable, Row, Cell } from 'react-sticky-table';
import { Button, ButtonGroup, ButtonToolbar, Dropdown, DropdownButton, ToggleButton } from 'react-bootstrap';
import styles from '../../styling/master.scss'

export default function PokemonTable(props) {
    const [rows, setRows] = useState([]);
    const [paginator, setPaginator] = useState();

    const dispatch = useDispatch();
    const { fetchingMoves, fetchedMoves, moveData, searchParams, offset, limit, total } = useSelector(state => state.moves);

    useEffect(() => {
        if (!fetchedMoves && !fetchingMoves)
            dispatch(fetchMoves());
    }, []);

    useEffect(() => {
        setRows([])
    }, [fetchingMoves, searchParams]);

    const handlePageClick = (value) => {
        let newPage = value;
        let newOffset;

        if (newPage === "inc" && offset + limit > total || newPage === "dec" && offset - limit < 0) {
            return;
        } else if (newPage === "inc") {
            newOffset = offset + limit;
        } else if (newPage === "dec") {
            newOffset = offset - limit;
        } else {
            newOffset = newPage;
        }

        dispatch(setMoveOffset(parseInt(newOffset)));
        dispatch(fetchMoves({
            offset: parseInt(newOffset),
            limit: limit,
            ...searchParams
        }));
    }

    useEffect(() => {
        let leadingButtons = [];
        let overflow = [];
        let trailingButtons = [];

        for (let i = 0; i < total; i += limit) {
            let page = parseInt((i / limit) + 1);
            if (page < 6) {
                leadingButtons.push(
                    <Button 
                        onClick={(e) => handlePageClick(e.target.value)}
                        active={i === offset} 
                        variant="light" 
                        size="sm"
                        value={i}
                    >{page}</Button>);
            } else if (total - i < limit) {
                trailingButtons.push(
                    <Button 
                        onClick={(e) => handlePageClick(e.target.value)}
                        active={i === offset} 
                        variant="light" 
                        size="sm"
                        value={i}
                    >{page}</Button>);
            } else {
                overflow.push(
                    <Dropdown.Item
                        active={i === offset} 
                        variant="light" 
                        size="sm"
                        eventKey={i}
                    >{page}</Dropdown.Item>);
            }
        }

        setPaginator(
            <ButtonToolbar style={{display: "flex row", justifyContent: "space-around"}} variant="light" size="sm">
                <h5>Movedex</h5>
                {total > 0 ? 
                    <span>{offset + 1}-{total > offset + limit ? offset + limit : total} of {total} moves</span>
                    : <span>0 results</span>
                }
                <ButtonGroup variant="light" size="sm" style={{padding: "0px 20px 0px 20px"}}>
                    <Button variant="light" size="sm" value={"dec"} onClick={(e) => handlePageClick(e.target.value)}>{'<'}</Button>
                    {leadingButtons}
                    {overflow.length > 0 ?
                        <DropdownButton variant="light" size="sm" as={ButtonGroup} onSelect={(e) => handlePageClick(e)} title=". . .">
                            {overflow}
                        </DropdownButton>
                        : null}
                    {trailingButtons}
                    <Button variant="light" size="sm" value={"inc"} onClick={(e) => handlePageClick(e.target.value)}>{'>'}</Button>
                </ButtonGroup>
            </ButtonToolbar>)
    }, [total, offset, limit, searchParams, moveData]);

    useEffect(() => {
        setRows(moveData.map(m => {
            return (
                <Row>
                    <Cell className="sticky-table-cell">
                        <span>{m.game_id}.{' '}{m.name}</span>
                    </Cell>
                    <Cell className="sticky-table-cell">
                        <div className="type-icon" style={{ backgroundColor: m.type.color }}>{m.type.name}</div>
                    </Cell>
                    <Cell className="sticky-table-cell">
                        <span>{m.damage_class}</span>
                    </Cell>
                    <Cell className="sticky-table-cell">
                        <span>{m.power}</span>
                    </Cell>
                    <Cell className="sticky-table-cell">
                        <span>{m.accuracy}</span>
                    </Cell>
                    <Cell className="sticky-table-cell">
                        <span>{m.priority}</span>
                    </Cell>
                    <Cell className="sticky-table-cell">
                        <span>{m.pp}</span>
                    </Cell>
                </Row>
            )
        }))
    }, [moveData])

    let tableStyle = {
        height: "auto",
        position: "relative",
        display: "flex column",
        alignContent: "center",
        justifyItems: "center",
        alignItems: "center",
        justifyContent: "center",
        margin: "10px 0px 0px 10px",
        overflow: "hidden"
    }

    var header = (
        <Row>
            <Cell className="sticky-table-header">Move</Cell>
            <Cell className="sticky-table-header">Type</Cell>
            <Cell className="sticky-table-header">Class</Cell>
            <Cell className="sticky-table-header">Power</Cell>
            <Cell className="sticky-table-header">Accuracy</Cell>
            <Cell className="sticky-table-header">Priority</Cell>
            <Cell className="sticky-table-header">PP</Cell>
        </Row>
    );

    return (
        <div className="card" style={{ height: '85vh', minWidth: "63%" }}>
            {paginator}
            <div style={tableStyle}>
                    <LoadSpinner isLoading={fetchingMoves}>
                <StickyTable>
                    {header}
                        {rows}
                </StickyTable>
                    </LoadSpinner>
            </div>
        </div>
    )
}