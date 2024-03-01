import "./style.css";
import { RegistrationSchema, safeFetch } from "./http";

const registerButton = document.getElementById(
  "registrationButton"
) as HTMLButtonElement;

const backButton = document.getElementById("backButton") as HTMLButtonElement;

const emailDataField = document.getElementById(
  "emailInput"
) as HTMLInputElement;

const passwordDataField = document.getElementById(
  "passwordInput"
) as HTMLInputElement;

const passwordConfirmInput = document.getElementById(
  "passwordConfirmInput"
) as HTMLInputElement;

passwordDataField.addEventListener("input", () => {
  if (
    passwordDataField.value.length < 5 ||
    passwordDataField.value !== passwordConfirmInput.value
  ) {
    passwordDataField.classList.add("input-error");
    passwordDataField.classList.remove("input-valid");
  } else if (
    passwordDataField.value.length >= 5 &&
    passwordDataField.value === passwordConfirmInput.value
  ) {
    passwordDataField.classList.remove("input-error");
    passwordDataField.classList.add("input-valid");
  }
});

passwordConfirmInput.addEventListener("input", () => {
  if (
    passwordConfirmInput.value.length < 5 ||
    passwordDataField.value !== passwordConfirmInput.value
  ) {
    passwordConfirmInput.classList.add("input-error");
    passwordConfirmInput.classList.remove("input-valid");
  } else if (
    passwordConfirmInput.value.length >= 5 &&
    passwordDataField.value === passwordConfirmInput.value
  ) {
    passwordConfirmInput.classList.remove("input-error");
    passwordConfirmInput.classList.add("input-valid");
  }
});

let popupElement = document.getElementById("newPage") as HTMLDivElement;

const showNewWindow = () => {
  popupElement.style.display = "flex";
};

const hideNewWindow = () => {
  popupElement.style.display = "none";
};

registerButton.addEventListener("click", async () => {
  showNewWindow();
  await postData();
});

backButton.addEventListener("click", () => {
  hideNewWindow();
});

const postData = async () => {
  const response = await safeFetch(
    "POST",
    `http://localhost:4500/api/userData`,
    RegistrationSchema,
    {
      email: emailDataField.value,
      password: passwordDataField.value,
      passwordConfirmation: passwordConfirmInput.value,
    }
  );
  if (response?.status === 200) {
    alert("Success");
  } else {
    alert("Error");
  }
};
