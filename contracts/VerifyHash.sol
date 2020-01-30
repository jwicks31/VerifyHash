pragma solidity ^0.5.0;

contract VerifyHash {
    //
    // State variables
    //
    bool private stopped = false;
    address private owner;

    struct Multihash {
        bytes32 digest;
        uint8 hashFunction;
        uint8 size;
        uint id;
        uint256 creation_date;
        uint8 flag;
    }
    struct User {
        uint entryCount;
        mapping (uint => Multihash) entries;
    }
    mapping (address => User) users;
    mapping (bytes32 => Multihash) private hashes;

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

    modifier isAdmin() {if(msg.sender != owner) revert('You are not the contract owner'); _;}


    modifier stopInEmergency {if (!stopped) _;}

    //
    // Functions
    //
    constructor() public {
        owner = msg.sender;
    }

    function toggleContractActive() public isAdmin
    {
        stopped = !stopped;
    }

    function setEntry(bytes32 _digest, uint8 _hashFunction, uint8 _size)
        public stopInEmergency
        {
            Multihash memory previousEntry = hashes[_digest];
            require (previousEntry.flag != 1, "This hash already exists.");
            Multihash memory entry = Multihash(_digest, _hashFunction, _size, users[msg.sender].entryCount, now, 1);
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

    function getEntries(address _address, uint256 cursor, uint256 howMany)
        public view returns (bytes32[] memory, uint8[] memory, uint8[] memory, uint256[] memory, uint256 newCursor)
        {
            User storage user = users[_address];
            uint256 length = howMany;
            if (length > user.entryCount - cursor) {
                length = user.entryCount - cursor;
            }

            bytes32[]    memory digest = new bytes32[](length);
            uint8[]  memory hashFunction = new uint8[](length);
            uint8[]    memory size = new uint8[](length);
            uint256[] memory creation_date = new uint256[](length);
            for (uint i = 0; i < length; i++) {
                uint cursorInt = cursor + i;
                Multihash storage multihash = user.entries[cursorInt];
                digest[cursorInt] = multihash.digest;
                hashFunction[cursorInt] = multihash.hashFunction;
                size[cursorInt] = multihash.size;
                creation_date[cursorInt] = multihash.creation_date;
            }
            newCursor = cursor + length;
            return (digest, hashFunction, size, creation_date, newCursor);
        }

    function getEntriesLength(address _address)
        public view returns (uint256 length)
        {
            return (users[_address].entryCount);
        }

    function getEntry(bytes32 _digest)
        public view
        returns(bytes32 digest, uint8 hashfunction, uint8 size, uint256 creation_date)
        {
            Multihash storage entry = hashes[_digest];
            return (
                entry.digest, entry.hashFunction, entry.size, entry.creation_date
            );
        }
}
