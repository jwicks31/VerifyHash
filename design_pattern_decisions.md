## Emergency Stop Pattern 

The Emergency Stop was a project requirement, however I don't believe it was necessary since there are no unsafe operations in the VerifyHash contract. It only adds new records to blockchain. There isn't any logic that removes or updates entries.

## Owner Pattern

This pattern was a result of needing to implement the emergency stop function. 


## Fail early and fail loud
The setEntry method immediately checks for the hash and then fails. Also the stopInEmergency modifier will fail immediately if the contract is paused.