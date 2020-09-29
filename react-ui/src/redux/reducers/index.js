import { combineReducers } from "redux";
import authReducer from './authReducer';
import messageReducer from './messageReducer';
import postReducer from './postReducer';
import pokemonReducer from "./pokemonReducer";
import moveReducer from "./moveReducer";
import itemsReducer from "./itemsReducer";
import abilitiesReducer from "./abilitiesReducer";
import naturesReducer from "./naturesReducer";
import userTeamsReducer from "./userTeamsReducer";
import iconsReducer from "./iconsReducer";
// import userSetsReducer from "./userSetsReducer";

export default combineReducers({
    auth: authReducer,
    icons: iconsReducer,
    message: messageReducer,
    posts: postReducer,
    pokemon: pokemonReducer,
    moves: moveReducer,
    items: itemsReducer,
    abilities: abilitiesReducer,
    natures: naturesReducer,
    userTeams: userTeamsReducer,
    // userSets: userSetsReducer,
})