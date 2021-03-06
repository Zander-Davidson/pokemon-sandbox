import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css'; // or include from a CDN
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import { store } from './redux/store';
import { Provider } from 'react-redux';
// import { persistor, store } from './redux/store';
// import { PersistGate } from 'redux-persist/lib/integration/react';
// import LoadingView from './components/tools/LoadingView';

{/* <PersistGate loading={<LoadingView />} persistor={persistor}>
        </PersistGate>  */}
ReactDOM.render(
    <Provider store={store}>
            <App/>
    </Provider>, 
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
