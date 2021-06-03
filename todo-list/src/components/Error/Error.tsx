import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

interface Props {
  error: null | string;
}

const Error = ({ error }: Props) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={!!error}
    >
      <MuiAlert variant="filled" severity="error">
        {error}
      </MuiAlert>
    </Snackbar>
  );
};

export default Error;
