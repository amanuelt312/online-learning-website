export const validatePassword = (password) => {
  const minLength = 6;
  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const numberRegex = /[0-9]/;
  const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

  // Check length
  if (password.length < minLength) {
    return "Password must be at least 6 characters long";
  }

  // Check for uppercase letters
  if (!uppercaseRegex.test(password)) {
    return "Password must contain at least one uppercase letter";
  }

  // Check for lowercase letters
  if (!lowercaseRegex.test(password)) {
    return "Password must contain at least one lowercase letter";
  }

  // Check for numbers
  if (!numberRegex.test(password)) {
    return "Password must contain at least one number";
  }

  // Check for special characters
  if (!specialCharRegex.test(password)) {
    return "Password must contain at least one special character";
  }

  // Password is strong
  return null;
};
