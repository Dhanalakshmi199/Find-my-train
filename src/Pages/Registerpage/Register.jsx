import React from "react";
import "./Register.css";
import { useState } from "react";
import auth from "../../firebaseconfig/firebase";
import {createUserWithEmailAndPassword} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [mailid, setmailid] = useState("");
  const [password, setpassword] = useState("");
 const navigate = useNavigate();
  const HandleSignup=async(e)=>{
    e.preventDefault();
    createUserWithEmailAndPassword(auth, mailid, password)
      .then(async(userCredential) => {
        console.log(userCredential);
        navigate("/home")
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      <div
        className="registerclass"
        style={{ backgroundImage: `url("/assets/background.png")` }}
      >
        <div className="y"></div>
        <div className="registerbox">
          {/* <div className="name">
            <span className="nametext">Enter User Name</span>

            <div>
              <input
                type="text"
                className="usernamebox"
                placeholder="USERNAME"
                value={username}
                onChange={(e) => {
                  setusername(e.target.value);
                }}
              />
            </div>
          </div> */}
          <div className="rmail">
            <span className="rmailidtext">Enter Mail ID</span>

            <div>
              <input
                type="text"
                className="rmailidbox"
                placeholder="MAIL ID"
                value={mailid}
                onChange={(e) => {
                  setmailid(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="rpass">
            <span className="rpasstxt">Enter Password</span>

            <div className="">
              <input
                type="password"
                className="rpassbox"
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => {
                  setpassword(e.target.value);
                }}
              />
            </div>
          </div>
          <div>
            <button className="registerbtn" onClick={HandleSignup}>REGISTER</button>
          </div>
        </div>
      </div>
    </>
  );
}
