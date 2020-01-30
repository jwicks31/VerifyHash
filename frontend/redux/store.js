import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { logger } from 'redux-logger';
import myContractArtifacts from '../features/web3/VerifyHash.json'
import { rootReducer } from './reducers';
import mySaga from './sagas';

const devMode = process.env.NODE_ENV !== `production`;

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers =
  (process.browser && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const middlewares = [sagaMiddleware];

if (devMode) {
  middlewares.push(logger);
}

export default (initialState) => {
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  );
  sagaMiddleware.run(mySaga);
  return store;
};
