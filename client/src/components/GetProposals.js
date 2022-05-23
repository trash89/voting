import { useContractRead } from "wagmi";
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
import { ShowError } from "./";

const GetProposal = ({
  idxProposal,
  activeChain,
  contractAddress,
  contractABI,
}) => {
  const isMounted = useIsMounted();
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
    }
  );

  return (
    <>
      {isMounted && !isLoadingProposal && (
        <>
          {isErrorProposal ? (
            <TableRow key={idxProposal} selected={true}>
              <TableCell align="left">
                <ShowError flag={isErrorProposal} error={errorProposal} />
              </TableCell>
            </TableRow>
          ) : (
            <TableRow key={idxProposal}>
              <TableCell align="left">
                {utils.toUtf8String(proposal[0])}
              </TableCell>
              <TableCell align="right">{proposal[1].toString()}</TableCell>
            </TableRow>
          )}
        </>
      )}
    </>
  );
};

const GetProposals = ({ activeChain, contractAddress, contractABI }) => {
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
            <Table size="small" aria-label="owners">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Proposal Name</TableCell>
                  <TableCell align="left">Vote Count</TableCell>
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
