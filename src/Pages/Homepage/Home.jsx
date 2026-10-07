import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
export default function Home() {
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
                navigate("/livelocation");
              }}
            >
              View Train's Location
            </button>
            <button
              type="button"
              className="b"
              onClick={() => {
                navigate("/trainsbetweenstations");
              }}
            >
              View Trains Between Stations
            </button>
            <button
              type="button"
              className="b"
              onClick={() => {
                navigate("/trainschedule");
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
