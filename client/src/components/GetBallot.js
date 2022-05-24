import { useState, useEffect, forwardRef } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { utils } from "ethers";
import { addressNotZero, shortenAddress } from "../utils/utils";

import { useContractWrite, useContractRead } from "wagmi";
import { useIsMounted, useGetVoter } from "../hooks";
import { GetStatusIcon, ShowError } from ".";
import { GetProposals, GetVoter } from "../components";

const GetBallot = ({ activeChain, contractAddress, contractABI, account }) => {
  const isMounted = useIsMounted();
  const [disabled, setDisabled] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogDelegateOpen, setDialogDelegateOpen] = useState(false);
  const [addressTo, setAddressTo] = useState("");
  const [addressToDelegate, setAddressToDelegate] = useState("");
  const [openSnack, setOpenSnack] = useState(false);

  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const {
    data: chairperson,
    isLoading: isLoadingChairperson,
    isError: isErrorChairperson,
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
  const { voted } = useGetVoter(
    activeChain,
    contractAddress,
    contractABI,
    account.address
  );

  const {
    error: errorGiveRight,
    isError: isErrorGiveRight,
    isLoading: isLoadingGiveRight,
    write: writeGiveRight,
    status: statusGiveRight,
  } = useContractWrite(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "giveRightToVote",
    {
      enabled: Boolean(
        activeChain &&
          account &&
          addressNotZero(contractAddress) &&
          addressTo &&
          addressNotZero(addressTo)
      ),
    }
  );
  const {
    error: errorDelegate,
    isError: isErrorDelegate,
    isLoading: isLoadingDelegate,
    write: writeDelegate,
    status: statusDelegate,
  } = useContractWrite(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "delegate",
    {
      enabled: Boolean(
        activeChain &&
          account &&
          addressNotZero(contractAddress) &&
          addressToDelegate &&
          addressNotZero(addressToDelegate)
      ),
    }
  );

  const { data: winnerName } = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "winnerName",
    {
      enabled: Boolean(
        activeChain && account && addressNotZero(contractAddress)
      ),
      watch: Boolean(activeChain && account && addressNotZero(contractAddress)),
    }
  );

  useEffect(() => {
    if (statusGiveRight !== "loading") {
      if (disabled) setDisabled(false);
    }
    if (statusDelegate !== "loading") {
      if (disabled) setDisabled(false);
    }

    // eslint-disable-next-line
  }, [statusGiveRight, statusDelegate]);

  const handleDialogGiveRight = () => {
    if (addressTo && addressNotZero(addressTo)) {
      writeGiveRight({
        args: [utils.getAddress(addressTo)],
      });
      setDialogOpen(false);
      setAddressTo("");
    }
  };
  const handleDialogDelegate = () => {
    if (addressToDelegate && addressNotZero(addressToDelegate)) {
      writeDelegate({
        args: [utils.getAddress(addressToDelegate)],
      });
      setDialogDelegateOpen(false);
      setAddressToDelegate("");
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

  if (isLoadingChairperson || isErrorChairperson || !chairperson)
    return <>Loading...</>;
  return (
    <>
      {isMounted && (
        <>
          <Typography variant="h5">Ballot</Typography>
          <Container direction="column" disableGutters={true} maxWidth={false}>
            <Stack
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
              padding={1}
              spacing={1}
            >
              <Typography
                color={
                  utils.getAddress(chairperson) ===
                  utils.getAddress(account.address)
                    ? "blue"
                    : "text.primary"
                }
              >
                Chairperson: {shortenAddress(chairperson)}
              </Typography>
              {utils.getAddress(chairperson) ===
                utils.getAddress(account.address) && (
                <>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setDialogOpen(true)}
                    disabled={disabled || isLoadingGiveRight}
                    endIcon={<GetStatusIcon status={statusGiveRight} />}
                  >
                    Give Right To Vote
                  </Button>
                  <Button onClick={handleClickSnack}>Show Winner</Button>
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
                  {isErrorGiveRight && (
                    <ShowError flag={isErrorGiveRight} error={errorGiveRight} />
                  )}
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
                        autoFocus
                        margin="dense"
                        id="addressTo"
                        label="Address"
                        type="text"
                        value={addressTo}
                        fullWidth
                        required
                        variant="standard"
                        onChange={(e) => {
                          setAddressTo(e.target.value);
                        }}
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
              padding={1}
              spacing={1}
            >
              <Typography>
                Connected:{shortenAddress(account.address)}
              </Typography>
            </Stack>
            {voted === "false" && (
              <>
                <Stack
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  padding={1}
                  spacing={1}
                >
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setDialogDelegateOpen(true)}
                    disabled={disabled || isLoadingDelegate}
                    endIcon={<GetStatusIcon status={statusDelegate} />}
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
                        autoFocus
                        margin="dense"
                        id="addressToDelegate"
                        label="Address"
                        type="text"
                        value={addressToDelegate}
                        fullWidth
                        required
                        variant="standard"
                        onChange={(e) => {
                          setAddressToDelegate(e.target.value);
                        }}
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
          </Container>
          <Container direction="row" disableGutters={true} maxWidth={false}>
            {isErrorChairperson && (
              <ShowError flag={isErrorChairperson} error={isErrorChairperson} />
            )}
          </Container>
        </>
      )}
    </>
  );
};

export default GetBallot;
