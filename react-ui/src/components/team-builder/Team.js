import React, { useState } from 'react'
import styles from './teambuilder-styles.css'

export default function Team(props) {

    let name = props.name
    let sprites = props.sets.map(s => {
            return <img className='team-sprite' src={s.sprite_link}/>
        })

    return (
        <div
            className='team-wrapper'
            style={props.isActive ? {boxShadow: "0px 0px 7px 1px rgba(146,49,255,0.68)"} : null}
        >
            <button onClick={props.handleDelete} className='delete-btn' ><div className='rotated-text'>Delete</div></button>
            <div onClick={props.handleClick} style={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center'}}>
                <div>
                    {name}
                </div>
                <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                    {sprites}
                </div>
            </div>
        </div>
    )
}