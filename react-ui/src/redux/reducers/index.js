import { combineReducers } from "redux";
import windowReducer from './windowReducer';
import messageReducer from './messageReducer';
import pokemonReducer from "./pokemonReducer";
import typesReducer from "./typesReducer";
import moveReducer from "./moveReducer";
import itemsReducer from "./itemsReducer";
import abilitiesReducer from "./abilitiesReducer";
import naturesReducer from "./naturesReducer";
import iconsReducer from "./iconsReducer";
// import userSetsReducer from "./userSetsReducer";

export default combineReducers({
    window: windowReducer,
    icons: iconsReducer,
    message: messageReducer,
    pokemon: pokemonReducer,
    types: typesReducer,
    moves: moveReducer,
    items: itemsReducer,
    abilities: abilitiesReducer,
    natures: naturesReducer,
    // userSets: userSetsReducer,
})