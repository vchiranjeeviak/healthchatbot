import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import { faHandsHoldingChild } from "@fortawesome/free-solid-svg-icons";

export default function Bot() {
  function handleReload() {
    window.location.reload(false);
  }
  return (
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
      <button className="reset-btn" onClick={handleReload}>
        Reset
      </button>
    </div>
  );
}
