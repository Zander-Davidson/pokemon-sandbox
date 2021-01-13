import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FocusTextForm from "./FocusTextForm";
import { Plus, Trash } from '../icons/FAIcons';
import styles from '../../styling/master.scss';
import SetViewButtonBar from './SetViewButtonBar';
import SetPicker from './SetPicker';
import SetEditor from './SetEditor';

export default function SetView() {
    const { setNest, activeTeamId, activeSetId, activeSetOptions } = useSelector(state => state.user);
    
    const [editor, setEditor] = useState(null);
    
    useEffect(() => {
        var set = setNest.get(activeTeamId) ?
            setNest.get(activeTeamId).get(activeSetId)
            : null;

        setEditor(set && activeSetOptions ? <SetEditor key={set.set_id} set={set} setOptions={activeSetOptions}/> : null);
    }, [activeTeamId, activeSetId, activeSetOptions]);

    return (
        <div className="set-view">
            <SetViewButtonBar />
            <div className='set-view-content-wrapper'>
                <SetPicker/>
                {editor || <>Choose or create a set to get started</>}
            </div>
        </div>
    )
}