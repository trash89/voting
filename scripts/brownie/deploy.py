from brownie import Ballot

from scripts.brownie.helpful_scripts import get_account, update_front_end

proposalNames = ["proposal1".encode(
    "utf-8"), "proposal2".encode("utf-8"), "proposal3".encode("utf-8")]


def main():
    _ = deployBallot(update_front_end_flag=True)


def deployBallot(update_front_end_flag=True):
    print("Deploying Ballot contract...")
    ballot = Ballot.deploy(proposalNames, {"from": get_account()})
    print(f"Deployed Ballot at {ballot}...")
    if update_front_end_flag:
        update_front_end()
    return ballot
