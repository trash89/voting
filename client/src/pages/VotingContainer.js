import Stack from "@mui/material/Stack";

import { useNetwork, useAccount } from "wagmi";
import { addressNotZero } from "../utils/utils";

import { SupportedNetworks, GetVoting } from "../components";
import { useIsMounted, useGetContract } from "../hooks";

const VotingContainer = () => {
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
    <Stack
      direction="column"
      spacing={0}
      padding={1}
      justifyContent="flex-start"
      alignItems="flex-start"
    >
      <GetVoting
        activeChain={activeChain}
        contractAddress={contractAddress}
        contractABI={contractABI}
        account={account}
      />
    </Stack>
  );
};

export default VotingContainer;
