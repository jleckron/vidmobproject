import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";

import { gql, useQuery as useApolloQuery } from "@apollo/client";

import {
  Button,
  Box,
  // createTheme, IconButton
} from "@mui/material";
import Add from "@mui/icons-material/Add";

import UserTable from "./userTable";

import ENDPOINTS from "../../utils/constants/endpoints";
import SearchField from "../SearchField";

import EditUserButton from "./UserFunctions/EditUserButton";
import DeleteUserButton from "./UserFunctions/DeleteUserButton";
import { useGet } from "../../hooks/useFetch";
import METHODS from "../../utils/constants/methods";
// import { MoreHoriz } from "@mui/icons-material";

const UserTableContainer = () => {
  const tableControl = useAppSelector((state) => state.tableControl);

  /**
   * Setup query for REST/HTTP endpoint and init hook values
   */
  const addParams = {
    size: String(tableControl.size),
    page: String(tableControl.page),
    search: tableControl.searchParameter,
    sortBy: tableControl.sortBy,
    order: tableControl.order,
  };
  const params = new URLSearchParams([...Object.entries(addParams)]);
  const url = new URL(String(ENDPOINTS.LOCAL_URL) + "?" + params);

  const { data, isLoading, error, execute } = useGet({
    url,
    ...METHODS.GET,
  });

  const tableProps = {
    users: data?.users || [],
    count: data?.count || 0,
    isLoading,
    error,
  };

  /**
   * End of REST/HTTP setup
   */

  /**
   * Setup query for GraphQL endpoint
   */
  const GQL_USERS = gql`
    query GetUsers(
      $page: Int!
      $size: Int!
      $sortBy: String!
      $order: String!
      $search: String!
    ) {
      users(
        page: $page
        size: $size
        sortBy: $sortBy
        order: $order
        search: $search
      ) {
        _id
        firstName
        lastName
        email
        createdAt
        updatedAt
      }
      count(search: $search)
    }
  `;

  // const GQL_Data = useApolloQuery(GQL_USERS, {
  //   variables: {
  //     size: tableControl.size,
  //     page: tableControl.page,
  //     search: tableControl.searchParameter,
  //     sortBy: tableControl.sortBy,
  //     order: tableControl.order,
  //   },
  // });

  // const GQL_tableprops = {
  //   users: GQL_Data?.data?.users,
  //   count: GQL_Data?.data?.count || 0,
  //   isLoading: GQL_Data?.loading,
  //   error: GQL_Data?.error as Error,
  // };
  /**
   * End of GraphQL setup
   */

  /**
   * Update response data in hook when table control is changed
   *
   * Uncomment 'execute()' to send REST requests
   */
  useEffect(() => {
    const abortController = new AbortController();
    execute(abortController);

    return () => {
      abortController.abort();
    };
  }, [tableControl]);

  // PASS 'tableProps' to data to use REST endpoint
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
            {"ADD USER"}
          </Button>
        </Link>
        <SearchField />
      </Box>
      <UserTable
        data={tableProps}
        components={[EditUserButton, DeleteUserButton]}
      />
    </>
  );
};

export default UserTableContainer;

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#022cc3",
//     },
//   },
// });
// const styling = {
//   backgroundColor: theme.palette.primary.main,
// };
