import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchUserSets, setActiveUserSet } from '../../redux/actions/userTeamsActions'
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

        if (!this.props.userSetsFetched && !this.props.userSetsFetching)
            this.props.fetchUserSets(this.props.activeTeam.guid);

        this.state = {
            pickerTabs: ['Pokemon', 'Moves', 'Abilities', 'Stats'],
            activePickerIndex: 0,
            showNewSet: false,
            disableNewSetBtn: false,
        }

        this.speciesInput = React.createRef();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            disableNewSetBtn: nextProps.activeTeam.sets.length >= 6
        })
    }

    render() {
        let userSets = this.props.userSets;
        let activeSet = this.props.activeSet;
        let activeTeam = this.props.activeTeam;
        let disableNewSetBtn = this.state.disableNewSetBtn;

        return (
            <span className='setview'>

                <div className={'set-tabs-wrapper'}>
                    
                    <button onClick={this.handleNewSet} disabled={disableNewSetBtn} className='btn-newset' style={disableNewSetBtn ? {opacity: '0.5'} : null}><FontAwesomeIcon icon={faPlusCircle} /></button>
                    {activeSet ?
                        userSets.map(s => {
                            return (
                                <div
                                    className='set-tab'
                                    style={s.guid === activeSet.guid ? { 
                                        boxShadow: "0px 0px 7px 1px rgba(146,49,255,0.68)", 
                                        borderRightColor: brightGhost, 
                                        backgroundColor: brightGhost } 
                                    : null}
                                    onClick={() => this.handleSetTabClick(s.guid)}
                                >
                                    {<img style={{ height: '70px', width: '70px' }} src={s.sprite_link} alt={s.pokemon_name} />}
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
                        {activeSet ?
                            <Set 
                                set={activeSet}
                                team={activeTeam}
                                editSet={this.handleEditSet}
                             /> 
                             : <LoadSpinner/>}
                    </div>
                </div>

            </span>
        )
    }

    handleTeamNameChange = (event) => {
        // let newName = event.target.value
        // this.props.editTeam(newName)
    }
 
    handleSetTabClick = (clickedSetGuid) => {
        this.props.setActiveSet(clickedSetGuid);
    }

    handlePickerTabClick = (index) => {
        this.setState({
            activePickerIndex: index
        })
    }

    handleEditSet = (newSet) => {
        // this.setState(prevState => {
        //     return {
        //         ...prevState,
        //         sets: prevState.sets.map((s, index) => {
        //         if (index === prevState.activeSetIndex) {
        //             return newSet
        //         } else
        //             return s
        //     })}
        //   });
    }

    handleNewSet = () => {
        // this.setState(prevState => {
        //     let newSet = {
        //         set_id: -1,
        //         sprite_link: '//cdn.bulbagarden.net/upload/a/a1/Substitute_artwork.png'
        //     }

        //     return {
        //         sets : prevState.sets.length === 0 ?
        //             [newSet] : [newSet, ...prevState.sets],
        //         activeSetIndex: 0
        //     }
        // })
    }

    handleNewSetBlur = (event) => {
        this.setState({ showNewSet: false })
    }

    handleDeleteSet = (clickedSetIndex) => {
        // let newTeams = this.state.teams.map((t, tIndex) => {
        //     if (tIndex === this.state.activeTeamIndex) {
        //         return {
        //             id: t.id,
        //             name: t.name,
        //             sets: t.sets.filter((s, sIndex) => sIndex !== clickedSetIndex)
        //         }
        //     }
        //     else
        //         return t
        // })

        // this.setState({
        //     teams: newTeams
        // })
    }

    handleNewSetEnter = (event) => {
    //     if (event.key === 'Enter') {
    //         event.preventDefault();
    //         event.stopPropagation();

    //         let newSpecies = event.target.value
    //         let newTeams = this.state.teams.map((t, tIndex) => {
    //             if (tIndex === this.state.activeTeamIndex) {
    //                 t.sets = [{
    //                     set_id: null,
    //                     species: newSpecies,
    //                     nickname: null,
    //                     nature: 'bashful',
    //                     ability: null,
    //                     item: null,
    //                     move_1: null,
    //                     move_2: null,
    //                     move_3: null,
    //                     move_4: null,
    //                     hp_evs: 0,
    //                     atk_evs: 0,
    //                     def_evs: 0,
    //                     spa_evs: 0,
    //                     spd_evs: 0,
    //                     spe_evs: 0,
    //                     level: 100,
    //                     sprite_link: null,
    //                     team_name: t.name,
    //                     team_id: t.id
    //                 }, ...t.sets]
    //             }
    //             else
    //                 return t
    //         })

    //         this.setState(prevState => {
    //             return {
    //                 showNewSet: false,
    //                 enableNewSetBtn: true,
    //                 // teams: newTeams//[{name: newName, sets: null}, ...prevState.teams]
    //             }
    //         })
    //     }
    }
}

SetView.propTypes = {
    fetchUserSets: PropTypes.func.isRequired,
    userSets: PropTypes.array.isRequired,
    userSetsFetching: PropTypes.bool.isRequired,
    userSetsFetched: PropTypes.bool.isRequired,
    
    activeTeam: PropTypes.object.isRequired,
    activeSet: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    userSets: state.userTeams.userSets,
    userSetsFetching: state.userTeams.userSetsFetching,
    userSetsFetched: state.userTeams.userSetsFetched,

    activeTeam: state.userTeams.activeTeam,
    activeSet: state.userSets.activeSet
})

export default connect(mapStateToProps, { fetchUserSets, setActiveUserSet })(SetView)