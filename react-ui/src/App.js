import React, { useEffect } from 'react';
import { clearMessage } from "./redux/actions/messageActions";
import { checkLoggedIn } from "./redux/actions/authActions";
import { history } from "./helpers/history";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Header from './components/Header'
import logo from './logo.svg';
import './App.css';
import Home from './components/Home'
import TeamBuilder from './components/team-builder/TeamBuilder'
import DamageCalculator from './components/DamageCalculator';
import Pokedex from './components/pokedex/Pokedex';
import Movedex from './components/pokedex/Movedex'

import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedRoute from './components/tools/ProtectedRoute';


// TODO: might be able to use a context here to get pokedex info all the way down to set editor

export default function App() {
  const dispatch = useDispatch();

  // useEffect(() => {
  //   history.listen((location) => {
  //     dispatch(clearMessage()); // clear message when changing location
  //     window.location.reload();
  //   });
  // }, [dispatch]);
  
  dispatch(checkLoggedIn());

  // standard react-router-dom site layout
  return (
    <div className="App">
      <Router history={history}>
        <Header />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/home' component={Home} />
          <Route path='/pokedex' component={Pokedex} />
          <Route path='/movedex' component={Movedex} />
          <ProtectedRoute path='/teambuilder' component={TeamBuilder} />
          <Route path='/login' component={Login} />
          <Route path='/signup' component={Signup} />

          {/* <Route path='/damage-calculator' component={DamageCalculator} /> */}
          {/* <Route path='/insertPokedexData' component={FetchPokedexData} /> */}
        </Switch>
      </Router>
    </div >
  );
}
