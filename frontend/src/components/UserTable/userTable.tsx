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

import User from "../../utils/types/user";

const UserTable = ({ data, pagination, triggers, components }: any) => {
  const messagePlaceholder = (msg: any) => {
    return (
      <>
        <TableCell />
        <TableCell />
        <TableCell align="left">{msg}</TableCell>
        <TableCell />
        <TableCell />
      </>
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
            <TableCell width="20%">Email</TableCell>
            <TableCell width="20%">Date Joined</TableCell>
            <TableCell width="10%" />
          </TableRow>
        </TableHead>
        <TableBody>
          {data.isLoading ? (
            <TableRow>
              <LoadingPlaceholder />
            </TableRow>
          ) : (
            !data.error.length &&
            data.users?.map((user: User, indx: number) => (
              <TableRow key={indx}>
                <TableCell component="th" scope="row">
                  {user.firstName}
                </TableCell>
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
                      <Component key={indx} user={user} triggers={triggers} />
                    ))}
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))
          )}
          <TableRow>
            {data.users?.length === 0 && data.error?.length === 0 && (
              <NoUserPlaceholder />
            )}
            {data.error?.length !== 0 && <ErrorPlaceholder />}
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              count={pagination.totalCount}
              page={pagination.page}
              rowsPerPage={pagination.size}
              rowsPerPageOptions={[5, 10, 20, 50]}
              onPageChange={pagination.pageChange}
              onRowsPerPageChange={pagination.sizeChange}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
