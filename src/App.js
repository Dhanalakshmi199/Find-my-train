import "./App.css";
import Home from "./Pages/Homepage/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Track from "./Pages/Trackpage/Track";
import Tbstns from "./Pages/Tbstationpage/Tbstns";
import Tschedule from "./Pages/Tschedulepage/Tschedule";
import Login from "./Pages/Loginpage/Login";
import Register from "./Pages/Registerpage/Register";

function App() {
  return (
    <>
      <div className="routes">
        <BrowserRouter>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/livelocation" element={<Track />} />
            <Route path="/trainsbetweenstations" element={<Tbstns />} />
            <Route path="/trainschedule" element={<Tschedule />} />
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </div>
 
    </>
  );
}
export default App;
