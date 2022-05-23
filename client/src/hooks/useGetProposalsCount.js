import { useContractRead } from "wagmi";
import { BigNumber } from "ethers";
import { addressNotZero } from "../utils/utils";

const useGetProposalsCount = (activeChain, contractAddress, contractABI) => {
  const {
    data: proposalsCount,
    isLoading: isLoadingProposalsCount,
    isError: isErrorProposalsCount,
    isSuccess: isSuccessProposalsCount,
  } = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "proposalsCount",
    {
      watch: Boolean(activeChain && addressNotZero(contractAddress)),
      enabled: Boolean(activeChain && addressNotZero(contractAddress)),
    }
  );
  return isLoadingProposalsCount ||
    isErrorProposalsCount ||
    !isSuccessProposalsCount
    ? BigNumber.from("0")
    : proposalsCount;
};

export default useGetProposalsCount;
