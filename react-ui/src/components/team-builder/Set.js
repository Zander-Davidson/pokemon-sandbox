import React, { Component, useState, useEffect } from 'react'
import { titleFormatter as title } from '../Utilities'
// import Typeahead from 'react-typeahead'

var Typeahead = require('react-typeahead').Typeahead;


export default class Set extends Component {

    constructor(props) {
        super(props)

        let set = props.set;
        let activeTeam = props.activeTeam;

        let move_names = {};
        let stat_evs = {};
        let stat_ivs = {};

        set.moves.forEach((m, index) => {
            move_names["move_" + (index + 1) + "_name"] = 
                m.move_slot === (index + 1) ? m.move_name : '';
        });

        set.stats.forEach(s => {
            stat_evs[s.stat_name] = s.evs;
            stat_ivs[s.stat_name] = s.ivs;
        });

        this.state = {
            set: {
                set_guid: set.set_guid ? set.set_guid : '',
                // team_guid: activeTeam.guid ? activeTeam.guid : '',
                team_name: activeTeam.name ? activeTeam.name : '',
                pokemon_name: set.pokemon_name ? set.pokemon_name : '',
                pokemon_nickname: set.pokemon_nickname ? set.pokemon_nickname : '',
                ability_name: set.ability_name ? set.ability_name : '',
                item_name: set.item_name ? set.item_name : '',
                ...move_names,
                ...stat_evs,
                ...stat_ivs,
                level: set.level ? set.level : 100,
                gender: set.gender || '',
                is_shiny: set.is_shiny || false,
                sprite_link: set.sprite_link ? set.sprite_link : '',
                official_artwork_link: set.official_artwork_link ? set.official_artwork_link : '',
            }
        }

        this.handleInputChange = this.handleInputChange.bind(this)
    }

    componentDidUpdate(prevProps) {        
        if (prevProps !== this.props) {
            let set = this.props.set;
    
            let move_names = {};
            let stat_evs = {};
            let stat_ivs = {};
    
            set.moves.forEach((m, index) => {
                move_names["move_" + (index + 1) + "_name"] = 
                    m.move_slot === (index + 1) ? m.move_name : '';
            });
    
            set.stats.forEach(s => {
                stat_evs[s.stat_name] = s.evs || 0;
                stat_ivs[s.stat_name] = s.ivs || 0;
            });

            this.setState({
                set: {
                    set_guid: set.set_guid ? set.set_guid : '',
                    //team_id: this.props.activeTeam.guid ? this.props.activeTeam.guid : '',
                    team_name: this.props.activeTeam.name ? this.props.activeTeam.name : '',
                    pokemon_name: set.pokemon_name ? set.pokemon_name : '',
                    pokemon_nickname: set.pokemon_nickname ? set.pokemon_nickname : '',
                    ability_name: set.ability_name ? set.ability_name : '',
                    item_name: set.item_name ? set.item_name : '',
                    ...move_names,
                    ...stat_evs,
                    ...stat_ivs,
                    level: set.level ? set.level : 100,
                    gender: set.gender || '',
                    is_shiny: set.is_shiny || false,
                    sprite_link: set.sprite_link ? set.sprite_link : '',
                    official_artwork_link: set.official_artwork_link ? set.official_artwork_link : '',
                }
            })
        }
    }

    handleInputChange(event) {
        const target = event.target
        const value = target.value;
        const name = target.name;

        console.log('target: ' + target)
        console.log('value: ' + value)
        console.log('name: ' + name)

        var set = { ...this.state.set }
        set[name] = value
        this.setState({
            set: { ...set }
        });
    }

    handleOnBlur = () => {
        //this.props.editSet(this.state.set)
    }

    render() {
        return (
            <div className='set-wrapper' onBlur={this.handleOnBlur}>
                <div className='set-field-area'>
                    <div style={{ fontWeight: 'bold' }}>Nickname</div>
                    <input name='pokemon_nickname' type='text' value={this.state.set.pokemon_nickname} onChange={this.handleInputChange} className='set-field' />
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <img className='set-sprite' src={this.state.set.official_artwork_link} alt={this.state.set.pokemon_name} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className='set-field-area'>[type]---[type]</div>
                        <div className='set-field-area'>
                            <div style={{ fontWeight: 'bold' }}>Level</div>
                            <input name='level' type='text' value={this.state.set.level} onChange={this.handleInputChange} className='set-field' style={{ width: '30px', textAlign: 'center' }} />
                        </div>
                        <div className='set-field-area'>
                            <div style={{ fontWeight: 'bold' }}>Gender</div>
                            <input name='gender' type='text' value={this.state.set.gender} onChange={this.handleInputChange} className='set-field' style={{ width: '30px', textAlign: 'center' }} />
                        </div>
                        <div className='set-field-area'>
                            <div style={{ fontWeight: 'bold' }}>Shiny</div>
                            <input name='shiny' type='text' value={this.state.set.is_shiny} onChange={this.handleInputChange} className='set-field' style={{ width: '30px', textAlign: 'center' }} />
                        </div>
                    </div>
                </div>

                <div className='set-field-area'>
                    <div style={{ fontWeight: 'bold' }}>Pokemon</div>
                    <input name='pokemon_name' type='text' value={this.state.set.pokemon_name} onChange={this.handleInputChange} className='set-field' />
                </div>
                <div className='set-field-area'>
                    <div style={{ fontWeight: 'bold' }}>Ability</div>
                    <input name='ability_name' type='text' value={this.state.set.ability_name} onChange={this.handleInputChange} className='set-field' />
                </div>
                <div className='set-field-area'>
                    <div style={{ fontWeight: 'bold' }}>Item</div>
                    <input name='item_name' type='text' value={this.state.set.item_name} onChange={this.handleInputChange} className='set-field' />
                </div>

                <div style={{ margin: '10px 0px 10px 0px' }}>
                    <div className='set-field-area'>
                        <div style={{ fontWeight: 'bold' }}>Moves</div><div>[coverage rating]</div>
                    </div>
                    <div className='set-field-area'>
                        [type]<input name='move_1_name' type='text' value={this.state.set.move_1_name} onChange={this.handleInputChange} className='set-field' />
                    </div>
                    <div className='set-field-area'>
                        [type]<input name='move_2_name' type='text' value={this.state.set.move_2_name} onChange={this.handleInputChange} className='set-field' />
                    </div>
                    <div className='set-field-area'>
                        [type]<input name='move_3_name' type='text' value={this.state.set.move_3_name} onChange={this.handleInputChange} className='set-field' />
                    </div>
                    <div className='set-field-area'>
                        [type]<input name='move_4_name' type='text' value={this.state.set.move_4_name} onChange={this.handleInputChange} className='set-field' />
                    </div>
                </div>

                <div className={'set-stat-box'}>
                    [stats]
                </div>
            </div>
        )
    }
}