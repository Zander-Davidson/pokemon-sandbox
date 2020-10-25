import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSets, setActiveTeam } from '../../redux/actions/userActions';
import LoadSpinner from '../tools/LoadSpinner';
import styles from '../../styling/master.scss';

export default function SetPicker(props) {
    const dispatch = useDispatch();
    const { setNest, activeTeamId, setsFetching, setsFetched } = useSelector(state => state.user);

    const [tabs, setTabs] = useState([]);

    useEffect(() => {
        console.log('dispatch')
        if (!setNest.get(activeTeamId)) {
            dispatch(fetchSets(activeTeamId));
        }
        else if (setsFetched && !setsFetching) {
            setTabs([...setNest.get(activeTeamId).values()].map(s => {
                console.log(s)
                return (
                    <div className='set-tab'>
                        <img className="sprite" src={s.sprite_link} />
                    </div>
                )
            }));
        }
    }, [setNest.size, activeTeamId]);

    return (
        <div className="set-tabs-wrapper">
            <LoadSpinner isLoading={setsFetching || !setsFetched}>
                {tabs}
            </LoadSpinner>
        </div>
    )
}