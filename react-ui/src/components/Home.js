import React from 'react'
import { Link } from 'react-router-dom'
import Posts from './Posts'
import PostForm from './PostForm'
import TeamTesting from './team-builder/TeamTesting'
import styles from '../styling/master.scss';

export default function Home() {
    return (
        <div className="page">
            <hr/>
            <PostForm/>
            <hr/>
            <Posts/>
        </div>
    )
}