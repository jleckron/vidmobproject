import { ChangeEvent, FormEvent } from "react";

import { Box, TextField, Button, Grid, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { Link } from "react-router-dom";

import User from "../../utils/interfaces/user";
import { clearUser } from "../../redux/slices/editableUserSlice";
import { useAppDispatch } from "../../redux/hooks";

interface IUserForm {
  data: {
    userInfo: User;
    formErrors: {
      firstName: string;
      lastName: string;
      email: string;
    };
    serviceError: string;
    isLoading: boolean;
    title: "Add User" | "Edit User";
  };
  handleOnChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const UserForm = (props: IUserForm) => {
  const { data, handleOnChange, handleSubmit } = props;
  const { userInfo, formErrors, serviceError, isLoading, title } = data;

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
      userInfo.firstName?.length > 0 &&
      userInfo.lastName?.length > 0 &&
      userInfo.email?.length > 0
    );
  };

  const handleCancel = () => {
    dispatch(clearUser());
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
              defaultValue={userInfo.firstName || null}
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
              defaultValue={userInfo.lastName || null}
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
          defaultValue={userInfo.email || null}
          error={formErrors.email.length > 0}
          helperText={formErrors.email}
        />

        <Typography color="error">{serviceError}</Typography>

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
            disabled={!checkFormCompleteNoError()}
          >
            Submit
          </LoadingButton>
        </Box>
      </form>
    </Box>
  );
};

export default UserForm;
