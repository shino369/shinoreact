import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { TransitionProps } from "@mui/material/transitions";
import Slide from "@mui/material/Slide";
import { Input } from "reactstrap";
import { Controller, useForm } from "react-hook-form";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  withInput?: boolean;
  onConfirm: (input?: string) => void;
  onCancel: () => void;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ConfimrDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  withInput,
  onConfirm,
  onCancel,
}) => {
  const [value, setValue] = React.useState("");
  const inputRef = React.useRef<any>(null);
  const handleConfirm = () => {
    onConfirm(inputRef.current.value);
  };
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onCancel}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <div>
          <div>{message}</div>
          {withInput && (
            <div>
              <Input
                ref={inputRef}
                // onChange={(e) => {
                //   setValue(e.target.value);
                // }}
                type="text"
              />

              <div style={{ fontSize: "0.75rem" }}>At least 3 characters</div>
            </div>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          disabled={inputRef?.current && inputRef?.current?.value < 3}
          onClick={() => {
            withInput ? handleConfirm() : onConfirm();
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfimrDialog;
