import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import UserForm from "../../components/UserForm/userForm";
import { BrowserRouter } from "react-router-dom";
import {
  userFormSlice,
  clearForm,
  updateUserField,
} from "../../redux/slices/userFormSlice";
const userFormInitialState = userFormSlice.getInitialState();

describe("UserForm", () => {
  const mockStore = configureStore([]);
  const initialState = {
    userForm: { ...userFormInitialState },
    // Add other relevant initial state properties for your Redux store
  };
  let store;

  const mockData = {
    serviceError: "",
    isLoading: false,
    title: "Add User",
  };

  const mockHandleSubmit = jest.fn();

  beforeEach(() => {
    store = mockStore(initialState);
  });

  test("form submission should not be pressable with no user data", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserForm data={mockData} handleSubmit={mockHandleSubmit} />
        </BrowserRouter>
      </Provider>
    );

    // Simulate form submission
    const submitButton = screen.getByRole("button", { name: "Submit" });
    fireEvent.click(submitButton);

    // Verify that handleSubmit is called
    expect(mockHandleSubmit).toHaveBeenCalledTimes(0);
  });

  test("renders error message when serviceError is present", () => {
    const errorData = {
      serviceError: "Some error message",
      isLoading: false,
      title: "Add User",
    };

    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserForm data={errorData} handleSubmit={mockHandleSubmit} />
        </BrowserRouter>
      </Provider>
    );

    // Verify that error message is rendered
    const errorMessage = screen.getByText("Some error message");
    expect(errorMessage).toBeInTheDocument();
  });

  test("handles form cancellation when Cancel button is clicked", () => {
    const cancelData = {
      serviceError: "",
      isLoading: false,
      title: "Add User",
    };

    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserForm data={cancelData} handleSubmit={mockHandleSubmit} />
        </BrowserRouter>
      </Provider>
    );

    // Verify that Cancel button is rendered
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    expect(cancelButton).toBeInTheDocument();

    // Simulate cancellation
    fireEvent.click(cancelButton);

    // Verify that clearForm action is dispatched
    const actions = store.getActions();
    expect(actions).toContainEqual(clearForm());
  });

  test("handles input field change", () => {
    const mockData = {
      serviceError: "",
      isLoading: false,
      title: "Add User",
    };

    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserForm data={mockData} handleSubmit={mockHandleSubmit} />
        </BrowserRouter>
      </Provider>
    );

    // Simulate input field change
    const firstNameInput = screen.getByLabelText("First Name *");
    fireEvent.change(firstNameInput, { target: { value: "John" } });

    const lastNameInput = screen.getByLabelText("Last Name *");
    fireEvent.change(lastNameInput, { target: { value: "Doe" } });

    const emailInput = screen.getByLabelText("Email *");
    fireEvent.change(emailInput, {
      target: { value: "johndoe@example.com" },
    });

    // Verify that updateUserField action is dispatched
    const actions = store.getActions();
    expect(actions).toContainEqual(
      updateUserField({ field: "firstName", value: "John" })
    );

    expect(actions).toContainEqual(
      updateUserField({ field: "lastName", value: "Doe" })
    );

    expect(actions).toContainEqual(
      updateUserField({ field: "email", value: "johndoe@example.com" })
    );
  });

  // test("handles incorrect first name errors", () => {
  //   const mockData = {
  //     serviceError: "",
  //     isLoading: false,
  //     title: "Add User",
  //   };

  //   render(
  //     <Provider store={store}>
  //       <BrowserRouter>
  //         <UserForm data={mockData} handleSubmit={mockHandleSubmit} />
  //       </BrowserRouter>
  //     </Provider>
  //   );

  //   // Simulate input field change
  //   const firstNameInput = screen.getByLabelText("First Name *");
  //   fireEvent.change(firstNameInput, { target: { value: "John5" } });

  //   // Verify that updateUserField action is dispatched
  //   const actions = store.getActions();
  //   expect(actions).toContainEqual(
  //     updateUserField({ field: "firstName", value: "John5" })
  //   );

  //   const invalidFlag = screen.getAllByDisplayValue("firstName-helper-text");
  //   expect(invalidFlag).toBeInTheDocument();
  // });
  // Add more test cases if needed
});
