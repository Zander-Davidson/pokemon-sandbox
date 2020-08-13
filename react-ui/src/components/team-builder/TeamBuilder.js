import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchItems } from '../../actions/itemsActions'
import { fetchNatures } from '../../actions/naturesActions'
import { fetchAbilities } from '../../actions/abilitiesActions'
import TeamView from './TeamView'
import SetView from './SetView'
import CalcView from './CalcView'
import LoadSpinner from '../tools/LoadSpinner'
import styles from './teambuilder-styles.css'

const username = 'ana'
const getSetsEndpoint = '/api/getUserSets/?username='
const updateSetsEndpoint = "/api/updateUserSets"

var axios = require('axios')

class TeamBuilder extends Component {
    componentWillMount() {
        if (!this.props.itemsFetched && !this.props.itemsFetching)
            this.props.fetchItems()   

        if (!this.props.naturesFetched && !this.props.naturesFetching)
            this.props.fetchNatures()   

        // if (!this.props.abilitiesFetched && !this.props.abilitiesFetching)
        //     this.props.fetchAbilities()   
    }

    constructor(props) {
        super(props)
        this.state = {
            isFetching: true,
            teamNames: null,
            sets: null,
        }
    }

    componentDidMount() {
        this.setState({isFetching: true})
        this.fetchData()
    }

    async fetchData() {
        await Promise.all([
            await fetch (getSetsEndpoint + username)
                .then(response => response.json())
                .then(json => {
                    console.log(json)
                    this.setState({
                        teamNames: json.results.teamNames,
                        sets: json.results.sets
                    })
                })
        ])
            .then(this.setState({isFetching: false})
            )
            .catch(err => {
                console.log(err)
            });
    }

    saveChanges = async (newTeams, newSets, oldTeams, oldSets, deletedTeams, deletedSets) => {
        this.setState({isFetching: true})
        await axios
            .post(updateSetsEndpoint, {
                username: username,
                newTeams: newTeams,
                newSets: newSets,
                oldTeams: oldTeams,
                oldSets: oldSets,
                deletedTeams: deletedTeams,
                deletedSets: deletedSets
            })
        .then(await this.setState({isFetching: false}))
        .then(await window.location.reload(false))
        .catch(e => {
            console.error('error', e);
        })
    }

    render() {
        let content =   this.props.itemsFetching || 
                        this.props.abilitiesFetching ||
                        this.props.naturesFetching || 
                        this.state.isFetching ?
                    <LoadSpinner/> :
                    <TeamView 
                        sets={this.state.sets}
                        teamNames={this.state.teamNames}
                        abilities={this.props.abilities}
                        natures={this.props.natures}
                        items={this.props.items}
                        handleSaveChanges={this.saveChanges}
                    />

        return content 
    }
}

TeamBuilder.propTypes = {
    fetchItems: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    itemsFetching: PropTypes.bool.isRequired,
    itemsFetched: PropTypes.bool.isRequired,

    fetchNatures: PropTypes.func.isRequired,
    natures: PropTypes.array.isRequired,
    naturesFetching: PropTypes.bool.isRequired,
    naturesFetched: PropTypes.bool.isRequired,

    fetchAbilities: PropTypes.func.isRequired,
    abilities: PropTypes.array.isRequired,
    abilitiesFetching: PropTypes.bool.isRequired,
    abilitiesFetched: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
    items: state.items.items,
    itemsFetching: state.items.fetching,
    itemsFetched: state.items.fetched,

    natures: state.natures.items,
    movesFetching: state.natures.fetching,
    naturesFetched: state.natures.fetched,

    abilities: state.abilities.items,
    abilitiesFetching: state.abilities.fetching,
    abilitiesFetched: state.abilities.fetched,
})

export default connect(mapStateToProps, { fetchItems, fetchAbilities, fetchNatures })(TeamBuilder)