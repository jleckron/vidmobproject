// import React, { ChangeEvent, FormEvent } from "react";
// import { render, screen, fireEvent } from "@testing-library/react";
// import { Provider } from "react-redux";
// import configureStore, { MockStoreEnhanced } from "redux-mock-store";
// import UserForm from "./UserForm";
// import {
//   initialState as userFormInitialState,
//   clearUser,
//   UserFormState,
// } from "./userFormSlice";

// describe("UserForm", () => {
//   const mockStore = configureStore<Partial<UserFormState>>();
//   const initialState: UserFormState = {
//     ...userFormInitialState,
//     // Add other relevant initial state properties for your Redux store
//   };
//   let store: MockStoreEnhanced<Partial<UserFormState>>;

//   beforeEach(() => {
//     store = mockStore(initialState);
//   });

//   test("renders UserForm wrapped in Provider and handles form submission", () => {
//     const mockData = {
//       userInfo: {
//         firstName: "John",
//         lastName: "Doe",
//         email: "john@example.com",
//       },
//       formErrors: {
//         firstName: "",
//         lastName: "",
//         email: "",
//       },
//       serviceError: "",
//       isLoading: false,
//       title: "Add User" as const,
//     };

//     const mockHandleChange = jest.fn();
//     const mockHandleSubmit = jest.fn();

//     render(
//       <Provider store={store}>
//         <UserForm
//           data={mockData}
//           handleOnChange={mockHandleChange}
//           handleSubmit={mockHandleSubmit}
//         />
//       </Provider>
//     );

//     // Verify that UserForm component is rendered
//     const userForm = screen.getByLabelText("User Form");
//     expect(userForm).toBeInTheDocument();

//     // Verify that form fields are rendered
//     const firstNameField = screen.getByLabelText("First Name");
//     expect(firstNameField).toBeInTheDocument();

//     const lastNameField = screen.getByLabelText("Last Name");
//     expect(lastNameField).toBeInTheDocument();

//     const emailField = screen.getByLabelText("Email");
//     expect(emailField).toBeInTheDocument();

//     // Simulate form submission
//     const submitButton = screen.getByRole("button", { name: "Submit" });
//     fireEvent.click(submitButton);

//     // Verify that handleSubmit is called
//     expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
//   });

//   test("renders error message when serviceError is present", () => {
//     const errorData = {
//       userInfo: {
//         firstName: "",
//         lastName: "",
//         email: "",
//       },
//       formErrors: {
//         firstName: "",
//         lastName: "",
//         email: "",
//       },
//       serviceError: "Some error message",
//       isLoading: false,
//       title: "Add User" as const,
//     };

//     render(
//       <Provider store={store}>
//         <UserForm
//           data={errorData}
//           handleOnChange={/* Provide mock handleOnChange function */}
//           handleSubmit={/* Provide mock handleSubmit function */}
//         />
//       </Provider>
//     );

//     // Verify that error message is rendered
//     const errorMessage = screen.getByText("Some error message");
//     expect(errorMessage).toBeInTheDocument();
//   });

//   test("handles form cancellation when Cancel button is clicked", () => {
//     const cancelData = {
//       userInfo: {
//         firstName: "",
//         lastName: "",
//         email: "",
//       },
//       formErrors: {
//         firstName: "",
//         lastName: "",
//         email: "",
//       },
//       serviceError: "",
//       isLoading: false,
//       title: "Add User" as const,
//     };

//     const mockHandleCancel = jest.fn();

//     render(
//       <Provider store={store}>
//         <UserForm
//           data={cancelData}
//           handleOnChange={/* Provide mock handleOnChange function */}
//           handleSubmit={/* Provide mock handleSubmit function */}
//         />
//       </Provider>
//     );

//     // Verify that Cancel button is rendered
//     const cancelButton = screen.getByRole("button", { name: "Cancel" });
//     expect(cancelButton).toBeInTheDocument();

//     // Simulate cancellation
//     fireEvent.click(cancelButton);

//     // Verify that mockHandleCancel is called
//     expect(mockHandleCancel).toHaveBeenCalledTimes(1);
//   });

//   // Add more test cases if needed
// });

export {};
