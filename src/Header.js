import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [Cookie, setCookie, removeCookie] = useCookies(["auth_token"]);
  const nvigate = useNavigate();
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  // const { user, Logout } = useContext(AuthContext);
  const Logout = () => {
    axios.post(`${process.env.API}/auth/logout`);
    removeCookie("userToken");
    localStorage.removeItem("userName");
    nvigate("/");
  };

  useEffect(() => {
    setName(localStorage.getItem("userName"));
    setUserId(localStorage.getItem("userId"));
  }, [name, userId]);

  return (
    <div className="header">
      <h4 className="logo">MERN</h4>
      <div className="btns right-header">
        <h4> Hi, {name}</h4>
        <button onClick={Logout}>Logout</button>
      </div>
    </div>
  );
};

export default Header;
