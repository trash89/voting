import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";

import { useNetwork, useAccount } from "wagmi";
import { addressNotZero } from "../utils/utils";

import { SupportedNetworks, GetVoting } from "../components";
import { useIsMounted, useGetContract } from "../hooks";

const Voting = () => {
  const isMounted = useIsMounted();
  const { activeChain } = useNetwork();

  const { address: contractAddress, ABI: contractABI } =
    useGetContract("Ballot");
  const {
    data: account,
    error: errorAccount,
    isError: isErrorAccount,
    isLoading: isLoadingAccount,
  } = useAccount({
    enabled: Boolean(
      isMounted && activeChain && addressNotZero(contractAddress)
    ),
  });

  if (!isMounted) return <></>;
  if (!activeChain) return <SupportedNetworks />;
  if (isLoadingAccount) return <div>Loading account…</div>;
  if (isErrorAccount)
    return <div>Error loading account: {errorAccount?.message}</div>;
  if (!addressNotZero(contractAddress))
    return (
      <div>Contract not deployed on this network : {activeChain?.name}</div>
    );

  return (
    <Container component={Paper} maxWidth="sm" disableGutters={true}>
      <GetVoting
        activeChain={activeChain}
        contractAddress={contractAddress}
        contractABI={contractABI}
        account={account}
      />
    </Container>
  );
};

export default Voting;
