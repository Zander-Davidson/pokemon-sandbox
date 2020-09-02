import React, { Component, useState, useEffect } from 'react'
import { titleFormatter as title } from '../Utilities'
// import Typeahead from 'react-typeahead'

var Typeahead = require('react-typeahead').Typeahead;


export default class Set extends Component {

    constructor(props) {
        super(props)
console.log(props)
        this.state = {
            set_guid: props.set.set_guid ? props.set.set_guid : '',
            //team_guid: props.activeTeam.guid ? props.activeTeam.guid : '',
            team_name: props.activeTeam ? props.activeTeam : '',
            pokemon_name: props.set.pokemon_name ? props.set.pokemon_name : '',
            pokemon_nickname: props.set.pokemon_nickname ? props.set.pokemon_nickname : '',
            ability_name: props.set.ability_name ? props.set.ability_name : '',
            item_name: props.set.item_name ? props.set.item_name : '',
            move_names: props.set.moves.map((m, index) => {return m.slot === index ? m.move_name : ''}),
            stat_evs: props.set.stats.map(s => {return s.evs ? s.evs : 0}),
            stat_ivs: props.set.stats.map(s => {return s.ivs ? s.ivs : 0}),
            level: props.set.level ? props.set.level : 100,
            sprite_link: props.set.sprite_link ? props.set.sprite_link : '',
            official_artwork_link: props.set.official_artwork_link ? props.set.official_artwork_link : '',
        }

        this.handleInputChange = this.handleInputChange.bind(this)
    }

    componentDidUpdate(prevProps) {
        if (prevProps != this.props) {
            this.setState({
                set_guid: this.props.set.set_guid ? this.props.set.set_guid : '',
                //team_id: this.props.activeTeam.guid ? this.props.activeTeam.guid : '',
                team_name: this.props.activeTeam ? this.props.activeTeam : '',
                pokemon_name: this.props.set.pokemon_name ? this.props.set.pokemon_name : '',
                pokemon_nickname: this.props.set.pokemon_nickname ? this.props.set.pokemon_nickname : '',
                ability_name: this.props.set.ability_name ? this.props.set.ability_name : '',
                item_name: this.props.set.item_name ? this.props.set.item_name : '',
                move_names: this.props.set.moves.map((m, index) => {return m.slot === index ? m.move_name : ''}),
                stat_evs: this.props.set.stats.map(s => {return s.evs ? s.evs : 0}),
                stat_ivs: this.props.set.stats.map(s => {return s.ivs ? s.ivs : 0}),
                level: this.props.set.level ? this.props.set.level : 100,
                sprite_link: this.props.set.sprite_link ? this.props.set.sprite_link : '',
                official_artwork_link: this.props.set.official_artwork_link ? this.props.set.official_artwork_link : '',
            })
        }
    }

    handleInputChange(event) {
        const target = event.target
        const value = target.value;
        const name = target.name;

        var set = { ...this.state }
        set[name] = value
        this.setState({ ...set })
    }

    handleOnBlur = () => {
        //this.props.editSet(this.state.set)
    }

    render() {
        return (
            <div className='set-wrapper' onBlur={this.handleOnBlur}>
                <div className='set-field-area'>
                    <div style={{ fontWeight: 'bold' }}>Nickname</div>
                    <input name='nickname' type='text' value={this.state.pokemon_nickname} onChange={this.handleInputChange} className='set-field' />
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <img className='set-sprite' src={this.state.official_artwork_link} alt={this.state.pokemon_name} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className='set-field-area'>[type]---[type]</div>
                        <div className='set-field-area'>
                            <div style={{ fontWeight: 'bold' }}>Level</div>
                            <input name='level' type='text' value={this.state.level} onChange={this.handleInputChange} className='set-field' style={{ width: '30px', textAlign: 'center' }} />
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
                    <input name='species' type='text' value={this.state.pokemon_name} onChange={this.handleInputChange} className='set-field' />
                </div>
                <div className='set-field-area'>
                    <div style={{ fontWeight: 'bold' }}>Ability</div>
                    <input name='ability' type='text' value={this.state.ability_name} onChange={this.handleInputChange} className='set-field' />
                </div>
                <div className='set-field-area'>
                    <div style={{ fontWeight: 'bold' }}>Item</div>
                    <input name='item' type='text' value={this.state.item_name} onChange={this.handleInputChange} className='set-field' />
                </div>

                <div style={{ margin: '10px 0px 10px 0px' }}>
                    <div className='set-field-area'>
                        <div style={{ fontWeight: 'bold' }}>Moves</div><div>[coverage rating]</div>
                    </div>
                    <div className='set-field-area'>
                        [type]<input name='move_1' type='text' value={this.state.move_names[0]} onChange={this.handleInputChange} className='set-field' />
                    </div>
                    <div className='set-field-area'>
                        [type]<input name='move_2' type='text' value={this.state.move_names[1]} onChange={this.handleInputChange} className='set-field' />
                    </div>
                    <div className='set-field-area'>
                        [type]<input name='move_3' type='text' value={this.state.move_names[2]} onChange={this.handleInputChange} className='set-field' />
                    </div>
                    <div className='set-field-area'>
                        [type]<input name='move_4' type='text' value={this.state.move_names[3]} onChange={this.handleInputChange} className='set-field' />
                    </div>
                </div>

                <div className={'set-stat-box'}>
                    [stats]
                </div>
            </div>
        )
    }
}