import React, { Component, useState, useEffect } from 'react'
import { titleFormatter as title } from '../Utilities'
// import Typeahead from 'react-typeahead'

var Typeahead = require('react-typeahead').Typeahead;


export default class Set extends Component {

    constructor(props) {
        super(props)
        this.state = {
            set: {
                set_id: props.set.set_id == null ? '' : props.set.set_id,
                team_id: props.set.team_id == null ? '' : props.set.team_id,
                team_name: props.set.team_name == null ? '' : props.set.team_name,
                species: props.set.species == null ? '' : props.set.species,
                nickname: props.set.nickname == null ? '' : props.set.nickname,
                ability: props.set.ability == null ? '' : props.set.ability,
                item: props.set.item == null ? '' : props.set.item,
                move_1: props.set.move_1 == null ? '' : props.set.move_1,
                move_2: props.set.move_2 == null ? '' : props.set.move_2,
                move_3: props.set.move_3 == null ? '' : props.set.move_3,
                move_4: props.set.move_4 == null ? '' : props.set.move_4,
                hp_evs: props.set.hp_evs == null ? '' : props.set.hp_evs,
                atk_evs: props.set.atk_evs == null ? '' : props.set.atk_evs,
                def_evs: props.set.def_evs == null ? '' : props.set.def_evs,
                spa_evs: props.set.spa_evs == null ? '' : props.set.spa_evs,
                spd_evs: props.set.spd_evs == null ? '' : props.set.spd_evs,
                spe_evs: props.set.spe_evs == null ? '' : props.set.spe_evs,
                level: props.set.level == null ? '' : props.set.level,
                sprite_link: props.set.sprite_link == null ? '' : props.set.sprite_link,
            }
        }

        this.handleInputChange = this.handleInputChange.bind(this)
    }

    componentDidUpdate(prevProps) {
        if (prevProps != this.props) {
            this.setState({
                set: {
                    set_id: this.props.set.set_id == null ? '' : this.props.set.set_id,
                    team_id: this.props.set.team_id == null ? '' : this.props.set.team_id,
                    team_name: this.props.set.team_name == null ? '' : this.props.set.team_name,
                    species: this.props.set.species == null ? '' : this.props.set.species,
                    nickname: this.props.set.nickname == null ? '' : this.props.set.nickname,
                    ability: this.props.set.ability == null ? '' : this.props.set.ability,
                    item: this.props.set.item == null ? '' : this.props.set.item,
                    move_1: this.props.set.move_1 == null ? '' : this.props.set.move_1,
                    move_2: this.props.set.move_2 == null ? '' : this.props.set.move_2,
                    move_3: this.props.set.move_3 == null ? '' : this.props.set.move_3,
                    move_4: this.props.set.move_4 == null ? '' : this.props.set.move_4,
                    hp_evs: this.props.set.hp_evs == null ? '' : this.props.set.hp_evs,
                    atk_evs: this.props.set.atk_evs == null ? '' : this.props.set.atk_evs,
                    def_evs: this.props.set.def_evs == null ? '' : this.props.set.def_evs,
                    spa_evs: this.props.set.spa_evs == null ? '' : this.props.set.spa_evs,
                    spd_evs: this.props.set.spd_evs == null ? '' : this.props.set.spd_evs,
                    spe_evs: this.props.set.spe_evs == null ? '' : this.props.set.spe_evs,
                    level: this.props.set.level == null ? '' : this.props.set.level,
                    sprite_link: this.props.set.sprite_link == null ? '' : this.props.set.sprite_link,
                }
            })
        }
    }

    handleInputChange(event) {
        const target = event.target
        const value = target.value;
        const name = target.name;

        var set = { ...this.state.set }
        set[name] = value
        this.setState({ set })
    }

    handleOnBlur = () => {
        this.props.editSet(this.state.set)
    }

    render() {
        return (
            <div className='set-wrapper' onBlur={this.handleOnBlur}>
                <div className='set-field-area'>
                    <div style={{ fontWeight: 'bold' }}>Nickname</div>
                    <input name='nickname' type='text' value={this.state.set.nickname} onChange={this.handleInputChange} className='set-field' />
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <img className='set-sprite' src={this.state.set.sprite_link} alt={this.state.set.species} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className='set-field-area'>[type]---[type]</div>
                        <div className='set-field-area'>
                            <div style={{ fontWeight: 'bold' }}>Level</div>
                            <input name='level' type='text' value={this.state.set.level} onChange={this.handleInputChange} className='set-field' style={{ width: '30px', textAlign: 'center' }} />
                        </div>
                        <div className='set-field-area'>
                            <div style={{ fontWeight: 'bold' }}>Gender</div>
                            <input name='gender' type='text' className='set-field' style={{ width: '30px', textAlign: 'center' }} />
                        </div>
                        <div className='set-field-area'>
                            <div style={{ fontWeight: 'bold' }}>Shiny</div>
                            <input name='shiny' type='text' className='set-field' style={{ width: '30px', textAlign: 'center' }} />
                        </div>
                    </div>
                </div>

                <div className='set-field-area'>
                    <div style={{ fontWeight: 'bold' }}>Pokemon</div>
                    <input name='species' type='text' value={this.state.set.species} onChange={this.handleInputChange} className='set-field' />
                </div>
                <div className='set-field-area'>
                    <div style={{ fontWeight: 'bold' }}>Ability</div>
                    <input name='ability' type='text' value={this.state.set.ability} onChange={this.handleInputChange} className='set-field' />
                </div>
                <div className='set-field-area'>
                    <div style={{ fontWeight: 'bold' }}>Item</div>
                    <input name='item' type='text' value={this.state.set.item} onChange={this.handleInputChange} className='set-field' />
                </div>

                <div style={{ margin: '10px 0px 10px 0px' }}>
                    <div className='set-field-area'>
                        <div style={{ fontWeight: 'bold' }}>Moves</div><div>[coverage rating]</div>
                    </div>
                    <div className='set-field-area'>
                        [type]<input name='move_1' type='text' value={this.state.set.move_1} onChange={this.handleInputChange} className='set-field' />
                    </div>
                    <div className='set-field-area'>
                        [type]<input name='move_2' type='text' value={this.state.set.move_2} onChange={this.handleInputChange} className='set-field' />
                    </div>
                    <div className='set-field-area'>
                        [type]<input name='move_3' type='text' value={this.state.set.move_3} onChange={this.handleInputChange} className='set-field' />
                    </div>
                    <div className='set-field-area'>
                        [type]<input name='move_4' type='text' value={this.state.set.move_4} onChange={this.handleInputChange} className='set-field' />
                    </div>
                </div>

                <div className={'set-stat-box'}>
                    [stats]
                </div>
            </div>
        )
    }
}