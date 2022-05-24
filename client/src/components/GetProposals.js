import { useState, useEffect } from "react";
import { useContractRead, useContractWrite } from "wagmi";
import { BigNumber, utils } from "ethers";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Stack from "@mui/material/Stack";

import { useIsMounted, useGetProposalsCount } from "../hooks";
import { addressNotZero } from "../utils/utils";
import { Button } from "@mui/material";
import { GetStatusIcon, ShowError } from "./";

const GetProposal = ({
  idxProposal,
  activeChain,
  contractAddress,
  contractABI,
  voted,
}) => {
  const isMounted = useIsMounted();
  const [disabled, setDisabled] = useState(false);
  const {
    data: proposal,
    isLoading: isLoadingProposal,
    isError: isErrorProposal,
    error: errorProposal,
  } = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "proposals",
    {
      args: [BigNumber.from(idxProposal)],
      enabled: Boolean(activeChain && addressNotZero(contractAddress)),
      watch: Boolean(activeChain && addressNotZero(contractAddress)),
    }
  );

  const {
    error: errorVote,
    isError: isErrorVote,
    isLoading: isLoadingVote,
    write: writeVote,
    status: statusVote,
  } = useContractWrite(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "vote",
    {
      enabled: Boolean(activeChain && addressNotZero(contractAddress)),
    }
  );

  const handleVote = (e) => {
    e.preventDefault();
    writeVote({ args: [BigNumber.from(e.target.value)] });
  };
  useEffect(() => {
    if (statusVote !== "loading") {
      if (disabled) setDisabled(false);
    }

    // eslint-disable-next-line
  }, [statusVote]);

  return (
    <>
      {isMounted && !isLoadingProposal && (
        <TableRow key={idxProposal}>
          <TableCell align="left">{idxProposal.toString()}</TableCell>
          <TableCell align="left">{utils.toUtf8String(proposal[0])}</TableCell>
          <TableCell align="right">{proposal[1].toString()}</TableCell>
          {voted !== "true" && (
            <TableCell align="right">
              <Button
                variant="contained"
                size="small"
                value={idxProposal}
                onClick={handleVote}
                disabled={disabled || isLoadingVote}
                endIcon={<GetStatusIcon status={statusVote} />}
              >
                Vote
              </Button>
            </TableCell>
          )}
          {isErrorProposal ||
            (isErrorVote && (
              <>
                {isErrorProposal && (
                  <TableCell align="left">
                    <ShowError flag={isErrorProposal} error={errorProposal} />
                  </TableCell>
                )}
                {isErrorVote && (
                  <TableCell align="left">
                    <ShowError flag={isErrorVote} error={errorVote} />
                  </TableCell>
                )}
              </>
            ))}
        </TableRow>
      )}
    </>
  );
};

const GetProposals = ({ activeChain, contractAddress, contractABI, voted }) => {
  const isMounted = useIsMounted();
  const proposalsCount = useGetProposalsCount(
    activeChain,
    contractAddress,
    contractABI
  );

  const proposalsArray = [
    ...Array.from({ length: parseInt(proposalsCount) }, (_, idx) => `${++idx}`),
  ];

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
          <TableContainer component={Paper}>
            <Table size="small" aria-label="Proposals">
              <TableHead>
                <TableRow>
                  <TableCell align="left">#</TableCell>
                  <TableCell align="left">Proposal</TableCell>
                  <TableCell align="left">Votes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {proposalsArray?.map((_, index) => {
                  return (
                    <GetProposal
                      key={index}
                      idxProposal={index}
                      contractAddress={contractAddress}
                      contractABI={contractABI}
                      activeChain={activeChain}
                      voted={voted}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Stack>
  );
};

export default GetProposals;
