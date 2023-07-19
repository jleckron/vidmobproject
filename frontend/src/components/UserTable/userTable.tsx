import { ChangeEvent, MouseEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import {
  setPage,
  setSize,
  setSortColumn,
  setSortOrder,
} from "../../redux/slices/tableControlSlice";

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
  TableSortLabel,
  Box,
  Pagination,
  Select,
  SelectChangeEvent,
  MenuItem,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";

interface IUserTable {
  data: {
    users: User[];
    error: Error | null;
    isLoading: boolean;
    count: number;
  };
  components: Function[];
}
type Order = "asc" | "desc";
const headCells = [
  { label: "First Name", id: "firstName", width: "20%" },
  { label: "Last Name", id: "lastName", width: "20%" },
  { label: "Email", id: "email", width: "27%" },
  { label: "Date Created", id: "createdAt", width: "18%" },
  { label: "", id: "", width: "15%" },
];

const UserTable = (props: IUserTable) => {
  const { data, components } = props;
  const { users, error, isLoading, count } = data;

  const dispatch = useAppDispatch();
  const { page, size, sortBy, order } = useAppSelector(
    (state) => state.tableControl
  );

  const handleRequestSort = (_event: MouseEvent<unknown>, property: string) => {
    const isAsc = sortBy === property && order === "asc";
    dispatch(setSortOrder(isAsc ? "desc" : "asc"));
    dispatch(setSortColumn(property));
  };

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

  //Have page be 0 while api returns new count - clears error
  const countParam = count || 0;
  const pageParam = countParam === 0 ? 0 : page;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <EnhancedTableHead
          order={order as Order}
          orderBy={sortBy}
          onRequestSort={handleRequestSort}
          rowCount={5}
        />
        <TableBody>
          {isLoading ? (
            <LoadingPlaceholder />
          ) : error ? (
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
              count={countParam}
              page={pageParam}
              rowsPerPage={size}
              rowsPerPageOptions={[5, 10, 20, 50]}
              onPageChange={dispatchPageUpdate}
              onRowsPerPageChange={dispatchSizeUpdate}
            />
            {/* <Select label="Rows" value={size} onChange={dispatchSizeUpdate}>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
            <Pagination
              count={Math.floor(countParam / size)}
              page={pageParam}
              onChange={dispatchPageUpdate}
            /> */}
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
    _event: ChangeEvent<unknown> | null,
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

/**
 * DEFINE ENHANCED TABLE HEADER WITH SORTING FROM MUI TABLE EXAMLE
 */

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: string) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
            width={headCell.width}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default UserTable;
