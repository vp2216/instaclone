import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import icon from "../images/icon.png";

function Start() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState(true);
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(0);

  async function submitLogin(e) {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("email", email);
    formdata.append("password", password);
    const res = await fetch("http://localhost:8080/user/login", {
      method: "POST",
      body: formdata,
    });
    const response = await res.json();
    if (response.token) {
      setToken(response.token);
      sessionStorage.setItem("token", response.token);
    }
    setMessage(response.message);
  }

  async function submitRegister(e) {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("email", email);
    formdata.append("name", name);
    formdata.append("city", city);
    formdata.append("password", password);
    const res = await fetch("http://localhost:8080/user/register", {
      method: "POST",
      body: formdata,
    });
    const response = await res.json();
    setMessage(response.message);
    setStatus(res.status);
  }
  
  useEffect(() => {
    setTimeout(() => {
      if (login) {
        setMessage("");
        if (token) navigate("/main")
      } else {
        setMessage("");
        if (status === 200) {
          setName("");
          setEmail("");
          setPassword("");
          setCity("");
          setLogin(true);
        }
      }
    }, 5000);
  },[message])
  
  return (
    <>
      {/* Message */}

      {message ? (
        <div className="h-screen w-screen fixed flex justify-center items-center z-50">
          <div className="absolute bg-gray-900 flex justify-center items-center flex-col p-5 gap-5 w-5/6 sm:w-3/6 lg:w-1/4 rounded font-semibold">
            <p className="text-center text-white break-words w-full">
              {message}
            </p>
            <span
              className="px-4 py-2 bg-green-700 hover:bg-green-600  rounded text-white ease-in-out duration-300 cursor-pointer"
              onClick={() => {
                setMessage("");
                if (login) {
                  if (token) navigate("/main");
                } else {
                  if (status === 200) {
                    setName("");
                    setEmail("");
                    setPassword("");
                    setCity("");
                    setLogin(true);
                  }
                }
              }}
            >
              OK
            </span>
          </div>
        </div>
      ) : null}

      <div
        className={`h-screen w-screen flex gap-10 justify-center items-center p-5 md:p-10 flex-col bg-gray-900 relative z-10 background ${
          message ? "opacity-25" : null
        }`}
      >
        <span className="flex justify-center items-center gap-3 cursor-default text-green-500 tracking-wider text-4xl font-bold">
          <img src={icon} alt="icon" className="w-10" />
          InstaClone
        </span>
        <form className="flex justify-center items-center flex-col gap-5 bg-gray-600 p-5 rounded w-full sm:w-3/4 md:w-2/4 lg:w-1/4">
          <input
            type="email"
            className="outline-none px-5 py-3 rounded font-semibold w-full "
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {!login ? (
            <>
              <input
                className="outline-none px-5 py-3 rounded font-semibold w-full "
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="outline-none px-5 py-3 rounded font-semibold w-full "
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </>
          ) : null}
          <input
            type="password"
            className="outline-none px-5 py-3 rounded font-semibold w-full "
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {login ? (
            <>
              <button
                className="px-5 py-3 w-full font-semibold text-white tracking-wider bg-green-700 hover:bg-green-600 rounded disabled:opacity-50 disabled:hover:bg-green-700"
                onClick={submitLogin}
                disabled={email && password ? false : true}
              >
                Login
              </button>
              <div className="px-5 py-3 w-full font-semibold text-white tracking-wider bg-green-700 hover:bg-green-600 rounded text-center cursor-pointer" onClick={() => {
                setEmail("vp@gmail.com");
                setPassword("123456");
              }}>Use Demo</div>
            </>
          ) : (
            <button
              className="px-5 py-3 w-full font-semibold text-white tracking-wider bg-green-700 hover:bg-green-600 rounded disabled:opacity-50 disabled:hover:bg-green-700"
              onClick={submitRegister}
              disabled={email && password && name && city ? false : true}
            >
              Register
            </button>
          )}
        </form>
        <p className="font-semibold text-white">
          {login ? "Don't have an account" : "Already have an account"}{" "}
          <a
            className="cursor-pointer font-bold text-green-500 hover:text-green-400"
            onClick={() => {
              setLogin(!login);
              setName("");
              setEmail("");
              setPassword("");
              setCity("");
            }}
          >
            {login ? "Register" : "Login"}
          </a>{" "}
          here
        </p>
      </div>
    </>
  );
}

export default Start;
