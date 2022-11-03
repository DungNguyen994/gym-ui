import { Grid, TextField } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { Controller, useFormContext } from "react-hook-form";
import { CommonFieldProps } from "../../types";

export const GridDatePicker = ({
  fieldName,
  label,
  readonly,
}: CommonFieldProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const errorMessage = errors[fieldName]?.message as string | undefined;
  return (
    <Grid item xs={9} md={6}>
      <Controller
        control={control}
        name={fieldName}
        render={({ field }) => (
          <DesktopDatePicker
            onChange={(date) => field.onChange(date)}
            value={field.value ? field.value : ""}
            label={label}
            inputFormat="DD/MM/YYYY"
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
        )}
      />
    </Grid>
  );
};
