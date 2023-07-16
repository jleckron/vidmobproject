import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import UserForm from "./userForm";
import METHODS from "../../utils/constants/methods";
import ENDPOINTS from "../../utils/constants/endpoints";
import {
  clearForm,
  updateFormErrorField,
} from "../../redux/slices/userFormSlice";
import { usePost } from "../../hooks/useFetch";

const UserFormContainer = () => {
  const navigator = useNavigate();
  const route = useLocation();

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.userForm);

  const FormMethod = route.state?.edit ? "PUT" : "POST";

  if (FormMethod === "PUT" && user._id === 0) {
    dispatch(clearForm());
    navigator("/");
  }

  const serviceError = useRef({ value: "" });

  let url = new URL(ENDPOINTS.LOCAL_URL);

  if (FormMethod !== "POST") url.pathname = `/users/${user._id}`;
  const { firstName, lastName, email } = user;
  const formData = {
    firstName,
    lastName,
    email,
  };
  const { response, isLoading, error, execute } = usePost({
    url,
    body: formData,
    ...METHODS[FormMethod],
  });

  /**
   * Sends form data to backend
   */
  function sendFormData() {
    execute();
  }

  /**
   * Handle redirect or error message display once results are received
   */
  useEffect(() => {
    if (response?.ok) {
      dispatch(clearForm());
      navigator("/");
    } else {
      if (response?.status === 409) {
        dispatch(
          updateFormErrorField({ field: "email", value: error?.message || "" })
        );
      } else serviceError.current.value = error?.message || "";
    }
  }, [response, error, dispatch, navigator]);

  return (
    <UserForm
      data={{
        serviceError: serviceError.current.value,
        isLoading,
        title: FormMethod === "POST" ? "Add User" : "Edit User",
      }}
      handleSubmit={handleSubmit}
    />
  );

  /**
   * Handles events when form is submitted
   * @param event
   */
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendFormData();
  }
};

export default UserFormContainer;
