import { useState, useEffect } from "react";
import { useContractRead } from "wagmi";
import { BigNumber, utils } from "ethers";

import { Button } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Stack from "@mui/material/Stack";

import { useIsMounted, useGetProposalsCount, useGetFuncWrite } from "../hooks";
import { addressNotZero } from "../utils/utils";
import { GetStatusIcon, ShowError } from "../components";

const GetProposal = ({
  idxProposal,
  activeChain,
  contractAddress,
  contractABI,
  voted,
}) => {
  const isMounted = useIsMounted();
  const [disabled, setDisabled] = useState(false);
  const isEnabled = Boolean(
    isMounted && activeChain && addressNotZero(contractAddress)
  );
  const {
    data: proposal,
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
      enabled: isEnabled,
      watch: isEnabled,
    }
  );

  // vote function
  const {
    error: errorVote,
    isError: isErrorVote,
    write: writeVote,
    status: statusVote,
    statusWait: statusVoteWait,
  } = useGetFuncWrite(
    "vote",
    activeChain,
    contractAddress,
    contractABI,
    isEnabled
  );

  const handleVote = (e) => {
    e.preventDefault();
    setDisabled(true);
    writeVote({ args: [BigNumber.from(e.currentTarget.value)] });
  };
  useEffect(() => {
    if (statusVote !== "loading" && statusVoteWait !== "loading") {
      if (disabled) setDisabled(false);
    }
    // eslint-disable-next-line
  }, [statusVote, statusVoteWait]);
  if (!isMounted) return <></>;
  const idxFormatted = idxProposal.toString();
  const proposalFormatted = utils.toUtf8String(proposal[0]);
  const votesFormatted = proposal[1].toString();
  return (
    <TableRow key={idxProposal}>
      <TableCell align="left">{idxFormatted}</TableCell>
      <TableCell align="left">{proposalFormatted}</TableCell>
      <TableCell align="right">{votesFormatted}</TableCell>
      {voted !== "true" && (
        <TableCell align="right">
          <Button
            variant="contained"
            size="small"
            value={idxProposal}
            onClick={handleVote}
            disabled={disabled}
            startIcon={<GetStatusIcon status={statusVote} />}
            endIcon={<GetStatusIcon status={statusVoteWait} />}
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

  if (!isMounted) return <></>;
  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      spacing={1}
      padding={1}
    >
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
    </Stack>
  );
};

export default GetProposals;
