import { useQuery } from "@apollo/client";
import {
  Box,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { get, round, subtract } from "lodash";
import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import AutoComplete from "../../../../Generic Components/Form/AutoComplete";
import LoadingSpinner from "../../../../Generic Components/LoadingSpinner";
import { PAYMENT_METHODS } from "../../../../constants";
import { GET_MEMBERSHIP_TYPES } from "../../../../graphql/queries/membershipTypes";
import { MembershipType } from "../../../../types";
import { calculateAmount, formatCurrency } from "../../../../utils";
import "./index.scss";

export default function SaleSummary() {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();
  const term = useWatch({ name: "newMembership.term" });
  const membershipType = useWatch({ name: "newMembership.membershipType" });
  const paymentMethod = useWatch({ name: "payment.paymentMethod" });
  const { data, loading } = useQuery(GET_MEMBERSHIP_TYPES);

  const membershipTypes = data?.membershipTypes?.data as MembershipType[];
  const foundMembershipType = membershipTypes?.find(
    (m) => m.name.toLocaleLowerCase() === membershipType?.toLocaleLowerCase()
  );
  const pricePerMonth = foundMembershipType?.pricePerMonth || 0;
  const discountPercent = foundMembershipType?.discountPercent || 0;

  const amount = calculateAmount(term, pricePerMonth, discountPercent);
  const total = formatCurrency(amount);
  const collected = useWatch({ name: "payment.collected" });
  useEffect(() => {
    const change = collected
      ? round(subtract(Number(collected), Number(amount)), 2)
      : 0;
    setValue("payment.change", change);
    setValue("payment.total", amount ? Number(amount) : 0);
  }, [amount, collected, setValue]);
  const errorMessage = get(errors, "payment.collected");

  return (
    <Box
      className="sale-summary"
      borderLeft={{ xs: "none", lg: "1px solid #e3e3e3" }}
    >
      <h2
        style={{
          width: "100%",
          marginLeft: "10px",
          marginBottom: 0,
        }}
      >
        Sale Summary
      </h2>
      {loading && <LoadingSpinner />}
      <hr className="divider" />
      <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow className="table-header">
              <TableCell>Membership</TableCell>
              <TableCell align="center">Term</TableCell>
              <TableCell align="center">Discount</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              key="membership"
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell scope="row">{membershipType}</TableCell>
              <TableCell align="center">{term}</TableCell>
              <TableCell align="center">{discountPercent}%</TableCell>
              <TableCell align="right">{formatCurrency(amount)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Divider />
      <Stack sx={{ padding: "20px" }}>
        <AutoComplete
          fieldName="payment.paymentMethod"
          label="Payment Method"
          options={PAYMENT_METHODS}
          defaultValue={PAYMENT_METHODS[0]}
          required
          sx={{ marginTop: "20px" }}
        />
        {paymentMethod === PAYMENT_METHODS[0] && (
          <Stack>
            <TextField
              label="Collected"
              variant="standard"
              {...register("payment.collected")}
              InputProps={{ startAdornment: "$" }}
              sx={{ marginTop: "20px" }}
              error={Boolean(errorMessage)}
              type="number"
              helperText={
                Boolean(errorMessage) && errorMessage?.message?.toString()
              }
              required={paymentMethod === PAYMENT_METHODS[0]}
            />
            <TextField
              label="Change"
              variant="standard"
              {...register("payment.change")}
              InputProps={{ startAdornment: "$", readOnly: true }}
              sx={{ marginTop: "20px", marginBottom: "40px" }}
            />
          </Stack>
        )}
      </Stack>
      <Divider />
      <Stack
        direction="row"
        justifyContent="space-between"
        marginTop={3}
        padding={1}
      >
        <p className="bold size-l">Total</p>
        <p className="bold size-l">{total}</p>
      </Stack>
    </Box>
  );
}
