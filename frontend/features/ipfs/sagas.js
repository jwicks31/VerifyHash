const IPFS = require('ipfs-mini');
const ipfs = new IPFS({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https'
});

import {
  sendToIPFS,
  sendToIPFSSuccess,
  sendToIPFSError,
  fetchFromIPFS,
  fetchFromIPFSSuccess,
  fetchFromIPFSError
} from './reducer';
import { sendVerifyHash } from '../web3/reducer';
import { takeEvery, call, put } from 'redux-saga/effects';
import VerifyHash from '../../../build/contracts/VerifyHash';
import Utils from '../../../helpers';

const string2Bin = str => {
  var result = [];
  for (var i = 0; i < str.length; i++) {
    result.push(str.charCodeAt(i));
  }
  return result;
};

const addIPFS = text =>
  new Promise((res, rej) => {
    ipfs
      .add(text)
      .then(res)
      .catch(rej);
  });
export function* sendToIPFSSaga(action) {
  const text = action.payload;
  try {
    const ipfsHash = yield call(addIPFS, text);
    yield put(sendVerifyHash(ipfsHash));
    yield put(sendToIPFSSuccess(ipfsHash));
  } catch (e) {
    yield put(sendToIPFSError(e.message));
  }
}

export function* watchSendToIPFS() {
  yield takeEvery(sendToIPFS().type, sendToIPFSSaga);
}

const catIPFS = hash =>
  new Promise((res, rej) => {
    ipfs.cat(hash, (err, result) => {
      if (!!err) rej(err);
      res(result);
    });
  });

export function* getFromIPFSSaga(action) {
  const hash = action.payload;
  try {
    const result = yield call(catIPFS, hash);
    yield put(fetchFromIPFSSuccess({ result, hash }));
  } catch (e) {
    yield put(fetchFromIPFSError(e.message));
  }
}

export function* watchGetFromIPFS() {
  yield takeEvery(fetchFromIPFS().type, getFromIPFSSaga);
}
