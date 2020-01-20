pragma solidity ^0.5.0;

contract VerifyHash {
    //
    // State variables
    //
    struct Multihash {
        bytes32 digest;
        uint8 hashFunction;
        uint8 size;
        uint id;
    }
    struct User {
        uint entryCount;
        mapping (uint => Multihash) entries;
    }
    mapping (address => User) users;
    mapping (bytes32 => Multihash) private hashes;
    address public owner;

    //
    // Events - publicize actions to external listeners
    //
    event EntrySet (
        address indexed key,
        bytes32 indexed digest,
        uint8 hashFunction,
        uint8 size,
        uint entryCount
    );

    //
    // Functions
    //
    constructor() public {
        owner = msg.sender;
    }

    function setEntry(bytes32 _digest, uint8 _hashFunction, uint8 _size)
        public
        {
            Multihash memory entry = Multihash(_digest, _hashFunction, _size, users[msg.sender].entryCount);
            users[msg.sender].entries[users[msg.sender].entryCount] = entry;
            hashes[_digest] = entry;
            emit EntrySet(
                msg.sender,
                _digest,
                _hashFunction,
                _size,
                users[msg.sender].entryCount
            );
            users[msg.sender].entryCount ++;
        }

    function getEntries(address _address)
        public view returns (bytes32[] memory, uint8[] memory, uint8[] memory)
        {
            User storage user = users[_address];
            bytes32[]    memory digest = new bytes32[](user.entryCount);
            uint8[]  memory hashFunction = new uint8[](user.entryCount);
            uint8[]    memory size = new uint8[](user.entryCount);
            for (uint i = 0; i < user.entryCount; i++) {
                Multihash storage multihash = user.entries[i];
                digest[i] = multihash.digest;
                hashFunction[i] = multihash.hashFunction;
                size[i] = multihash.size;
            }

            return (digest, hashFunction, size);
        }

    function getEntry(bytes32 _digest)
        public view
        returns(bytes32 digest, uint8 hashfunction, uint8 size)
        {
            Multihash storage entry = hashes[_digest];
            return (
                entry.digest, entry.hashFunction, entry.size
            );
        }
}
