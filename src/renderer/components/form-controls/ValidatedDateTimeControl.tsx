import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  SpaceProps,
} from '@chakra-ui/react';
import { FormikProps } from 'formik';
import moment from 'moment';
import { RefObject } from 'react';
import Datetime from 'react-datetime';

interface ValidatedDatetimeControlProps<T> {
  formikProps: FormikProps<T>;
  name: string;
  placeholder?: string;
  value?: Date; // formikProps.values.name as string | undefined
  error?: string; // formikProps.errors.name
  spaceProps?: SpaceProps;
  inputFieldRef?: RefObject<HTMLInputElement>;
  formLabelText?: string;
  helperText?: string;
  isRequired?: boolean;
  onPaste?: (text: string) => void;
}

export function ValidatedDatetimeControl<T>(
  props: ValidatedDatetimeControlProps<T>,
) {
  const {
    formikProps,
    name,
    placeholder,
    value,
    error,
    spaceProps,
    inputFieldRef,
    formLabelText,
    helperText,
    isRequired,
    onPaste,
  } = props;
  return (
    <FormControl
      {...spaceProps}
      isInvalid={error !== undefined}
      isRequired={
        isRequired
        // yupSchemaField.describe().tests[0].name === "required"
      }
    >
      <FormLabel>{formLabelText ?? placeholder}</FormLabel>
      <Datetime
        inputProps={{
          ref: inputFieldRef,
          onChange: formikProps.handleChange,
          onBlur: formikProps.handleBlur,
          placeholder,
          name,
          onPaste: (e) => {
            if (onPaste) {
              onPaste(e.clipboardData.getData('Text'));
            }
          },
        }}
        closeOnSelect
        onChange={(aValue: string | moment.Moment) => {
          let formattedValue = aValue;
          if (moment.isMoment(aValue)) {
            formattedValue = aValue.toISOString();
          }
          formikProps.setFieldValue(name, formattedValue);
        }}
        value={value ?? ''}
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
