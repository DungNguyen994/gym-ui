import { useMutation } from "@apollo/client";
import { Delete, Login, Phone } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  IconButton,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Image from "mui-image";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../Generic Components/LoadingSpinner";
import {
  MEMBERSHIP_STATUS,
  MEMBERSHIP_STATUS_DESCRIPTION,
} from "../../../constants";
import { CHECK_IN } from "../../../graphql/mutations/checkIn";
import { VISIT_HISTORY } from "../../../graphql/queries/visitHistory";
import { ROUTES } from "../../../routes";
import { Member, MembershipStatus } from "../../../types";
import { getFullName } from "../../../utils";
import "./index.scss";
interface Props {
  member: Member;
  onDelete: (member: Member) => void;
}
export default function MemberCard({ member, onDelete }: Props) {
  const { photo, phoneNumber, status, firstName, lastName } = member;
  const navigate = useNavigate();
  const [checkIn, { data, loading }] = useMutation(CHECK_IN);
  const [open, setOpen] = useState(false);
  const onCheckIn = () => {
    checkIn({
      variables: { memberId: member.id },
      refetchQueries: [{ query: VISIT_HISTORY }],
    }).then(() => {
      setOpen(true);
    });
  };
  const onClose = () => setOpen(false);
  return (
    <div>
      {loading && <LoadingSpinner />}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={onClose}
        message={data?.checkIn?.data || ""}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }} onClose={onClose}>
          {data?.checkIn?.data || ""}
        </Alert>
      </Snackbar>
      <Card className="card-container">
        <CardActionArea
          onClick={() =>
            member.id && navigate(ROUTES.EDITMEMBER.replace(":id", member.id))
          }
        >
          <Stack direction="row">
            <Image
              src={(photo as string) || "/profile-icon.png"}
              width={100}
              height={130}
              showLoading
              fit="cover"
            />
            <Box sx={{ display: "flex", flexDirection: "column" }} width="80%">
              <CardContent
                sx={{
                  flex: "1 0 auto",
                  p: 1,
                  pl: 2,
                  "&:last-child": {
                    pb: 1,
                  },
                }}
              >
                <Stack justifyContent="space-between" height="100%">
                  <Stack>
                    <Typography component="div" variant="h5">
                      {getFullName(firstName, lastName)}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Phone fontSize="small" />
                      <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        component="div"
                      >
                        {phoneNumber}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ width: "50%" }}
                    color={
                      status === MEMBERSHIP_STATUS.ACTIVE
                        ? "success"
                        : status === MEMBERSHIP_STATUS.EXPIRED
                        ? "error"
                        : "inherit"
                    }
                  >
                    {MEMBERSHIP_STATUS_DESCRIPTION[status as MembershipStatus]}
                  </Button>
                </Stack>
              </CardContent>
            </Box>
          </Stack>
        </CardActionArea>
        <IconButton className="delete-icon" onClick={() => onDelete(member)}>
          <Tooltip title="Delete Member">
            <Delete color="error" />
          </Tooltip>
        </IconButton>
        <IconButton
          className="checkin-icon"
          onClick={() => onCheckIn()}
          disabled={status !== MEMBERSHIP_STATUS.ACTIVE}
        >
          <Tooltip title="Check In">
            <Login color="success" />
          </Tooltip>
        </IconButton>
      </Card>
    </div>
  );
}
