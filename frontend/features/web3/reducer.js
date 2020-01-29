const INIT_WEB_3 = 'INIT_WEB_3';
const INIT_WEB_3_SUCCESS = 'INIT_WEB_3_SUCCESS';
const INIT_WEB_3_ERROR = 'INIT_WEB_3_ERROR';

const FETCH_ENTRIES = 'FETCH_ENTRIES';
const FETCH_ENTRIES_SUCCESS = 'FETCH_ENTRIES_SUCCESS';
const FETCH_ENTRIES_ERROR = 'FETCH_ENTRIES_ERROR';

const SEND_VERIFY_HASH = 'SEND_VERIFY_HASH';
const SEND_VERIFY_HASH_SUCCESS = 'SEND_VERIFY_HASH_SUCCESS';
const SEND_VERIFY_HASH_ERROR = 'SEND_VERIFY_HASH_ERROR';

export const slice = 'web3';
export const initialState = {
  accounts: [],
  contract: null,
  entries: [],
  isLoading: false,
  error: {
    status: false,
    message: ''
  }
};

/* Actions */
export const initWeb3 = () => ({ type: INIT_WEB_3 });
export const initWeb3Success = accounts => ({
  type: INIT_WEB_3_SUCCESS,
  payload: accounts
});
export const initWeb3Error = error => ({
  type: INIT_WEB_3_ERROR,
  payload: error
});
export const fetchEntries = () => ({ type: FETCH_ENTRIES });
export const fetchEntriesSuccess = hashes => ({
  type: FETCH_ENTRIES_SUCCESS,
  payload: hashes
});
export const fetchEntriesError = error => ({
  type: FETCH_ENTRIES_ERROR,
  payload: error
});

export const sendVerifyHash = (hash) => ({ type: SEND_VERIFY_HASH, payload: hash });
export const sendVerifyHashSuccess = () => ({
  type: SEND_VERIFY_HASH_SUCCESS
});
export const sendVerifyHashError = error => ({
  type: SEND_VERIFY_HASH_ERROR,
  payload: error
});

/* Selectors */
export const getAccounts = state => state[slice].accounts;
export const getIsLoading = state => state[slice].isLoading;
export const getContract = state => state[slice].contract;
export const getEntries = state => state[slice].entries;
export const getError = state =>
  state[slice].error.status && state[slice].error.message;

/* Reducer */
export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case INIT_WEB_3:
      return {
        ...state,
        error: {
          ...initialState.error
        }
      };
    case INIT_WEB_3_SUCCESS:
      return {
        ...state,
        error: {
          ...initialState.error
        },
        accounts: payload.accounts,
        contract: payload.contract
      };
    case INIT_WEB_3_ERROR:
      return {
        ...state,
        error: {
          status: true,
          message: payload
        }
      };
    case FETCH_ENTRIES:
      return {
        ...state,
        isLoading: true,
        error: {
          ...initialState.error
        }
      };
    case FETCH_ENTRIES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: {
          ...initialState.error
        },
        entries: payload
      };
    case FETCH_ENTRIES_ERROR:
      return {
        ...state,
        isLoading: false,
        error: {
          status: true,
          message: payload
        }
      };
    case SEND_VERIFY_HASH:
      return {
        ...state,
        error: {
          ...initialState.error
        },
        currentHash: payload
      };
    case SEND_VERIFY_HASH_SUCCESS:
      return {
        ...state,
        error: {
          ...initialState.error
        },
        currentHash: ''
      };
    case SEND_VERIFY_HASH_ERROR:
      return {
        ...state,
        error: {
          status: true,
          message: payload
        }
      };
    default:
      return state;
  }
};
