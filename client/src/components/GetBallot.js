import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import { Paper } from "@mui/material";

import { BigNumber, utils } from "ethers";
import { addressNotZero, formatBalance, shortenAddress } from "../utils/utils";

import { useBalance, useContractWrite, useContractRead } from "wagmi";
import { useIsMounted, useDetailsBallot } from "../hooks";
import { GetStatusIcon, ShowError } from ".";
import { GetProposals } from "../components";

const GetBallot = ({ activeChain, contractAddress, contractABI, account }) => {
  const isMounted = useIsMounted();
  const [disabled, setDisabled] = useState(false);

  const {
    data: chairperson,
    isLoading: isLoadingChairperson,
    isError: isErrorChairperson,
    isSuccess: isSuccessChairperson,
  } = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "chairperson",
    {
      watch: Boolean(activeChain && addressNotZero(contractAddress)),
      enabled: Boolean(activeChain && addressNotZero(contractAddress)),
    }
  );

  // useEffect(() => {
  //   if (statusBid !== "loading") {
  //     if (disabled) setDisabled(false);
  //   }
  //   // eslint-disable-next-line
  // }, [statusBid]);

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      spacing={1}
      padding={1}
    >
      {isMounted && (
        <>
          <Typography variant="h5">Ballot</Typography>
          <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="flex-start"
            padding={1}
            spacing={1}
          >
            <Paper elevation={4}>
              <Typography>
                Chairperson: {shortenAddress(chairperson)}
              </Typography>
            </Paper>
            <Paper elevation={4}>
              <GetProposals
                activeChain={activeChain}
                contractAddress={contractAddress}
                contractABI={contractABI}
              />
            </Paper>
          </Stack>
          <Paper elevation={4}>
            <Stack
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
              padding={1}
              spacing={1}
            >
              {isErrorChairperson && (
                <ShowError
                  flag={isErrorChairperson}
                  error={isErrorChairperson}
                />
              )}
            </Stack>
          </Paper>
        </>
      )}
    </Stack>
  );
};

export default GetBallot;
