import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTurnUp } from "@fortawesome/free-solid-svg-icons";
import { useCookies } from "react-cookie";
// import { useEffect } from "react"

export default function Chat() {
  const [userInput, setUserInput] = useState("");
  const [userChat, setUserChat] = useState([]);
  const [chat, setChat] = useState([
    {
      entity: "bot",
      value: "Hello World, I am health chat bot. I am here to help you find your disease. Please enter your symptom",
    },
  ]);
  const [speechText, setSpeechText] = useState("Hello World, I am health chat bot. I am here to help you find your disease. Please enter your symptom")

  const speech = new SpeechSynthesisUtterance()

  const textToSpeech = (speech, speechText) => {
      speech.text = speechText
        
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(speech)
  }

  useEffect(() => {
      textToSpeech(speech, "Hello World, I am health chat bot. I am here to help you find your disease. Please enter your symptom")
  }, [])

  const chatStages = [
    {
      endpoint: "symptom",
      stage: 1,
    },
    {
      endpoint: "days",
      stage: 2,
    },
    {
      endpoint: "more_symptoms",
      stage: 3,
    },
    {
      endpoint: "second_symptom",
      stage: 4,
    },
    {
      endpoint: "final",
      stage: 5,
    },
  ];
    
  // useEffect(() => {
  //   window.speechSynthesis.speak(msg)
  // }, [msg])
  
  

  const [chatStage, setChatStage] = useState(chatStages[0]);

  const [submit, setSubmit] = useState(false);

  const addMessage = (setChat, text, entity) => {
    setChat((chat) => [...chat, { entity: entity, value: text }]);
  };

  const handleUserChat = async (
    value,
    chatStage,
    setChat,
    setChatStage,
    chatStages,
    textToSpeech,
    speech,
    setSpeechText
  ) => {
    if (value.trim().length === 0) {
      return;
    }
    console.log(value);
    if (value !== "internal") {
        await addMessage(setChat, value, "user");
    }

    switch (chatStage.stage) {
      case 1:
        console.log("case 1");
        const symptomResponse = await fetch("http://127.0.0.1:5000/symptom", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ symptom: value }),
        });
        const symptomRes = await symptomResponse.json();
        // addMessage(res.message, 'bot')
        if (symptomRes.message != null) {
          addMessage(setChat, symptomRes.message, "bot");
        }

        console.log(symptomRes.payload);
        if (symptomRes.payload != null) {
          symptomRes.payload.map((item, index) => {
            addMessage(setChat, `${index}) ${item}`, "bot");
          });
        }

        if (symptomRes.next) {
          localStorage.removeItem("symptom")
          localStorage.setItem("symptom", value);
          handleUserChat(
            "internal",
            chatStages[1],
            setChat,
            setChatStage,
            chatStages,
            textToSpeech,
            speech,
            setSpeechText
          );
        }
        console.log("case 1 ends")
        break;

      case 2:
        console.log("case 2")
        setChatStage(chatStages[1]);
        if (isNaN(parseInt(value))) {
          addMessage(setChat, "From how many days?", "bot");
          return;
        }
        if (parseInt(value) < 0) {
          addMessage(setChat, "Enter a valid number.", "bot");
          return;
        }
        localStorage.removeItem("num_days")
        localStorage.setItem("num_days", value);
        // handleUserChat(" ", chatStages[2], setChat, setChatStage, chatStages, symptomCookie, setSymptomCookie, presentDiseaseCookie, setPresentDiseaseCookie, dayCookie, setDayCookie)
        // break;
        setChatStage(chatStages[2]);

      case 3:
        setChatStage(chatStages[2]);
        console.log(chatStage);
        console.log("case 3");
        const moreSymptomsResponse = await fetch(
          "http://127.0.0.1:5000/more_symptoms",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              symptom: localStorage.getItem("symptom"),
            }),
          }
        );
        const moreSymptomsRes = await moreSymptomsResponse.json();
        addMessage(setChat, moreSymptomsRes.message, "bot");
        localStorage.removeItem("present_disease")
        localStorage.setItem("present_disease", moreSymptomsRes.payload[0][0]);
        moreSymptomsRes.payload[1].map((item, index) => {
          addMessage(setChat, item, "bot");
        });
        console.log(moreSymptomsRes);
        setChatStage(chatStages[3]);
        console.log(chatStage);
        break;

      case 4:
        setChatStage(chatStages[3]);
        console.log("hello");
        console.log(value);
        const symptoms_exp = value.includes(",") ? value.split(",") : value;
        console.log(symptoms_exp);

        const secondSymptomResponse = await fetch(
          "http://127.0.0.1:5000/second_symptom",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              present_disease: [
                  localStorage.getItem("present_disease"),
              ],
              symptoms_exp:
                symptoms_exp.constructor === Array
                  ? symptoms_exp
                  : [symptoms_exp],
              num_days: localStorage.getItem("num_days"),
            }),
          }
        );
        console.log(secondSymptomResponse);
        const secondSymptomRes = await secondSymptomResponse.json();
        console.log(secondSymptomRes);
        addMessage(setChat, secondSymptomRes.message, "bot");
        let str = "";
        if (
          secondSymptomRes.payload[0] &&
          secondSymptomRes.payload[0].constructor === String
        ) {
          str = str + secondSymptomRes.payload[0];
        }
        if (secondSymptomRes.payload[1] &&
            secondSymptomRes.payload[1].constructor === String
        ) {
          if (str != "") {
            str = str + " or " + secondSymptomRes.payload[1];
          } else {
            str = str + secondSymptomRes.payload[1];
          }
        }
        localStorage.removeItem("second_symptom")
        localStorage.setItem("second_symptom", secondSymptomRes.payload[1]);
        addMessage(setChat, str, "bot");
        setChatStage(chatStages[4]);
        handleUserChat(
          "internal",
          chatStages[4],
          setChat,
          setChatStage,
          chatStages,
          textToSpeech,
          speech,
          setSpeechText
        );

        break;

      case 5:
        setChatStage(chatStages[4]);
        const finalResponse = await fetch("http://127.0.0.1:5000/final", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            present_disease: [
                localStorage.getItem("present_disease"),
            ],
            second_symptom: [
                localStorage.getItem("second_symptom"),
            ],
          }),
        });
        console.log(finalResponse);
        const finalRes = await finalResponse.json();
        console.log(finalRes.payload);

        if (finalRes.payload[0] && finalRes.payload[1]) {
            // setSpeechText(finalRes.payload[1])
            await textToSpeech(speech, finalRes.payload[1])
            addMessage(setChat, finalRes.payload[1], "bot");
            finalRes.payload[0][0].map((item, index) => {
                addMessage(setChat, item, "bot");
            });
        }
        if (finalRes.payload[2] && finalRes.payload[3]) {
            // setSpeechText(finalRes.payload[3])
            await textToSpeech(speech, finalRes.payload[3])
            addMessage(setChat, finalRes.payload[3], "bot");
            finalRes.payload[2][0].map((item, index) => {
                addMessage(setChat, item, "bot");
            });
        }

        addMessage(
          setChat,
          "You can reset everything by clicking on reset button.",
          "bot"
        );
        
        const items = ["symptom", "num_days", "present_disease", "second_symptom"]
        items.map((item, ind) => {
            localStorage.removeItem(item)
        })
    }
  };

  function handleSubmit() {
    setSubmit(!submit);
    setUserInput("");
  }

  return (
    <div>
      <ChatPage userChat={chat} submitBtn={submit} />
      <UserChat
        onHandleUserChat={handleUserChat}
        userInput={userInput}
        onHandleSubmit={handleSubmit}
        chatStage={chatStage}
        setChat={setChat}
        setChatStage={setChatStage}
        chatStages={chatStages}
        textToSpeech={textToSpeech}
        speech={speech}
        setSpeechText={setSpeechText}
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
          {userChat.map((messageObj, index) =>
            messageObj.entity === "user" ? (
              <li className="user-chat-list" key={index}>
                {messageObj.value}
              </li>
            ) : (
              <li className="bot-chat-list" key={index}>
                {messageObj.value}
              </li>
            )
          )}
        </ul>
      </div>
    </main>
  );
}

function UserChat({
  onHandleUserChat,
  onHandleSubmit,
  chatStage,
  setChat,
  setChatStage,
  chatStages,
  textToSpeech,
  speech,
  setSpeechText
}) {
  const [childInput, setChildInput] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setChildInput(value);
  };

  const handleButtonClick = () => {
    onHandleUserChat(
      childInput,
      chatStage,
      setChat,
      setChatStage,
      chatStages,
      textToSpeech,
      speech,
      setSpeechText
    );
    onHandleSubmit();
    setChildInput(""); // Clear the input field in the child component
  };

  return (
    <div className="chat-form">
      <input
        placeholder="Type your query or response here:"
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
