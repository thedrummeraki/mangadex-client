import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  makeStyles,
  OutlinedInput,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { Page } from "components";
import { FileButton } from "components/FileButton";
import BasicModal from "components/modals/BasicModal";
import { ReadingHistory } from "helpers/useCurrentlyReading";
import useLocalCurrentReadingHistoryManagament from "helpers/useLocalCurrentReadingHistoryManagament";
import { useState } from "react";
import { PreviewReadingHistoryImport } from "./PreviewReadingHistoryImport";

const useStyles = makeStyles((theme) => ({
  vhCentered: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "75vh",
  },
  passwordModalRoot: {
    "& > *": {
      width: "100%",
      margin: theme.spacing(1, 0),
    },
  },
}));

export default function ImportReadingHistoryPage() {
  const classes = useStyles();
  const [importedReadingHistory, setImportantReadingHistory] =
    useState<ReadingHistory[] | null>(null);

  const [errorReason, setErrorReason] = useState("");
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [encryptedHistory, setEncryptedHistory] = useState("");
  const [filename, setFilename] = useState("");
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordRequired, setPasswordRequired] =
    useState<"true" | "false">("false");
  const [password, setPassword] = useState("");

  const { importHistory } = useLocalCurrentReadingHistoryManagament();

  const showError = (reason: string) => {
    setErrorModalOpen(true);
    setErrorReason(reason);
  };

  const dismissErrorModal = () => {
    setErrorModalOpen(false);
    setErrorReason("");
  };

  return importedReadingHistory == null ? (
    <Page backUrl="/continue-reading" title="Import your reading history...">
      <div className={classes.vhCentered}>
        <FileButton
          multiple={false}
          variant="contained"
          color="secondary"
          size="large"
          onFileChange={(file) => {
            if (file.type !== "text/plain") {
              showError("Only plain text is accepted at the moment.");
              return;
            }

            file.text().then((encryptedHistory) => {
              if (encryptedHistory) {
                setFilename(file.name);
                setEncryptedHistory(encryptedHistory);
                setPasswordModalOpen(true);
              } else {
                showError("There is nothing to import...!");
              }
            });
          }}
        >
          Import from a file...
        </FileButton>
        <BasicModal
          open={errorModalOpen}
          onClose={dismissErrorModal}
          title="Woops...!"
        >
          {errorReason}
        </BasicModal>
        <BasicModal
          open={passwordModalOpen && Boolean(encryptedHistory)}
          onClose={() => setPasswordModalOpen(false)}
          title={`Importing ${filename}`}
        >
          <FormControl component="fieldset">
            <FormLabel component="legend">Import options</FormLabel>
            <RadioGroup
              aria-label="gender"
              name="gender1"
              value={passwordRequired}
              onChange={(_, value) =>
                setPasswordRequired(value === "true" ? "true" : "false")
              }
            >
              <FormControlLabel
                value="false"
                control={<Radio />}
                label="No password was used when exporting"
              />
              <FormControlLabel
                value="true"
                control={<Radio />}
                label="This file is password protected"
              />
            </RadioGroup>
          </FormControl>

          <form
            noValidate
            autoComplete="off"
            className={classes.passwordModalRoot}
          >
            {passwordRequired === "true" && (
              <FormControl>
                <OutlinedInput
                  id="optional-password"
                  type="password"
                  value={password}
                  placeholder="Password (optional)"
                  onChange={(event) => setPassword(event.target.value)}
                />
              </FormControl>
            )}
            <FormControl>
              <Button
                size="large"
                variant="contained"
                color="primary"
                onClick={() => {
                  importHistory(encryptedHistory, password)
                    .then((readingHistory) => {
                      setPasswordModalOpen(false);
                      setFilename("");
                      setEncryptedHistory("");
                      setImportantReadingHistory(readingHistory);
                    })
                    .catch((e) => {
                      console.error("That import did not work. Try again!", e);
                    })
                    .finally(() => setPassword(""));
                }}
              >
                Continue
              </Button>
            </FormControl>
          </form>
        </BasicModal>
      </div>
    </Page>
  ) : (
    <PreviewReadingHistoryImport readingHistory={importedReadingHistory} />
  );
}
