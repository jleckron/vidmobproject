import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import UserFormContainer from "../../components/UserForm";
import { clearForm, updateUserField } from "../../redux/slices/userFormSlice";
import * as UseFetchModule from "../../hooks/useFetch";
import { tableControlSlice } from "../../redux/slices/tableControlSlice";
import { userFormSlice } from "../../redux/slices/userFormSlice";
import { RootState } from "../../redux/store";
import ENDPOINTS from "../../utils/constants/endpoints";
import METHODS from "../../utils/constants/methods";
const tableControlInitialState = tableControlSlice.getInitialState();
const userFormInitialState = userFormSlice.getInitialState();

describe("UserFormContainer", () => {
  const mockStore = configureStore<RootState>([]);
  const initialState: RootState = {
    tableControl: {
      ...tableControlInitialState,
    },
    userForm: {
      ...userFormInitialState,
    },
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

  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  test('renders UserForm correctly with title "Add User" when no user in redux', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserFormContainer />
        </BrowserRouter>
      </Provider>
    );

    const title = screen.getByText("Add User");
    expect(title).toBeInTheDocument();
  });

  test('renders UserForm correctly with title "Edit User" when user in redux', () => {
    const storeWithData = mockStore({
      ...initialState,
      userForm: { ...mockFullForm },
    });
    render(
      <Provider store={storeWithData}>
        <BrowserRouter>
          <UserFormContainer />
        </BrowserRouter>
      </Provider>
    );

    const title = screen.getByText("Edit User");
    expect(title).toBeInTheDocument();
  });

  test("verify handleOnCancel performs correct redux action - clearForm", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserFormContainer />
        </BrowserRouter>
      </Provider>
    );

    //Expect the cancel button to be called
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButton);

    // Ensure that handleOnCancel dispatches the clearForm action
    const actions = store.getActions();
    expect(actions).toEqual([{ type: clearForm.type }]);
  });

  test("verify handleOnChange performs correct redux action - updateuserfield", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserFormContainer />
        </BrowserRouter>
      </Provider>
    );

    const firstNameInput = screen.getByLabelText("First Name *");
    const lastNameInput = screen.getByLabelText("Last Name *");
    const emailInput = screen.getByLabelText("Email *");

    fireEvent.change(firstNameInput, { target: { value: "Jane" } });
    fireEvent.change(lastNameInput, { target: { value: "Smith" } });
    fireEvent.change(emailInput, {
      target: { value: "jane.smith@example.com" },
    });

    // Ensure that handleOnChange dispatches the updateUserField action with the correct values
    const actions = store.getActions();
    expect(actions).toEqual([
      {
        type: updateUserField.type,
        payload: { field: "firstName", value: "Jane" },
      },
      {
        type: updateUserField.type,
        payload: { field: "lastName", value: "Smith" },
      },
      {
        type: updateUserField.type,
        payload: { field: "email", value: "jane.smith@example.com" },
      },
    ]);
  });

  // Add more test cases for useEffect and other scenarios as needed
});
