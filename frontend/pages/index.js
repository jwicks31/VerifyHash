import React, { useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import NoMetaMask from '../components/NoMetaMask';
import {
  initWeb3,
  fetchEntries,
  getContract,
  getAccounts,
  getEntries,
  getIsLoading
} from '../features/web3/reducer';
import {
  fetchFromIPFS,
  getIPFSResults,
  getIPFSIsFetching,
  getIPFSIsSending
} from '../features/ipfs/reducer';

import { sendToIPFS } from '../features/ipfs/reducer';
import { Form, Icon, Input, Button, List } from 'antd';
import Web3 from 'web3';
import Utils from '../../helpers';

const { TextArea } = Input;
const hasErrors = (fieldsError) => Object.keys(fieldsError).some(field => fieldsError[field]);
const TextUploadForm = props => {
  const {
    getFieldDecorator,
    getFieldsError,
    getFieldError,
    isFieldTouched,
    validateFields
  } = props.form;
  const isSending = useSelector(getIPFSIsSending);
  const [error, setError] = useState({ status: false, message: '' });
  const dispatch = useDispatch();
  const textError = isFieldTouched('text') && getFieldError('text');
  const handleSubmit = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        setError({ status: true, message: 'Received values of form: ', values});
      }
      dispatch(sendToIPFS(values.text))
      setError({ status: false, message: '' });
    });
  }
  return isSending ? (
    <div className="container">
      <strong>Sending To IPFS, Please Do Not Leave This Page</strong>
      <style jsx>{`
        .container {
          display: flex;
          width: 100%;
          min-heigh: 5rem;
          align-items: center;
          justify-content: center;
          margin-bottom: 3rem;
          margin-top: 2rem;
        }
      `}</style>
    </div>
  ) : (
    <div className="container">
      <Form layout="inline" style={{ width: '60%' }} onSubmit={handleSubmit}>
        <Form.Item
          style={{ width: '100%' }}
          validateStatus={textError ? 'error' : ''}
          help={textError || ''}
        >
          {getFieldDecorator('text', {
            rules: [{ required: true, message: 'Please input your text!' }]
          })(
            <TextArea
              style={{ width: '100%' }}
              autoSize={{ minRows: 8, maxRows: 14 }}
              placeholder="Verify Your Text Here!"
              onPressEnter={handleSubmit}
            />
          )}
        </Form.Item>
        <Form.Item style={{ width: '100%' }}>
          <Button
            style={{ width: '100%' }}
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}
          >
            Send Text
          </Button>
        </Form.Item>
      </Form>
      <style jsx>{`
        .container {
          display: flex;
          width: 100%;
          min-heigh: 5rem;
          align-items: center;
          justify-content: center;
          margin-bottom: 3rem;
          margin-top: 2rem;
        }
      `}</style>
    </div>
  );
};

const WrappedTextUploadForm = Form.create({ name: 'horizontal_text' })(
  TextUploadForm
);

const Header = () => (
  <div className="container">
    Your Saved Hashes
    <style jsx>{`
      .container {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `}</style>
  </div>
);

const Entries = props => {
  const entries = useSelector(getEntries);
  const ipfsResults = useSelector(getIPFSResults);
  const ipfsIsFetching = useSelector(getIPFSIsFetching);
  const isFetchingEntries = useSelector(getIsLoading);
  const dispatch = useDispatch();
  const handleClick = hash => {
    dispatch(fetchFromIPFS(hash));
  };
  return (
    <div className="container">
      <List
        itemLayout="horizontal"
        header={<Header />}
        bordered
        loading={isFetchingEntries}
        dataSource={entries}
        renderItem={item => (
          <List.Item>
            <div>
              {ipfsIsFetching[item.hash] || ipfsResults[item.hash] ? (
                ipfsIsFetching[item.hash] ? (
                  <p>'Fetching...'</p>
                ) : (
                  <p>
                    <strong>From IPFS:</strong> {ipfsResults[item.hash]}
                  </p>
                )
              ) : (
                <button onClick={() => handleClick(item.hash)}>
                  Get From IPFS
                </button>
              )}
              <p>
                <strong>Hash:</strong> {item.hash}
              </p>
              <p>
                <strong>Date Saved:</strong> {item.creationDate.toString()}
              </p>
            </div>
          </List.Item>
        )}
      />
      <style jsx>{`
        .container {
          height: 100%;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  );
}

class Index extends React.Component {
  static async getInitialProps(props) {
    const { isServer } = props.ctx;
    return { isServer };
  }

  componentDidMount() {
    this.props.dispatch(initWeb3());
  }

  componentDidUpdate(prevProps) {
    if (prevProps.accounts.length === 0 && this.props.accounts.length !== 0) {
      this.props.dispatch(fetchEntries());
    }
  }

  render() {
    const { accounts } = this.props;
    return accounts.length !== 0 ? (
      <>
        <WrappedTextUploadForm />
        <Entries />
      </>
    ) : (
      <NoMetaMask />
    );
  }
}

const mapStateToProps = state => ({
  accounts: getAccounts(state),
  isFetchingEntries: getIsLoading(state)
});

export default connect(mapStateToProps)(Index);
