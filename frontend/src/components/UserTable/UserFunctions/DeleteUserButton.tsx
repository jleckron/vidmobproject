import { useState } from "react";
import { useAppDispatch } from "../../../redux/hooks";
import { IconButton, Modal, Box, Typography, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Delete } from "@mui/icons-material";

import { toggleShouldReload } from "../../../redux/slices/tableControlSlice";

import ENDPOINTS from "../../../utils/constants/endpoints";
import METHODS from "../../../utils/constants/methods";
import User from "../../../utils/interfaces/user";

interface IDeleteUser {
  user: User;
}

const DeleteUserButton = (props: IDeleteUser) => {
  const { user } = props;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const handleModal = () => setIsModalOpen((prevState) => !prevState);

  async function handleDelete() {
    setIsLoading(true);
    const url = new URL(ENDPOINTS.LOCAL_URL);
    url.pathname = `/users/${user._id}`;
    const requestOptions = {
      ...METHODS.DELETE,
    };
    try {
      await fetch(url, requestOptions);
    } catch (err) {
      alert(err);
    } finally {
      setIsLoading(false);
      dispatch(toggleShouldReload());
    }
  }

  const style = {
    position: "absolute" as "absolute",
    top: "25%",
    left: "50%",
    transform: "translate(-50%, 0)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    textAlign: "center",
  };

  return (
    <>
      <Modal
        open={isModalOpen}
        onClose={handleModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Delete {user.firstName} {user.lastName}
          </Typography>
          <Box mt={2}>
            <Button
              style={{ marginRight: "8px" }}
              onClick={handleModal}
              disabled={isLoading}
            >
              Let them stay
            </Button>
            <LoadingButton
              onClick={handleDelete}
              variant="contained"
              color="error"
              loading={isLoading}
            >
              <span>Delete</span>
            </LoadingButton>
          </Box>
        </Box>
      </Modal>
      <IconButton
        onClick={handleModal}
        sx={{ "&:hover": { color: "#d32f2f" } }}
      >
        <Delete />
      </IconButton>
    </>
  );
};

export default DeleteUserButton;
