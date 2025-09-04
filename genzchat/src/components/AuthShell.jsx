// src/components/AuthShell.jsx
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function AuthShell() {
  const { isFlipped, setIsFlipped, setMode } = useContext(AuthContext);

  const showLogin = () => { setMode("login"); setIsFlipped(false); };
  const showSignup = () => { setMode("login"); setIsFlipped(true); };

  return (
  <></>
  );
}
