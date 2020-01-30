const VerifyHash = artifacts.require('./VerifyHash.sol');
let catchRevert = require('./exceptionsHelpers.js').catchRevert;

const { multiHashToBytes32, bytes32ToMultiHash } = require('../helpers');

contract('VerifyHash', accounts => {
  let verifyHash;
  const owner = accounts[0];
  const alice = accounts[1];
  const bob = accounts[2];

  beforeEach(async () => {
    verifyHash = await VerifyHash.new();
  });

  const ipfsHashes = [
    'QmahqCsAUAw7zMv6P6Ae8PjCTck7taQA6FgGQLnWdKG7U8',
    'Qmb4atcgbbN5v4CDJ8nz5QG5L2pgwSTLd3raDrnyhLjnUH'
  ];

  async function setIPFSHash(account, hash) {
    const { digest, hashFunction, size } = multiHashToBytes32(hash);
    return verifyHash.setEntry(digest, hashFunction, size, { from: account });
  }

  async function getIPFSHash(_digest) {
    const result = await verifyHash.getEntry(_digest);
    const [digest, hashFunction, size, creationDate] = [
      result[0],
      result[1],
      result[2],
      result[3]
    ];
    return { 
      hash: bytes32ToMultiHash({
        hashFunction: hashFunction.toNumber(),
        digest,
        size: size.toNumber()
      }), 
      creationDate 
    };
  }

  async function getIPFSHashes(address) {
    const result = await verifyHash.getEntries(address, 0, 5);
    const [digestArray, hashFunctionArray, sizeArray, creationDateArray] = [
      result[0],
      result[1],
      result[2],
      result[3]
    ];
    return digestArray.map((digest, i) => ({
      hash: bytes32ToMultiHash({
        hashFunction: hashFunctionArray[i].toNumber(),
        digest,
        size: sizeArray[i].toNumber()
      }),
      creationDate: creationDateArray[i]
    }));
  }

  it('should get IPFS hash after setting', async () => {
    await setIPFSHash(alice, ipfsHashes[0]);
    const { digest, size, hashFunction } = multiHashToBytes32(ipfsHashes[0]);
    const { hash } = await getIPFSHash(digest);
    expect(hash).to.equal(ipfsHashes[0]);
  });

  it('should fire event when new entry is set', async () => {
    const result = await setIPFSHash(alice, ipfsHashes[0]);
    const { digest, size, hashFunction } = multiHashToBytes32(ipfsHashes[0]);

    const expectedEventResult = {
      key: alice,
      digest,
      size,
      hashFunction,
      entryCount: 0
    };

    const logEntryKey = result.logs[0].args.key;
    const logEntryDigest = result.logs[0].args.digest;
    const logEntrySize = result.logs[0].args.size;
    const logEntryHashFunction = result.logs[0].args.hashFunction;
    const logEntryEntryCount = result.logs[0].args.entryCount;

    assert.equal(
      expectedEventResult.key,
      alice,
      'EntrySet event key property not emitted, check setEntry method'
    );
    assert.equal(
      expectedEventResult.digest,
      logEntryDigest,
      'EntrySet event digest property not emitted, check setEntry method'
    );
    assert.equal(
      expectedEventResult.size,
      logEntrySize,
      'EntrySet event size property not emitted, check setEntry method'
    );
    assert.equal(
      expectedEventResult.hashFunction,
      logEntryHashFunction,
      'EntrySet event hashFunction property not emitted, check setEntry method'
    );
    assert.equal(
      expectedEventResult.entryCount,
      logEntryEntryCount,
      'EntrySet event logEntryEntryCount property not emitted, check setEntry method'
    );
  });

  it('should set hash for the digest', async () => {
    await setIPFSHash(alice, ipfsHashes[0]);
    await setIPFSHash(bob, ipfsHashes[1]);
    const { digest, size, hashFunction } = multiHashToBytes32(ipfsHashes[0]);
    const {
      digest: digest2,
      size: size2,
      hashFunction: hashFunction2
    } = multiHashToBytes32(ipfsHashes[1]);
    const { hash } = await getIPFSHash(digest);
    const { hash: hash2 } = await getIPFSHash(digest2);
    expect(hash).to.equal(ipfsHashes[0]);
    expect(hash2).to.equal(ipfsHashes[1]);
  });

  it('should set hash for the users', async () => {
    await setIPFSHash(alice, ipfsHashes[0]);
    await setIPFSHash(bob, ipfsHashes[1]);
    const aliceHashes = await getIPFSHashes(alice);
    const bobHashes = await getIPFSHashes(bob);
    const { hash } = aliceHashes[0];
    const { hash: hash2 } = bobHashes[0];
    expect(hash).to.deep.equal(ipfsHashes[0]);
    expect(hash2).to.deep.equal(ipfsHashes[1]);
  });

  it('should not set the hash if contract is shut off', async () => {
    await verifyHash.toggleContractActive({ from: owner });
    await setIPFSHash(alice, ipfsHashes[0]);
    await setIPFSHash(bob, ipfsHashes[1]);
    const aliceHashes = await getIPFSHashes(alice);
    const bobHashes = await getIPFSHashes(bob);
    expect(aliceHashes).to.deep.equal([]);
    expect(bobHashes).to.deep.equal([]);
  });

  it('should not shut the contract off if not the contract owner', async () => {
    await catchRevert(verifyHash.toggleContractActive({ from: alice }));
    await setIPFSHash(alice, ipfsHashes[0]);
    await setIPFSHash(bob, ipfsHashes[1]);
    const aliceHashes = await getIPFSHashes(alice);
    const bobHashes = await getIPFSHashes(bob);
    const { hash, creationDate } = aliceHashes[0];
    const { hash: hash2 } = bobHashes[0];
    expect(hash).to.equal(ipfsHashes[0]);
    expect(hash2).to.equal(ipfsHashes[1]);
  });

  it('should not set entry if bad format', async () => {
    try {
      await verifyHash.setEntry('digest', 'hashFunction', 'size', {
        from: alice
      });
    } catch (e) {
      expect(e.message).to.contain('invalid bytes32')
    }
    const aliceHashes = await getIPFSHashes(alice);
    const { hash } = alice[0];
    expect(hash).to.equal(undefined);
  });

  it('should only return the requested number of entries', async () => {
    await setIPFSHash(alice, ipfsHashes[0]);
    await setIPFSHash(alice, ipfsHashes[1]);
    const result = await verifyHash.getEntries(alice, 0, 1);
    const [digestArray, hashFunctionArray, sizeArray, creationDateArray, newCursorLength] = [
      result[0],
      result[1],
      result[2],
      result[3],
      result[4]
    ];
    const aliceHashes =  digestArray.map((digest, i) => ({
      hash: bytes32ToMultiHash({
        hashFunction: hashFunctionArray[i].toNumber(),
        digest,
        size: sizeArray[i].toNumber()
      }),
      creationDate: creationDateArray[i]
    }));
    const { hash } = aliceHashes[0];
    expect(hash).to.equal(ipfsHashes[0]);
    expect(aliceHashes[1]).to.equal(undefined);
    expect(newCursorLength.toNumber()).to.equal(1);
  });

  it('should have a creation date', async () => {
    await setIPFSHash(alice, ipfsHashes[0]);
    const aliceHashes = await getIPFSHashes(alice);
    const { hash, creationDate } = aliceHashes[0];
    expect(hash).to.equal(ipfsHashes[0]);
    expect(creationDate).to.exist;
  });

  it('should not allow the same hash to be stored twice', async () => {
    await setIPFSHash(alice, ipfsHashes[0]);
    await catchRevert(setIPFSHash(bob, ipfsHashes[0]));
    const aliceHashes = await getIPFSHashes(alice);
    const bobHashes = await getIPFSHashes(bob);
    const { hash, creationDate } = aliceHashes[0];
    expect(hash).to.equal(ipfsHashes[0]);
    expect(bobHashes[0]).to.equal(undefined);
  });

  it('should get entry length', async () => {
    await setIPFSHash(alice, ipfsHashes[0]);
    const aliceLength = await verifyHash.getEntriesLength(alice)
    expect(aliceLength.toNumber()).to.equal(1);
  });
});
