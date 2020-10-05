import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchPokemon, setPokemonSearch, setPokemonOffset } from '../../redux/actions/pokemonActions';
import { Form, Button, Col, Row, InputGroup } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import styles from '../../styling/master.scss'

export default function PokemonSearchPanel(props) {
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortBy, setSortBy] = useState('');
    const [hasNames, setHasNames] = useState([]);
    const [types, setTypes] = useState([]);
    const [hasTypes, setHasTypes] = useState([]);
    const [strictTypes, setStrictTypes] = useState(false);
    const [hasAbilities, setHasAbilities] = useState([]);
    const [hasMoves, setHasMoves] = useState([]);
    const [strictMoves, setStrictMoves] = useState(true);

    const { offset, limit } = useSelector(state => state.pokemon)
    const dispatch = useDispatch();

    useEffect(() => {
        setTypes(props.typeData.map(t => {
            return t.name
        }))
    }, [props.typeData]);

    const handleChangeSortOrder = (event) => {
        setSortOrder(event.target.value)
    }

    const handleChangeSortBy = (event) => {
        setSortBy(event.target.value)
    }

    const handleChangeHasNames = (event) => {
        setHasNames(event)
    }

    const handleChangeHasTypes = (event) => {
        setHasTypes(event)
    }

    const handleChangeStrictTypes = (event) => {
        setStrictTypes(event.target.value === "true")
    }

    const handleChangeHasAbilities = (event) => {
        setHasAbilities(event)
    }

    const handleChangeHasMoves = (event) => {
        setHasMoves(event)
    }

    const handleChangeStrictMoves = (event) => {
        setStrictMoves(event.target.value === "true")
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        let searchParams = {
            sortOrder: sortOrder,
            sortBy: sortBy,
            hasNames: hasNames,
            hasTypes: hasTypes,
            strictTypes: strictTypes,
            hasAbilities: hasAbilities,
            hasMoves: hasMoves,
            strictMoves: strictMoves,
        };
        dispatch(setPokemonOffset(0))
        dispatch(setPokemonSearch(searchParams))
        dispatch(fetchPokemon({
            offset: 0,
            limit: limit,
            ...searchParams
        }));
    }

    const handleReset = (event) => {
        setSortOrder('asc');
        setSortBy('');
        setHasNames([]);
        setTypes([]);
        setHasTypes([]);
        setStrictTypes(false);
        setHasAbilities([]);
        setHasMoves([]);
        setStrictMoves(true);
    }

    return (
        <div className="card" style={{ height: '85vh' }}>
            <div className="pokemon-search-panel-wrapper">
                <h5>Custom Search</h5>
                <div style={{ margin: "15px 15px 15px 15px"}}>
                    <Form onSubmit={handleSubmit}>

                        {/* <Form.Row>
                        <Col><Button variant="info" className="mb-3" size="sm">Reset</Button></Col>
                        <Col><Button variant="info" disabled className="mb-3" size="sm">Saved searches (coming soon)</Button></Col>
                    </Form.Row> */}

                        <Form.Row>
                            <Col>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>Sort by</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control size="sm" as="select" onChange={handleChangeSortBy}>
                                        <option value="game_id">Pokedex #</option>
                                        <option value="name">Name</option>
                                        <option value="hp">HP</option>
                                        <option value="atk">Attack</option>
                                        <option value="def">Defense</option>
                                        <option value="spa">Sp. Attack</option>
                                        <option value="spd">Sp. Defense</option>
                                        <option value="spe">Speed</option>
                                    </Form.Control>
                                </InputGroup>
                            </Col>
                            <Col>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>Order by</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control size="sm" as="select" onChange={handleChangeSortOrder}>
                                        <option value="asc">Low to High</option>
                                        <option value="desc">High to Low</option>
                                    </Form.Control>
                                </InputGroup>
                            </Col>
                        </Form.Row>

                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text>Pokemon</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Typeahead
                                id="hasPokemon"
                                placeholder="Choose or start typing..."
                                size="small"
                                multiple
                                clearButton
                                options={props.pokemonNames}
                                selected={hasNames}
                                onChange={handleChangeHasNames}
                            />
                        </InputGroup>

                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text>Types</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Typeahead
                                id="hasTypes"
                                placeholder="Choose or start typing..."
                                size="small"
                                multiple
                                clearButton
                                options={types}
                                selected={hasTypes}
                                onChange={handleChangeHasTypes}
                            />
                            <InputGroup.Append>
                                <Form.Control size="sm" as="select" onChange={handleChangeStrictTypes}>
                                    <option value={false}>Lax</option>
                                    <option value={true}>Strict</option>
                                </Form.Control>
                            </InputGroup.Append>
                        </InputGroup>


                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text>Moves</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Typeahead
                                id="hasMoves"
                                placeholder="Choose or start typing..."
                                size="small"
                                multiple
                                clearButton
                                options={props.moveNames}
                                selected={hasMoves}
                                onChange={handleChangeHasMoves}
                            />
                            <InputGroup.Append>
                                <Form.Control size="sm" as="select" onChange={handleChangeStrictMoves}>
                                    <option value={true}>Strict</option>
                                    <option value={false}>Lax</option>
                                </Form.Control>
                            </InputGroup.Append>
                        </InputGroup>

                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text>Abilities</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Typeahead
                                id="hasAbilities"
                                placeholder="Choose or start typing..."
                                size="small"
                                multiple
                                clearButton
                                options={props.abilityNames}
                                selected={hasAbilities}
                                onChange={handleChangeHasAbilities}
                            />
                        </InputGroup>

                        <Form.Row>
                            <Col><Button variant="info" size="sm" type="submit">Search</Button></Col>
                            {/* <Col><Button variant="info" className="mb-3" size="sm" onClick={handleReset}>Reset filters</Button></Col> */}
                            {/* <Col><Button variant="info" disabled className="mb-3" size="sm">Save search (coming soon)</Button></Col> */}
                        </Form.Row>

                    </Form>
                </div >
            </div>
        </div>
    )
}