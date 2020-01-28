
import { all } from 'redux-saga/effects';

import {
  watchInitWeb3,
  watchGetEntries,
  watchSendVerifyHash
} from '../features/web3/sagas';
import { watchSendToIPFS, watchGetFromIPFS } from '../features/ipfs/sagas';
export default function* rootSaga() {
  yield all([
    watchInitWeb3(),
    watchGetEntries(),
    watchSendVerifyHash(),
    watchSendToIPFS(),
    watchGetFromIPFS()
  ]);
}
