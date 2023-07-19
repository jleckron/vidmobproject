import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import UserTable from "../../components/UserTable/userTable";

import { tableControlSlice } from "../../redux/slices/tableControlSlice";
import { userFormSlice } from "../../redux/slices/userFormSlice";
import { RootState } from "../../redux/store";
const tableControlInitialState = tableControlSlice.getInitialState();
const userFormInitialState = userFormSlice.getInitialState();

describe("UserTable", () => {
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

  const mockData = {
    users: [
      {
        _id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        createdAt: "2023-06-12T18:26:55.320+00:00",
        updatedAt: "2023-06-12T18:26:55.320+00:00",
      },
      {
        _id: 2,
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        createdAt: "2023-06-13T17:16:32.820+00:00",
        updatedAt: "2023-06-13T17:16:32.820+00:00",
      },
    ],
    error: null,
    isLoading: false,
    count: 2,
  };

  const mockComponents = [jest.fn(), jest.fn()];

  beforeEach(() => {
    store = mockStore(initialState);
  });

  test("renders UserTable wrapped in Provider and receives table control data from Redux store", () => {
    render(
      <Provider store={store}>
        <UserTable data={mockData} components={mockComponents} />
      </Provider>
    );

    // Verify that user data is rendered
    const firstNameCells = screen.getAllByText(/John|Jane/);
    expect(firstNameCells).toHaveLength(2);

    const lastNameCells = screen.getAllByText(/Doe/);
    expect(lastNameCells).toHaveLength(2);

    const emailCells = screen.getAllByText(/john@example.com|jane@example.com/);
    expect(emailCells).toHaveLength(2);

    const createdAtCells = screen.getAllByText(/June 12, 2023|June 13, 2023/);
    expect(createdAtCells).toHaveLength(2);

    // Verify that UserTable receives data from Redux store
    const state = store.getState();
    expect(state.tableControl.page).toEqual(tableControlInitialState.page);
    expect(state.tableControl.size).toEqual(tableControlInitialState.size);
  });

  test("renders loading placeholder when isLoading is true", () => {
    const loadingData = {
      users: [],
      error: null,
      isLoading: true,
      count: 0,
    };

    render(
      <Provider store={store}>
        <UserTable data={loadingData} components={mockComponents} />
      </Provider>
    );

    // Verify that CircularProgress is rendered
    const circularProgress = screen.getByRole("progressbar");
    expect(circularProgress).toBeInTheDocument();
  });

  test("renders error placeholder when error is present", () => {
    const errorData = {
      users: [],
      error: new Error("Some error"),
      isLoading: false,
      count: 0,
    };

    render(
      <Provider store={store}>
        <UserTable data={errorData} components={mockComponents} />
      </Provider>
    );

    // Verify that error placeholder is rendered
    const errorPlaceholder = screen.getByText("Error getting users");
    expect(errorPlaceholder).toBeInTheDocument();
  });

  test("renders no user placeholder when users array is empty", () => {
    const emptyUsersData = {
      users: [],
      error: null,
      isLoading: false,
      count: 0,
    };

    render(
      <Provider store={store}>
        <UserTable data={emptyUsersData} components={mockComponents} />
      </Provider>
    );

    // Verify that no user placeholder is rendered
    const noUserPlaceholder = screen.getByText("No Users");
    expect(noUserPlaceholder).toBeInTheDocument();
  });

  // Add more test cases if needed
});
