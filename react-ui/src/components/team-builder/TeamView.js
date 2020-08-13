import React, { Component } from 'react'
import Team from './Team'
import { Button } from 'react-bootstrap'
import NewTeamForm from './NewTeamForm'
import NewSetForm from './NewSetForm'
import { titleFormatter as title } from '../Utilities'
import styles from './teambuilder-styles.css'
import SetView from './SetView'
import Set from './Set'
import DataView from './DataView'
import update from 'immutability-helper'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

// this component is messy and can be broken up a bit (and commented)
// it's mostly event handlers

export default class TeamView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            activeTeamIndex: 0, // index of team we are currently editing
            activeSetIndex: null,
            teams: [],
            showNewTeamBtn: true,
            showNewTeam: false,
            showNewSetBtn: true,
            showNewSet: false,
            showTypeahead: false,
        }
        this.handleNewTeam = this.handleNewTeam.bind(this)
    }

    componentDidMount() {
        this.processSets(this.props.sets, this.props.teamNames)
    }

    processSets(sets, teamNames) {
        let teams = []
        let currTeamName = sets[0].team
        let j = 0
        let currTeamId = teamNames[j].id
        let currTeam = { id: currTeamId, name: currTeamName, sets: [] }

        teamNames.forEach(t => {
            teams.push({
                id: t.id,
                name: t.name,
                sets: sets.filter(s => {
                    return s.team_id === t.id
                })
            })
        })

        this.setState({ teams: teams })
    }

    render() {
        return (
            <div>
                {/* <button className='button btn-savechanges' onClick={this.handleSaveChanges}>Save Changes</button> */}
                <div className='teambuilder'>
                    <span className='teamview'>
                        {this.state.showNewTeamBtn ? <div><button onClick={() => this.handleNewTeam()} className='button btn-newteam'>New Team</button></div> : null}
                        {this.state.showNewTeam ? <NewTeamForm handleNewTeamEnter={this.handleNewTeamEnter} handleNewTeamBlur={this.handleNewTeamBlur} /> : null}
                        {this.state.teams.map((t, index) => {
                            return <Team
                                name={t.name} sets={t.sets}
                                handleClick={() => this.handleTeamClick(index)}
                                handleDelete={() => this.handleDeleteTeam(index)}
                                isActive={index == this.state.activeTeamIndex ? true : false}
                            />
                        })}
                    </span>

                    {/* <span className='setview'>
                            {this.state.showNewSetBtn && this.state.activeTeamIndex != null && this.state.teams[this.state.activeTeamIndex].sets.length <= 5 ?
                                <div><button onClick={() => this.handleNewSet()} className='button btn-newteam'>New Set</button></div> : null}
                            {this.state.showNewSet ? <NewSetForm handleNewSetEnter={this.handleNewSetEnter} handleNewSetBlur={this.handleNewSetBlur} /> : null}
                            {this.state.activeTeamIndex != null ?
                                this.state.teams[this.state.activeTeamIndex].sets != null ?
                                    this.state.teams[this.state.activeTeamIndex].sets.map((s, index) => {
                                        return <Set
                                            key={s.set_id}
                                            set={s}
                                            handleClick={() => this.handleSetClick(index)}
                                            handleDelete={() => this.handleDeleteSet(index)}
                                            editSet={(newSet) => this.editSet(index, newSet)}
                                            isActive={index == this.state.activeSetIndex ? true : false}
                                            moves={this.state.moves}
                                        />
               
                                    }) : null
                                : null}
                    </span> */}
                    {this.state.activeTeamIndex != null && this.state.teams[this.state.activeTeamIndex] != null ?
                        <SetView sets={this.state.teams[this.state.activeTeamIndex].sets}/>
                        : null}
                </div>
            </div>
        )
    }

    handleSaveChanges = () => {
        let newTeams = []
        let newSets = []
        let oldTeams = []
        let oldSets = []

        this.state.teams.forEach(t => {
            if (t.id == null) {
                newTeams.push({ name: t.name })
                t.sets.forEach(s => {
                    newSets.push(s)
                })
            }
            else {
                oldTeams.push({ id: t.id, name: t.name })
                t.sets.forEach(s => {
                    if (s.set_id == null && s.set_id != -1)
                        newSets.push(s)
                    else
                        oldSets.push(s)
                })
            }
        })

        let oldTeamIds = oldTeams.map(t => {
            return t.id
        })
        let deletedTeams = []
        this.props.teamNames.forEach(t => {
            if (!oldTeamIds.includes(t.id))
                deletedTeams.push({ id: t.id })
        })

        let oldSetIds = oldSets.map(s => {
            return s.set_id
        })
        let deletedSets = []
        this.props.sets.forEach(s => {
            if (!oldSetIds.includes(s.set_id))
                deletedSets.push({ id: s.set_id })
        })


        this.props.handleSaveChanges(newTeams, newSets, oldTeams, oldSets, deletedTeams, deletedSets)
    }

    handleSpeciesField = () => {

    }

    handleAbilityField = () => {

    }

    handleNatureField = () => {

    }

    handleItemField = () => {

    }

    handleMoveField = () => {

    }

    handleNewTeamBlur = (event) => {
        this.setState({ showNewTeam: false, showNewTeamBtn: true })
    }

    handleNewTeam() {
        this.setState({ showNewTeamBtn: false, showNewTeam: true })
    }

    handleTeamClick = (clickedTeamIndex) => {
        this.setState({ activeTeamIndex: clickedTeamIndex })
    }

    handleDeleteTeam = (clickedTeamIndex) => {
        let newTeams = this.state.teams.filter((t, index) => index !== clickedTeamIndex)
        this.setState({
            activeTeamIndex: null,
            teams: newTeams
        })
    }

    handleNewTeamEnter = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            console.log('enter');
            let newName = event.target.value

            this.setState(prevState => {
                return {
                    showNewTeam: false,
                    showNewTeamBtn: true,
                    activeTeamIndex: 0,
                    teams: [{ id: null, name: newName, sets: [] }, ...prevState.teams]
                }
            })
        }
    }

    editSet = (setIndex, newSet) => {
        let newTeams = this.state.teams.map((t, tIndex) => {
            if (tIndex === this.state.activeTeamIndex) {
                return {
                    id: t.id,
                    name: t.name,
                    sets: this.state.teams[tIndex].sets.map((s, sIndex) => {
                        if (sIndex === setIndex) {
                            return {
                                set_id: newSet.set_id,
                                species: newSet.species,
                                nickname: newSet.nickname,
                                nature: newSet.nature,
                                ability: newSet.ability,
                                item: newSet.item,
                                move_1: newSet.move_1,
                                move_2: newSet.move_2,
                                move_3: newSet.move_3,
                                move_4: newSet.move_4,
                                hp_evs: newSet.hp_evs,
                                atk_evs: newSet.atk_evs,
                                def_evs: newSet.def_evs,
                                spa_evs: newSet.spa_evs,
                                spd_evs: newSet.spd_evs,
                                spe_evs: newSet.spe_evs,
                                level: newSet.level,
                                sprite_link: newSet.sprite_link,
                                team_name: newSet.team_name,
                                team_id: newSet.team_id
                            }
                        }
                        else
                            return s
                    })
                }
            }
            else
                return t
        })
        this.setState({ teams: newTeams })
    }
}