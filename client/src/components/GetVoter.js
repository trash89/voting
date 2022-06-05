import { useIsMounted } from "../hooks";
import { addressNotZero } from "../utils/utils";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useGetVoter } from "../hooks";
import { shortenAddress } from "../utils/utils";

const GetVoter = ({ activeChain, contractAddress, contractABI, address }) => {
  const isMounted = useIsMounted();
  const { weight, voted, delegate, vote } = useGetVoter(
    activeChain,
    contractAddress,
    contractABI,
    address
  );

  if (!isMounted) return <></>;
  return (
    <>
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        padding={0}
        spacing={1}
      >
        <Typography>Weight:{weight}</Typography>
        {!addressNotZero(delegate) && (
          <>
            {voted === "true" ? (
              <Typography>Voted</Typography>
            ) : (
              <Typography>Not voted</Typography>
            )}

            {voted === "false" || vote === "-1" ? (
              <Typography>any proposal yet</Typography>
            ) : (
              <Typography>the proposal #{vote}</Typography>
            )}
          </>
        )}
      </Stack>
      {addressNotZero(delegate) && (
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
          padding={0}
          spacing={1}
        >
          <Typography>Delegated To {shortenAddress(delegate)}</Typography>
        </Stack>
      )}
    </>
  );
};

export default GetVoter;
