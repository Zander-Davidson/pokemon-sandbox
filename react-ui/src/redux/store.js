import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
// import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import rootReducer from './reducers'

// redux-persist is used to save redux tree in between browser refreshes
// const persistConfig = {
//     key: 'root',
//     storage: storage,
//     stateReconciler: autoMergeLevel2 // see "Merge Process" section for details.
// };

const initialState = {}
const middleware = [thunk]

// const pReducer = persistReducer(persistConfig, rootReducer);
export const store = createStore(
    rootReducer,
    initialState,
    compose(
        applyMiddleware(...middleware),
        // currently creating fatal build error in production. update redux dev tools
        // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);

// export const persistor = persistStore(store);