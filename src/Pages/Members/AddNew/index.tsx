import { useMutation } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormControl, Stack } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import LoadingSpinner from "../../../Generic Components/LoadingSpinner";
import { ADD_MEMBER } from "../../../graphql/mutations/addMember";
import { addMember } from "../../../Redux-toolkit/features/Members/memberSlice";
import { useAppDispatch } from "../../../Redux-toolkit/hooks";
import { Member } from "../../../types";
import Information from "../components/Information";
import LeftPanel from "../components/LeftPanel/LeftPanel";
import MemberToolbar from "../components/Toolbar";
import { validationSchema } from "../validationSchema";
import "./index.scss";
import { mapMemberPayload } from "./utils";

export default function AddNew() {
  const methods = useForm<Member>({
    resolver: yupResolver(validationSchema),
  });
  const { handleSubmit } = methods;
  const [add, { loading }] = useMutation(ADD_MEMBER);
  const [editing, setEditing] = useState(true);
  const dispatch = useAppDispatch();
  const photoUrl = "";
  const onSave = (data: Member) => {
    const newMember = mapMemberPayload(data, photoUrl) as Member;
    add({
      variables: newMember,
    }).then(() => {
      dispatch(addMember(newMember));
      setEditing(false);
    });
  };

  const onSubmit: SubmitHandler<Member> = (data) => {
    if (editing) onSave(data);
    else setEditing((prev) => !prev);
  };
  return (
    <div className="new-member">
      <h1>New Member</h1>
      {loading && <LoadingSpinner />}
      <FormProvider {...methods}>
        <FormControl
          fullWidth
          component="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack className="details-container" direction="row">
              <LeftPanel />
              <Stack className="details-content" direction="row">
                <MemberToolbar />
                <Information
                  member={{}}
                  editing={editing}
                  isAddNew={true}
                  setEditing={setEditing}
                />
              </Stack>
            </Stack>
          </LocalizationProvider>
        </FormControl>
      </FormProvider>
    </div>
  );
}
