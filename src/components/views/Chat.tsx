import React, { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import { getBrokerURL } from "helpers/getBrokerURL"

const Chat = () => {
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [draftMessage, setDraftMessage] = useState("");
  const [timer, setTimer] = useState(10);

  /**
   * UserId setting is just for test.
   */
  const [userId, setUserId] = useState("");
  const [userIdInput, setUserIdInput] = useState("");
  const [isUserIdSet, setIsUserIdSet] = useState(false);

  useEffect(() => {
    // Connect WebSocket
    const stompClient = new Client({
      brokerURL: getBrokerURL(),
      onConnect: () => {
        console.log("Connected");
        setConnected(true);

        // subscribe message
        const gameId = "1";
        stompClient.subscribe("/topic/" + gameId + "/public", (message) => {
          const newMessage = JSON.parse(message.body);
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        // subscribe timer
        stompClient.subscribe("/topic/timer", (message) => {
          const newTime = JSON.parse(message.body);
          setTimer(newTime);
        });

        // subscribe timer notification
        stompClient.subscribe("/topic/timerNotification", (message) => {
          const notification = message.body;
          alert(notification);
        });


      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
        setConnected(false);
      },
    });
    stompClient.activate();
    setClient(stompClient);

    // if close window or move to another page, then disconnect
    const handleBeforeUnload = () => {
      stompClient.deactivate();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      stompClient.deactivate();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const sendMessage = () => {
    if (client && connected && draftMessage) {
      const chatMessage = {
        content: draftMessage,
        userId: userId,
        gameId: "1",
      };

      client.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(chatMessage),
      });
      setDraftMessage("");

    } else {
      console.log("STOMP connection is not established.");
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const setUserIdAndHide = () => {
    setUserId(userIdInput);
    setIsUserIdSet(true);
  };

  const startGame = () => {
    if (client && connected) {
      client.publish({
        destination: "/app/startGame",
        body: JSON.stringify({ message: "Start the game and timer!" }),
      });
    } else {
      console.log("STOMP connection is not established.");
    }
  }

  return (
    <div>
      <h2>Chat</h2>
      {!isUserIdSet && (
        <>
          <input
            type="number"
            value={userIdInput}
            onChange={(e) => setUserIdInput(e.target.value)}
            placeholder="Enter your userId..."
          />
          <button onClick={setUserIdAndHide}>Set UserId</button>
        </>
      )}
      {isUserIdSet && (
        <div>Your userId is {userId}</div>
      )}
      <div><button onClick={clearMessages}>Clear Chat</button></div>
      <div><button onClick={startGame}>StartGame</button></div>
      <div>Timer: {timer} seconds</div>
      <div id="messageList" style={{ height: "200px", overflowY: "scroll", marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
        {messages.map((msg, index) => (
          <div key={index}>{msg.userId}: {msg.content}</div>
        ))}
      </div>
      <input
        type="text"
        value={draftMessage}
        onChange={(e) => setDraftMessage(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type a message..."
        style={{ width: "80%", marginRight: "10px" }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;


