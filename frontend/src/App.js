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
  const [cookies, setCookie, removeCookie] = useCookies(["username"]);

  useEffect(() => {
    if (cookies.username && cookies.username !== undefined) {
      setnavigation(false);
    }
  }, [cookies]);

  function handlenav(nav) {
    setnavigation((nav) => !nav);
  }

  function handleCookie(username) {
    setCookie("username", username, {
      path: "/",
      sameSite: "None",
    });
    setLoggedInUsername(username);
    console.log(loggedInUsername);
  }

  function removeCookieHandler() {
    removeCookie("username");
    setLoggedInUsername(null);
  }

  function handleCssProperty() {
    setCssProperty("flex");
  }

  function handleLogout() {
    setLogout((lu) => !lu);
  }

  return (
    <div>
      <Bot
        onHandleRemoveCookie={removeCookieHandler}
        cssProperty={cssProperty}
        onHandleLogout={handleLogout}
      />
      {cookies.username && cookies.username !== undefined ? (
        <Chat />
      ) : navgation && logout ? (
        <Login
          onhandlenav={handlenav}
          onHandleCookie={handleCookie}
          onHandleCssProperty={handleCssProperty}
        />
      ) : (
        <Registration
          onhandlenav={handlenav}
          onHandleCookie={handleCookie}
          onHandleCssProperty={handleCssProperty}
        />
      )}
    </div>
  );
}

export default App;
