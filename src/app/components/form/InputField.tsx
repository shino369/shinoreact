import clsx from "clsx";
import { FieldHookConfig, useField } from "formik";
import React from "react";
import { Input, Label } from "reactstrap";
import "./InputField.scss";

type InputType =
  | "textarea"
  | "button"
  | "checkbox"
  | "color"
  | "date"
  | "datetime-local"
  | "email"
  | "file"
  | "hidden"
  | "image"
  | "month"
  | "number"
  | "password"
  | "radio"
  | "range"
  | "reset"
  | "search"
  | "submit"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week";

interface OtherProps {
  label?: string;
  horizontal?: boolean;
  type?: InputType;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  showError?: boolean;
  style?: React.CSSProperties;
}

const InputField = (props: OtherProps & FieldHookConfig<string>) => {
  const [field, meta] = useField(props);
  const { label, type, placeholder, rows, disabled, showError, style } = props;
  return (
    <div
      className={clsx("transition", "form-group")}
      style={
        type === "textarea"
          ? { height: "unset" }
          : { height: label ? 85 : "fit-content" }
      }
    >
      {label ? <Label>{props.label}</Label> : null}
      <Input
        style={style}
        className="form-control"
        {...field}
        placeholder={placeholder}
        type={type}
        autoComplete="off"
        rows={rows}
        disabled={disabled}
      />
      {showError && (
        <div
          style={{
            opacity:  meta.error ? 1 : 0,
          }}
          className={`transition text-danger`}
        >
          {meta.error}
        </div>
      )}
    </div>
  );
};

export default InputField;
