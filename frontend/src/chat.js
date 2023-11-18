import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTurnUp } from "@fortawesome/free-solid-svg-icons";

export default function Chat() {
  return (
    <div>
      <ChatPage />
      <ChatForm />
    </div>
  );
}

function ChatPage() {
  return (
    <main>
      <div className="chat-container">
        <div className="sub-container"></div>
      </div>
    </main>
  );
}
function ChatForm() {
  return (
    <div className="chat-form">
      <input placeholder="Enter the symptoms"></input>
      <button className="chat-btn">
        <FontAwesomeIcon
          icon={faArrowTurnUp}
          rotation={90}
          size="lg"
          style={{ color: "#000000" }}
        />
      </button>
    </div>
  );
}
