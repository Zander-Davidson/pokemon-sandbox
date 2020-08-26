import React from 'react'
import { Link } from 'react-router-dom'
import Posts from './Posts'
import PostForm from './PostForm'
import TeamTesting from './team-builder/TeamTesting'

export default function Home() {
    return (
        <div>
            <hr/>
            <PostForm/>
            <hr/>
            <Posts/>
        </div>
    )
}