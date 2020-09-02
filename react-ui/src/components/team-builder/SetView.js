import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchUserSets } from '../../actions/userSetsActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import Set from './Set'
import styles from './teambuilder-styles.css'
import NewSetForm from './NewSetForm'
import LoadSpinner from '../tools/LoadSpinner'

const brightGhost = '#f0e9f7'

class SetView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            //teamName: props.activeTeam.name,
            //sets: props.sets,
            pickerTabs: ['Pokemon', 'Moves', 'Abilities', 'Stats'],
            activeSetIndex: null,
            activePickerIndex: 0,
            showNewSet: false,
            disableNewSetBtn: false,
        }

        this.speciesInput = React.createRef();
    }

    componentWillMount() {
        if (!this.props.userSetsFetched && !this.props.userSetsFetching)
            this.props.fetchUserSets(this.props.activeTeam.guid);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            disableNewSetBtn: nextProps.activeTeam.sets.length >= 6
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps != this.props) {
            if (this.props.userSets.length > 0) {
                this.setState({
                    activeSetIndex: 0
                })
            } else {
                this.setState({
                    activeSetIndex: null
                })
            }
        }
    }

    render() {
        let sets = this.props.userSets;
        let disableNewSetBtn = this.state.disableNewSetBtn;

        console.log('user sets: ' + this.props.userSets)
        console.log('active team: ' + this.props.activeTeam)

        return (
            <span className='setview'>

                <div className={'set-tabs-wrapper'}>
                    
                    <button onClick={this.handleNewSet} disabled={disableNewSetBtn} className='btn-newset' style={disableNewSetBtn ? {opacity: '0.5'} : null}><FontAwesomeIcon icon={faPlusCircle} /></button>
                    {this.state.activeSetIndex != null ?
                        sets.map((s, index) => {
                            return (
                                <div
                                    className='set-tab'
                                    style={index === this.state.activeSetIndex ? { 
                                        boxShadow: "0px 0px 7px 1px rgba(146,49,255,0.68)", 
                                        borderRightColor: brightGhost, 
                                        backgroundColor: brightGhost } 
                                    : null}
                                    onClick={() => this.handleSetTabClick(index)}
                                >
                                    {<img style={{ height: '70px', width: '70px' }} src={s.sprite_link} alt={s.species} />}
                                </div>
                            )
                        }) 
                    : null}
                </div>

                <div className='picker-wrapper'>
                    <div className='picker-header-wrapper'>
                        <div className='set-field-area' style={{ justifyContent: 'left', width: 'fit-content' }}>
                            <div style={{ fontWeight: 'bold' }}>Team</div>
                            <input name='teamName' type='text' value={this.props.activeTeam.name} onChange={this.handleTeamNameChange} className='set-field' />
                        </div>
                        <div className='picker-tabs-wrapper'>
                            {this.state.pickerTabs.map((p, index) => {
                                return (
                                    <div
                                        className='picker-tab'
                                        style={index === this.state.activePickerIndex ? { boxShadow: "0px 0px 7px 1px rgba(146,49,255,0.68)", borderRightColor: brightGhost, backgroundColor: brightGhost } : null}
                                        onClick={() => this.handlePickerTabClick(index)}
                                    >
                                        {p}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className='picker-content-wrapper'>
                        {this.state.activeSetIndex !== null ?
                            <Set 
                                set={sets[this.state.activeSetIndex]}
                                activeTeam={this.props.activeTeam}
                                editSet={this.handleEditSet}
                             /> : <LoadSpinner/>}
                    </div>
                </div>

            </span>
        )
    }

    handleTeamNameChange = (event) => {
        let newName = event.target.value
        // this.props.editTeam(newName)
    }
 
    handleSetTabClick = (index) => {
        this.setState({ activeSetIndex: index })
    }

    handlePickerTabClick = (index) => {
        this.setState({
            activePickerIndex: index
        })
    }

    handleEditSet = (newSet) => {
        this.setState(prevState => {
            return {
                ...prevState,
                sets: prevState.sets.map((s, index) => {
                if (index === prevState.activeSetIndex) {
                    return newSet
                } else
                    return s
            })}
          });
    }

    handleNewSet = () => {
        this.setState(prevState => {
            let newSet = {
                set_id: -1,
                sprite_link: '//cdn.bulbagarden.net/upload/a/a1/Substitute_artwork.png'
            }

            return {
                sets : prevState.sets.length === 0 ?
                    [newSet] : [newSet, ...prevState.sets],
                activeSetIndex: 0
            }
        })
    }

    handleNewSetBlur = (event) => {
        this.setState({ showNewSet: false })
    }

    handleDeleteSet = (clickedSetIndex) => {
        let newTeams = this.state.teams.map((t, tIndex) => {
            if (tIndex === this.state.activeTeamIndex) {
                return {
                    id: t.id,
                    name: t.name,
                    sets: t.sets.filter((s, sIndex) => sIndex !== clickedSetIndex)
                }
            }
            else
                return t
        })

        this.setState({
            teams: newTeams
        })
    }

    handleNewSetEnter = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();

            let newSpecies = event.target.value
            let newTeams = this.state.teams.map((t, tIndex) => {
                if (tIndex === this.state.activeTeamIndex) {
                    t.sets = [{
                        set_id: null,
                        species: newSpecies,
                        nickname: null,
                        nature: 'bashful',
                        ability: null,
                        item: null,
                        move_1: null,
                        move_2: null,
                        move_3: null,
                        move_4: null,
                        hp_evs: 0,
                        atk_evs: 0,
                        def_evs: 0,
                        spa_evs: 0,
                        spd_evs: 0,
                        spe_evs: 0,
                        level: 100,
                        sprite_link: null,
                        team_name: t.name,
                        team_id: t.id
                    }, ...t.sets]
                }
                else
                    return t
            })

            this.setState(prevState => {
                return {
                    showNewSet: false,
                    enableNewSetBtn: true,
                    // teams: newTeams//[{name: newName, sets: null}, ...prevState.teams]
                }
            })
        }
    }
}

SetView.propTypes = {
    fetchUserSets: PropTypes.func.isRequired,
    userSets: PropTypes.array.isRequired,
    userSetsFetching: PropTypes.bool.isRequired,
    userSetsFetched: PropTypes.bool.isRequired,
    
    activeTeam: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    userSets: state.userSets.items,
    userSetsFetching: state.userSets.fetching,
    userSetsFetched: state.userSets.fetched,

    activeTeam: state.userTeams.activeTeam 
})

export default connect(mapStateToProps, { fetchUserSets })(SetView)