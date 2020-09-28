import React from 'react'
import { Spinner } from 'react-bootstrap'

export default function LoadSpinner(props) {

    const variant = 'info'
    const style = {
        marginTop: '15%'
    }

    var content = props.isLoading ?
        <div style={style}>
            <Spinner animation="border" variant={variant} />
        </div>
        : props.children;

    return content;
}