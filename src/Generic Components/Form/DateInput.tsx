import { Grid, TextField } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { Controller, useFormContext } from "react-hook-form";
import { DATE_FORMAT } from "../../constants";
import { CommonFieldProps } from "../../types";

export const DateInput = ({
  fieldName,
  label,
  readonly,
  prefix,
  xs = 12,
  md = 6,
  lg = 6,
}: CommonFieldProps) => {
  const {
    formState: { errors },
  } = useFormContext();
  const errorMessage = errors[fieldName]?.message as string | undefined;
  return (
    <Grid item xs={xs} md={md} lg={lg}>
      <Controller
        name={fieldName}
        render={({ field }) => {
          return (
            <DesktopDatePicker
              onChange={(date) => field.onChange(date)}
              value={field.value ? field.value : ""}
              label={label}
              InputProps={{ startAdornment: prefix }}
              inputFormat={DATE_FORMAT}
              readOnly={readonly}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  fullWidth
                  error={Boolean(errors[fieldName])}
                  helperText={errorMessage}
                />
              )}
            />
          );
        }}
      />
    </Grid>
  );
};
