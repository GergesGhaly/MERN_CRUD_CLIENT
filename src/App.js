import { useEffect } from "react";
import "./App.css";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function App() {
  const initial = {
    title: "",
    desc: "",
  };

  const [data, setdata] = useState([]);
  const [id, setId] = useState();
  const [sendData, setsendData] = useState(initial);
  const [updatmod, setUpdatmod] = useState(false);

  const { desc, title } = sendData;

  const handleChange = (e) => {
    const { value, name } = e.target;
    setsendData({ ...sendData, [name]: value });
  };

  const dataFetch = () => {
    fetch("https://weak-useful-rabbit.glitch.me/posts")
      .then((res) => res.json())
      .then((data) => setdata(data));
  };

  useEffect(() => {
    dataFetch();
  }, []);

  const UpdatItem = (id) => {
    const singledata = data.find((item) => item.id == id);
    setId(id);
    setsendData({ ...singledata });
    setUpdatmod(true);
    console.log(singledata);
  };

  const DeletItem = (id) => {
    console.log(id);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#3085d6",

      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const data = fetch(`https://weak-useful-rabbit.glitch.me/posts/${id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((fetch) => dataFetch());
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Your file has been deleted",
          showConfirmButton: false,
          timer: 1200,
        });
      }
    });
  };
  const POSTItem = (e) => {
    e.preventDefault();
    // if(){
    // alert("Please Enter The Name & Age")
    // }
    if (!updatmod) {
      if (title && desc) {
        axios
          .post(`https://weak-useful-rabbit.glitch.me/posts/`, sendData)
          .then((fetch) => dataFetch())
          .then((x) => setsendData({ title: "", desc: "" }))
          .then((data) =>
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "saved",
              showConfirmButton: false,
              timer: 1200,
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
        .put(`https://weak-useful-rabbit.glitch.me/posts/${id}`, sendData)
        .then((fetch) => dataFetch())
        .then((x) => setsendData({ title: "", desc: "" }));

      setUpdatmod(false);
    }

    // fetch(`http://localhost:8000/posts/`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(sendData),
    // })

    //   .then((fetch) => dataFetch());
  };
  return (
    <div className="App">
      <h1 className="logo">
        <span>C</span>
        <span>R</span>
        <span>U</span>
        <span>D</span>
      </h1>
      <form onSubmit={(e) => POSTItem(e)}>
        <input
          onChange={handleChange}
          type="text"
          name="title"
          value={title}
          placeholder="Enter name"
        />
        <input
          onChange={handleChange}
          type="text"
          name="desc"
          value={desc}
          placeholder="Enter age"
        />

        <input
          style={{
            background: !updatmod ? "lightgreen" : "rgb(206, 209, 8)",
          }}
          type="submit"
          value={updatmod ? "Update" : "ADD"}
        />
      </form>
      {data?.map((item) => {
        return (
          <div className="hero" key={item.id}>
            <div>
              <h2 className="name">{item.title}</h2>
              <h2>{item.desc} years</h2>
            </div>
            <div className="btns">
              <button onClick={() => UpdatItem(item.id)} type="">
                Update
              </button>
              <button
                onClick={() => {
                  DeletItem(item.id);
                }}
                type=""
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
