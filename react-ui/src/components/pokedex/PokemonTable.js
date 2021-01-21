import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchPokemon, setPokemonOffset, addPokemonPin, removePokemonPin, clearPokemonPins } from '../../redux/actions/pokemonActions'
import LoadSpinner from '../tools/LoadSpinner'
import { StickyTable, Row, Cell } from 'react-sticky-table';
import { Button, ButtonGroup, ButtonToolbar, Dropdown, DropdownButton } from 'react-bootstrap';
import Thumbtack from '../icons/Thumbtack';
import styles from '../../styling/master.scss'

export default function PokemonTable(props) {
    const dispatch = useDispatch();
    const { isMobile } = useSelector(state => state.window);
    const { fetchingPokemon, fetchedPokemon, pokemonData,
        searchParams, offset, limit, total, pinnedPokemon } = useSelector(state => state.pokemon);

    const [rows, setRows] = useState([]);
    const [pinnedRows, setPinnedRows] = useState([]);
    const [paginator, setPaginator] = useState();


    useEffect(() => {
        setPaginator(buildPaginator());
    }, [total, offset, limit, searchParams, pokemonData, pinnedPokemon.size]);

    useEffect(() => {
        setRows([])
    }, [fetchingPokemon, searchParams]);

    useEffect(() => {
        setRows(buildRows(pokemonData, false));
    }, [pokemonData, pinnedPokemon.size]);

    useEffect(() => {
        let pinnedArray = Array.from(pinnedPokemon.values());
        setPinnedRows(buildRows(pinnedArray, true));
    }, [pinnedPokemon.size]);

    useEffect(() => {
        if (!fetchedPokemon && !fetchingPokemon)
            dispatch(fetchPokemon());
    }, []);


    const handleHeaderPinClick = () => {
        if (pinnedPokemon.size > 0) {
            dispatch(clearPokemonPins())
        }
    }

    const handleRowPinClick = (pokemon) => {
        if (pinnedPokemon.get(pokemon.name)) {
            dispatch(removePokemonPin(pokemon.name));
        } else if (pinnedPokemon.size < 6) {
            dispatch(addPokemonPin(pokemon.name, pokemon));
        }
    }

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

    let buildPaginator = () => {
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

        return (
            <ButtonToolbar style={{ display: "flex row", justifyContent: "space-around" }} size="sm">
                <h5>Pokedex</h5>
                {total > 0 ?
                    <span>{offset + 1}-{total > offset + limit ? offset + limit : total} of {total} Pokemon</span>
                    : <span>0 results</span>
                }
                <Dropdown>
                    <Dropdown.Toggle bsStyle="default" className="btn-1" size="sm">
                        {`(${pinnedPokemon.size}/6 pins)`}
                    </Dropdown.Toggle>

                    <Dropdown.Menu size="sm">
                        <Dropdown.Item size="sm">(coming soon) New team from pinned</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <ButtonGroup variant="light" size="sm" style={{ padding: "0px 20px 0px 20px" }}>
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
            </ButtonToolbar>
        )
    }

    let buildRows = (pokemon, isPinRow) => {
        const className = isPinRow ? "pinned-sticky-table-cell" : "sticky-table-cell";

        return pokemon.map(p => {
            return (
                <Row>
                    <Cell style={{cursor: "pointer"}} onClick={() => handleRowPinClick(p)} className={className}>
                        <Thumbtack pinned={pinnedPokemon.get(p.name)} />
                    </Cell>
                    <Cell className={className}>
                        <span><img className="table-pokemon-icon" src={p.sprite_link} /></span>
                        <span>{p.game_id}.{' '}{p.name}</span>
                    </Cell>
                    <Cell className={className}>{p.types.map(t => {
                        return (<><div className="type-icon" style={{ backgroundColor: t.color }}>{t.name}</div><br /></>)
                    })}</Cell>
                    <Cell style={{fontSize: isMobile ? "8px" : "10px"}} className={className}>{(p.abilities.map((a, index) => {
                        return a.is_hidden ?
                            <div style={{ fontStyle: "italic" }}>{a.name}</div>
                            : <div>{a.name + (index !== p.abilities.length - 1 ? ', ' : '')}</div>
                    }))}</Cell>
                    {p.stats.map(s => {
                        return <Cell className={className}>{s.value}</Cell>
                    })}
                </Row>
            )
        })
    }

    var header = (
        <Row>
            <Cell className="sticky-table-header" onClick={handleHeaderPinClick} style={{ cursor: "pointer" }}>
                <Thumbtack disabled={pinnedPokemon.size === 0} pinned={pinnedPokemon.size > 0} />
            </Cell>
            <Cell className="sticky-table-header">Pokemon</Cell>
            <Cell className="sticky-table-header">Type</Cell>
            <Cell className="sticky-table-header">Abilities</Cell>
            <Cell className="sticky-table-header">HP</Cell>
            <Cell className="sticky-table-header">Atk</Cell>
            <Cell className="sticky-table-header">Def</Cell>
            <Cell className="sticky-table-header">SpA</Cell>
            <Cell className="sticky-table-header">SpD</Cell>
            <Cell className="sticky-table-header">Speed</Cell>
        </Row>
    );

    return (
        <div className="table-card">
            {paginator}
            <div className="table-wrapper">
                <StickyTable leftStickyColumnCount={2}>
                    {header}
                    {pinnedRows}
                    <LoadSpinner isLoading={fetchingPokemon}>
                        {rows}
                    </LoadSpinner>
                </StickyTable>
            </div>
            {isMobile ? paginator : null}
        </div>
    )
}