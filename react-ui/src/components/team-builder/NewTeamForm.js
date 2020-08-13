import React, { Component } from 'react'

export default class NewTeamForm extends Component {
    constructor(props) {
        super(props);
        this.textInput = React.createRef();
    }

    componentDidMount() {
        this.textInput.current.focusTextInput()
    }

    render() {
        return <NameInput ref={this.textInput} handleNewTeamBlur={this.props.handleNewTeamBlur} handleNewTeamEnter={this.props.handleNewTeamEnter}/>
    }
}

class NameInput extends Component {
    constructor(props) {
        super(props)
        this.textInput = React.createRef();
        this.focusTextInput = this.focusTextInput.bind(this)
    }

    focusTextInput() {
        // Explicitly focus the text input using the raw DOM API
        // Note: we're accessing "current" to get the DOM node
        this.textInput.current.focus();
    }

    render() {
        let value
        
        return (
            <form className='team-wrapper' style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}} >
                <input
                    ref={this.textInput}
                    type='text'
                    value={value}
                    style={{
                        fontSize: 'small',
                        height: '25px', 
                        width: '170px'}}
                    placeholder='team name'
                    onKeyDown={e => this.props.handleNewTeamEnter(e)}
                    onBlur={e => this.props.handleNewTeamBlur(e)}
                />
            </form>
        )
    }
}