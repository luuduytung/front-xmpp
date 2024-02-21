// LoginForm.js
import React from "react";
import styled from "styled-components";
import { userInfo } from "./userInfo";
import toast from "react-hot-toast";

const LoginForm = ({ username, setUsername, password, setPassword, loading, setLoading, setWs }) => {
  const xmppDomain = "x.conception.confroom.io";

  const handleLogin = () => {
    setLoading(false);
    if (userInfo.has(username) && userInfo.get(username)["password"] === password) {
      setWs(new WebSocket(`ws://localhost:8079/chat/${username}@${xmppDomain}`));
      setLoading(true);
    } else {
      toast.error("Authentication failed");
    }
  };

  return (
    <Container>
      <Title>XMPP WebSocket</Title>
      <FormContainer>
        <Input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </FormContainer>
    </Container>
  );
};

export default LoginForm;

const Container = styled.div`
  text-align: center;
  margin-top: 50px;
`;

const Title = styled.h1`
  font-family: "Arial", sans-serif;
  font-size: 24px;
  color: #333;
`;

const FormContainer = styled.div`
  margin-top: 20px;
`;

const Input = styled.input`
  padding: 10px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 200px;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 5px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;
