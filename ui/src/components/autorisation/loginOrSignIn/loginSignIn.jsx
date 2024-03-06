import React, { useState } from "react";
import l from "./loginSignIn.module.scss";
import { AutorisationMenu } from "../autorisation";

export const LogInSignIn = () => {
  const [openSignIn, setToOpenSignIn] = useState(false);
  const [openMenu, showAutorisationMenu] = useState(false);
  const openLogInAutorisationMenu = () => {
    showAutorisationMenu(true);
  };
  const openSignInAutorisationMenu = () => {
    showAutorisationMenu(true);
    setToOpenSignIn(true);
  };
  const handleClosingMenu = () => {
    showAutorisationMenu(false);
    setToOpenSignIn(false);
  };
  return (
    <>
      <div className={l.logInSignInContainer}>
        <button onClick={() => openLogInAutorisationMenu()}>Login In</button>
        <button onClick={() => openSignInAutorisationMenu()}>Sign In</button>
      </div>
      <AutorisationMenu
        show={openMenu ? true : false}
        signIn={openSignIn ? true : false}
        closeMenu={() => handleClosingMenu()}
      />
    </>
  );
};
