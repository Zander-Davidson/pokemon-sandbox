import React, { Component } from 'react'

export default class NewSetForm extends Component {
    constructor(props) {
        super(props);
        this.textInput = React.createRef();
    }

    componentDidMount() {
        this.textInput.current.focusTextInput()
    }

    render() {
        return (
            <SpeciesInput 
                ref={this.textInput} 
                handleNewSetBlur={this.props.handleNewSetBlur} 
                handleNewSetEnter={this.props.handleNewSetEnter}
            />
        )
    }
}

class SpeciesInput extends Component {
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
            <form className='set-wrapper' style={{ padding: '7px', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}} >
                <img 
                    src='//cdn.bulbagarden.net/upload/a/a1/Substitute_artwork.png'
                    style={{height: '110px', width: '110px'}}
                />

                Pokemon
                <input
                    ref={this.textInput}
                    type='text'
                    value={value}
                    style={{
                        fontSize: 'small',
                        height: '25px', 
                        width: '170px'}}
                    placeholder='species'
                    onKeyDown={e => this.props.handleNewSetEnter(e)}
                    onBlur={e => this.props.handleNewSetBlur(e)}
                />
            </form>
        )
    }
}