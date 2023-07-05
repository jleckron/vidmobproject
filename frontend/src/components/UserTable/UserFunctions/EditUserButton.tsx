import { useNavigate } from "react-router-dom";

import { IconButton } from "@mui/material";
import { Edit } from "@mui/icons-material";

import User from "../../../utils/interfaces/user";

interface IEditUser {
  user: User;
}

const EditUserButton = (props: IEditUser) => {
  const { user } = props;

  const navigator = useNavigate();
  const handleClick = () => navigator("/form", { state: { user } });

  return (
    <IconButton sx={{ "&:hover": { color: "#ed6c04" } }} onClick={handleClick}>
      <Edit />
    </IconButton>
  );
};

export default EditUserButton;
