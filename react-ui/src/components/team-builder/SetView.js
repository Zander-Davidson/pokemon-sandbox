import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../styling/master.scss';

export default function SetView() {
    const dispatch = useDispatch();
    const { setNest } = useSelector(state => state.user);

    useEffect(() => {
        console.log(setNest)
    }, [setNest.size]);

    return (
        <div className="set-view">
            <div className='picker-tabs-wrapper'>
                {['Pokemon', 'Moves', 'Abilities', 'Stats'].map((p, index) => {
                    return <div className='picker-tab'>{p}</div>
                })}
            </div>
            <div className='set-view-content-wrapper'>
                
                <div className='picker-content-wrapper'>
                <div className='set-tabs-wrapper'>
                    <div className='set-tab'>
                        <img style={{ height: '70px', width: '70px' }} src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/42.png" />
                    </div>
                    <div className='set-tab'>
                        <img style={{ height: '70px', width: '70px' }} src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/42.png" />
                    </div>
                    <div className='set-tab'>
                        <img style={{ height: '70px', width: '70px' }} src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/42.png" />
                    </div>
                    <div className='set-tab'>
                        <img style={{ height: '70px', width: '70px' }} src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/42.png" />
                    </div>
                    <div className='set-tab'>
                        <img style={{ height: '70px', width: '70px' }} src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/42.png" />
                    </div>
                    <div className='set-tab'>
                        <img style={{ height: '70px', width: '70px' }} src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/42.png" />
                    </div>
                </div>
                    Set
                    {/* {activeSet ?
                        <Set
                            set={activeSet}
                            team={activeTeam}
                            editSet={this.handleEditSet}
                        />
                        : <LoadSpinner />} */}
                </div>
            </div>
        </div>
    )
}