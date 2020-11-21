import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSets, setActiveSet } from '../../redux/actions/userActions';
import LoadSpinner from '../tools/LoadSpinner';
import styles from '../../styling/master.scss';

export default function SetPicker(props) {
    const dispatch = useDispatch();
    const { setNest, activeTeamId, setsFetching, setsFetched, teamPreviews } = useSelector(state => state.user);

    const [tabs, setTabs] = useState([]);

    useEffect(() => {
        if (!setNest.get(activeTeamId)) {
            dispatch(fetchSets(activeTeamId));
        }
        else if (setsFetched && !setsFetching) {
            setTabs([...setNest.get(activeTeamId).values()].map(s => {
                return <Set set={s} />
            }));
        }
    }, [teamPreviews, activeTeamId, setNest.get(activeTeamId)]);

    return (
        <div className="set-tabs-wrapper">
            <LoadSpinner isLoading={setsFetching || !setsFetched}>
                {tabs}
            </LoadSpinner>
        </div>
    )
}

const defaultClassName = 'set-tab';
const activeClassName = 'set-tab-active';

function Set(props) {
    const dispatch = useDispatch();
    const { activeSetId } = useSelector(state => state.user);

    const handleSetClick = () => {
        if (props.set.set_id != activeSetId) {
            dispatch(setActiveSet(props.set.set_id));
        } else {
            dispatch(setActiveSet(null))
        }
    };

    return (
        <div className={props.set.set_id == activeSetId ? activeClassName : defaultClassName} onClick={handleSetClick}>
            <img className="sprite" src={props.set.sprite_link} />
        </div>
    )
}
