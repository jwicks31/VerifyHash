# VERIFY IPFS HASH

## ABOUT

The goal of this project is to be able to store a document on IPFS and keep a record of the hash and when it was created on the blockchain. The contract will store a digest, hashFunc, and size that represent an IPFS Multihash. The hash can be retreived by either the digest or by returning all hashes for a user address.

## FrontEnd

The FrontEnd Application Implements Sending Text To IPFS and Storing the Hash On Chain.

To run the application:

```cli
 cd frontend
 npm i
 npm run dev
```

Then visit localhost:3000 in your browser.

To use the application enter some text in the text box and press send text. This will start the process by sending the text to IPFS, please do not leave the page during this step for it to complete. Once the transaction succeffully posts to IPFS and returns a hash, MetaMask will ask you to verify the transcation that will store the hash with the VerifyHash Contract. Once MetaMask says the transaction was successful you can refresh the page. This will fetch all entries for the currently signed in MetaMask user. You can then use the button next to each entry to fetch from IPFS.


## Contracts

To test run a local blockchain on Port 7545.

```cli
  truffle compile
  truffle migrate
  truffle test
```