import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchPokemon, setPokemonOffset } from '../../redux/actions/pokemonActions'
import LoadSpinner from '../tools/LoadSpinner'
import { StickyTable, Row, Cell } from 'react-sticky-table';
import { Button, ButtonGroup, ButtonToolbar, Dropdown, DropdownButton, ToggleButton } from 'react-bootstrap';
import styles from '../../styling/master.scss'

export default function PokemonTable(props) {
    const [rows, setRows] = useState([]);
    const [paginator, setPaginator] = useState();

    const dispatch = useDispatch();
    const { fetchingPokemon, fetchedPokemon, pokemonData, searchParams, offset, limit, total } = useSelector(state => state.pokemon);

    useEffect(() => {
        if (!fetchedPokemon && !fetchingPokemon)
            dispatch(fetchPokemon());
    }, []);

    useEffect(() => {
        setRows([])
    }, [fetchingPokemon, searchParams]);

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

        dispatch(setPokemonOffset(parseInt(newOffset)));
        dispatch(fetchPokemon({
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
                <h5>Pokedex</h5>
                {total > 0 ? 
                    <span>Showing {offset + 1} to {total > offset + limit ? offset + limit : total} of {total} Pokemon</span>
                    : <span>0 Pokemon matched your search</span>
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
    }, [total, offset, limit, searchParams, pokemonData]);

    useEffect(() => {
        setRows(pokemonData.map(p => {
            return (
                <Row>
                    <Cell className="sticky-table-cell">
                        <span><img className="table-pokemon-icon" src={p.sprite_link} /></span>
                        <span>{p.game_id}.{' '}{p.name}</span>
                    </Cell>
                    <Cell className="sticky-table-cell">{p.types.map(t => {
                        return (<><div className="type-icon" style={{ backgroundColor: t.color }}>{t.name}</div><br /></>)
                    })}</Cell>
                    <Cell className="sticky-table-cell">{(p.abilities.map((a, index) => {
                        return a.is_hidden ?
                            <div style={{ fontStyle: "italic" }}>{a.name}</div>
                            : <span>{a.name + (index !== p.abilities.length - 1 ? ', ' : '')}</span>
                    }))}</Cell>
                    {p.stats.map(s => {
                        return <Cell className="sticky-table-cell">{s.value}</Cell>
                    })}
                </Row>
            )
        }))
    }, [pokemonData])

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
            <Cell className="sticky-table-header">Pokemon</Cell>
            <Cell className="sticky-table-header">Type</Cell>
            <Cell className="sticky-table-header">Abilities</Cell>
            <Cell className="sticky-table-header">HP</Cell>
            <Cell className="sticky-table-header">Atk</Cell>
            <Cell className="sticky-table-header">Def</Cell>
            <Cell className="sticky-table-header">Sp. Atk</Cell>
            <Cell className="sticky-table-header">Sp. Def</Cell>
            <Cell className="sticky-table-header">Speed</Cell>
        </Row>
    );

    return (
        <div className="card" style={{ height: '85vh', minWidth: "63%" }}>
            {paginator}
            <div style={tableStyle}>
                    <LoadSpinner isLoading={fetchingPokemon}>
                <StickyTable>
                    {header}
                        {rows}
                </StickyTable>
                    </LoadSpinner>
            </div>
        </div>
    )
}