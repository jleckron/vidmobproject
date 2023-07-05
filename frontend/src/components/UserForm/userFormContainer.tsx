import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import UserForm from "./userForm";
import Form from "../../utils/interfaces/form";
import METHODS from "../../utils/constants/methods";
import ENDPOINTS from "../../utils/constants/endpoints";

const UserFormContainer = () => {
  const navigator = useNavigate();
  const { state } = useLocation();
  const FormMethod = state === null ? "POST" : "PUT";

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form, setForm] = useState<Form>(state?.user || {});
  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [serviceError, setServiceError] = useState<string>("");

  /**
   * Sends form data to backend
   */
  async function sendFormData() {
    let url = new URL(ENDPOINTS.LOCAL_URL);
    setIsLoading(true);

    if (FormMethod !== "POST") url.pathname = `/users/${state.user._id}`;
    const requestOptions = {
      ...METHODS[FormMethod],
      body: JSON.stringify(form),
    };

    try {
      const res = await fetch(url, requestOptions);
      const { statusCode, message } = await res.json();
      //Code for conflict in server, only email field can cause DB conflict
      if (statusCode === 409) {
        setFormErrors((prevForm): any => ({
          ...prevForm,
          email: message,
        }));
      } else navigator("/");
    } catch (err: any) {
      setServiceError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <UserForm
      data={{
        form,
        formErrors,
        serviceError,
        isLoading,
        title: FormMethod === "POST" ? "Add User" : "Edit User",
      }}
      handleOnChange={handleOnChange}
      handleSubmit={handleSubmit}
    />
  );

  /**
   * Updates form state with new form input field value
   * @param event
   */
  function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const action = event.target.id;
    validateFormOnChange(event);
    setForm((prevForm): any => ({ ...prevForm, [action]: event.target.value }));
  }

  /**
   * Handles events when form is submitted
   * @param event
   */
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendFormData();
  }

  /**
   * validates form input field against corresponding regex and updates if errors are present
   * @param event
   */
  function validateFormOnChange(event: any) {
    const value = event.target.value;
    let newError = "";
    switch (event.target.id) {
      //matches email against regex for 'non-whitespace'@'letter/number route'.'letter/number domain'
      case "email": {
        newError = !value.match(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-]*$/
        )
          ? "Invalid entry"
          : "";
        break;
      }
      //matches first and last name against regex of only letters
      default: {
        newError = !value.match(/^[A-Za-z']+$/) ? "Invalid Entry" : "";
      }
    }

    setFormErrors((prevForm): any => ({
      ...prevForm,
      [event.target.id]: newError,
    }));
  }
};

export default UserFormContainer;
