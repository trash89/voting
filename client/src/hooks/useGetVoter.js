import { useContractRead } from "wagmi";
import { constants, utils } from "ethers";
import { addressNotZero } from "../utils/utils";
import { useIsMounted } from "../hooks";

const useGetVoter = (activeChain, contractAddress, contractABI, address) => {
  const isMounted = useIsMounted();
  const {
    data: voter,
    isLoading: isLoadingVoter,
    isError: isErrorVoter,
    isSuccess: isSuccessVoter,
  } = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "voters",
    {
      args: [utils.getAddress(address)],
      enabled: Boolean(
        activeChain &&
          addressNotZero(contractAddress) &&
          addressNotZero(address)
      ),
      watch: Boolean(
        activeChain &&
          addressNotZero(contractAddress) &&
          addressNotZero(address)
      ),
    }
  );

  return !isMounted || isLoadingVoter || isErrorVoter || !isSuccessVoter
    ? {
        weight: "-1",
        voted: "false",
        delegate: constants.AddressZero,
        vote: "-1",
      }
    : {
        weight: voter[0]?.toString(),
        voted: voter[1]?.toString(),
        delegate: voter[2]?.toString(),
        vote: voter[3]?.toString(),
      };
};

export default useGetVoter;
