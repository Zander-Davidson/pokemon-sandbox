import React, { useState, useEffect } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import PokemonPicker from './PokemonPicker'
import MovePicker from './MovePicker'
import AbilityPicker from './AbilityPicker'
import StatsPicker from './StatsPicker'

export default function DataView(props) {

    return (
        <Tabs>
            <TabList className='picker-tabs-wrapper'>
                <Tab>Pokemon</Tab>
                <Tab>Moves</Tab>
                <Tab>Abilities</Tab>
                <Tab>Stats</Tab>
            </TabList>

           <div className='picker-content-wrapper'>
                <TabPanel>
                    <PokemonPicker/>
                </TabPanel>
                <TabPanel>
                    <MovePicker/>
                </TabPanel>
                <TabPanel>
                    <AbilityPicker/>
                </TabPanel>
                <TabPanel>
                    <StatsPicker/>
                </TabPanel>
           </div>
        </Tabs>
    )
}
