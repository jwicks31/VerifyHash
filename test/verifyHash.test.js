const VerifyHash = artifacts.require("./VerifyHash.sol")

const { multiHashToBytes32, bytes32ToMultiHash } = require('../helpers');


contract('VerifyHash', accounts => {
  let verifyHash;
  const owner = accounts[0]
  const alice = accounts[1]
  const bob = accounts[2]

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
    const [digest, hashFunction, size] = [result[0], result[1], result[2]]
    return bytes32ToMultiHash({ hashFunction: hashFunction.toNumber(), digest, size: size.toNumber()});
  }

  async function getIPFSHashes(address) {
    const result = await verifyHash.getEntries(address);
    const [digestArray, hashFunctionArray, sizeArray] = [result[0], result[1], result[2]];
    return digestArray.map((digest, i) =>
      bytes32ToMultiHash({
        hashFunction: hashFunctionArray[i].toNumber(),
        digest,
        size: sizeArray[i].toNumber()
      })
    );
  }

  it('should get IPFS hash after setting', async () => {
    await setIPFSHash(alice, ipfsHashes[0]);
    const { digest, size, hashFunction } = multiHashToBytes32(ipfsHashes[0]);

    expect(await getIPFSHash(digest)).to.equal(ipfsHashes[0]);
  });

  it("should fire event when new entry is set", async() => {
    const result = await setIPFSHash(alice, ipfsHashes[0])
    const { digest, size, hashFunction } = multiHashToBytes32(ipfsHashes[0]);
    
    const expectedEventResult = {key: alice, digest, size, hashFunction, entryCount: 0 };

    const logEntryKey = result.logs[0].args.key
    const logEntryDigest = result.logs[0].args.digest
    const logEntrySize = result.logs[0].args.size
    const logEntryHashFunction = result.logs[0].args.hashFunction
    const logEntryEntryCount = result.logs[0].args.entryCount;

    assert.equal(expectedEventResult.key, alice, "EntrySet event key property not emitted, check setEntry method");
    assert.equal(expectedEventResult.digest, logEntryDigest, "EntrySet event digest property not emitted, check setEntry method")
    assert.equal(expectedEventResult.size, logEntrySize, "EntrySet event size property not emitted, check setEntry method")
    assert.equal(expectedEventResult.hashFunction, logEntryHashFunction, "EntrySet event hashFunction property not emitted, check setEntry method")
    assert.equal(expectedEventResult.entryCount, logEntryEntryCount, "EntrySet event logEntryEntryCount property not emitted, check setEntry method")
  })

  it('should set IPFS hash for the digest', async () => {
    await setIPFSHash(alice, ipfsHashes[0]);
    await setIPFSHash(bob, ipfsHashes[1]);
    const {
      digest,
      size,
      hashFunction
    } = multiHashToBytes32(ipfsHashes[0]);

    const {
      digest: digest2,
      size: size2,
      hashFunction: hashFunction2
    } = multiHashToBytes32(ipfsHashes[1]);
    expect(await getIPFSHash(digest)).to.equal(ipfsHashes[0]);
    expect(await getIPFSHash(digest2)).to.equal(ipfsHashes[1]);
  });

  it('should set IPFS hash for the users', async () => {
    await setIPFSHash(alice, ipfsHashes[0]);
    await setIPFSHash(bob, ipfsHashes[1]);
    const { digest, size, hashFunction } = multiHashToBytes32(ipfsHashes[0]);
    expect(await getIPFSHashes(alice)).to.deep.equal([ipfsHashes[0]]);
    expect(await getIPFSHashes(bob)).to.deep.equal([ipfsHashes[1]]);
  });
});
