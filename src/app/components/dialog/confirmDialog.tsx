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
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Form, Formik, FormikHelpers } from "formik";
import InputField from "../form/InputField";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  withInput?: boolean;
  onConfirm: (input?: string) => void;
  onCancel: () => void;
}

type FormItem = {
  room: string;
};

const schema = yup.object().shape({
  room: yup.string().required().min(3, "must > 3 characters"),
});

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
  const onSubmit = (values: FormItem, actions: FormikHelpers<FormItem>) => {
    console.log(values);
    onConfirm(values.room);
  };
  const formikRef = React.useRef<any>();

  React.useEffect(() => {
    // reset form
    if (!open && formikRef.current) {
      setTimeout(() => {
        formikRef.current.resetForm();
      }, 100);
    }
  }, [open]);

  return (
    <Dialog
      PaperProps={{
        style: { borderRadius: 0 },
      }}
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onCancel}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle className="pt-2">
        <span style={{ fontSize: "1rem" }}>{title}</span>
      </DialogTitle>
      <DialogContent className={`${withInput ? "pb-0" : ""}`}>
        <div>
          <div style={{ fontSize: "0.8rem" }}>{message}</div>
          {withInput && (
            <Formik
              innerRef={formikRef}
              initialValues={{
                room: "",
              }}
              validationSchema={schema}
              onSubmit={onSubmit}
            >
              {({ values, errors, isValid }) => (
                <Form className=" ">
                  <div className="col">
                    <InputField
                      style={{
                        backgroundColor: "rgba(54, 57, 63, 0.8)",
                        border: "none",
                        borderRadius: "0",
                        caretColor: "white",
                        color: "white",
                        resize: "none",
                      }}
                      name="room"
                      placeholder="Input room name"
                      showError
                    />
                  </div>

                  <DialogActions className="justify-content-between px-0">
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button disabled={!isValid} type="submit">
                      Confirm
                    </Button>
                  </DialogActions>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </DialogContent>
      {!withInput && (
        <DialogActions>
          <Button onClick={onCancel}>Cancel</Button>

          <Button
            onClick={() => {
              onConfirm();
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ConfimrDialog;
