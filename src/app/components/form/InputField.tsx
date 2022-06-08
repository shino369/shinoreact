import clsx from 'clsx';
import { FieldHookConfig, useField } from 'formik';
import React from 'react';
import { Input, Label } from 'reactstrap';
import './InputField.scss';

type InputType =
  | 'textarea'
  | 'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week';

interface OtherProps {
  label: string;
  horizontal?: boolean;
  type?: InputType;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}

const InputField = (props: OtherProps & FieldHookConfig<string>) => {
  const [field, meta] = useField(props);
  const { label, type, placeholder, rows, disabled } = props;
  return (
    <div
      className={clsx(
        'transition',
        'mb-2',
        'form-group',
      )}
      style={
        type === 'textarea' ? { height: 'unset' } : { height: label ? 85 : 60 }
      }
    >
      {label ? <Label>{props.label}</Label> : null}
      <Input
        className="form-control"
        {...field}
        placeholder={placeholder}
        type={type}
        autoComplete="new-password"
        rows={rows}
        disabled={disabled}
      />
      <div style={{
        opacity: meta.touched && meta.error ? 1 : 0,
      }} className={`transition text-danger`}>{meta.error}</div>
    </div>
  );
};

export default InputField;
