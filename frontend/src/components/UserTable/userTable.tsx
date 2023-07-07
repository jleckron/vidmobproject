import { ChangeEvent, MouseEvent, Dispatch, SetStateAction } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import { setPage, setSize } from "../../redux/slices/tableControlSlice";

import {
  ButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  Paper,
  CircularProgress,
} from "@mui/material";

interface IUserTable {
  data: {
    users: User[];
    error: string;
    isLoading: boolean;
    recordCount: number;
  };
  components: Function[];
}

const UserTable = (props: IUserTable) => {
  const { data, components } = props;
  const { users, error, isLoading, recordCount } = data;

  const dispatch = useAppDispatch();
  const { page, size } = useAppSelector((state) => state.tableControl);

  const messagePlaceholder = (msg: string | JSX.Element) => {
    return (
      <TableRow>
        <TableCell />
        <TableCell />
        <TableCell align="left">{msg}</TableCell>
        <TableCell />
        <TableCell />
      </TableRow>
    );
  };

  const ErrorPlaceholder = () => messagePlaceholder("Error getting users");
  const NoUserPlaceholder = () => messagePlaceholder("No Users");
  const LoadingPlaceholder = () => messagePlaceholder(<CircularProgress />);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell width="20%">First Name</TableCell>
            <TableCell width="20%">Last Name</TableCell>
            <TableCell width="24%">Email</TableCell>
            <TableCell width="18%">Date Created</TableCell>
            <TableCell width="18%" />
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <LoadingPlaceholder />
          ) : error?.length !== 0 ? (
            <ErrorPlaceholder />
          ) : users?.length === 0 ? (
            <NoUserPlaceholder />
          ) : (
            users?.map((user: User, indx: number) => (
              <TableRow key={indx}>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                  }).format(new Date(user.createdAt))}
                </TableCell>
                <TableCell align="right">
                  <ButtonGroup>
                    {components.map((Component: any, indx: number) => (
                      <Component key={indx} user={user} />
                    ))}
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))
          )}
          <TableRow></TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              count={recordCount}
              page={page}
              rowsPerPage={size}
              rowsPerPageOptions={[5, 10, 20, 50]}
              onPageChange={dispatchPageUpdate}
              onRowsPerPageChange={dispatchSizeUpdate}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );

  /**
   * Dispatches new page number to redux table controller
   * @param _event
   * @param page
   */
  function dispatchPageUpdate(
    _event: MouseEvent<HTMLButtonElement> | null,
    page: number
  ) {
    dispatch(setPage(page));
  }

  /**
   * Dispatches new page size to redux table controller
   * @param event
   */
  function dispatchSizeUpdate(event: ChangeEvent<HTMLInputElement>) {
    dispatch(setSize(event.target.value));
  }
};

export default UserTable;
