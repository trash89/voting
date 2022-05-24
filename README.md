Study case of the Voting contract, from [Solidity documentation, voting](https://docs.soliditylang.org/en/latest/solidity-by-example.html#voting/)

## Frontend on the Hardhat network

![Voting app ](./voting_frontend.png)

I use brownie to compile and deploy into hardhat in order to have the console.log feature.
You should start the hardhat node in another terminal and folder (`hh node`), then, in a terminal :

```bash
brownie compile
brownie run scripts/deploy.py --network hh-local
```
