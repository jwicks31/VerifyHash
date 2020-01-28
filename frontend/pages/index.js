import React, { useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import NoMetaMask from '../components/NoMetaMask';
import {
  initWeb3,
  fetchEntries,
  getContract,
  getAccounts,
  getEntries
} from '../features/web3/reducer';
import { fetchFromIPFS, getIPFSResults } from '../features/ipfs/reducer';

import { sendToIPFS } from '../features/ipfs/reducer';
import { Form, Icon, Input, Button, List } from 'antd';
import Web3 from 'web3';
import Utils from '../../helpers';

const hasErrors = (fieldsError) => Object.keys(fieldsError).some(field => fieldsError[field]);
const TextUploadForm = props => {
  const {
    getFieldDecorator,
    getFieldsError,
    getFieldError,
    isFieldTouched,
    validateFields
  } = props.form;
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
  return (
    <Form layout="inline" onSubmit={handleSubmit}>
      <Form.Item
        validateStatus={textError ? 'error' : ''}
        help={textError || ''}
      >
        {getFieldDecorator('text', {
          rules: [{ required: true, message: 'Please input your text!' }]
        })(
          <Input
            prefix={<Icon type="build" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Verify Your Text Here!"
          />
        )}
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          disabled={hasErrors(getFieldsError())}
        >
          Send Text
        </Button>
      </Form.Item>
    </Form>
  );
};

const WrappedTextUploadForm = Form.create({ name: 'horizontal_text' })(
  TextUploadForm
);

const Entries = props => {
  const entries = useSelector(getEntries);
  const ipfsResults = useSelector(getIPFSResults);
  const dispatch = useDispatch();
  const handleClick = hash => {
    dispatch(fetchFromIPFS(hash));
  };
  return (
    <List
      header={<div>Your Saved Hashes</div>}
      bordered
      dataSource={entries}
      renderItem={item => (
        <List.Item>
          <List.Item.Meta
            title={ipfsResults[item] ? ipfsResults[item] : <button onClick={() => handleClick(item)}>Get From IPFS</button>}
          />
          {item}
        </List.Item>
      )}
    />
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
  accounts: getAccounts(state)
});

export default connect(mapStateToProps)(Index);
