import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchUserSets, setActiveUserTeam } from '../../redux/actions/userTeamsActions'
import Team from './Team'
import { Button } from 'react-bootstrap'
import NewTeamForm from './NewTeamForm'
import NewSetForm from './NewSetForm'
import styles from './teambuilder-styles.css'
import SetView from './SetView'
import Set from './Set'
import DataView from './DataView'
import update from 'immutability-helper'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

// this component is messy and can be broken up a bit (and commented)
// it's mostly event handlers

class TeamView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showNewTeamBtn: true,
            showNewTeam: false,
            showNewSetBtn: true,
            showNewSet: false,
            showTypeahead: false,
        }
        this.handleNewTeam = this.handleNewTeam.bind(this)
    }

    render() {
        let userTeams = this.props.userTeams;

        return (
            <span className='teamview'>
                {this.state.showNewTeamBtn ? <div><button onClick={() => this.handleNewTeam()} className='button btn-newteam'>New Team</button></div> : null}
                {this.state.showNewTeam ? <NewTeamForm handleNewTeamEnter={this.handleNewTeamEnter} handleNewTeamBlur={this.handleNewTeamBlur} /> : null}
                {userTeams.map(t => {
                    return <Team
                        name={t.name} sets={t.sets}
                        isActive={t.guid === this.props.activeTeam.guid}
                        handleClick={() => this.handleTeamClick(t.guid)}
                        handleDelete={() => this.handleDeleteTeam(t.guid)}
                    />
                })}
            </span>
        )
    }

    handleNewTeamBlur = (event) => {
        this.setState({ showNewTeam: false, showNewTeamBtn: true })
    }

    handleNewTeam() {
        this.setState({ showNewTeamBtn: false, showNewTeam: true })
    }

    handleTeamClick = (clickedTeamGuid) => {
        this.props.setActiveTeam(clickedTeamGuid);
        this.props.fetchUserSets(clickedTeamGuid);
    }

    handleDeleteTeam = (clickedTeamIndex) => {
        let newTeams = this.state.teams.filter((t, index) => index !== clickedTeamIndex)
        this.setState({
            teams: newTeams
        })
    }

    handleNewTeamEnter = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            let newName = event.target.value

            this.setState(prevState => {
                return {
                    showNewTeam: false,
                    showNewTeamBtn: true,
                    teams: [{ id: null, name: newName, sets: [] }, ...prevState.teams]
                }
            })
        }
    }
}

TeamView.propTypes = {
    userTeams: PropTypes.object.isRequired,
    activeTeam: PropTypes.object.isRequired,
    setActiveTeam: PropTypes.func.isRequired,
    
    fetchUserSets: PropTypes.func.isRequired,
    userSetsFetching: PropTypes.bool.isRequired,
    userSetsFetched: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    userTeams: state.userTeams.userTeams,
    activeTeam: state.userTeams.activeTeam,

    userSetsFetching: state.userTeams.userSetsfetching,
    userSetsFetched: state.userTeams.userSetsFetched,
});

export default connect(mapStateToProps, { fetchUserSets, setActiveUserTeam })(TeamView)