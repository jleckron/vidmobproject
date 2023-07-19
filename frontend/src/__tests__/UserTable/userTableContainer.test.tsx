import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
// import {
//   ApolloProvider,
//   gql,
//   useQuery as useApolloQuery,
// } from "@apollo/client";
import UserTableContainer from "../../components/UserTable";
import * as UseFetchModule from "../../hooks/useFetch";
import { tableControlSlice } from "../../redux/slices/tableControlSlice";
import { userFormSlice } from "../../redux/slices/userFormSlice";
import { RootState } from "../../redux/store";
import METHODS from "../../utils/constants/methods";
import ENDPOINTS from "../../utils/constants/endpoints";
const tableControlInitialState = tableControlSlice.getInitialState();
const userFormInitialState = userFormSlice.getInitialState();

describe("UserTableContainer", () => {
  const mockStore = configureStore<RootState>([]);
  const initialState: RootState = {
    tableControl: {
      ...tableControlInitialState,
    },
    userForm: {
      ...userFormInitialState,
    },
  };
  let store: ReturnType<typeof mockStore>;

  const MockParams = {
    url: new URL(ENDPOINTS.LOCAL_URL),
    ...METHODS.GET,
  };

  const mockFullResult = {
    data: {
      users: [
        {
          _id: 1,
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          createdAt: "2023-07-16T12:00:00.000Z",
          updatedAt: "2023-07-16T12:00:00.000Z",
        },
      ],
      count: 1,
    },
    response: null,
    isLoading: false,
    error: null,
    execute: jest.fn(),
  };

  beforeEach(() => {
    store = mockStore(initialState);
  });

  test("renders UserTable with correct data", () => {
    jest.spyOn(UseFetchModule, "useGet").mockReturnValue(mockFullResult);

    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserTableContainer />
        </BrowserRouter>
      </Provider>
    );

    // // Ensure that the Add User button is present
    const addUserButton = screen.getByRole("button", { name: "ADD USER" });
    expect(addUserButton).toBeInTheDocument();

    // Ensure that the UserTable component is rendered with correct data
    const userRow = screen.getByText("John");
    expect(userRow).toBeInTheDocument();
  });

  test("renders UserTable with no users", () => {
    const mockNoUsersResult = {
      data: {
        users: [],
        count: 0,
      },
      response: null,
      isLoading: false,
      error: null,
      execute: jest.fn(),
    };

    jest.spyOn(UseFetchModule, "useGet").mockReturnValue(mockNoUsersResult);

    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserTableContainer />
        </BrowserRouter>
      </Provider>
    );

    // Ensure that the UserTable component is rendered with no user display
    const userRow = screen.getByText("No Users");
    expect(userRow).toBeInTheDocument();
  });

  test("renders UserTable with error", () => {
    const mockErrorResult = {
      data: {
        users: [],
        count: 0,
      },
      response: null,
      isLoading: false,
      error: new Error("some error"),
      execute: jest.fn(),
    };

    jest.spyOn(UseFetchModule, "useGet").mockReturnValue(mockErrorResult);

    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserTableContainer />
        </BrowserRouter>
      </Provider>
    );

    // Ensure that the UserTable component is rendered with error display
    const errorRow = screen.getByText("Error getting users");
    expect(errorRow).toBeInTheDocument();
  });

  test("calls execute function when tableControl is changed", () => {
    jest.spyOn(UseFetchModule, "useGet").mockReturnValue(mockFullResult);
    const resultObj = UseFetchModule.useGet({ ...MockParams });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserTableContainer />
        </BrowserRouter>
      </Provider>
    );

    // Ensure that execute is called when tableControl is changed

    //Test execute called when rows per page is changed
    const pageSizeChange = screen.getByRole("button", {
      name: "Rows per page: 5",
    });
    fireEvent.change(pageSizeChange, { target: 10 });
    expect(resultObj.execute).toBeCalled();

    //Test execute called when orderBy column is changed
    const orderByChange = screen.getByRole("button", { name: "First Name" });
    fireEvent.change(orderByChange, { target: "firstName" });
    expect(resultObj.execute).toBeCalled();

    //Test execute called when search param is changed
    const searchChange = screen.getByRole("textbox", { name: "search" });
    fireEvent.change(searchChange, { target: "J" });
    expect(resultObj.execute).toBeCalled();
  });

  // Add more test cases for other functionality and scenarios as needed
});

// Mock the useApolloQuery hook
// jest.mock("@apollo/client");
// const mockGqlData = {
//   data: {
//     users: [
//       {
//         _id: 1,
//         firstName: "John",
//         lastName: "Doe",
//         email: "john.doe@example.com",
//         createdAt: "2023-07-16T12:00:00.000Z",
//         updatedAt: "2023-07-16T12:00:00.000Z",
//       },
//     ],
//     count: 1,
//   },
//   loading: false,
//   error: null,
// };
// useApolloQuery.mockReturnValue(mockGqlData);
