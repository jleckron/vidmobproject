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

const SearchField = ({ handleSearchParamChange }: any) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <form onSubmit={handleSearchParamChange}>
        <RightToolBar>
          <SearchWrap>
            <SearchIconWrapper>
              <Search />
            </SearchIconWrapper>
            <StyledTextField
              variant="standard"
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              onChange={handleSearchParamChange}
            />
          </SearchWrap>
        </RightToolBar>
      </form>
    </Box>
  );
};

export default SearchField;
