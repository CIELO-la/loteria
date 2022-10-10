import React from "react";
import Dialog from '@mui/material/Dialog';
import { createTheme, DialogActions, DialogContent, DialogContentText, DialogTitle, ThemeProvider } from "@mui/material";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const FinDelJuego = ({ jugadorId, ganador }) => {
  const { t } = useTranslation();
  const isWinner = ganador === jugadorId;
  const navigate = useNavigate();
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
          <DialogTitle id="alert-dialog-title">{isWinner ? (t("ganar")) : (t("perder")) }</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {isWinner ? 
              ("\u{1F389}"): ("\u{1F622}")}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
             {/*When we have the play again logic wired up, remove this display none.*/}
            <Button onClick="" style={{display: "none"}}>{t("otraVez")}</Button>
            <Button onClick={() => navigate("/")}>{t("home")}</Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </div>
  );
};

export default FinDelJuego;
