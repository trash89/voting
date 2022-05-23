#!/bin/bash

# ganache-cli local
ganache --accounts 10 --gasPrice 2000000000 --gasLimit 6721975 --mnemonic brownie --port 8545

WETH_WHALE=0xee2826453A4Fd5AfeB7ceffeEF3fFA2320081268
DAI_WHALE=0x020d0886d0a1b55e9362f9b00095db5775c7754d
USDC_WHALE=0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE
USDT_WHALE=0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE
WBTC_WHALE=0xF977814e90dA44bFA03b6295A0616a897441aceC

# mainnet-fork-dev
#ganache --chain.vmErrorsOnRPCResponse true --wallet.totalAccounts 10 --fork.url https://eth-mainnet.alchemyapi.io/v2/HnrkQS70IbIsxW6fi7sOlpOR2PHgg34c --wallet.mnemonic brownie --server.port 8545 -u $WETH_WHALE -u $DAI_WHALE -u $USDC_WHALE -u $USDT_WHALE -u $WBTC_WHALE
