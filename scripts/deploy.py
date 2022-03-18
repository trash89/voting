from asyncio import exceptions
from brownie import accounts, exceptions, Ballot
import pytest


def main():
    alice = accounts[0]
    bob = accounts[1]
    luke = accounts[2]
    proposalNames = ["prop1".encode(
        "utf-8"), "prop2".encode("utf-8"), "prop3".encode("utf-8")]
    print("Deploying Ballot contract...")
    b = Ballot.deploy(proposalNames, {"from": alice})
    print(f"Deployed at {b}")

    print("Giving the rights to vote to bob...")
    tx = b.giveRightToVote(bob.address, {"from": alice})
    tx.wait(1)
    print("bob has the right to vote...")

    print("Giving the rights to vote to luke...")
    tx = b.giveRightToVote(luke.address, {"from": alice})
    tx.wait(1)
    print("luke has the right to vote...")

    print("bob delegates his vote to luke...")
    tx = b.delegate(luke.address, {"from": bob})
    tx.wait(1)
    print("bob delegated his vote to luke")

    with pytest.raises(exceptions.VirtualMachineError):
        print("bob is voting the first proposal")
        tx = b.vote(0, {"from": bob})
        tx.wait(1)
        print("bob voted the first proposal")

    print("luke is voting the second proposal")
    tx = b.vote(1, {"from": luke})
    tx.wait(1)
    print("luke voted the second proposal")

    vn = b.winnerName()
    print(f"Winner name is {vn}")
