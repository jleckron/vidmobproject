import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Button, Box } from "@mui/material";
import Add from "@mui/icons-material/Add";

import UserTable from "./userTable";

import METHODS from "../../utils/constants/methods";
import ENDPOINTS from "../../utils/constants/endpoints";
import User from "../../utils/types/user";
import SearchField from "../SearchField";

import EditUser from "./UserFunctions/EditUser";
import DeleteUser from "./UserFunctions/DeleteUser";

interface TableData {
  users: Array<User>;
  error: string;
  isLoading: boolean;
  recordCount: number;
}

const UserTableContainer = () => {
  const [reloadAfterDelete, setReloadAfterDelete] = useState<boolean>(false);
  const [tableController, setTableController] = useState({
    search: "",
    page: Number(sessionStorage.getItem("pageNum")) || 0,
    size: Number(sessionStorage.getItem("pageSize")) || 5,
  });
  const [tableData, setTableData] = useState<TableData>({
    users: [],
    error: "",
    isLoading: true,
    recordCount: 0,
  });

  /**
   * Calls given endpoint with params size/page/search
   * @param abortController
   */
  async function getAllUsers(abortController: AbortController) {
    const addParams = {
      size: String(tableController.size),
      page: String(tableController.page),
      search: tableController.search,
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
      if (users.length === 0 && count) {
        setTableController((prevController) => ({
          ...prevController,
          page: prevController.page - 1,
        }));
      }
      setTableData((prevData) => ({
        ...prevData,
        users: users,
        error: "",
        recordCount: count,
        isLoading: false,
      }));
    } catch (err: any) {
      //Disregard user abort error caused by double effect firing in react.strictmode / dev
      if (err.code !== 20) {
        setTableData((prevData) => ({
          ...prevData,
          error: err.message,
          isLoading: false,
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
  }, [tableController, reloadAfterDelete]);

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
          <Button variant="contained" size="large" startIcon={<Add />}>
            Add User
          </Button>
        </Link>
        <SearchField handleSearchParamChange={handleSearchParamChange} />
      </Box>
      <UserTable
        data={tableData}
        pagination={{
          ...tableController,
          sizeChange: handlePageSizeChange,
          pageChange: handlePageNumChange,
        }}
        triggers={{ reload: setReloadAfterDelete }}
        components={[EditUser, DeleteUser]}
      />
    </>
  );

  /**
   * Handles control of table page number selection
   * @param _event
   * @param newPage
   */
  function handlePageNumChange(
    _event: React.ChangeEvent<HTMLInputElement>,
    newPage: number
  ) {
    sessionStorage.setItem("pageNum", String(newPage));

    setTableController((prevController) => ({
      ...prevController,
      page: newPage,
    }));
  }

  /**
   * Handles control of table page size selection changes
   * @param event
   */
  function handlePageSizeChange(event: React.ChangeEvent<HTMLInputElement>) {
    sessionStorage.setItem("pageSize", event.target.value);
    sessionStorage.setItem("pageNum", "0");

    setTableController({
      ...tableController,
      page: 0,
      size: Number(event.target.value),
    });
  }

  /**
   * Handles setting search param from search input on value change
   * @param event
   */
  function handleSearchParamChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setTableController((prevController) => ({
      ...prevController,
      page: 0,
      search: event.target.value,
    }));
  }
};

export default UserTableContainer;
