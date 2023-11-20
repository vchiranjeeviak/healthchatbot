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
  const [cookies, setCookie] = useCookies(["username"]);

  useEffect(() => {
    if (cookies.username) {
      setnavigation(false);
    }
  }, [cookies]);

  function handlenav(nav) {
    setnavigation((nav) => !nav);
  }

  function handleCookie(username) {
    setCookie("username", username, {
      path: "/login",
      sameSite: "None",
      secure: true,
    });
    setLoggedInUsername(username);
    console.log(loggedInUsername);
  }

  return (
    // <CookiesProvider>
    //   <div>
    //     {cookies.username ? (
    //       <Chat />
    //     ) : navgation ? (
    //       <Registration onhandlenav={handlenav} onHandleCookie={handleCookie} />
    //     ) : (
    //       <Login onhandlenav={handlenav} onHandleCookie={handleCookie} />
    //     )}
    //   </div>
    // </CookiesProvider>
    <div>
      <Chat />
    </div>
  );
}

export default App;
