import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTurnUp } from "@fortawesome/free-solid-svg-icons";
export default function Chat() {
  const [userInput, setUserInput] = useState("");
  const [userChat, setUserChat] = useState([]);
  const [submit, setSubmit] = useState(false);

  const addMessage = (text) => {
    // console.log(text);
    setUserChat((userInput) => [...userInput, text]);
    // console.log(userChat);
  };

  const handleUserChat = (value) => {
    if (value.length === 0) {
      console.log("empty input");
    }
    addMessage(value);
  };

  function handleSubmit() {
    setSubmit(!submit);
    setUserInput("");
  }

  return (
    <div>
      <ChatPage userChat={userChat} submitBtn={submit} />
      <UserChat
        onHandleUserChat={handleUserChat}
        userInput={userInput}
        onHandleSubmit={handleSubmit}
      />
    </div>
  );
}

function ChatPage({ userChat, submitBtn }) {
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom whenever userChat changes
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [userChat]);
  return (
    <main>
      <div className="chat-container" ref={chatContainerRef}>
        <ul>
          {userChat.map((message, index) => (
            <li className="user-chat-list" key={index}>
              {message}
            </li>
          ))}
          <li className="bot-chat-list">I am the bot</li>
        </ul>
      </div>
    </main>
  );
}
function UserChat({ onHandleUserChat, onHandleSubmit }) {
  const [childInput, setChildInput] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setChildInput(value);
  };

  const handleButtonClick = () => {
    onHandleUserChat(childInput);
    onHandleSubmit();
    setChildInput(""); // Clear the input field in the child component
  };

  return (
    <div className="chat-form">
      <input
        placeholder="Enter the symptoms"
        onChange={handleInputChange}
        value={childInput}
      ></input>
      <button
        className="chat-btn"
        onClick={() => {
          handleButtonClick();
        }}
      >
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
