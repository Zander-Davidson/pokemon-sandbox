import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchUserTeams, fetchUserSets } from '../../redux/actions/userTeamsActions'
import TeamView from './TeamView'
import SetView from './SetView'
import CalcView from './CalcView'
import LoadSpinner from '../tools/LoadSpinner'
import styles from './teambuilder-styles.css'


class TeamBuilder extends Component {

    componentDidMount() {
        if (!this.props.userTeamsFetched && !this.props.userTeamsFetching)
            this.props.fetchUserTeams();
    }

    render() {
        let content = !this.props.userTeamsFetched || !this.props.userSetsFetched ||
                      !this.props.userTeamsFetching || !this.props.userSetsFetching ?
            <LoadSpinner/> : 
            <div className='teambuilder'>
                <TeamView/>
                <SetView/>
            </div>

        let comingSoon = <h5>Team builder coming soon!</h5>
        return comingSoon 
    }
}

TeamBuilder.propTypes = {
    fetchUserSets: PropTypes.func.isRequired,
    userSetsFetching: PropTypes.bool.isRequired,
    userSetsFetched: PropTypes.bool.isRequired,

    activeTeam: PropTypes.object.isRequired,
    fetchUserTeams: PropTypes.func.isRequired,
    userTeamsFetching: PropTypes.bool.isRequired,
    userTeamsFetched: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
    userSetsFetching: state.userTeams.userSetsFetching,
    userSetsFetched: state.userTeams.userSetsFetched,
    
    activeTeam: state.userTeams.activeTeam,
    userTeamsFetching: state.userTeams.userTeamsFetching,
    userTeamsFetched: state.userTeams.userTeamsFetched,
})

export default connect(mapStateToProps, { fetchUserTeams, fetchUserSets })(TeamBuilder)