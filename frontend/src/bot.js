import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import { faHandsHoldingChild } from "@fortawesome/free-solid-svg-icons";

export default function Bot() {
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
    </div>
  );
}
