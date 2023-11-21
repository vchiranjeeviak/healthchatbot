import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Registration from "./Registration";
import Bot from "./bot";
import Chat from "./chat";
import { Cookies, CookiesProvider, useCookies } from "react-cookie";

function App() {
  const [loggedInUsername, setLoggedInUsername] = useState(null);
  const [navgation, setnavigation] = useState(true);
  const [cssProperty, setCssProperty] = useState("");
  const [logout, setLogout] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("username") !== null)

  useEffect(() => {
    if (isLoggedIn) {
      setnavigation(false);
      setCssProperty("flex")
    } else {
      setCssProperty("")
    }
  }, [isLoggedIn]);

  function handlenav(nav) {
    setnavigation((nav) => !nav);
  }

  //function handleCookie(username) {
  //  setCookie("username", username, {
  //    path: "/",
  //    sameSite: "None",
  //  });
  //  setLoggedInUsername(username);
  //  console.log(loggedInUsername);
  //}

  function removeCookieHandler() {
   //  removeCookie("username");
    setLoggedInUsername(null);
  }

  function handleCssProperty() {
    setCssProperty("flex");
  }

  function handleLogout() {
    localStorage.removeItem("username")
    setIsLoggedIn(false)
  }

  return (
    <div>
      <Bot
        cssProperty={cssProperty}
        onHandleLogout={handleLogout}
        setIsLoggedIn={setIsLoggedIn}
      />
      {isLoggedIn ? (
        <Chat />
      ) : navgation && logout ? (
        <Login
          onhandlenav={handlenav}
          onHandleCssProperty={handleCssProperty}
          setIsLoggedIn={setIsLoggedIn}
        />
      ) : (
        <Registration
          onhandlenav={handlenav}
          onHandleCssProperty={handleCssProperty}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}
    </div>
  );
}

export default App;
