import React, { useState } from "react";
import "./Login.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import auth from "../../firebaseconfig/firebase";
import { useNavigate } from "react-router-dom";

//import Register from "../Registerpage/Register";
export default function Login() {
    const navigate = useNavigate();
    const [error,seterror]=useState(false)
  const [mailid, setmailid] = useState("");
  const [password, setpassword] = useState("");
  const login = async(e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, mailid, password)
      .then((userCredential) => {
        // console.log(userCredential);
        navigate("/home")
      })
      .catch((error) => {
        seterror(true)
        // console.log(error);
      });
  };

  return (
    <>
      <div
        className="loginclass"
        style={{ backgroundImage: `url("/assets/background.png")` }}
      >
        <div className="x"></div>
        <div className="loginbox">
          <div className="mail">
            <span className="mailidtext">Enter Mail ID</span>

            <div>
              <input
                type="text"
                className="mailidbox"
                placeholder="MAIL ID"
                value={mailid}
                onChange={(e) => {
                  setmailid(e.target.value);
                  seterror(false);
                }}
              />
            </div>
          </div>
          <div className="pass">
            <span className="passtxt">Enter Password</span>

            <div className="">
              <input
                type="password"
                className="passbox"
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => {
                  setpassword(e.target.value);
                  seterror(false);
                }}
              />
            </div>
          </div>
          {/* <div>
            <button className="fgpassbtn">forgot password?</button>
          </div> */}
          <div>
            <button className="loginbtn" type="submit" onClick={login}>
              LOG IN
            </button>
          </div>
          <div>
            <button
              className="signupbtn"
              onClick={() => {
                navigate("/register");
              }}
            >
              SIGN UP
            </button>
          </div>
          {error && (
            <div className="invalid">
              <span className="">Invalid credentials!</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
