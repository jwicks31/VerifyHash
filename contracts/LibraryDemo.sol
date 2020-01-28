pragma solidity ^0.5.0;

import "bytes/BytesLib.sol";

/// @title Contract for LibraryDemo
/// @notice Demonstrates usage of a package from  ethPM registry

contract LibraryDemo {
	using BytesLib for bytes;
	function getFullName(bytes memory _title, bytes memory _fName, bytes memory _lName)
  	public pure returns (bytes memory)
	{
		bytes memory fullName = _title.concat(" ").concat(_fName).concat(" ").concat(_lName);
		return fullName;
	}
	function getTitle(bytes memory _fullName)
  	public pure returns (bytes memory)
	{
		bytes memory lastName = _fullName.slice(0, 3);
		return lastName;
	}
}