const lowerCaseLetters = /[a-z]/g;
const uppercase = /[A-Z]/g;
const numbers = /[0-9]/g;
const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

export const testOnLowerCase = (value) => lowerCaseLetters.test(value);
export const testOnUpperCase = (value) => uppercase.test(value);
export const testOnNumber = (value) => numbers.test(value);
export const testOnSpecialCharacters = (value) => specialCharacters.test(value);
