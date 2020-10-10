import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchMoves, setMoveSearch, setMoveOffset } from '../../redux/actions/movesActions';
import { Form, Button, Col, Row, InputGroup } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import styles from '../../styling/master.scss'

export default function MoveSearchPanel(props) {
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortBy, setSortBy] = useState('');
    const [hasNames, setHasNames] = useState([]);
    const [types, setTypes] = useState([]);
    const [hasTypes, setHasTypes] = useState([]);
    const [hasDamageClass, setHasDamageClass] = useState([]);
    const [hasPokemon, setHasPokemon] = useState([]);
    const [strictPokemon, setStrictPokemon] = useState(true);

    const { offset, limit } = useSelector(state => state.moves)
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

    const handleChangeHasDamageClass = (event) => {
        setHasDamageClass(event)
    }

    const handleChangeHasPokemon = (event) => {
        setHasPokemon(event)
    }

    const handleChangeStrictPokemon = (event) => {
        setStrictPokemon(event.target.value === "true")
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        let searchParams = {
            sortOrder: sortOrder,
            sortBy: sortBy,
            hasNames: hasNames,
            hasTypes: hasTypes,
            hasDamageClass: hasDamageClass,
            hasPokemon: hasPokemon,
            strictPokemon: strictPokemon,
        };
        dispatch(setMoveOffset(0))
        dispatch(setMoveSearch(searchParams))
        dispatch(fetchMoves({
            offset: 0,
            limit: limit,
            ...searchParams
        }));
    }

    const handleReset = (event) => {
        setSortOrder('asc');
        setSortBy('');
        setHasNames([]);
        setHasTypes([]);
        setHasDamageClass([]);
        setHasPokemon([]);
        setStrictPokemon(true);
    }

    return (
        <div className="search-panel-card">
            <h5>Custom Move Search</h5>
            <div style={{ margin: "15px 15px 15px 15px" }}>
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
                                    <option value="game_id">Game #</option>
                                    <option value="name">Name</option>
                                    <option value="power">Power</option>
                                    <option value="accuracy">Accuracy</option>
                                    <option value="priority">Priority</option>
                                    <option value="pp">PP</option>
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
                            <InputGroup.Text>Moves</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Typeahead
                            id="hasMoves"
                            placeholder="Choose or start typing..."
                            size="small"
                            multiple
                            clearButton
                            options={props.moveNames}
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
                    </InputGroup>


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
                            selected={hasPokemon}
                            onChange={handleChangeHasPokemon}
                        />
                        <InputGroup.Append>
                            <Form.Control size="sm" as="select" onChange={handleChangeStrictPokemon}>
                                <option value={true}>Strict</option>
                                <option value={false}>Lax</option>
                            </Form.Control>
                        </InputGroup.Append>
                    </InputGroup>

                    <InputGroup size="sm" className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text>Damage Class</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Typeahead
                            id="hasDamageClass"
                            placeholder="Choose or start typing..."
                            size="small"
                            multiple
                            clearButton
                            options={props.damageClassNames}
                            selected={hasDamageClass}
                            onChange={handleChangeHasDamageClass}
                        />
                    </InputGroup>

                    <Form.Row>
                        <Col><Button bsStyle="default" className="btn-1" size="sm" type="submit">Search</Button></Col>
                        {/* <Col><Button variant="info" className="mb-3" size="sm" onClick={handleReset}>Reset filters</Button></Col> */}
                        {/* <Col><Button variant="info" disabled className="mb-3" size="sm">Save search (coming soon)</Button></Col> */}
                    </Form.Row>

                </Form>
            </div >
        </div>
    )
}