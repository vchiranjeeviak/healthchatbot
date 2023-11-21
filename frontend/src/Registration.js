import "./App.css";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";

function Registration({ onhandlenav, onHandleCookie, onHandleCssProperty }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (data.error) {
        setErrorMessage(data.error);
      } else {
        onHandleCssProperty();
        onHandleCookie(username);
      }

      if (!response.ok) {
        // Check if the response status is not in the range 200-299 (not successful)
        throw new Error(`Error during login. Status: ${response.status}`);
      }
      // Perform further actions with the data if needed
    } catch (error) {
      console.error("Error during login:", error.message);
      setErrorMessage("Error during login. Please try again.");
    }
  };

  return (
    <div className="main">
      <div className="right">
        <div className="login">
          <FontAwesomeIcon icon={faComments} />
          <p>User Registration</p>
        </div>
        <div className="login">
          <div className="user-input">
            {errorMessage && (
              <p className="error" style={{ color: "red" }}>
                {errorMessage} 
              </p>
            )}
            <h5>User ID</h5>
            <div className="search-icon">
              <FontAwesomeIcon icon={faUser} />
              <input
                placeholder="User Name"
                className="user-input"
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <div className="user-input">
            <h5>Password</h5>
            <div className="search-icon">
              <FontAwesomeIcon icon={faLock} />
              <input
                placeholder="Password"
                className="user-input"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="login">
          <button className="button" onClick={handleRegister}>
            Register
          </button>
          <a href="#">
            Already Have Account!
            <span className="highlight" onClick={onhandlenav}>
              {" "}
              Login
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Registration;
