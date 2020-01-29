import {
  initWeb3,
  initWeb3Success,
  initWeb3Error,
  sendVerifyHash,
  sendVerifyHashSuccess,
  sendVerifyHashError,
  fetchEntries,
  fetchEntriesSuccess,
  fetchEntriesError,
  getContract,
  getAccounts
} from './reducer';
import { takeEvery, call, put, select } from 'redux-saga/effects';
import VerifyHash from '../../../build/contracts/VerifyHash';
import Utils from '../../../helpers';
import Web3 from 'web3';

const contractAddress = '0x73eeDec4CeeDd0BfB1c2c0402be1208eA5379306';

export function* initWeb3Saga() {
  // Modern dapp browsers...
  if (window.ethereum) {
    web3 = new Web3(web3.currentProvider);
    try {
      web3.setProvider(web3.currentProvider);
      // Request account access if needed
      const accounts = yield call(window.ethereum.enable);

      web3.eth.defaultAccount = accounts[0];
      const contract = new web3.eth.Contract(VerifyHash.abi, contractAddress);
      yield put(initWeb3Success({ accounts, contract }));
    } catch (error) {
      yield put(initWeb3Error(error.message));
      // User denied account access...
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    web3 = new Web3(web3.currentProvider);
    // Acccounts always exposed
    try {
      const accounts = yield call(web3.eth.getAccounts);
      yield put(initWeb3Success(accounts));
    } catch (e) {
      yield put(initWeb3Error(e.message));
    }
  }
  // Non-dapp browsers...
  else {
    yield put(
      initWeb3Error(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      )
    );
  }
}

export function* watchInitWeb3() {
  yield takeEvery(initWeb3().type, initWeb3Saga);
}

export function* sendVerifyHashSaga(action) {
  const hash = action.payload;
  const { digest, hashFunction, size } = Utils.multiHashToBytes32(hash);
  try {
    const contract = yield select(getContract);
    const accounts = yield select(getAccounts);
    yield call(contract.methods.setEntry(digest, hashFunction, size).send, {
      from: accounts[0]
    });
    yield put(sendVerifyHashSuccess());
  } catch (e) {
    yield put(sendVerifyHashError(e.message));
  }
}

export function* watchSendVerifyHash() {
  yield takeEvery(sendVerifyHash().type, sendVerifyHashSaga);
}

export function* fetchEntriesSaga() {
  const contract = yield select(getContract);
  const accounts = yield select(getAccounts);
  const entries = yield call(contract.methods.getEntries(accounts[0]).call);
  const [digestArray, hashFunctionArray, sizeArray, creationDateArray] = [
    entries[0],
    entries[1],
    entries[2],
    entries[3]
  ];
  const result = digestArray.map((digest, i) => ({
    hash: Utils.bytes32ToMultiHash({
      hashFunction: hashFunctionArray[i],
      digest,
      size: sizeArray[i]
    }),
    creationDate: new Date(creationDateArray[i] * 1000)
  }));
  yield put(fetchEntriesSuccess(result));
}

export function* watchGetEntries() {
  yield takeEvery(fetchEntries().type, fetchEntriesSaga);
}
