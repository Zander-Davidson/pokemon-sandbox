import React from 'react'
import { Spinner } from 'react-bootstrap'

export default function LoadingView(props) {

    const variant = 'info'
    const style = {
        marginTop: '15%'
    }
    
    return (
        <div style={style}>
            <Spinner animation="border" variant={variant} />
        </div>
    );
}