import { ChangeEvent } from "react";

import { useAppDispatch } from "../../redux/hooks";
import { updateSearch } from "../../redux/slices/tableControlSlice";

import { Box, Toolbar, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const RightToolBar = styled(Toolbar)(() => ({
  display: "flex",
  justifyContent: "flex-end",
}));

const SearchWrap = styled("div")(({ theme }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "row",
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: "100%",
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  alignSelf: "flex-end",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

const SearchField = () => {
  const dispatch = useAppDispatch();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <form>
        <RightToolBar>
          <SearchWrap>
            <SearchIconWrapper>
              <Search />
            </SearchIconWrapper>
            <StyledTextField
              variant="standard"
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              onChange={setSearchParameter}
            />
          </SearchWrap>
        </RightToolBar>
      </form>
    </Box>
  );

  /**
   * Handles updating search parameter in redux table controller
   * @param event
   */
  function setSearchParameter(event: ChangeEvent<HTMLInputElement>) {
    const param = event.target.value;
    dispatch(updateSearch(param));
  }
};

export default SearchField;
