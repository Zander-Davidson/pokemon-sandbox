import React, { useCallback, useEffect, useState } from 'react';
import store from './store'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Header from './components/Header'
import logo from './logo.svg';
import './App.css';
import FetchPokedexData from './components/FetchPokedexData'
import Home from './components/Home'
import TeamBuilder from './components/team-builder/TeamBuilder'
import DamageCalculator from './components/DamageCalculator';
import Pokedex from './components/pokedex/Pokedex';
import Movedex from './components/pokedex/Movedex'


// TODO: might be able to use a context here to get pokedex info all the way down to set editor

export default function App() {
    
  // standard react-router-dom site layout
  return (
    <div className="App">
fdsafwdfas
      {/* <Provider store={store}> */}
        {/* <Router> */}
          {/* <Header/> */}
          {/* <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/home' component={Home} />
            <Route path='/pokedex' component={Pokedex} />
            <Route path='/movedex' component={Movedex} />
            <Route path='/team-builder' component={TeamBuilder} />
        
            //<Route path='/damage-calculator' component={DamageCalculator} />
            <Route path='/insertPokedexData' component={FetchPokedexData} />
          </Switch> */}
        {/* </Router> */}
      {/* </Provider> */}

    </div>
  );
}
