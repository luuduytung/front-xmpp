import { useEffect, useState, useRef } from "react";
import Select from "react-select";
import "./App.css";
import toast, { Toaster } from "react-hot-toast";
import { userInfo } from "./userInfo";
import LoginForm from "./LoginForm";

function App() {
  const xmppDomain = "x.conception.confroom.io";
  const mucDomain = "conference.x.conception.confroom.io";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [ws, setWs] = useState(null);
  const [selectedChannelId, setSelectedChannelId] = useState("");
  const [message, setMessage] = useState("");
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mucJoin, setMucJoin] = useState(false);
  const connection = useRef(null);
  const users = ["alice", "bob", "charlie"];
  const mucs = ["ab", "ac", "bc", "abc", "test"];
  const channels = [...users, ...mucs];

  const sendXmpp = (xmppMessage) => {
    ws.send(JSON.stringify(xmppMessage));
  };

  const isMuc = (channelId) => {
    return mucs.includes(channelId);
  };

  const handleSelectChannel = (selectedChannel) => {
    const channelId = selectedChannel["value"];
    console.log(channelId);
    setSelectedChannelId(channelId);
    if (isMuc(channelId)) {
      if (!mucJoin) {
        sendXmpp({ to: `${channelId}@${mucDomain}`, messageType: "JOIN_MUC" });
        setMucJoin(true);
      }
    }
  };

  const handleSendMessage = () => {
    const [to, messageType] = isMuc(selectedChannelId)
      ? [`${selectedChannelId}@${mucDomain}`, "MUC_MESSAGE"]
      : [`${selectedChannelId}@${xmppDomain}`, "MESSAGE"];
    const content = message;
    sendXmpp({ to, messageType, content });
    if (!isMuc(selectedChannelId)) {
      setLog((prevLog) => [...prevLog, { channelId: selectedChannelId, content: genMsgText(username, message) }]);
    }
    setMessage("");
  };

  const genMsgText = (from, content) => {
    return `${from}: ${content}`;
  };

  const chatMessageDecoder = (msg) => {
    const from = msg["from"].split("/")[0];
    const channelId = from.split(`@${xmppDomain}`)[0];
    const content = genMsgText(channelId, msg["content"]);
    return { channelId, content };
  };

  const mucMessageDecoder = (msg) => {
    let channelInfo = msg["from"].split("/");
    const [channelId, from] = [channelInfo[0].split(`@${mucDomain}`)[0], channelInfo[1]];
    const content = genMsgText(from.split(`@${xmppDomain}`)[0], msg["content"]);
    return { channelId, content };
  };

  useEffect(() => {
    if (!ws) return;

    ws.addEventListener("open", (event) => {
      setLoading(false);
      toast.success("WebSocket connected");
    });

    ws.addEventListener("message", (event) => {
      const msg = JSON.parse(event.data);
      if (msg["content"] !== undefined) {
        if (msg["messageType"] === "MUC_MESSAGE") {
          setLog((prevLog) => [...prevLog, mucMessageDecoder(msg)]);
        }
        if (msg["messageType"] === "MESSAGE") {
          setLog((prevLog) => [...prevLog, chatMessageDecoder(msg)]);
        }
      }
    });

    connection.current = ws;

    return () => connection.current.close();
  }, [ws]);

  const displayAuthPath = !ws;
  const authPart = displayAuthPath && (
    <LoginForm
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      loading={loading}
      setLoading={setLoading}
      setWs={setWs}
    />
  );

  const displaySelectPath =
    ws && userInfo.has(username) && userInfo.get(username)["chatTo"] && userInfo.get(username)["mucTo"];
  const selectPart = displaySelectPath && (
    <div>
      <h2>Chat</h2>
      <p>
        <i>You are connected as {username}</i>
      </p>
      <Select
        options={[
          {
            label: "1-1 Messaging",
            options: userInfo
              .get(username)
              ["chatTo"].map((chatTo) => ({ value: chatTo["id"], label: chatTo["label"] })),
          },
          {
            label: "Group Messaging",
            options: userInfo.get(username)["mucTo"].map((mucTo) => ({ value: mucTo["id"], label: mucTo["label"] })),
          },
        ]}
        onChange={handleSelectChannel}
        placeholder="Select your channel"
      />
    </div>
  );

  const displayChatPart = ws && channels.includes(selectedChannelId);
  const chatPart = displayChatPart && (
    <div>
      <div>
        <input
          type="text"
          placeholder="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      <div>
        <h2>Chat Log</h2>
        <ul>
          {log
            .filter((msg) => msg["channelId"] === selectedChannelId)
            .map((msg, index) => (
              <li key={index}>{msg["content"]}</li>
            ))}
        </ul>
      </div>
    </div>
  );

  return (
    <>
      <Toaster position="top-center" />
      {authPart}
      {selectPart}
      {chatPart}
    </>
  );
}

export default App;
