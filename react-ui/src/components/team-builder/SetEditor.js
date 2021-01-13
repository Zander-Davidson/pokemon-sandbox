import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormControl, Button, Col, Row, InputGroup } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import styles from '../../styling/master.scss';
import { calculate } from '@smogon/calc/dist/calc';


export default function SetEditor(props) {
    const { setNest, activeTeamId, activeSetId } = useSelector(state => state.user);
    const { typeData } = useSelector(state => state.types);
    const { pokemonNames } = useSelector(state => state.pokemon);
    const { itemNames } = useSelector(state => state.items);
    const { natures } = useSelector(state => state.natures);

    var moveNames = props.setOptions.moves.map(m => { return m.name });

    var set = props.set;

    let pokemonDefault = set && set.pokemon_name ? [set.pokemon_name] : [];
    let itemDefault = set && set.item_name ? [set.item_name] : [];
    let move1Default = set && set.moves && set.moves[0] && set.moves[0].move_name !== null ? [set.moves[0].move_name] : [];
    let move2Default = set && set.moves && set.moves[1] && set.moves[1].move_name !== null ? [set.moves[1].move_name] : [];
    let move3Default = set && set.moves && set.moves[2] && set.moves[2].move_name !== null ? [set.moves[2].move_name] : [];
    let move4Default = set && set.moves && set.moves[3] && set.moves[3].move_name !== null ? [set.moves[3].move_name] : [];

    const [pokemon, setPokemon] = useState(pokemonDefault);
    const [nickname, setNickname] = useState(set && set.pokemon_nickname ? set.pokemon_nickname : '');
    const [isShiny, setIsShiny] = useState(set && set.is_shiny != null ? set.is_shiny : false);
    const [gender, setGender] = useState(set && set.gender ? set.gender : 'neutral');
    const [level, setLevel] = useState(set && set.level ? set.level : '100');
    const [ability, setAbility] = useState(set && set.ability_name ? set.ability_name : '');
    const [item, setItem] = useState(itemDefault);
    const [move1, setMove1] = useState(move1Default);
    const [move2, setMove2] = useState(move2Default);
    const [move3, setMove3] = useState(move3Default);
    const [move4, setMove4] = useState(move4Default);

    const [move1Type, setMove1Type] = useState(set && set.moves && set.moves[0] && set.moves[0].type_name !== null ? <div className="type-icon" style={{ backgroundColor: set.moves[0].type_color }}>{set.moves[0].type_name}</div> : null);
    const [move2Type, setMove2Type] = useState(set && set.moves && set.moves[1] && set.moves[1].type_name !== null ? <div className="type-icon" style={{ backgroundColor: set.moves[1].type_color }}>{set.moves[1].type_name}</div> : null);
    const [move3Type, setMove3Type] = useState(set && set.moves && set.moves[2] && set.moves[2].type_name !== null ? <div className="type-icon" style={{ backgroundColor: set.moves[2].type_color }}>{set.moves[2].type_name}</div> : null);
    const [move4Type, setMove4Type] = useState(set && set.moves && set.moves[3] && set.moves[3].type_name !== null ? <div className="type-icon" style={{ backgroundColor: set.moves[3].type_color }}>{set.moves[3].type_name}</div> : null);

    const [natureName, setNatureName] = useState(set ? set.nature_name : '');
    const [natureMult, setNatureMult] = useState(set ? set.stats.nature_mult : []);

    const [baseHp, setBaseHp] = useState(set ? set.stats.base[0] : 0);
    const [baseAtk, setBaseAtk] = useState(set ? set.stats.base[1] : 0);
    const [baseDef, setBaseDef] = useState(set ? set.stats.base[2] : 0);
    const [baseSpa, setBaseSpa] = useState(set ? set.stats.base[3] : 0);
    const [baseSpd, setBaseSpd] = useState(set ? set.stats.base[4] : 0);
    const [baseSpe, setBaseSpe] = useState(set ? set.stats.base[5] : 0);

    const [ivHp, setIvHp] = useState(set ? set.stats.ivs[0] : 0);
    const [ivAtk, setIvAtk] = useState(set ? set.stats.ivs[1] : 0);
    const [ivDef, setIvDef] = useState(set ? set.stats.ivs[2] : 0);
    const [ivSpa, setIvSpa] = useState(set ? set.stats.ivs[3] : 0);
    const [ivSpd, setIvSpd] = useState(set ? set.stats.ivs[4] : 0);
    const [ivSpe, setIvSpe] = useState(set ? set.stats.ivs[5] : 0);

    const [evHp, setEvHp] = useState(set ? set.stats.evs[0] : 0);
    const [evAtk, setEvAtk] = useState(set ? set.stats.evs[1] : 0);
    const [evDef, setEvDef] = useState(set ? set.stats.evs[2] : 0);
    const [evSpa, setEvSpa] = useState(set ? set.stats.evs[3] : 0);
    const [evSpd, setEvSpd] = useState(set ? set.stats.evs[4] : 0);
    const [evSpe, setEvSpe] = useState(set ? set.stats.evs[5] : 0);

    const handleOnLevelChange = (e) => {
        if (e.target.value === '') {
            setLevel('');
        } else {
            let val = parseInt(e.target.value);
            if (val >= 1 && val <= 100) {
                setLevel(val);
            }
        }
    }

    const handleOnStatChange = (e, callback, min, max) => {
        if (e.target.value === '') {
            callback(0);
        } else {
            let val = parseInt(e.target.value);

            if (val >= min && val <= max) {
                callback(val);
            }
        }
    }

    const handleOnNatureChange = (e) => {
        setNatureName(e.target.value);

        let nature = natures.filter(n => (e.target.value === n.name))[0]

        if (nature) {
            setNatureMult(nature.multipliers);
        }
    }

    const handleOnMoveChange = (text, moveNameCallback, moveTypeCallback) => {
        if (moveNames.includes(text)) {
            let move = props.setOptions.moves.filter(m => (m.name === text))[0];

            moveNameCallback([text]);
            moveTypeCallback(<div className="type-icon" style={{ backgroundColor: move.type.color }}>{move.type.name}</div>)
        } else {
            moveNameCallback([]);
            moveTypeCallback(null);
        }
    }

    const calculateStat = (isHp, base, ivs, evs, level, natureMod) => {
        if (isHp) {
            return Math.floor(((2 * base + ivs + Math.floor(evs / 4)) * level) / 100) + level + 10;
        } else {
            return Math.floor((Math.floor(((2 * base + ivs + Math.floor(evs / 4)) * level) / 100) + 5) * natureMod);
        }
    };

    return (
        <div className="set-editor">
            <Form>
                <InputGroup size="sm" className="form-field">
                    <InputGroup.Prepend>
                        <InputGroup.Text>Pokemon</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Typeahead
                        selectHintOnEnter
                        id="pokemon"
                        size="small"
                        options={pokemonNames}
                        selected={pokemon}
                        onChange={(e) => { setPokemon(e) }}
                        onInputChange={(text, event) => { if (pokemonNames.includes(text)) setPokemon([text]) }}
                    />
                </InputGroup>

                <InputGroup size="sm" className="form-field">
                    <InputGroup.Prepend>
                        <InputGroup.Text>Nickname</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        id="nickname"
                        size="small"
                        value={nickname}
                        onChange={(e) => { setNickname(e.target.value) }}
                    />
                </InputGroup>

                <Form.Row>
                    <Col>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <span className="type-icon" style={{ borderRadius: "5px", margin: "3px", backgroundColor: set.pokemon_types[0].type_color }}>{set.pokemon_types[0].type_name}</span>
                            {set.pokemon_types.length === 2 ?
                                <span className="type-icon" style={{ borderRadius: "5px", margin: "3px", backgroundColor: set.pokemon_types[1].type_color }}>{set.pokemon_types[1].type_name}</span>
                                : null
                            }
                        </div>
                        <img src={set.official_artwork_link} />
                    </Col>
                    <Col>
                        <div style={{ paddingTop: "15px", display: "flex", flexDirection: "column", alignContent: "center", alignItems: "center" }}>
                            <InputGroup size="sm" className="form-field">
                                <InputGroup.Prepend>
                                    <InputGroup.Text>Shiny</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control
                                    size="sm"
                                    as="select"
                                    selected={isShiny}
                                    value={isShiny}
                                    onChange={(e) => { setIsShiny(e.target.value) }}
                                >
                                    <option value={true}>Yes</option>
                                    <option value={false}>No</option>
                                </Form.Control>
                            </InputGroup>
                            <InputGroup size="sm" className="form-field">
                                <InputGroup.Prepend>
                                    <InputGroup.Text>Gender</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control
                                    size="sm"
                                    as="select"
                                    selected={gender}
                                    value={gender}
                                    onChange={(e) => { setGender(e.target.value) }}
                                >
                                    <option value={"neutral"}>Neutral</option>
                                    <option value={"female"}>Female</option>
                                    <option value={"male"}>Male</option>
                                </Form.Control>
                            </InputGroup>
                            <InputGroup size="sm" className="form-field">
                                <InputGroup.Prepend>
                                    <InputGroup.Text>Level</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    id="level"
                                    size="small"
                                    value={level}
                                    placeholder={"1-100"}
                                    onChange={handleOnLevelChange}
                                />
                            </InputGroup>
                        </div>
                    </Col>
                </Form.Row>

                <InputGroup size="sm" className="form-field">
                    <InputGroup.Prepend>
                        <InputGroup.Text>Ability</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                        size="sm"
                        as="select"
                        selected={ability}
                        value={ability}
                        onChange={(e) => { setAbility(e.target.value) }}
                    >
                        {props.setOptions.abilities.map(a => {
                            return <option value={a}>{a}</option>
                        })}
                    </Form.Control>
                </InputGroup>

                <InputGroup size="sm" className="form-field">
                    <InputGroup.Prepend>
                        <InputGroup.Text>Item</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Typeahead
                        selectHintOnEnter
                        id="item"
                        size="small"
                        options={itemNames}
                        selected={item}
                        onChange={(e) => { setItem(e) }}
                        onInputChange={(text, event) => { if (itemNames.includes(text)) setItem([text]) }}
                    />
                </InputGroup>

                <InputGroup size="sm" className="form-field">
                    <InputGroup.Prepend>
                        <InputGroup.Text>Move 1</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Typeahead
                        selectHintOnEnter
                        id="move1"
                        size="small"
                        options={moveNames}
                        selected={move1}
                        onChange={(event) => handleOnMoveChange(event[0], setMove1, setMove1Type)}
                        onInputChange={(text, event) => handleOnMoveChange(text, setMove1, setMove1Type)}
                    />
                    {move1Type ? <InputGroup.Append>{move1Type}</InputGroup.Append> : null}
                </InputGroup>
                <InputGroup size="sm" className="form-field">
                    <InputGroup.Prepend>
                        <InputGroup.Text>Move 2</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Typeahead
                        selectHintOnEnter
                        id="move2"
                        size="small"
                        options={moveNames}
                        selected={move2}
                        onChange={(event) => handleOnMoveChange(event[0], setMove2, setMove2Type)}
                        onInputChange={(text, event) => handleOnMoveChange(text, setMove2, setMove2Type)}
                    />
                    {move2Type ? <InputGroup.Append>{move2Type}</InputGroup.Append> : null}
                </InputGroup>
                <InputGroup size="sm" className="form-field">
                    <InputGroup.Prepend>
                        <InputGroup.Text>Move 3</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Typeahead
                        selectHintOnEnter
                        id="move3"
                        size="small"
                        options={moveNames}
                        selected={move3}
                        onChange={(event) => handleOnMoveChange(event[0], setMove3, setMove3Type)}
                        onInputChange={(text, event) => handleOnMoveChange(text, setMove3, setMove3Type)}
                    />
                    {move3Type ? <InputGroup.Append>{move3Type}</InputGroup.Append> : null}
                </InputGroup>
                <InputGroup size="sm" className="form-field">
                    <InputGroup.Prepend>
                        <InputGroup.Text>Move 4</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Typeahead
                        selectHintOnEnter
                        id="move4"
                        size="small"
                        options={moveNames}
                        selected={move4}
                        onChange={(event) => handleOnMoveChange(event[0], setMove4, setMove4Type)}
                        onInputChange={(text, event) => handleOnMoveChange(text, setMove4, setMove4Type)}
                    />
                    {move4Type ? <InputGroup.Append>{move4Type}</InputGroup.Append> : null}
                </InputGroup>

                {/* <InputGroup size="sm" className="form-field">
                    <InputGroup.Prepend>
                        <InputGroup.Text>Nature</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Typeahead
                        selectHintOnEnter
                        dropup
                        id="nature"
                        size="small"
                        defaultSelected={[natureNameDefault]}
                        options={natureNames2}
                        selected={natureName}
                        onChange={handleOnNatureChange}
                    />
                </InputGroup> */}

                <InputGroup size="sm" className="form-field">
                    <InputGroup.Prepend>
                        <InputGroup.Text>Nature</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                        size="sm"
                        as="select"
                        selected={natureName}
                        value={natureName}
                        onChange={handleOnNatureChange}
                    >
                        {natures.map(n => { return <option value={n.name}>{n.name}</option> })}
                    </Form.Control>
                </InputGroup>

                <div className="stats-area">
                    <table>
                        <tbody>
                            <tr className="slider-row">
                                <th> </th>
                                <th>EVs</th>
                                <th> </th>
                                <th>IVs</th>
                                <th> </th>
                            </tr>

                            <tr className="slider-row">
                                <td>HP</td>
                                <td><FormControl
                                    className="text-input"
                                    id="evHpVal"
                                    size="sm"
                                    value={evHp}
                                    onChange={(e) => { handleOnStatChange(e, setEvHp, 0, 252) }}
                                /></td>
                                <td><Form.Control
                                    id="evHpSlide"
                                    className="ev-slider"
                                    type="range"
                                    size="sm"
                                    value={evHp}
                                    min={0}
                                    max={252}
                                    step={4}
                                    onChange={(e) => { setEvHp(e.target.value) }}
                                /></td>
                                <td><FormControl
                                    className="text-input"
                                    id="ivHp"
                                    size="sm"
                                    value={ivHp}
                                    onChange={(e) => { handleOnStatChange(e, setIvHp, 0, 31) }}
                                /></td>
                                <td>{calculateStat(true, baseHp, ivHp, evHp, level, 1.0)}</td>
                            </tr>

                            <tr className="slider-row">
                                <td>ATK</td>
                                <td><FormControl
                                    className="text-input"
                                    id="evAtkVal"
                                    size="sm"
                                    value={evAtk}
                                    onChange={(e) => { handleOnStatChange(e, setEvAtk, 0, 252) }}
                                /></td>
                                <td><Form.Control
                                    id="evAtkSlide"
                                    className="ev-slider"
                                    type="range"
                                    size="sm"
                                    value={evAtk}
                                    min={0}
                                    max={252}
                                    step={4}
                                    onChange={(e) => { setEvAtk(e.target.value) }}
                                /></td>
                                <td><FormControl
                                    className="text-input"
                                    id="ivAtk"
                                    size="sm"
                                    value={ivAtk}
                                    onChange={(e) => { handleOnStatChange(e, setIvAtk, 0, 31) }}
                                /></td>

                                <td style={natureMult[1] != 1.0 ? { color: (natureMult[1] == 1.1 ? "#ff4747" : "#598eff") } : {}}>
                                    {calculateStat(false, baseAtk, ivAtk, evAtk, level, natureMult[1] || 1.0)}
                                </td>
                            </tr>

                            <tr className="slider-row">
                                <td>DEF</td>
                                <td><FormControl
                                    className="text-input"
                                    id="evDefVal"
                                    size="sm"
                                    value={evDef}
                                    onChange={(e) => { handleOnStatChange(e, setEvDef, 0, 252) }}
                                /></td>
                                <td><Form.Control
                                    id="evDefSlide"
                                    className="ev-slider"
                                    type="range"
                                    size="sm"
                                    value={evDef}
                                    min={0}
                                    max={252}
                                    step={4}
                                    onChange={(e) => { setEvDef(e.target.value) }}
                                /></td>
                                <td><FormControl
                                    className="text-input"
                                    id="ivDef"
                                    size="sm"
                                    value={ivDef}
                                    onChange={(e) => { handleOnStatChange(e, setIvDef, 0, 31) }}
                                /></td>

                                <td style={natureMult[2] != 1.0 ? { color: (natureMult[2] == 1.1 ? "#ff4747" : "#598eff") } : {}}>
                                    {calculateStat(false, baseDef, ivDef, evDef, level, natureMult[2] || 1.0)}
                                </td>
                            </tr>

                            <tr className="slider-row">
                                <td>SPA</td>
                                <td><FormControl
                                    className="text-input"
                                    id="evSpaVal"
                                    size="sm"
                                    value={evSpa}
                                    onChange={(e) => { handleOnStatChange(e, setEvSpa, 0, 252) }}
                                /></td>
                                <td><Form.Control
                                    id="evSpaSlide"
                                    className="ev-slider"
                                    type="range"
                                    size="sm"
                                    value={evSpa}
                                    min={0}
                                    max={252}
                                    step={4}
                                    onChange={(e) => { setEvSpa(e.target.value) }}
                                /></td>
                                <td><FormControl
                                    className="text-input"
                                    id="ivSpa"
                                    size="sm"
                                    value={ivSpa}
                                    onChange={(e) => { handleOnStatChange(e, setIvSpa, 0, 31) }}
                                /></td>

                                <td style={natureMult[3] != 1.0 ? { color: (natureMult[3] == 1.1 ? "#ff4747" : "#598eff") } : {}}>
                                    {calculateStat(false, baseSpa, ivSpa, evSpa, level, natureMult[3] || 1.0)}
                                </td>
                            </tr>

                            <tr className="slider-row">
                                <td>SPD</td>
                                <td><FormControl
                                    className="text-input"
                                    id="evSpdVal"
                                    size="sm"
                                    value={evSpd}
                                    onChange={(e) => { handleOnStatChange(e, setEvSpd, 0, 252) }}
                                /></td>
                                <td><Form.Control
                                    id="evSpdSlide"
                                    className="ev-slider"
                                    type="range"
                                    size="sm"
                                    value={evSpd}
                                    min={0}
                                    max={252}
                                    step={4}
                                    onChange={(e) => { setEvSpd(e.target.value) }}
                                /></td>
                                <td><FormControl
                                    className="text-input"
                                    id="ivSpd"
                                    size="sm"
                                    value={ivSpd}
                                    onChange={(e) => { handleOnStatChange(e, setIvSpd, 0, 31) }}
                                /></td>

                                <td style={natureMult[4] != 1.0 ? { color: (natureMult[4] == 1.1 ? "#ff4747" : "#598eff") } : {}}>
                                    {calculateStat(false, baseSpd, ivSpd, evSpd, level, natureMult[4] || 1.0)}
                                </td>
                            </tr>

                            <tr className="slider-row">
                                <td>SPE</td>
                                <td><FormControl
                                    className="text-input"
                                    id="evSpeVal"
                                    size="sm"
                                    value={evSpe}
                                    onChange={(e) => { handleOnStatChange(e, setEvSpe, 0, 252) }}
                                /></td>
                                <td><Form.Control
                                    id="evSpeSlide"
                                    className="ev-slider"
                                    type="range"
                                    size="sm"
                                    value={evSpe}
                                    min={0}
                                    max={252}
                                    step={4}
                                    onChange={(e) => { setEvSpe(e.target.value) }}
                                /></td>
                                <td><FormControl
                                    className="text-input"
                                    id="ivSpe"
                                    size="sm"
                                    value={ivSpe}
                                    onChange={(e) => { handleOnStatChange(e, setIvSpe, 0, 31) }}
                                /></td>

                                <td style={natureMult[5] != 1.0 ? { color: (natureMult[5] == 1.1 ? "#ff4747" : "#598eff") } : {}}>
                                    {calculateStat(false, baseSpe, ivSpe, evSpe, level, natureMult[5] || 1.0)}
                                </td>
                            </tr>
                        </tbody>
                    </table>


                </div>

            </Form>
        </div>
    )
}