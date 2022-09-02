import React from "react";
import Dialog from '@mui/material/Dialog';
import { createTheme, DialogActions, DialogContent, DialogContentText, DialogTitle, ThemeProvider } from "@mui/material";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const FinDelJuego = ({ jugadorId, ganador }) => {
  const isWinner = ganador === jugadorId;
  const history = useHistory();
  const dialogTheme = createTheme({
    components: {
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            color: '#cb3805',
            fontFamily: 'fantasy',
            textAlign: 'center',
          }
        }
      },
      MuiDialogContentText: {
        styleOverrides: {
          root: {
            textAlign: 'center',
            fontSize: '80px',
          }
        }
      },
      MuiDialogActions: {
        styleOverrides: {
          root: {
            margin: '0px',
            paddingTop: '0px',
            paddingBottom: '20px',
            alignContent: 'center',
            justifyContent: 'center',
          }
        }
      },
    }
  })

  return(
    <div>
      <ThemeProvider theme={dialogTheme}>
        <Dialog open="true" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">{isWinner ? ("You won the game!") : ("Better luck next time.") }</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {isWinner ? 
              ("\u{1F389}"): ("\u{1F622}")}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick="">Play Again</Button>
            <Button onClick={() => history.push("/")}>Home</Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </div>
  );
};

export default FinDelJuego;
