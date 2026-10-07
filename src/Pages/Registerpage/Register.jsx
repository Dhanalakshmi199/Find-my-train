import React from "react";
import "./Register.css";
import { useState } from "react";
import auth from "../../firebaseconfig/firebase";
import {createUserWithEmailAndPassword} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [mailid, setmailid] = useState("");
  const [password, setpassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const HandleSignup = async (e) => {
    e.preventDefault();
    if (!mailid || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    createUserWithEmailAndPassword(auth, mailid, password)
      .then((userCredential) => {
        navigate("/home");
      })
      .catch((err) => {
        console.error(err);
        const msg = err.code ? err.code.replace("auth/", "").replace(/-/g, " ") : err.message;
        setError(msg);
      });
  };

  return (
    <>
      <div
        className="registerclass"
        style={{ backgroundImage: `url("/assets/background.png")` }}
      >
        <div className="y"></div>
        <div className="registerbox">
          <form onSubmit={HandleSignup} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <div className="rmail">
              <span className="rmailidtext">Enter Mail ID</span>

              <div>
                <input
                  type="email"
                  required
                  className="rmailidbox"
                  placeholder="MAIL ID"
                  value={mailid}
                  onChange={(e) => {
                    setmailid(e.target.value);
                    setError("");
                  }}
                />
              </div>
            </div>
            <div className="rpass">
              <span className="rpasstxt">Enter Password</span>

              <div className="">
                <input
                  type="password"
                  required
                  className="rpassbox"
                  placeholder="PASSWORD"
                  value={password}
                  onChange={(e) => {
                    setpassword(e.target.value);
                    setError("");
                  }}
                />
              </div>
            </div>
            <div>
              <button className="registerbtn" type="submit">
                REGISTER
              </button>
            </div>
            <div>
              <button
                type="button"
                className="signupbtn"
                onClick={() => {
                  navigate("/");
                }}
              >
                LOG IN
              </button>
            </div>
            {error && (
              <div className="invalid">
                <span>{error}</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
