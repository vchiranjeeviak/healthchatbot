import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDisplay, faRobot } from "@fortawesome/free-solid-svg-icons";
import { faHandsHoldingChild } from "@fortawesome/free-solid-svg-icons";

export default function Bot({
  onHandleRemoveCookie,
  cssProperty,
  onHandleLogout,
}) {
  function handleReload() {
    window.location.reload(false);
  }
  console.log(typeof cssProperty);

  return (
    <div className="main-bot">
      <div className="bot">
        <FontAwesomeIcon icon={faRobot} size="2xl" />
        <h3>
          Health
          <span>
            <FontAwesomeIcon
              icon={faHandsHoldingChild}
              style={{ color: "#ff80ff" }}
            />
          </span>
          ChatBot
        </h3>
      </div>
      <div className="log-reset" style={{ display: cssProperty }}>
        <button className="log-reset-btn" onClick={handleReload}>
          Reset
        </button>
        <button
          className="log-reset-btn"
          onClick={() => {
            onHandleRemoveCookie();
            onHandleLogout();
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
