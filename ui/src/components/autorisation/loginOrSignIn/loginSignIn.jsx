import React from "react";
import l from "./loginSignIn.module.scss";

export const LogInSignIn = () => {
  return (
    <div className={l.logInSignInContainer}>
      <button>Login In</button>
      <button>Sign In</button>
    </div>
  );
};
