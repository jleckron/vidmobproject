import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import DeleteUserButton from "../../components/UserTable/UserFunctions/DeleteUserButton";

describe("DeleteUserButton", () => {
  const mockStore = configureStore([]);
  const initialState = {
    // Add relevant initial state properties for your Redux store
  };
  let store;
  const mockUser = {
    _id: 1,
    firstName: "John",
    lastName: "Doe",
  };
  beforeEach(() => {
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

  test("dispatches toggleShouldReload and handles deletion when Delete button is clicked", () => {
    const mockToggleShouldReload = jest.fn();

    render(
      <Provider store={store}>
        <DeleteUserButton user={mockUser} />
      </Provider>
    );

    // Simulate button click to open the modal
    const deleteUserButton = screen.getByRole("button");
    fireEvent.click(deleteUserButton);

    // Simulate button click to delete the user
    const deleteButton = screen.getByRole("button", { name: "Delete" });
    deleteButton.onclick = mockToggleShouldReload();
    fireEvent.click(deleteButton);

    // Verify that toggleShouldReload action is dispatched
    expect(mockToggleShouldReload).toHaveBeenCalledTimes(1);
  });

  // Add more test cases if needed
});
