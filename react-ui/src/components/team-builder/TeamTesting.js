import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchTeams, createTeam, deleteTeam, setActiveTeam } from '../../actions/userteamsActions'
import LoadSpinner from '../tools/LoadSpinner'
import TeamView from './TeamView'
import NewTeamForm from './NewTeamForm'
import Team from './Team'
import SetView from './SetView'
import styles from './teambuilder-styles.css'

class TeamTesting extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeTeamIndex: 0, // index of team we are currently editing
            activeSetIndex: null,
            showNewTeamBtn: true,
            showNewTeam: false,
            showNewSetBtn: true,
            showNewSet: false,
            showTypeahead: false,
        }
    }

    componentWillMount() {
        this.props.fetchTeams()
    }

    render() {
        let content = this.props.fetching ?
            <LoadSpinner/> :
            <div>
                {/* <button className='button btn-savechanges' onClick={this.handleSaveChanges}>Save Changes</button> */}
                <div className='teambuilder'>
                    <span className='teamview'>
                        {this.state.showNewTeamBtn ? <div><button onClick={() => this.handleNewTeam()} className='button btn-newteam'>New Team</button></div> : null}
                        {this.state.showNewTeam ? <NewTeamForm handleNewTeamEnter={this.handleNewTeamEnter} handleNewTeamBlur={this.handleNewTeamBlur} /> : null}
                        {this.props.teams.map((t, index) => {
                            return <Team
                                name={t.name} sets={t.sets}
                                handleClick={() => this.handleTeamClick(index)}
                                handleDelete={() => this.handleDeleteTeam(index)}
                                isActive={index == this.state.activeTeamIndex ? true : false}
                            />
                        })}
                    </span>

                    {this.props.activeTeam != null ?
                        <SetView sets={this.props.activeTeam.sets}/>
                        : null}
                </div>
            </div>
        
        return content
    }

    handleNewTeamBlur = (event) => {
        this.setState({ showNewTeam: false, showNewTeamBtn: true })
    }

    handleNewTeam() {
        this.setState({ showNewTeamBtn: false, showNewTeam: true })
    }

    handleTeamClick = (clickedTeamIndex) => {
        this.setState({ activeTeamIndex: clickedTeamIndex })
        this.props.setActiveTeam(this.props.teams[clickedTeamIndex])
    }

    handleDeleteTeam = (clickedTeamIndex) => {
        this.props.deleteTeam(this.props.teams[clickedTeamIndex].id)
        this.setState({
            activeTeamIndex: null
        })
    }

    handleNewTeamEnter = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            this.props.createTeam(event.target.value) // new team name
            this.setState({
                showNewTeam: false,
                showNewTeamBtn: true
            })
        }
    }
}

TeamTesting.propTypes = {
    fetchTeams: PropTypes.func.isRequired,
    teams: PropTypes.array.isRequired,
    fetching: PropTypes.bool.isRequired,
    createTeam: PropTypes.func.isRequired,
    deleteTeam: PropTypes.func.isRequired,
    activeTeam: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    teams: state.userteams.items,
    fetching: state.userteams.fetching,
    activeTeam: state.userteams.activeTeam,
})

export default connect(mapStateToProps, { fetchTeams, createTeam, deleteTeam, setActiveTeam })(TeamTesting)