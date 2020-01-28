import { combineReducers } from 'redux';
import {
  reducer as web3Reducer,
  slice as web3Slice
} from '../features/web3/reducer';
import {
  reducer as ipfsReducer,
  slice as ipfsSlice
} from '../features/ipfs/reducer';

export const rootReducer = combineReducers({
  [web3Slice]: web3Reducer,
  [ipfsSlice]: ipfsReducer
});
