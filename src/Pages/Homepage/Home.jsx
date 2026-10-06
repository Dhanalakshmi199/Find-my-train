import React, { useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
export default function Home() {
  const [curpage, setcurpage] = useState(null);
  const navigate = useNavigate();
  return (
    <>
      <div className="container">
        <div className="middle">
          <div className="btn">
            <button
              type="button"
              className="b"
              onClick={() => {
                setcurpage("track");
                navigate("/livelocation", { curpage });
              }}
            >
              View Train's Location
            </button>
            <button
              type="button"
              className="b"
              onClick={() => {
                setcurpage("tbstsns");
                navigate("/trainsbetweenstations", { curpage });
              }}
            >
              View Trains Between Stations
            </button>
            <button
              type="button"
              className="b"
              onClick={() => {
                setcurpage("tschedule");
                navigate("/trainschedule", { curpage });
              }}
            >
              View Train's Schedule
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
