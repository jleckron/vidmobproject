import { ChangeEvent, FormEvent } from "react";

import { Box, TextField, Button, Grid, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { Link } from "react-router-dom";

import { clearForm, updateUserField } from "../../redux/slices/userFormSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

interface IUserForm {
  data: {
    serviceError: string;
    isLoading: boolean;
    title: "Add User" | "Edit User";
  };
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const UserForm = (props: IUserForm) => {
  const { data, handleSubmit } = props;
  const { serviceError, isLoading, title } = data;

  const { user, formErrors } = useAppSelector((state) => state.userForm);
  const dispatch = useAppDispatch();

  const style = {
    position: "absolute" as "absolute",
    top: "10%",
    left: "50%",
    transform: "translate(-50%, 0)",
    width: "60%",
    bgcolor: "background.paper",
    p: 4,
    textAlign: "center",
  };

  //Returns boolean to control submit button disabled state
  const checkFormCompleteNoError = (): boolean => {
    let complete = true;
    for (const val of Object.values(formErrors)) {
      if (val) complete = false;
    }

    return (
      complete &&
      user.firstName?.length > 0 &&
      user.lastName?.length > 0 &&
      user.email?.length > 0
    );
  };

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const field = event.target.id;
    dispatch(updateUserField({ field, value: event.target.value }));
  };

  const handleCancel = () => {
    dispatch(clearForm());
  };

  return (
    <Box sx={style}>
      <Typography variant="h3">{title}</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              required
              label="First Name"
              id="firstName"
              fullWidth
              margin="normal"
              onChange={handleOnChange}
              defaultValue={user.firstName || null}
              error={formErrors.firstName.length > 0}
              helperText={formErrors.firstName}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              label="Last Name"
              id="lastName"
              fullWidth
              margin="normal"
              onChange={handleOnChange}
              defaultValue={user.lastName || null}
              error={formErrors.lastName.length > 0}
              helperText={formErrors.lastName}
            />
          </Grid>
        </Grid>

        <TextField
          required
          label="Email"
          id="email"
          fullWidth
          margin="normal"
          onChange={handleOnChange}
          defaultValue={user.email || null}
          error={formErrors.email.length > 0}
          helperText={formErrors.email}
        />

        <Box mt={2}>
          <Link to="/">
            <Button
              onClick={handleCancel}
              type="button"
              variant="outlined"
              color="primary"
              style={{ marginRight: "10px" }}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </Link>

          <LoadingButton
            loading={isLoading}
            type="submit"
            variant="contained"
            color="primary"
            disabled={!checkFormCompleteNoError() || serviceError.length > 0}
          >
            Submit
          </LoadingButton>
        </Box>
        <Typography color="error">{serviceError}</Typography>
      </form>
    </Box>
  );
};

export default UserForm;
export type { IUserForm };
