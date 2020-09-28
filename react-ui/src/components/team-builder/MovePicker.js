import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchMoves } from '../../redux/actions/movesActions'
import LoadSpinner from '../tools/LoadSpinner'

class MovePicker extends Component {
    componentWillMount() {
        if (!this.props.movesFetched && !this.props.movesFetching)
            this.props.fetchMoves()
    }

    render() {
        let content = this.props.movesFetching ?
            <LoadSpinner/> :
            <div>
                Move picker
            </div>

        return content
    }
}

MovePicker.propTypes = {
    fetchMoves: PropTypes.func.isRequired,
    moves: PropTypes.array.isRequired,
    movesFetching: PropTypes.bool.isRequired,
    movesFetched: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
    moves: state.moves.items,
    movesFetching: state.moves.fetching,
    movesFetched: state.moves.fetched,
})

export default connect(mapStateToProps, { fetchMoves })(MovePicker)