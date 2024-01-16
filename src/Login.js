import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import { useCookies } from "react-cookie";

const Login = () => {
  const nvigate = useNavigate();
  const [Cookie, setCookie] = useCookies("");
  const [laod, setLoad] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    password: "",
  });
  const [err, setErr] = useState("");
  const handleChange = (e) => {
    const { value, name } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const LoginHandel = async (e) => {
    e.preventDefault();
    setLoad(true);
    axios
      .post(`${process.env.REACT_APP_API}/auth/login`, userData)
      .then((res) => {
        setUserData(res.data.userName);
        localStorage.setItem("userName", res.data.userName);
        localStorage.setItem("userId", res.data.userId);
        setCookie("userToken", res.data.userToken);
        nvigate("/home");
      })

      .catch((error) => setErr(error.request.response))
      .finally((x) => setLoad(false));
  };
  useEffect(() => {
    if (Cookie.userToken) {
      nvigate("/home");
    }
  }, [Cookie]);

  return (
    <div className="loginPage">
      <form onSubmit={LoginHandel}>
        <input
          onChange={handleChange}
          type="text"
          name="name"
          value={userData.name}
          placeholder="Enter name"
        />
        <input
          onChange={handleChange}
          type="password"
          name="password"
          value={userData.password}
          placeholder="Enter password"
        />
        <span style={{ padding: "20px 0", fontSize: "13px" }}>
          {" "}
          Have Not Account /<Link to="/register"> To Register </Link>
        </span>

        <input
          disabled={laod}
          className="submit"
          style={{
            background: "lightgreen",
          }}
          type="submit"
          value={laod ? "Loading ..." : "Login"}
        />
        {err && (
          <span style={{ padding: "13px 0", fontSize: "12px", color: "red" }}>
            {err}
          </span>
        )}
      </form>
    </div>
  );
};

export default Login;
