import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../redux/hooks";

import { IconButton } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { setUser } from "../../../redux/slices/userFormSlice";

interface IEditUser {
  user: User;
}

const EditUserButton = (props: IEditUser) => {
  const { user } = props;

  const dispatch = useAppDispatch();

  const navigator = useNavigate();
  const handleClick = () => {
    navigator("/form");
    dispatch(setUser(user));
  };

  return (
    <IconButton
      sx={{ "&:hover": { color: "#4caf50" } }}
      onClick={handleClick}
      role="button"
    >
      <Edit />
    </IconButton>
  );
};

export default EditUserButton;
