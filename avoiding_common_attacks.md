# Common Attacks

## TxOrigin Attack

Avoided using tx.origin. Used msg.sender.

## Denial of Service Attack

To avoid looping over an array of indeterminable lenght I added pagination to the getEntries method. To help with this I added a getEntriesLength method to allow the user to determine how many there are.

## Reentrancy

No external contracts called.

## Integer Overflow and Underflow

The only arithmetic operations that I call is increasing the entryCount by 1 each time, which should be safe from this problem.
 