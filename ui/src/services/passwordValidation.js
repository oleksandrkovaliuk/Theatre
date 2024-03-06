export const passwordValidation = (pass) => {
  const pattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{6,20}/;
  return pattern.test(pass);
};
