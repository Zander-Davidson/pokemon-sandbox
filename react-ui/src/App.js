import React, { useEffect } from 'react';
import { clearMessage } from "./redux/actions/messageActions";
import { checkLoggedIn } from "./redux/actions/authActions";
import { history } from "./helpers/history";
import { useDispatch, useSelector } from "react-redux";
import { fetchPokemonNames } from './redux/actions/pokemonActions';
import { fetchMoveNames } from './redux/actions/movesActions';
import { fetchAbilityNames } from './redux/actions/abilitiesActions';
import { fetchTypes } from './redux/actions/typesActions';
import { fetchItemNames } from './redux/actions/itemsActions';
import { fetchNatures } from './redux/actions/naturesActions';
import { updateWindowSize } from "./redux/actions/windowActions";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Header from './components/Header'
import logo from './logo.svg';
import styles from './styling/master.scss';
import Home from './components/Home';
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

  const { typeData } = useSelector(state => state.types);
  const { pokemonNames } = useSelector(state => state.pokemon);
  const { abilityNames } = useSelector(state => state.abilities);
  const { moveNames } = useSelector(state => state.moves);
  const { itemNames } = useSelector(state => state.items);
  const { natures } = useSelector(state => state.natures);


  useEffect(() => {
      if (pokemonNames.length === 0 || typeData.length === 0 
          || abilityNames.length === 0 || moveNames.length === 0 
          || itemNames.length === 0 || natures.length === 0) {
          dispatch(fetchPokemonNames());
          dispatch(fetchTypes());
          dispatch(fetchMoveNames());
          dispatch(fetchAbilityNames());
          dispatch(fetchItemNames());
          dispatch(fetchNatures());
      }
  }, []);

  useEffect(() => {
    let windowListener = dispatch(updateWindowSize(window.innerWidth, window.innerHeight));

    window.addEventListener('resize', windowListener);
    return () => {
      window.removeEventListener('resize', windowListener);
    }
  }, []);

  dispatch(checkLoggedIn());

  // standard react-router-dom site layout
  return (
    <div className="App">
      <Router history={history}>
        <Header />
        <div className="page">
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/home' component={Home} />
            <Route path='/pokedex' component={Pokedex} />
            <Route path='/movedex' component={Movedex} />
            <Route path='/teambuilder' component={TeamBuilder} />
            <Route path='/login' component={Login} />
            <Route path='/signup' component={Signup} />

            {/* <Route path='/damage-calculator' component={DamageCalculator} /> */}
            {/* <Route path='/insertPokedexData' component={FetchPokedexData} /> */}
          </Switch>
        </div>
      </Router>
    </div>
  );
}
