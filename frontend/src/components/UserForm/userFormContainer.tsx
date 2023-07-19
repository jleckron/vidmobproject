import { ChangeEvent, FormEvent, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import UserForm from "./userForm";
import METHODS from "../../utils/constants/methods";
import ENDPOINTS from "../../utils/constants/endpoints";
import {
  clearForm,
  updateFormErrorField,
  updateUserField,
} from "../../redux/slices/userFormSlice";
import { usePost } from "../../hooks/useFetch";

const UserFormContainer = () => {
  const navigator = useNavigate();

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.userForm);
  const serviceError = useRef({ value: "" });

  const FormMethod = user._id !== 0 ? "PUT" : "POST";

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
   * Handle redirect or error message display once results are received
   */
  useEffect(() => {
    if (response?.ok) {
      navigator("/");
      dispatch(clearForm());
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
      handleOnChange={handleOnChange}
      handleOnCancel={handleOnCancel}
      handleOnSubmit={handleOnSubmit}
    />
  );

  /**
   * Form handler helper functions
   */
  function handleOnCancel() {
    dispatch(clearForm());
  }
  function handleOnSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    execute();
  }
  function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
    const field = event.target.id;
    dispatch(updateUserField({ field, value: event.target.value }));
  }
};

export default UserFormContainer;
