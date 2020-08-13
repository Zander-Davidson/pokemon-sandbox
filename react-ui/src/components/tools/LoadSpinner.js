import React from 'react'
import { Spinner } from 'react-bootstrap'

export default function LoadSpinner() {

    const variant = 'info'
    const style = {
        marginTop: '15%'
    }

    return (
        <div style={style}>
            <Spinner animation="border" variant={variant} />
        </div>
    )
}