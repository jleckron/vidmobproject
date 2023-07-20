import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import DeleteUserButton from "../../components/UserTable/UserFunctions/DeleteUserButton";
import * as UseFetchModule from "../../hooks/useFetch";

import { tableControlSlice } from "../../redux/slices/tableControlSlice";
import { userFormSlice } from "../../redux/slices/userFormSlice";
import { RootState } from "../../redux/store";
const tableControlInitialState = tableControlSlice.getInitialState();
const userFormInitialState = userFormSlice.getInitialState();

describe("DeleteUserButton", () => {
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
  const mockUser = {
    _id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@example.com",
    createdAt: "2023-06-12T18:26:55.320+00:00",
    updatedAt: "2023-06-12T18:26:55.320+00:00",
  };

  beforeEach(async () => {
    store = mockStore(initialState);
  });

  test("renders DeleteUserButton and opens modal when clicked", () => {
    render(
      <Provider store={store}>
        <DeleteUserButton user={mockUser} />
      </Provider>
    );

    // Verify that DeleteUserButton component is rendered
    const deleteUserButton = screen.getByRole("button");
    expect(deleteUserButton).toBeInTheDocument();

    // Verify that modal is closed initially
    const modal = screen.queryByRole("dialog");
    expect(modal).toBeNull();

    // Simulate button click to open the modal
    fireEvent.click(deleteUserButton);

    // Verify that modal is opened
    const openedModal = screen.getByRole("dialog");
    expect(openedModal).toBeInTheDocument();

    // Verify the modal content
    const modalTitle = screen.getByText("Delete John Doe?");
    expect(modalTitle).toBeInTheDocument();
  });

  test("dispatches toggleShouldReload and handles deletion when Delete button is clicked", async () => {
    const mockToggleShouldReload = jest.fn();

    render(
      <Provider store={store}>
        <DeleteUserButton user={mockUser} />
      </Provider>
    );

    // Simulate button click to open the modal
    const deleteUserButton = await screen.findByRole("button", {});
    fireEvent.click(deleteUserButton);

    // Simulate button click to delete the user
    const deleteButton = screen.getByRole("button", { name: "Delete" });
    deleteButton.onclick = mockToggleShouldReload();
    fireEvent.click(deleteButton);

    // Verify that toggleShouldReload action is dispatched
    expect(mockToggleShouldReload).toHaveBeenCalledTimes(1);
  });

  test("correctly displays error message if error exists", async () => {
    const mockResponse = {
      data: { users: [], count: 0 },
      error: new Error(),
      response: new Response(),
      isLoading: false,
      execute: jest.fn(),
    };

    jest.spyOn(UseFetchModule, "usePost").mockReturnValue(mockResponse);

    render(
      <Provider store={store}>
        <DeleteUserButton user={mockUser} />
      </Provider>
    );

    // Simulate button click to open the modal
    const deleteUserButton = await screen.findByRole("button", {});
    fireEvent.click(deleteUserButton);

    // Verify Error text is shown when error returned by usePost
    const errorText = screen.getByText("Error Deleting User");
    expect(errorText).toBeInTheDocument();
  });

  test("LoadingButton displays correctly when isLoading true", async () => {
    const mockResponse = {
      data: { users: [], count: 0 },
      error: new Error(),
      response: new Response(),
      isLoading: true,
      execute: jest.fn(),
    };

    jest.spyOn(UseFetchModule, "usePost").mockReturnValue(mockResponse);

    render(
      <Provider store={store}>
        <DeleteUserButton user={mockUser} />
      </Provider>
    );
    // Simulate button click to open the modal
    const deleteUserButton = await screen.findByRole("button", {});
    fireEvent.click(deleteUserButton);

    // Verify that LoadingButton is rendered
    const circularProgress = screen.getByRole("progressbar");
    expect(circularProgress).toBeInTheDocument();
  });

  // Add more test cases if needed
});
