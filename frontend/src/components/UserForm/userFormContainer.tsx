import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import UserForm from "./userForm";
import METHODS from "../../utils/constants/methods";
import ENDPOINTS from "../../utils/constants/endpoints";
import {
  clearForm,
  updateFormErrorField,
} from "../../redux/slices/userFormSlice";

const UserFormContainer = () => {
  const navigator = useNavigate();
  const route = useLocation();

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.userForm);

  const FormMethod = route.state?.edit ? "PUT" : "POST";

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [serviceError, setServiceError] = useState<string>("");

  /**
   * Sends form data to backend
   */
  async function sendFormData() {
    let url = new URL(ENDPOINTS.LOCAL_URL);
    setIsLoading(true);

    if (FormMethod !== "POST") url.pathname = `/users/${user._id}`;
    const { firstName, lastName, email } = user;
    const formData = {
      firstName,
      lastName,
      email,
    };
    const requestOptions = {
      ...METHODS[FormMethod],
      body: JSON.stringify(formData),
    };

    try {
      const res = await fetch(url, requestOptions);
      const { statusCode, message } = await res.json();
      // Code for conflict in server, only email field can cause DB conflict
      if (statusCode === 409) {
        dispatch(updateFormErrorField({ field: "email", value: message }));
      } else {
        dispatch(clearForm());
        navigator("/");
      }
    } catch (err) {
      setServiceError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <UserForm
      data={{
        serviceError,
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
