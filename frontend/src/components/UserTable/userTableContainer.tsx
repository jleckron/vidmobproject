import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import { Button, Box, createTheme, IconButton } from "@mui/material";
import Add from "@mui/icons-material/Add";

import UserTable from "./userTable";

import METHODS from "../../utils/constants/methods";
import ENDPOINTS from "../../utils/constants/endpoints";
import User from "../../utils/interfaces/user";
import SearchField from "../SearchField";

import { setPage } from "../../redux/slices/tableControlSlice";

import EditUserButton from "./UserFunctions/EditUserButton";
import DeleteUserButton from "./UserFunctions/DeleteUserButton";
import { MoreHoriz } from "@mui/icons-material";

interface TableData {
  users: Array<User>;
  error: string;
  isLoading: boolean;
  recordCount: number;
}

const UserTableContainer = () => {
  const [tableData, setTableData] = useState<TableData>({
    users: [],
    error: "",
    isLoading: true,
    recordCount: 0,
  });

  const tableControl = useAppSelector((state) => state.tableControl);
  const dispatch = useAppDispatch();

  /**
   * Calls given endpoint with params size/page/search
   * @param abortController
   */
  async function getAllUsers(abortController: AbortController) {
    const addParams = {
      size: String(tableControl.size),
      page: String(tableControl.page),
      search: tableControl.searchParameter,
    };
    const params = new URLSearchParams([...Object.entries(addParams)]);
    const url = new URL(String(ENDPOINTS.LOCAL_URL) + "?" + params);

    const requestOptions = {
      ...METHODS.GET,
      signal: abortController.signal,
    };
    try {
      const result = await fetch(url, requestOptions);
      const { users, count } = await result.json();

      if (users.length === 0 && count) dispatch(setPage(0));
      setTableData((prevData) => ({
        ...prevData,
        users: users,
        error: "",
        isLoading: false,
        recordCount: count,
      }));
    } catch (err: any) {
      //Disregard user abort error caused by double effect firing in react.strictmode / dev
      if (err.code !== 20) {
        setTableData((prevData) => ({
          ...prevData,
          error: err.message,
          isLoading: false,
          recordCount: 0,
        }));
      }
    }
  }

  useEffect(() => {
    const abortController = new AbortController();
    setTableData((prevData) => ({
      ...prevData,
      isLoading: true,
    }));
    getAllUsers(abortController);
    return () => abortController.abort();
    // eslint-disable-next-line
  }, [tableControl]);

  const theme = createTheme({
    palette: {
      primary: {
        main: "#022cc3",
      },
    },
  });

  const styling = {
    backgroundColor: theme.palette.primary.main,
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link to="/form">
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            // sx={styling}
          >
            Add User
          </Button>
        </Link>
        <SearchField />
      </Box>
      <UserTable
        data={tableData}
        components={[EditUserButton, DeleteUserButton]}
      />
    </>
  );
};

export default UserTableContainer;
