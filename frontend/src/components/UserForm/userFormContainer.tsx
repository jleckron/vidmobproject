import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import UserForm from "./userForm";
import Form from "../../utils/types/form";
import METHODS from "../../utils/constants/methods";
import ENDPOINTS from "../../utils/constants/endpoints";

const UserFormContainer = () => {
  const navigator = useNavigate();
  const { state } = useLocation();
  const FormMethod = state === null ? "POST" : "PUT";

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form, setForm] = useState<Form>(state?.user);
  const [formErrors, setFormErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
  });

  //validates form input field against corresponding regex and updates if errors are present
  const validateFormOnChange = (event: any) => {
    const value = event.target.value;
    let newError = false;
    switch (event.target.id) {
      //matches email against regex for 'non-whitespace'@'letter/number route'.'letter/number domain'
      case "email": {
        newError = !value.match(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-]*$/
        );
        break;
      }
      //matches first and last name against regex of only letters
      default: {
        newError = !value.match(/^[A-Za-z']+$/);
      }
    }

    setFormErrors((prevForm): any => {
      return { ...prevForm, [event.target.id]: newError };
    });
  };

  //updates form state with new form input field value
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const action = event.target.id;
    validateFormOnChange(event);
    setForm((prevForm): any => {
      return { ...prevForm, [action]: event.target.value };
    });
  };

  //Sends form data to backend
  const sendFormData = async () => {
    let url = new URL(ENDPOINTS.LOCAL_URL);
    setIsLoading(true);

    if (FormMethod !== "POST") url.pathname = `/users/${state.user._id}`;
    const requestOptions = {
      ...METHODS[FormMethod],
      body: JSON.stringify(form),
    };

    try {
      await fetch(url, requestOptions);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      navigator("/");
    }
  };

  //Handles events when form is submitted
  const handleSubmit = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    sendFormData();
  };

  return (
    <UserForm
      handleOnChange={handleOnChange}
      handleSubmit={handleSubmit}
      data={{
        form,
        formErrors,
        isLoading,
        message: FormMethod === "POST" ? "Add User" : "Edit User",
      }}
    />
  );
};

export default UserFormContainer;
