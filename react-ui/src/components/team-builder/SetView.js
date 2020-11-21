import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSet } from '../../redux/actions/userActions';
import FocusTextForm from "./FocusTextForm";
import { Plus, Trash } from '../icons/FAIcons';
import styles from '../../styling/master.scss';
import SetViewButtonBar from './SetViewButtonBar';
import SetPicker from './SetPicker';

export default function SetView() {

    return (
        <div className="set-view">
            <SetViewButtonBar />
            <div className='set-view-content-wrapper'>
                <SetPicker />
            </div>
        </div>
    )
}