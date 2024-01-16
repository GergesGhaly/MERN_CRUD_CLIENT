import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const Register = () => {
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

  const RegisterHandel = (e) => {
    e.preventDefault();
    setLoad(true);

    axios
      .post(`${process.env.API}/auth/register`, userData)
      .then((res) => {
        setUserData(res.data.userName);
        setCookie("userToken", res.data.userToken);
        localStorage.setItem("userName", res.data.userName);
        localStorage.setItem("userId", res.data.userId);
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
    <div className="registerPage">
      <form onSubmit={RegisterHandel}>
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
          Have An Account /<Link to="/"> To Login </Link>
        </span>

        <input
          className="submit"
          style={{
            background: "lightgreen",
          }}
          type="submit"
          value="Register"
        />
        {laod && (
          <span style={{ padding: "13px 0", fontSize: "12px" }}>
            Loading ..
          </span>
        )}

        {err && (
          <span style={{ padding: "13px 0", fontSize: "12px", color: "red" }}>
            {err}
          </span>
        )}
      </form>
    </div>
  );
};

export default Register;
