import React, { useState } from "react";
import "./Navbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import {  signOut } from "firebase/auth";
import auth from "../firebaseconfig/firebase";
import { Logout } from "@mui/icons-material";

export default function Navbar({ curpage }) {
  // const auth = getAuth();
  const [gotopage, setgotopage] = useState(curpage);
  const navigate = useNavigate();
  const location = useLocation();
  const buttonClassName =
    location.pathname === "/livelocation" ? "changecolour" : "";
  const buttonClassName1 =
    location.pathname === "/trainsbetweenstations" ? "changecolour" : "";
  const buttonClassName2 =
    location.pathname === "/trainschedule" ? "changecolour" : "";

  return (
    <>
      <div className="topbarcontainer">
        <div>
          <img src="/assets/logo.png" alt="" className="logo" />
        </div>
        <div
          className="title"
          onClick={() => {
            navigate("/home");
          }}
        >
          Find My Train
        </div>

        <button
          className={`findmytrain ${buttonClassName} navbuttons`}
          id="fmt"
          onClick={() => {
            setgotopage("track");
            navigate("/livelocation", { gotopage });
          }}
        >
          Spot My Train
        </button>

        <button
          className={`tbstations ${buttonClassName1} navbuttons`}
          onClick={() => {
            setgotopage("tbstsns");
            navigate("/trainsbetweenstations", { gotopage });
          }}
        >
          Trains between Stations
        </button>

        <button
          className={`tschedule ${buttonClassName2} navbuttons`}
          onClick={() => {
            setgotopage("tschedule");
            navigate("/trainschedule", { gotopage });
          }}
        >
          Train's Schedule
        </button>

        <div
          className="id "
          onClick={() => {
            signOut(auth)
              .then(() => {
                navigate("/");
              })
              .catch((Error) => console.log(Error));
          }}
        >
          <Logout id="logouticon" fontSize="medium" /> <span id="logouttxt">LOG OUT</span>
        </div>
      </div>
    </>
  );
}
