import React, { useEffect, useState } from 'react';
import TeamPreview from "./TeamPreview";
import { Button } from "react-bootstrap";
import styles from '../../styling/master.scss';

export default function TeamView() {

    return (
        <div className="team-view">
            <Button size="sm">New Team</Button>
            <div className="team-previews-wrapper">
                <TeamPreview/>
                <TeamPreview/>
                <TeamPreview/>
                <TeamPreview/>
                <TeamPreview/>
                <TeamPreview/>
                <TeamPreview/>
                <TeamPreview/>
                <TeamPreview/>
                <TeamPreview/>
            </div>
        </div>
    )
}