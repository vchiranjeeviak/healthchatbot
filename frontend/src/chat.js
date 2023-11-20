import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTurnUp } from "@fortawesome/free-solid-svg-icons";
import {useCookies} from 'react-cookie'

export default function Chat() {
  const [userInput, setUserInput] = useState("");
  const [userChat, setUserChat] = useState([]);
  const [chat, setChat] = useState([
      {
          entity: 'bot',
          value: "Enter your symptoms"
      } 
  ]);

  const chatStages = [
      {
          endpoint: 'symptom',
          stage:1
      },
      {
          endpoint: 'days',
          stage: 2
      },
      {
          endpoint:'more_symptoms',
          stage:3
      },
      {
          endpoint:'second_symptom',
          stage:4
      },
      {
          endpoint:'final',
          stage:5
      }
  ]

  const [chatStage, setChatStage] = useState(chatStages[0])

  const [submit, setSubmit] = useState(false);

  // const chatContainerRef = useRef(null);

  const addMessage = (setChat, text, entity) => {
    setChat((chat) => [...chat, { entity: entity, value: text }])
    // chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  };

  const [symptomCookie, setSymptomCookie] = useCookies("symptom")
  const [presentDiseaseCookie, setPresentDiseaseCookie] = useCookies("present_disease")
  const [dayCookie, setDayCookie] = useCookies("days")
  
  // setSymptomCookie("symptom", null, { path: "/" })

  const handleUserChat = async (value, chatStage, setChat, setChatStage, chatStages, symptomCookie, setSymptomCookie, presentDiseaseCookie, setPresentDiseaseCookie, dayCookie, setDayCookie) => {
    if (value.length === 0) {
        return
    }
    console.log(value)
    if (value !== " ") {
        await addMessage(setChat, value, 'user');
    }

    const url = `http://127.0.0.1:5000/${chatStage.endpoint}`
    switch (chatStage.stage) {
        case 1:
            console.log("case 1")
            const symptomResponse = await fetch("http://127.0.0.1:5000/symptom", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ symptom: value })
            })
            const symptomRes = await symptomResponse.json()
            // addMessage(res.message, 'bot')
            if (symptomRes.message != null) {
                addMessage(setChat, symptomRes.message, 'bot')
            }

            console.log(symptomRes.payload)
            if(symptomRes.payload != null) {
                symptomRes.payload.map((item, index) => {
                    addMessage(setChat, `${index}) ${item}`, 'bot')
                })
            }

            if (symptomRes.next) {
                setSymptomCookie("symptom", value, { path: "/" })
                localStorage.setItem("symptom", value)
                handleUserChat(" ", chatStages[1], setChat, setChatStage, chatStages, symptomCookie, setSymptomCookie, presentDiseaseCookie, setPresentDiseaseCookie, dayCookie, setDayCookie)
            }
            break;

        case 2:
            setChatStage(chatStages[1])
            if (isNaN(parseInt(value))) {
                addMessage(setChat, 'From how many days?', 'bot')
                return
            }
            if (parseInt(value) < 0) {
                addMessage(setChat, "Enter a valid number.", 'bot')
                return
            }
            localStorage.setItem('num_days', 10)
            setDayCookie("days", parseInt(value), {path:"/"})
            // handleUserChat(" ", chatStages[2], setChat, setChatStage, chatStages, symptomCookie, setSymptomCookie, presentDiseaseCookie, setPresentDiseaseCookie, dayCookie, setDayCookie)
            // break;
            setChatStage(chatStages[2])

        case 3:
            setChatStage(chatStages[2])
            console.log(chatStage)
            console.log("case 3")
            console.log(symptomCookie)
            const moreSymptomsResponse = await fetch("http://127.0.0.1:5000/more_symptoms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ symptom: symptomCookie.symptom || localStorage.getItem('symptom') })
            })
            const moreSymptomsRes = await moreSymptomsResponse.json()
            addMessage(setChat, moreSymptomsRes.message, 'bot')
            localStorage.setItem('present_disease', moreSymptomsRes.payload[0][0])
            setPresentDiseaseCookie("present_disease", moreSymptomsRes.payload[0][0], {path:"/"})
            moreSymptomsRes.payload[1].map((item, index) => {
                addMessage(setChat, item, 'bot')
            })
            console.log(moreSymptomsRes)
            setChatStage(chatStages[3])
            console.log(chatStage)
            break;

        case 4:
            setChatStage(chatStages[3])
            console.log("hello")
            console.log(value)
            const symptoms_exp = value.includes(",") ? value.split(",") : value
            console.log(symptoms_exp)
           
            console.log(dayCookie)
            const secondSymptomResponse = await fetch("http://127.0.0.1:5000/second_symptom", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    present_disease: [presentDiseaseCookie.present_disease || localStorage.getItem('present_disease')],
                    symptoms_exp: symptoms_exp.constructor === Array ? symptoms_exp : [symptoms_exp],
                    num_days: dayCookie.days || localStorage.getItem('num_days') 
                })
            })
            console.log(secondSymptomResponse)
            const secondSymptomRes = await secondSymptomResponse.json()
            console.log(secondSymptomRes)
            addMessage(setChat, secondSymptomRes.message, 'bot')
            let str = ""
            if (secondSymptomRes.payload[0] && secondSymptomRes.payload[0].constructor === String) {
                str = str + secondSymptomRes.payload[0]
            }
            if (secondSymptomRes.payload[0] && secondSymptomRes.payload[0].present_disease) {
                str = str + secondSymptomRes.payload[0].present_disease
            }
            if (secondSymptomRes.payload[1]){
                if (str != "") {
                    str = str + " or " + secondSymptomRes.payload[1]
                } else {
                    str = str + secondSymptomRes.payload[1]
                }
            }

            addMessage(setChat, str, 'bot')
            setChatStage(chatStages[4])
            handleUserChat(" ", chatStages[4], setChat, setChatStage, chatStages, symptomCookie, setSymptomCookie, presentDiseaseCookie, setPresentDiseaseCookie, dayCookie, setDayCookie)

            break;

        case 5:
            setChatStage(chatStages[4])
            console.log(presentDiseaseCookie)
            const finalResponse = await fetch("http://127.0.0.1:5000/final", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    present_disease: [presentDiseaseCookie.present_disease || localStorage.getItem('present_disease')]
                })
            })
            console.log(finalResponse)
            const finalRes = await finalResponse.json()
            addMessage(setChat, finalRes.message, 'bot')
            finalRes.payload[0].map((item, index) => {
                addMessage(setChat, item, 'bot')
            })
            addMessage(setChat, finalRes.payload[1], 'bot')
            console.log(finalRes.payload)
    }
  };

  function handleSubmit() {
    setSubmit(!submit);
    setUserInput("");
  }

  return (
    <div>
      <ChatPage chat={chat} submitBtn={submit} />
      <UserChat
        onHandleUserChat={handleUserChat}
        userInput={userInput}
        onHandleSubmit={handleSubmit}
        chatStage={chatStage}
        setChat={setChat}
        setChatStage={setChatStage}
        chatStages={chatStages}
        symptomCookie={symptomCookie}
        setSymptomCookie={setSymptomCookie}
        presentDiseaseCookie={presentDiseaseCookie}
        setPresentDiseaseCookie={setPresentDiseaseCookie}
        dayCookie={dayCookie}
        setDayCookie={setDayCookie}
      />
    </div>
  );
}

function ChatPage({ chat, submitBtn }) {

  return (
    <main>
      <div className="chat-container">
        <ul>
          {chat.map((messageObj, index) => (
              messageObj.entity === 'user'
              ? <li className="user-chat-list" key={index}>{messageObj.value}</li>
              : <li className="bot-chat-list" key={index}>{messageObj.value}</li>))}
        </ul>
      </div>
    </main>
  );
}

function UserChat({ onHandleUserChat, onHandleSubmit, chatStage, setChat, setChatStage, chatStages, symptomCookie, setSymptomCookie, presentDiseaseCookie, setPresentDiseaseCookie, dayCookie, setDayCookie }) {
  const [childInput, setChildInput] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setChildInput(value);
  };

  const handleButtonClick = () => {
    onHandleUserChat(childInput, chatStage, setChat, setChatStage, chatStages, symptomCookie, setSymptomCookie, presentDiseaseCookie, setPresentDiseaseCookie, dayCookie, setDayCookie);
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
