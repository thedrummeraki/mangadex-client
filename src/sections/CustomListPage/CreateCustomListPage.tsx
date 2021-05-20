import { useMutation } from "@apollo/client";
import { Typography, CircularProgress } from "@material-ui/core";
import { Page } from "components";
import { useEffect, useState } from "react";
import { CustomList } from "types/customList";

import CreateCustomList from "./queries/CreateCustomList";

interface Props {
  name: string;
  onCustomListCreated: (customList: CustomList) => void;
}

interface IndeterminateProgress {
  variant: "indeterminate";
  value?: undefined;
}

interface DeterminateProgress {
  variant: "determinate";
  value: number;
}

type Progress = IndeterminateProgress | DeterminateProgress;

export function CreateCustomListPage({ name, onCustomListCreated }: Props) {
  const [createFollowsList] = useMutation(CreateCustomList, {
    variables: { name, visibility: "private" },
  });
  const [createdCustomList, setCreatedCustomList] =
    useState<CustomList | null>(null);

  const [statusText, setStatusText] = useState(
    '"Hey MangaDex, can you please create this for us?"'
  );
  const [progressVariant, setProgressVariant] = useState<Progress>({
    variant: "indeterminate",
  });

  useEffect(() => {
    if (createdCustomList) {
      setProgressVariant({ value: 100, variant: "determinate" });
      setStatusText("Done :)");
      const id = setTimeout(() => onCustomListCreated(createdCustomList), 2000);

      return () => clearTimeout(id);
    } else {
      createFollowsList().then((result) => {
        if (result.data?.createCustomList.result === "ok") {
          setCreatedCustomList(result.data.createCustomList.data);
        }
      });
    }
  }, [createdCustomList, createFollowsList, onCustomListCreated]);

  return (
    <Page backUrl="/" title={name}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "55vh",
          textAlign: "center",
        }}
      >
        <div style={{ display: "block" }}>
          <CircularProgress
            size={24}
            variant={progressVariant.variant}
            value={progressVariant.value}
          />
          <br />
          <Typography variant="body1">{statusText}</Typography>
        </div>
      </div>
    </Page>
  );
}
