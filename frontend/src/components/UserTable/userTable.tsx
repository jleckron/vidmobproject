import { ChangeEvent, MouseEvent, Dispatch, SetStateAction } from "react";

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

import User from "../../utils/interfaces/user";

interface IUserTable {
  data: {
    users: User[];
    error: string;
    isLoading: boolean;
    recordCount: number;
  };
  pagination: {
    search: string;
    page: number;
    size: number;
    sizeChange: (event: ChangeEvent<HTMLInputElement>) => void;
    pageChange: (
      event: MouseEvent<HTMLButtonElement> | null,
      page: number
    ) => void;
  };
  triggers: {
    reload: Dispatch<SetStateAction<boolean>>;
  };
  components: Array<
    (
      user: any,
      triggers?: { reload: Dispatch<SetStateAction<boolean>> }
    ) => JSX.Element
  >;
}

const UserTable = (props: IUserTable) => {
  const { data, pagination, triggers, components } = props;
  const { users, error, isLoading, recordCount } = data;
  const { page, size, sizeChange, pageChange } = pagination;

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
                    {components.map((Component: Function, indx: number) => (
                      <Component key={indx} user={user} triggers={triggers} />
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
              onPageChange={pageChange}
              onRowsPerPageChange={sizeChange}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
