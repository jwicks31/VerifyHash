const SEND_TO_IPFS = 'SEND_TO_IPFS';
const SEND_TO_IPFS_SUCCESS = 'SEND_TO_IPFS_SUCCESS';
const SEND_TO_IPFS_ERROR = 'SEND_TO_IPFS_ERROR';
const FETCH_FROM_IPFS = 'FETCH_FROM_IPFS';
const FETCH_FROM_IPFS_SUCCESS = 'FETCH_FROM_IPFS_SUCCESS';
const FETCH_FROM_IPFS_ERROR = 'FETCH_FROM_IPFS_ERROR';

export const slice = 'IPFS';
export const initialState = {
  results: {},
  isFetching: {},
  isSending: false,
  error: {
    status: false,
    message: ''
  }
};

/* Actions */
export const sendToIPFS = text => ({
  type: SEND_TO_IPFS,
  payload: text
});
export const sendToIPFSSuccess = () => ({
  type: SEND_TO_IPFS_SUCCESS
});
export const sendToIPFSError = error => ({
  type: SEND_TO_IPFS_ERROR,
  payload: error
});

export const fetchFromIPFS = hash => ({ type: FETCH_FROM_IPFS, payload: hash });
export const fetchFromIPFSSuccess = result => ({
  type: FETCH_FROM_IPFS_SUCCESS,
  payload: result
});
export const fetchFromIPFSError = (error, hash) => ({
  type: FETCH_FROM_IPFS_ERROR,
  payload: { error, hash }
});

/* Selectors */
export const getError = state =>
  state[slice].error.status && state[slice].error.message;
export const getIPFSResults = state =>
  state[slice].results
export const getIPFSIsFetching = state => state[slice].isFetching;
export const getIPFSIsSending = state => state[slice].isSending;

/* Reducer */
export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SEND_TO_IPFS:
      return {
        ...state,
        error: {
          ...initialState.error
        },
        isSending: true,
        text: payload
      };
    case SEND_TO_IPFS_SUCCESS:
      return {
        ...state,
        error: {
          ...initialState.error
        },
        isSending: false,
        text: ''
      };
    case SEND_TO_IPFS_ERROR:
      return {
        ...state,
        error: {
          status: true,
          message: payload
        },
        isSending: false
      };
    case FETCH_FROM_IPFS:
      return {
        ...state,
        error: {
          ...initialState.error
        },
        isFetching: {
          ...state.isFetching,
          [payload.hash]: true
        },
        text: ''
      };
    case FETCH_FROM_IPFS_SUCCESS:
      return {
        ...state,
        error: {
          ...initialState.error
        },
        isFetching: {
          ...state.isFetching,
          [payload.hash]: false
        },
        results: {
          ...state.results,
          [payload.hash]: payload.result
        }
      };
    case FETCH_FROM_IPFS_ERROR:
      return {
        ...state,
        error: {
          status: true,
          message: payload.error
        },
        result: {
          ...state.results,
          [payload.hash]: 'Error Retrieving From IPFS'
        },
        isFetching: {
          ...state.isFetching,
          [payload.hash]: false
        }
      };
    default:
      return state;
  }
};
