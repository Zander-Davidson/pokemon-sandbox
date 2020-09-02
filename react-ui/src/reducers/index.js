import { combineReducers } from "redux";
import postReducer from './postReducer'
import pokemonsReducer from "./pokemonsReducer";
import moveReducer from "./moveReducer";
import itemsReducer from "./itemsReducer";
import abilitiesReducer from "./abilitiesReducer";
import naturesReducer from "./naturesReducer";
import userTeamsReducer from "./userTeamsReducer"
import userSetsReducer from "./userSetsReducer";

export default combineReducers({
    posts: postReducer,
    pokemons: pokemonsReducer,
    moves: moveReducer,
    items: itemsReducer,
    abilities: abilitiesReducer,
    natures: naturesReducer,
    userTeams: userTeamsReducer,
    userSets: userSetsReducer,
})