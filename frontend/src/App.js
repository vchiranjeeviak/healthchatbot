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

  const userPresence = cookies.username && cookies.username !== undefined;

  useEffect(() => {
    if (cookies.username && cookies.username !== undefined) {
      setnavigation(false);
    }
  }, [cookies]);

  useEffect(() => {
    if (userPresence) {
      setCssProperty("flex");
    } else {
      setCssProperty("");
    }

    if (cookies.username && cookies.username !== undefined) {
      setnavigation(false);
    }
  }, [userPresence, cookies]);

  function handlenav(nav) {
    setnavigation((nav) => !nav);
  }

  function handleCookie(username) {
    setCookie("username", username, {
      path: "/",
      sameSite: "None",
    });
    setLoggedInUsername(username);
  }

  function removeCookieHandler() {
    removeCookie("username");
    setLoggedInUsername(null);
  }

  function handleLogout() {
    setLogout((lu) => !lu);
  }

  // console.log(cssProperty);
  // console.log(userPresence);
  // console.log(navgation);
  // console.log(logout);

  return (
    <div>
      <Bot
        onHandleRemoveCookie={removeCookieHandler}
        cssProperty={cssProperty}
        onHandleLogout={handleLogout}
      />
      {userPresence ? (
        <Chat />
      ) : navgation || logout ? (
        <Login onhandlenav={handlenav} onHandleCookie={handleCookie} />
      ) : (
        <Registration onhandlenav={handlenav} onHandleCookie={handleCookie} />
      )}
    </div>
  );
}

export default App;
