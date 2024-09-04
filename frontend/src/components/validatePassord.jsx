export const validatePassword = (password) => {
  const minLength = 6;
  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const numberRegex = /[0-9]/;
  const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

  if (password.length < minLength) {
    return "Password must be at least 6 characters long";
  }

  if (!uppercaseRegex.test(password)) {
    return "Password must contain at least one uppercase letter";
  }

  if (!lowercaseRegex.test(password)) {
    return "Password must contain at least one lowercase letter";
  }

  if (!numberRegex.test(password)) {
    return "Password must contain at least one number";
  }

  if (!specialCharRegex.test(password)) {
    return "Password must contain at least one special character";
  }

  return null;
};
