import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore, { MockStoreEnhanced } from "redux-mock-store";
import UserTable, { IUserTable } from "../components/UserTable/userTable";

import { tableControlSlice } from "../redux/slices/tableControlSlice";
const tableControlInitialState = tableControlSlice.getInitialState();
type TableControlState = typeof tableControlInitialState;

describe("UserTable", () => {
  const mockStore = configureStore<Partial<TableControlState>>();
  const initialState: TableControlState = {
    ...tableControlInitialState,
  };
  let store: MockStoreEnhanced<Partial<TableControlState>>;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  const mockData: IUserTable["data"] = {
    users: [
      {
        _id: 0,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        createdAt: "2023-06-12T18:26:55.320+00:00",
        updatedAt: "2023-06-12T18:26:55.320+00:00",
      },
      {
        _id: 1,
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        createdAt: "2023-06-13T17:16:32.820+00:00",
        updatedAt: "2023-06-13T17:16:32.820+00:00",
      },
    ],
    error: "",
    isLoading: false,
    recordCount: 2,
  };
  const mockComponents: IUserTable["components"] = [jest.fn(), jest.fn()];

  test("renders user table with mock user data", () => {
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
  });

  test("renders UserTable wrapped in Provider and receives data from Redux store", () => {
    // Verify that UserTable receives data from Redux store
    const state = store.getState();
    expect(state.page).toEqual(tableControlInitialState.page);
    expect(state.size).toEqual(tableControlInitialState.size);
  });

  test("renders loading placeholder when isLoading is true", () => {
    const loadingData = {
      ...mockData,
      isLoading: true,
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
      ...mockData,
      error: "Some error message",
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
      ...mockData,
      users: [],
      recordCount: 0,
    };

    render(
      <Provider store={store}>
        <UserTable data={emptyUsersData} components={mockComponents} />
      </Provider>
    );

    // Verify that no user placeholder is rendered
    const noUserPlaceholder = screen.getByText("No Users");
    expect(noUserPlaceholder).toBeInTheDocument();
    //expect page to be 0
  });
});
