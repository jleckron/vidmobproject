import React, { useEffect, useState } from "react";

import { Button, Box } from "@mui/material";
import Add from "@mui/icons-material/Add";
import { Link } from "react-router-dom";

import UserTable from "./userTable";

import METHODS from "../../utils/constants/methods";
import ENDPOINTS from "../../utils/constants/endpoints";
import User from "../../utils/types/user";
import SearchField from "../SearchField";

import EditUser from "./UserFunctions/EditUser";
import DeleteUser from "./UserFunctions/DeleteUser";

const UserTableContainer = () => {
  const [users, setUsers] = useState<Array<User> | null>();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reloadAfterDelete, setReloadAfterDelete] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [tableController, setTableController] = useState({
    search: "",
    page: Number(sessionStorage.getItem("pageNum")) || 0,
    size: Number(sessionStorage.getItem("pageSize")) || 5,
  });

  useEffect(() => {
    const abortController = new AbortController();
    setIsLoading(true);
    getAllUsers(abortController);
    return () => abortController.abort();
    // eslint-disable-next-line
  }, [tableController, reloadAfterDelete]);

  //Calls given endpoint with params size/page/search
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
      const body = await fetch(url, requestOptions);

      const { users, count } = await body.json();
      if (users.length === 0 && count) {
        setTableController((prevController) => ({
          ...prevController,
          page: prevController.page - 1,
        }));
      }
      setUsers(users);
      setError("");
      if (totalCount !== count) setTotalCount(count);
      setIsLoading(false);
    } catch (err: any) {
      const { code, message } = err;
      //Disregard user abort error caused by double effect firing in react.strictmode / dev
      if (code !== 20) {
        setError(message);
        setIsLoading(false);
      }
    } finally {
      // setIsLoading(false);
    }
  }

  //Handles control of table page size selection changes
  const handleTableControl = (event: React.ChangeEvent<HTMLInputElement>) => {
    sessionStorage.setItem("pageSize", event.target.value);
    sessionStorage.setItem("pageNum", "0");

    setTableController({
      ...tableController,
      page: 0,
      size: Number(event.target.value),
    });
  };

  //Handles control of table page number selection
  const handleOnPageChange = (
    _event: React.ChangeEvent<HTMLInputElement>,
    newPage: number
  ) => {
    sessionStorage.setItem("pageNum", String(newPage));

    setTableController((prevController) => {
      return { ...prevController, page: newPage };
    });
  };

  //Handles setting search param from search input on value change
  const handleSearchParamChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    setTableController((prevController) => {
      return { ...prevController, page: 0, search: event.target.value };
    });
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
          <Button variant="contained" size="large" startIcon={<Add />}>
            Add User
          </Button>
        </Link>
        <SearchField
          searchParam={tableController.search}
          handleSearchParamChange={handleSearchParamChange}
        />
      </Box>
      <UserTable
        data={{ users, error, isLoading }}
        pagination={{
          ...tableController,
          totalCount: totalCount,
          sizeChange: handleTableControl,
          pageChange: handleOnPageChange,
        }}
        triggers={{ reload: setReloadAfterDelete }}
        components={[EditUser, DeleteUser]}
      />
    </>
  );
};

export default UserTableContainer;
