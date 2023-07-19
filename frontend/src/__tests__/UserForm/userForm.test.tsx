import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import UserForm from "../../components/UserForm/userForm";
import { BrowserRouter } from "react-router-dom";

import { tableControlSlice } from "../../redux/slices/tableControlSlice";
import { userFormSlice } from "../../redux/slices/userFormSlice";
import { RootState } from "../../redux/store";
const tableControlInitialState = tableControlSlice.getInitialState();
const userFormInitialState = userFormSlice.getInitialState();

describe("UserForm", () => {
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

  type TMockData = {
    serviceError: string;
    isLoading: boolean;
    title: "Add User" | "Edit User";
  };
  const mockData: TMockData = {
    serviceError: "",
    isLoading: false,
    title: "Add User",
  };

  const mockFullForm = {
    user: {
      _id: 5,
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
      createdAt: "2023-07-14T21:07:39.156+00:00",
      updatedAt: "2023-07-14T21:07:39.156+00:00",
    },
    formErrors: {
      firstName: "",
      lastName: "",
      email: "",
    },
  };

  const mockHandleOnCancel = jest.fn();
  const mockHandleOnChange = jest.fn();
  const mockHandleOnSubmit = jest.fn();

  beforeEach(() => {
    store = mockStore(initialState);
  });

  test("Form submission should not be pressable with no user data", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserForm
            data={mockData}
            handleOnCancel={mockHandleOnCancel}
            handleOnChange={mockHandleOnChange}
            handleOnSubmit={mockHandleOnSubmit}
          />
        </BrowserRouter>
      </Provider>
    );

    // Simulate form submission
    const submitButton = screen.getByRole("button", { name: "Submit" });
    fireEvent.click(submitButton);

    // Verify that handleSubmit is not called and submit is disabled
    expect(submitButton).toBeDisabled();
    expect(mockHandleOnSubmit).toHaveBeenCalledTimes(0);
  });

  test("Renders error message when serviceError is present", () => {
    const errorData: TMockData = {
      serviceError: "Some error message",
      isLoading: false,
      title: "Add User",
    };

    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserForm
            data={errorData}
            handleOnCancel={mockHandleOnCancel}
            handleOnChange={mockHandleOnChange}
            handleOnSubmit={mockHandleOnSubmit}
          />{" "}
        </BrowserRouter>
      </Provider>
    );

    // Verify that error message is rendered
    const errorMessage = screen.getByText("Some error message");
    expect(errorMessage).toBeInTheDocument();

    // Verify submit button is disabled
    const submitButton = screen.getByRole("button", { name: "Submit" });
    expect(submitButton).toBeDisabled();
  });

  test("Handle form cancellation when Cancel button is clicked", () => {
    const cancelData: TMockData = {
      serviceError: "",
      isLoading: false,
      title: "Add User",
    };

    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserForm
            data={cancelData}
            handleOnCancel={mockHandleOnCancel}
            handleOnChange={mockHandleOnChange}
            handleOnSubmit={mockHandleOnSubmit}
          />
        </BrowserRouter>
      </Provider>
    );

    // Verify that Cancel button is rendered
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    expect(cancelButton).toBeInTheDocument();

    // Simulate cancellation
    fireEvent.click(cancelButton);
    expect(mockHandleOnCancel).toHaveBeenCalledTimes(1);
  });

  test("handles input field change", () => {
    const mockData: TMockData = {
      serviceError: "",
      isLoading: false,
      title: "Add User",
    };

    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserForm
            data={mockData}
            handleOnCancel={mockHandleOnCancel}
            handleOnChange={mockHandleOnChange}
            handleOnSubmit={mockHandleOnSubmit}
          />
        </BrowserRouter>
      </Provider>
    );

    // Simulate input field change
    //Expect redux setter function to be called each time
    const firstNameInput = screen.getByLabelText("First Name *");
    fireEvent.change(firstNameInput, { target: { value: "John" } });
    expect(mockHandleOnChange).toBeCalled();

    const lastNameInput = screen.getByLabelText("Last Name *");
    fireEvent.change(lastNameInput, { target: { value: "Doe" } });
    expect(mockHandleOnChange).toBeCalled();

    const emailInput = screen.getByLabelText("Email *");
    fireEvent.change(emailInput, {
      target: { value: "johndoe@example.com" },
    });
    expect(mockHandleOnChange).toBeCalled();

    expect(mockHandleOnChange).toHaveBeenCalledTimes(3);
  });

  test("Display user data in fields when provided by store", () => {
    const storeWithData = mockStore({
      ...initialState,
      userForm: { ...mockFullForm },
    });
    const editUserData: TMockData = {
      serviceError: "",
      isLoading: false,
      title: "Edit User",
    };

    render(
      <Provider store={storeWithData}>
        <BrowserRouter>
          <UserForm
            data={editUserData}
            handleOnCancel={mockHandleOnCancel}
            handleOnChange={mockHandleOnChange}
            handleOnSubmit={mockHandleOnSubmit}
          />
        </BrowserRouter>
      </Provider>
    );

    //Expect each field to display redux field value
    const firstNameDisplay = screen.getByDisplayValue("John");
    expect(firstNameDisplay).toBeInTheDocument();

    const lastNameDisplay = screen.getByDisplayValue("Doe");
    expect(lastNameDisplay).toBeInTheDocument();

    const emailDisplay = screen.getByDisplayValue("johndoe@example.com");
    expect(emailDisplay).toBeInTheDocument();
  });

  test("Submit button success when all fields valid", () => {
    const storeWithData = mockStore({
      ...initialState,
      userForm: { ...mockFullForm },
    });
    const editUserData: TMockData = {
      serviceError: "",
      isLoading: false,
      title: "Edit User",
    };

    render(
      <Provider store={storeWithData}>
        <BrowserRouter>
          <UserForm
            data={editUserData}
            handleOnCancel={mockHandleOnCancel}
            handleOnChange={mockHandleOnChange}
            handleOnSubmit={mockHandleOnSubmit}
          />
        </BrowserRouter>
      </Provider>
    );

    // Simulate form submission
    const submitButton = screen.getByRole("button", { name: "Submit" });
    fireEvent.submit(submitButton);

    // Verify that handleSubmit is called
    expect(mockHandleOnSubmit).toBeCalled();
  });

  test("Submit button non-clickable when error present", () => {
    const mockFormWithErrors = {
      ...mockFullForm,
      formErrors: {
        firstName: "Invalid Name",
        lastName: "",
        email: "",
      },
    };
    const storeWithFormErrorData = mockStore({
      ...initialState,
      userForm: { ...mockFormWithErrors },
    });
    const editUserData: TMockData = {
      serviceError: "",
      isLoading: false,
      title: "Edit User",
    };

    render(
      <Provider store={storeWithFormErrorData}>
        <BrowserRouter>
          <UserForm
            data={editUserData}
            handleOnCancel={mockHandleOnCancel}
            handleOnChange={mockHandleOnChange}
            handleOnSubmit={mockHandleOnSubmit}
          />
        </BrowserRouter>
      </Provider>
    );

    // Verify that handleSubmit is disabled
    const submitButton = screen.getByRole("button", { name: "Submit" });
    expect(submitButton).toBeDisabled();

    submitButton.click();
    expect(mockHandleOnSubmit).toHaveBeenCalledTimes(0);
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
