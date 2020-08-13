import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchMoves } from '../../actions/movesActions'
import LoadSpinner from '../tools/LoadSpinner'
import MoveTable from './MoveTable';

class Movedex extends Component {
    componentWillMount() {
        if (!this.props.fetched && !this.props.fetching)
            this.props.fetchMoves()
    }

    render() {
        let content = this.props.fetching ?
            <LoadSpinner/> :
            <MoveTable moves={this.props.moves}/>

        return content
    } 
}

Movedex.propTypes = {
    fetchMoves: PropTypes.func.isRequired,
    moves: PropTypes.array.isRequired,
    fetching: PropTypes.bool.isRequired,
    fetched: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
    moves: state.moves.items,
    fetching: state.moves.fetching,
    fetched: state.moves.fetched
})

export default connect(mapStateToProps, { fetchMoves })(Movedex)