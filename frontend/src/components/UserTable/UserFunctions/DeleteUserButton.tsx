import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../redux/hooks";
import { IconButton, Modal, Box, Typography, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Delete } from "@mui/icons-material";

import { toggleShouldReload } from "../../../redux/slices/tableControlSlice";

import ENDPOINTS from "../../../utils/constants/endpoints";
import { usePost } from "../../../hooks/useFetch";
import METHODS from "../../../utils/constants/methods";

interface IDeleteUser {
  user: User;
}

const DeleteUserButton = (props: IDeleteUser) => {
  const { user } = props;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const handleModal = () => setIsModalOpen((prevState) => !prevState);

  const url = new URL(ENDPOINTS.LOCAL_URL);
  url.pathname = `/users/${user._id}`;
  const { response, isLoading, error, execute } = usePost({
    url,
    ...METHODS.DELETE,
  });

  /**
   * Fire delete request in hook
   */
  function handleDelete() {
    execute();
  }

  /**
   * Reload user table if delete successful
   */
  useEffect(() => {
    if (response?.ok) {
      dispatch(toggleShouldReload());
    }
  }, [response, dispatch]);

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
        role="dialog"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Delete {user.firstName} {user.lastName}?
          </Typography>
          <Box mt={2}>
            <Button
              style={{ marginRight: "8px" }}
              onClick={handleModal}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <LoadingButton
              onClick={handleDelete}
              variant="contained"
              color="error"
              loading={isLoading}
              role="button"
              name="delete"
            >
              <span>Delete</span>
            </LoadingButton>
            {error && (
              <Typography color="error">Error Deleting User</Typography>
            )}
          </Box>
        </Box>
      </Modal>
      <IconButton
        onClick={handleModal}
        sx={{ "&:hover": { color: "#d32f2f" } }}
        role="button"
        name="deleteIcon"
      >
        <Delete name="findme" />
      </IconButton>
    </>
  );
};

export default DeleteUserButton;
