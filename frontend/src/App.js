import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Registration from "./Registration";
import Bot from "./bot";
import Chat from "./chat";
import { CookiesProvider, useCookies } from "react-cookie";
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

  function handleLogin(username) {
    setCookie("username", username, { path: "/" });
  }

  return (
    // <div>
    //   {cookies.username ? (
    //     <Chat />
    //   ) : navgation ? (
    //     <Login onhandlenav={handlenav} onLogin={handleLogin} />
    //   ) : (
    //     <Registration onhandlenav={handlenav} />
    //   )}
    // </div>
    <div>
      <Chat />
    </div>
  );
}

export default App;
