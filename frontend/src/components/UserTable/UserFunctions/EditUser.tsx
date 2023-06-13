import { IconButton } from "@mui/material";
import { Edit } from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

const EditUser = ({ user }: any) => {
  const navigator = useNavigate();
  const handleClick = () => navigator("/form", { state: { user } });

  return (
    <IconButton sx={{ "&:hover": { color: "#ed6c04" } }} onClick={handleClick}>
      <Edit />
    </IconButton>
  );
};

export default EditUser;
