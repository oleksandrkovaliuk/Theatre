import React, { useContext, useEffect, useState } from "react";
import l from "./loginSignIn.module.scss";
import { AutorisationMenu } from "../autorisation";
import { userContext } from "../../../context/userInfoContext";

export const LogInSignIn = () => {
  const [openSignIn, setToOpenSignIn] = useState(false);
  const [openMenu, showAutorisationMenu] = useState(false);
  const [loginned, setLogin] = useState(false);
  const { user } = useContext(userContext);
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
  const logInUser = () => {
    setLogin(true);
  };
  useEffect(() => {
    if (user !== null) {
      console.log(user , "user")
      setLogin(true);
    }
  }, [user]);
  return (
    <>
      {loginned ? (
        <div>
          {user?.username}
          <p>{user?.role === "admin" ? "admin" : "lol"}</p>
        </div>
      ) : (
        <div className={l.logInSignInContainer}>
          <button onClick={() => openLogInAutorisationMenu()}>Login In</button>
          <button onClick={() => openSignInAutorisationMenu()}>Sign In</button>
        </div>
      )}
      <AutorisationMenu
        show={openMenu ? true : false}
        signIn={openSignIn ? true : false}
        closeMenu={() => handleClosingMenu()}
        loginUser={() => logInUser()}
      />
    </>
  );
};
