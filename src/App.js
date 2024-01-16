import { useEffect } from "react";
import "./App.css";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

function App() {
  const [userId, setUserId] = useState("");
  const [data, setdata] = useState([]);
  const [id, setId] = useState();
  const [sendData, setsendData] = useState({
    name: "",
    age: "",
  });
  const [updatmod, setUpdatmod] = useState(false);
  const [load, setLoad] = useState(false);
  const { name, age } = sendData;
  const [Cookie, setCookie] = useCookies(["userToken"]);

  const nivgate = useNavigate();

  const handleChange = (e) => {
    const { value, name } = e.target;
    setsendData({ ...sendData, [name]: value });
  };
  const dataFetch = () => {
    setLoad(true);
    fetch(`${process.env.API}/users/getdata`)
      .then((res) => res.json())
      .then((dataF) => setdata(dataF))
      .then(() => setLoad(false));
  };

  useEffect(() => {
    dataFetch();
    if (!Cookie.userToken) {
      nivgate("/");
    }
    setUserId(localStorage.getItem("userId"));
  }, [Cookie, userId]);

  const UpdatItem = (id) => {
    const singledata = data.find((item) => item._id == id);
    setId(id);
    setsendData({ ...singledata });
    setUpdatmod(true);
  };

  const DeletItem = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#3085d6",

      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, Delete It!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${process.env.API}/users/deleteuser/${id}`)
          .then((fetch) => dataFetch())
          .then(() => setsendData({ name: "", age: "" }));
        setUpdatmod(false);
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Your File Has been Deleted",
          showConfirmButton: false,
          timer: 1400,
        });
      }
    });
  };
  const POSTItem = (e) => {
    e.preventDefault();
    if (!updatmod) {
      if (name && age) {
        axios
          .post(`${process.env.API}/users/createuser`, {
            name,
            age,
            userAuthId: userId,
          })
          .then((fetch) => dataFetch())
          .then(() => setsendData({ name: "", age: "" }))
          .then((data) =>
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Created",
              showConfirmButton: false,
              timer: 1400,
            })
          );
      } else {
        const MySwal = withReactContent(Swal);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Name or Age is empty!",
          timer: 1500,
        });
      }
    } else {
      axios
        .put(`${process.env.API}/users/updateuser/${id}`, sendData)
        .then((fetch) => dataFetch())
        .then(() => setsendData({ name: "", age: "" }));

      setUpdatmod(false);
    }
  };
  return (
    <div className="App">
      <Header />

      <form onSubmit={(e) => POSTItem(e)}>
        <input
          onChange={handleChange}
          type="text"
          name="name"
          value={name}
          placeholder="Enter name"
        />
        <input
          onChange={handleChange}
          min="1"
          max="130"
          type="number"
          name="age"
          value={age}
          placeholder="Enter age"
        />

        <input
          className="submit"
          style={{
            background: !updatmod ? "lightgreen" : "rgb(206, 209, 8)",
          }}
          type="submit"
          value={updatmod ? "Update" : "ADD"}
        />
      </form>
      {load && (
        <h5
          style={{
            textAlign: "center",
            fontWeight: "lighter",
          }}
        >
          Loading ...
        </h5>
      )}
      {data?.map((item) => {
        return (
          <div className="hero" key={item._id}>
            <div>
              <h2 className="name">{item.name}</h2>
              <h2>{item.age} years</h2>
            </div>

            <div className="btns">
              <button
                disabled={userId == item.userAuthId ? false : true}
                onClick={() => UpdatItem(item._id)}
              >
                Update
              </button>
              <button
                disabled={userId == item.userAuthId ? false : true}
                onClick={() => {
                  DeletItem(item._id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default App;
