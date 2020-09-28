import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route } from 'react-router-dom'
import { checkLoggedIn } from '../../redux/actions/authActions';

export default function ProtectedRoute(props) {
    const dispatch = useDispatch();

    const { isLoggedIn } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(checkLoggedIn());
    }, []);

    let content = isLoggedIn ?
        <Route path={props.path} component={props.component} />
        : <Redirect to="/login"/>

    return content
}