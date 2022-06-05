import { useState, useEffect, forwardRef } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { utils } from "ethers";
import { addressNotZero, shortenAddress } from "../utils/utils";

import { useContractRead } from "wagmi";
import { useIsMounted, useGetVoter, useGetFuncWrite } from "../hooks";
import {
  GetStatusIcon,
  ShowError,
  GetProposals,
  GetVoter,
} from "../components";

const GetVoting = ({ activeChain, contractAddress, contractABI, account }) => {
  const isMounted = useIsMounted();
  const [disabled, setDisabled] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogDelegateOpen, setDialogDelegateOpen] = useState(false);

  const [input, setInput] = useState({
    addressTo: "",
    addressToDelegate: "",
  });
  const [isErrorInput, setIsErrorInput] = useState({
    addressTo: false,
    addressToDelegate: false,
  });

  const [openSnack, setOpenSnack] = useState(false);
  const isEnabled = Boolean(
    isMounted && activeChain && account && addressNotZero(contractAddress)
  );

  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const { data: chairperson, isError: isErrorChairperson } = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "chairperson",
    {
      watch: isEnabled,
      enabled: isEnabled,
    }
  );
  const { data: winnerName } = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "winnerName",
    {
      enabled: isEnabled,
      watch: isEnabled,
    }
  );

  const { voted } = useGetVoter(
    activeChain,
    contractAddress,
    contractABI,
    account.address
  );

  // giveRightToVote function
  const {
    error: errorGiveRight,
    isError: isErrorGiveRight,
    write: writeGiveRight,
    status: statusGiveRight,
    statusWait: statusGiveRightWait,
  } = useGetFuncWrite(
    "giveRightToVote",
    activeChain,
    contractAddress,
    contractABI,
    isEnabled
  );

  // delegate function
  const {
    error: errorDelegate,
    isError: isErrorDelegate,
    write: writeDelegate,
    status: statusDelegate,
    statusWait: statusDelegateWait,
  } = useGetFuncWrite(
    "delegate",
    activeChain,
    contractAddress,
    contractABI,
    isEnabled
  );

  useEffect(() => {
    if (
      statusGiveRight !== "loading" &&
      statusGiveRightWait !== "loading" &&
      statusDelegate !== "loading" &&
      statusDelegateWait !== "loading"
    ) {
      if (disabled) setDisabled(false);
      setInput({ addressTo: "", addressToDelegate: "" });
    }
    // eslint-disable-next-line
  }, [
    statusGiveRight,
    statusGiveRightWait,
    statusDelegate,
    statusDelegateWait,
  ]);

  const handleDialogGiveRight = () => {
    if (
      input.addressTo &&
      input.addressTo !== "" &&
      addressNotZero(input.addressTo) &&
      utils.isAddress(input.addressTo)
    ) {
      setDisabled(true);
      writeGiveRight({
        args: [utils.getAddress(input.addressTo)],
      });
      setDialogOpen(false);
    } else {
      setIsErrorInput({ ...isErrorInput, addressTo: true });
    }
  };
  const handleDialogDelegate = () => {
    if (
      input.addressToDelegate &&
      input.addressToDelegate !== "" &&
      addressNotZero(input.addressToDelegate) &&
      utils.isAddress(input.addressToDelegate)
    ) {
      setDisabled(true);
      writeDelegate({
        args: [utils.getAddress(input.addressToDelegate)],
      });
      setDialogDelegateOpen(false);
    } else {
      setIsErrorInput({ ...isErrorInput, addressToDelegate: true });
    }
  };

  const handleClickSnack = () => {
    setOpenSnack(true);
  };

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnack(false);
  };

  const handleAddressTo = (e) => {
    setInput({ ...input, addressTo: e.target.value });
    if (isErrorInput.addressTo)
      setIsErrorInput({ ...isErrorInput, addressTo: false });
  };
  const handleAddressToDelegate = (e) => {
    setInput({ ...input, addressToDelegate: e.target.value });
    if (isErrorInput.addressToDelegate)
      setIsErrorInput({ ...isErrorInput, addressToDelegate: false });
  };

  if (!isMounted) return <></>;
  return (
    <Paper elevation={4}>
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        padding={1}
        spacing={0}
      >
        <Typography variant="h6" gutterBottom component="div">
          Voting
        </Typography>
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
          padding={0}
          spacing={0}
        >
          <Typography
            color={
              utils.getAddress(chairperson) ===
              utils.getAddress(account?.address)
                ? "blue"
                : "primary.text"
            }
          >
            Chairperson: {shortenAddress(chairperson)}
          </Typography>
          {utils.getAddress(chairperson) ===
            utils.getAddress(account?.address) && (
            <>
              <Button
                variant="contained"
                size="small"
                onClick={() => setDialogOpen(true)}
                disabled={disabled}
                startIcon={<GetStatusIcon status={statusGiveRight} />}
                endIcon={<GetStatusIcon status={statusGiveRightWait} />}
              >
                Give Right To Vote
              </Button>
              <Button size="small" onClick={handleClickSnack}>
                Show Winner
              </Button>
              <Snackbar
                open={openSnack}
                autoHideDuration={6000}
                onClose={handleCloseSnack}
              >
                <Alert
                  onClose={handleCloseSnack}
                  severity="success"
                  sx={{ width: "100%" }}
                >
                  {utils.toUtf8String(winnerName)}
                </Alert>
              </Snackbar>
              <Dialog
                open={dialogOpen}
                onClose={handleDialogGiveRight}
                maxWidth="xs"
                fullWidth={true}
                disableEscapeKeyDown={true}
              >
                <DialogTitle>Give Right To Vote</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Enter the address of the voter to give right
                  </DialogContentText>
                  <TextField
                    error={isErrorInput.addressTo}
                    autoFocus
                    margin="dense"
                    id="addressTo"
                    label="Address"
                    type="text"
                    value={input.addressTo}
                    fullWidth
                    required
                    variant="standard"
                    onChange={handleAddressTo}
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleDialogGiveRight}
                  >
                    Give Right
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </Stack>
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
          padding={0}
          spacing={0}
        >
          <Typography>Connected:{shortenAddress(account.address)}</Typography>
        </Stack>
        {voted === "false" && (
          <>
            <Stack
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
              padding={0}
              spacing={0}
            >
              <Button
                variant="contained"
                size="small"
                onClick={() => setDialogDelegateOpen(true)}
                disabled={disabled}
                startIcon={<GetStatusIcon status={statusDelegate} />}
                endIcon={<GetStatusIcon status={statusDelegateWait} />}
              >
                delegate your vote
              </Button>
              {isErrorDelegate && (
                <ShowError flag={isErrorDelegate} error={errorDelegate} />
              )}
              <Dialog
                open={dialogDelegateOpen}
                onClose={handleDialogDelegate}
                maxWidth="xs"
                fullWidth={true}
                disableEscapeKeyDown={true}
              >
                <DialogTitle>Delegate vote to voter</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Enter the address of the voter to delegate your vote
                  </DialogContentText>
                  <TextField
                    error={isErrorInput.addressToDelegate}
                    autoFocus
                    margin="dense"
                    id="addressToDelegate"
                    label="Address"
                    type="text"
                    value={input.addressToDelegate}
                    fullWidth
                    required
                    variant="standard"
                    onChange={handleAddressToDelegate}
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setDialogDelegateOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleDialogDelegate}
                  >
                    delegate
                  </Button>
                </DialogActions>
              </Dialog>
            </Stack>
          </>
        )}
        <GetVoter
          activeChain={activeChain}
          contractAddress={contractAddress}
          contractABI={contractABI}
          address={account.address}
        />
        <GetProposals
          activeChain={activeChain}
          contractAddress={contractAddress}
          contractABI={contractABI}
          voted={voted}
        />
      </Stack>
      {isErrorChairperson && (
        <ShowError flag={isErrorChairperson} error={isErrorChairperson} />
      )}
      {isErrorGiveRight && (
        <ShowError flag={isErrorGiveRight} error={errorGiveRight} />
      )}
    </Paper>
  );
};

export default GetVoting;
