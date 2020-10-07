import React, { useEffect, useState } from 'react';
import styles from '../../styling/master.scss';

export default function TeamPreview() {

    return (
        <div className="team-preview">
            <div>Team Winners!</div>
            <div className="team-preview-sprite-row">
                <img class="sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/461.png" />
                <img class="sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/461.png" />
                <img class="sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/461.png" />
                <img class="sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/461.png" />
                <img class="sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/461.png" />
                <img class="sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/463.png" />
            </div>
        </div>
    )
}