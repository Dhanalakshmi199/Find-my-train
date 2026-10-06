import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import "./Tbstns.css";
import data from "../../Data/Stations_dict.json";
import data2 from "../../Data/Schedules_dict.json";
import data3 from "../../Data/Trains_dict.json";
import { AccessTime, SwapHoriz } from "@mui/icons-material";
import SwapVert from "@mui/icons-material/SwapVert";
import SearchIcon from "@mui/icons-material/Search";
import { ReportProblem } from "@mui/icons-material";

export default function Tbstns({ curpage }) {
  const [issearched, setissearched] = useState(false);
  const [pallete, setpallette] = useState(1);
  const [validfromsearch, setvalidfromsearch] = useState(false);
  const [validtosearch, setvalidtosearch] = useState(false);
  const [fromsugg, setfromsugg] = useState([]);
  const [tosugg, settosugg] = useState([]);
  const [from, setfrom] = useState("");
  const [to, setto] = useState("");
  const [fromcode, setfromcode] = useState("");
  const [tocode, settocode] = useState("");
  const [animation, setAnimation] = useState(false);
  const [resulttrains, setresulttrains] = useState([]);
  const Handleonclick = () => {
    const temp = from;
    const temp2 = fromcode;
    const temp3 = tocode;
    setfrom(to);
    setto(temp);
    setfromcode(tocode);
    settocode(temp2);
    getfromstations(temp3, true);
    gettostations(temp2, true);
  };
  const getfromstations = (value, t) => {
    if (t) {
      const results = Object.entries(data).filter(([key, obj]) => {
        return value.toUpperCase() && key === value.toUpperCase();
      });
      setfromsugg(results);
    } else {
      const results = Object.entries(data).filter(([key, obj]) => {
        return (
          value.toUpperCase() &&
          (key.startsWith(value.toUpperCase()) ||
            obj.Station_name.startsWith(value.toUpperCase()))
        );
      });
      setfromsugg(results);
    }
  };
  const gettostations = (value, t) => {
    if (t) {
      const results = Object.entries(data).filter(([key, obj]) => {
        return value.toUpperCase() && key === value.toUpperCase();
      });
      settosugg(results);
    } else {
      const results = Object.entries(data).filter(([key, obj]) => {
        return (
          value.toUpperCase() &&
          (key.startsWith(value.toUpperCase()) ||
            obj.Station_name.startsWith(value.toUpperCase()))
        );
      });
      settosugg(results);
    }
  };
  const getcommontrains = () => {
    const results = [];
    fromsugg.map((item) =>
      Object.values(item[1]["Trains"]).forEach((t) => {
        // console.log(t)
        tosugg.map((tm) =>
          Object.values(tm[1]["Trains"]).forEach((tmp) => {
            if (tmp === t) results.push(t);
          })
        );
      })
    );
    setresulttrains(results);
  };
  const gettime = (tstime, fstime, fsday, tsday) => {
    const fstarr = fstime.split(":");
    const tstarr = tstime.split(":");
    const temp1 = 60 * fstarr[0] + fstarr[1];
    const temp2 = 60 * tstarr[0] + tstarr[1];
    var diffInMinutes = temp2 - temp1;
    diffInMinutes += (tsday - fsday) * 24 * 6000;
    const hours = Math.floor(diffInMinutes / 6000);
    const minutes = diffInMinutes % 60;
    return (
      (hours < 10 ? "0" + hours : hours) +
      ":" +
      (minutes < 10 ? "0" + minutes : minutes) +
      "Hrs"
    );
  };
  const getdays = (runson, fsdayno) => {
    var ondays = { M: 0, T: 0, W: 0, THU: 0, F: 0, S: 0, SUN: 0 };
    if (runson["mon"] === 1) {
      if (fsdayno === 1) ondays.M = 1;
      if (fsdayno === 2) ondays.T = 1;
      if (fsdayno === 3) ondays.W = 1;
      if (fsdayno === 4) ondays.THU = 1;
      if (fsdayno === 5) ondays.F = 1;
    }
    if (runson["tue"] === 1) {
      if (fsdayno === 1) ondays.T = 1;
      if (fsdayno === 2) ondays.W = 1;
      if (fsdayno === 3) ondays.THU = 1;
      if (fsdayno === 4) ondays.F = 1;
      if (fsdayno === 5) ondays.S = 1;
    }
    if (runson["wed"] === 1) {
      if (fsdayno === 1) ondays.W = 1;
      if (fsdayno === 2) ondays.THU = 1;
      if (fsdayno === 3) ondays.F = 1;
      if (fsdayno === 4) ondays.S = 1;
      if (fsdayno === 5) ondays.SUN = 1;
    }
    if (runson["thu"] === 1) {
      if (fsdayno === 1) ondays.THU = 1;
      if (fsdayno === 2) ondays.F = 1;
      if (fsdayno === 3) ondays.S = 1;
      if (fsdayno === 4) ondays.SUN = 1;
      if (fsdayno === 5) ondays.M = 1;
    }
    if (runson["fri"] === 1) {
      if (fsdayno === 1) ondays.F = 1;
      if (fsdayno === 2) ondays.S = 1;
      if (fsdayno === 3) ondays.SUN = 1;
      if (fsdayno === 4) ondays.M = 1;
      if (fsdayno === 5) ondays.T = 1;
    }
    if (runson["sat"] === 1) {
      if (fsdayno === 1) ondays.S = 1;
      if (fsdayno === 2) ondays.SUN = 1;
      if (fsdayno === 3) ondays.M = 1;
      if (fsdayno === 4) ondays.T = 1;
      if (fsdayno === 5) ondays.W = 1;
    }
    if (runson["sun"] === 1) {
      if (fsdayno === 1) ondays.SUN = 1;
      if (fsdayno === 2) ondays.M = 1;
      if (fsdayno === 3) ondays.T = 1;
      if (fsdayno === 4) ondays.W = 1;
      if (fsdayno === 5) ondays.THU = 1;
    }
    return (
      <div className="">
        <span
          className={`tbstnsdays ${ondays.M === 1 ? "greentbs" : "blacktbs"}`}
        >
          M
        </span>
        <span
          className={`tbstnsdays ${ondays.T === 1 ? "greentbs" : "blacktbs"}`}
        >
          T
        </span>
        <span
          className={`tbstnsdays ${ondays.W === 1 ? "greentbs" : "blacktbs"}`}
        >
          W
        </span>
        <span
          className={`tbstnsdays ${ondays.THU === 1 ? "greentbs" : "blacktbs"}`}
        >
          T
        </span>
        <span
          className={`tbstnsdays ${ondays.F === 1 ? "greentbs" : "blacktbs"}`}
        >
          F
        </span>
        <span
          className={`tbstnsdays ${ondays.S === 1 ? "greentbs" : "blacktbs"}`}
        >
          S
        </span>
        <span
          className={`tbstnsdays ${ondays.SUN === 1 ? "greentbs" : "blacktbs"}`}
        >
          S
        </span>
      </div>
    );
  };

  const [showModal, setShowModal] = useState(false);
  const myModal = () => {
    return (
      <>
        <div className="repcls">
          <ReportProblem fontSize="medium" className="repicon" />
          <span className="reptext">Invalid Station Data</span>
        </div>
      </>
    );
  };

  useEffect(() => {
    if (showModal) {
      const timeoutId = setTimeout(() => {
        setShowModal(false);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [showModal]);
  return (
    <>
      <Navbar curpage={curpage} />
      <div
        className={` mid1 ${
          issearched ? " animatedmid13" : animation ? "animatedmid12" : ""
        }`}
      >
        <div>
          {animation && !issearched && (
            <div className="inactivetxtbtw">
              <p>Enter Valid Input and </p>
              <p>Click on Search button</p>
            </div>
          )}
        </div>
        <div className={`anipage ${animation ? "animated83" : ""}`}>
          {issearched &&
            validfromsearch &&
            validtosearch &&
            tosugg &&
            tosugg.length > 0 &&
            fromsugg &&
            fromsugg.length > 0 && (
              <div
                className={`tbstnsdata ${animation ? "animated833tbstns" : ""}`}
              >
                <div className="clock">
                  <span className="clock1">{from}</span>
                  <span className="clock2">
                    <AccessTime />
                  </span>
                  <span className="clock3">{to}</span>
                </div>
                {resulttrains.length === 0 && (
                  <div className="notfound">
                    <span className="">NO TRAINS FOUND!</span>
                  </div>
                )}
                {resulttrains && resulttrains.length > 0 && (
                  <div className="tbstnsrows">
                    {resulttrains.map((t) => {
                      return (
                        <>
                          {data2[t][fromcode]["Serial_No"] <=
                            data2[t][tocode]["Serial_No"] && (
                            <div className="tbstnseachrow">
                              <div className="tbstnsrow1">
                                {t} - {data3[t]["Train_name"]}
                              </div>
                              <div className="tbstnsrow2">
                                <div className="tbstnsrow21">
                                  <div className="tbstnsrow211">
                                    {data2[t][fromcode]["Arrival Time"] === "--"
                                      ? data2[t][fromcode]["Departure Time"]
                                      : data2[t][fromcode]["Arrival Time"]}
                                  </div>
                                  <div className="tbstnsrow212">
                                    {gettime(
                                      data2[t][tocode]["Arrival Time"] === "--"
                                        ? data2[t][tocode]["Departure Time"]
                                        : data2[t][tocode]["Arrival Time"],
                                      data2[t][fromcode]["Arrival Time"] ===
                                        "--"
                                        ? data2[t][fromcode]["Departure Time"]
                                        : data2[t][fromcode]["Arrival Time"],
                                      data2[t][fromcode]["Day"],
                                      data2[t][tocode]["Day"]
                                    )}
                                  </div>
                                  <div className="tbstnsrow213">
                                    {data2[t][tocode]["Arrival Time"] === "--"
                                      ? data2[t][tocode]["Departure Time"]
                                      : data2[t][tocode]["Arrival Time"]}
                                  </div>
                                </div>
                                <div className="tbstnsrow22">
                                  {getdays(
                                    data3[t]["Runs_on"],
                                    data2[t][fromcode]["Day"]
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
        </div>
        <div className={`Tbstnspage ${animation ? "animated13" : ""}`}>
          <div className={`text3 ${animation ? "animated53" : ""}`}>
            Enter Starting Station :
          </div>
          <div className={`tbstnsform ${animation ? "animated23" : ""}`}>
            <div className="stc1">
              <div className={`tbs1`}>
                <input
                  className={`fromstationcode ${
                    animation ? "animated63f" : ""
                  }`}
                  type="search"
                  placeholder="Station Code/Name"
                  // id={`fromstationcode ${animation ? "animated63" : ""}`}
                  value={from}
                  autoComplete="off"
                  // onClick={setpallette(1)}
                  onChange={(event) => {
                    setissearched(false);
                    setvalidfromsearch(false);
                    setfrom(event.target.value);
                    setpallette(1);
                    getfromstations(event.target.value, false);
                  }}
                />
              </div>
              <div className={`pal1 ${animation ? "animatedpal1" : ""}`}>
                {!validfromsearch &&
                  pallete === 1 &&
                  fromsugg &&
                  fromsugg.length > 0 &&
                  fromsugg.map((item) => (
                    <div
                      onClick={() => {
                        setvalidfromsearch(true);
                        setfrom(item[0] + "-" + item[1].Station_name);
                        setfromcode(item[0]);
                        getfromstations(item[0], true);
                      }}
                      className="frompalette"
                      key={item[0]}
                    >
                      {item[0]}-{item[1].Station_name}
                    </div>
                  ))}
              </div>
            </div>

            <button
              className={`swapvertbutton ${animation ? "animated73" : ""}`}
              type="submit"
              onClick={Handleonclick}
            >
              {!animation ? (
                <SwapVert id="swapverticon" />
              ) : (
                <SwapHoriz id="swaphorizicon" />
              )}
            </button>

            <div className={`text3 ${animation ? "animated53" : ""}`}>
              Enter Destination Station:
            </div>
            <div className="stc1">
              <div className="tbs2">
                <input
                  className={`tostationcode ${animation ? "animated63t" : ""}`}
                  type="search"
                  placeholder="Station Code/Name"
                  //id="tostationcode"
                  value={to}
                  autoComplete="off"
                  // onClick={setpallette(2)}
                  onChange={(event) => {
                    setShowModal(false);
                    setissearched(false);
                    setvalidtosearch(false);
                    setto(event.target.value);
                    setpallette(2);
                    gettostations(event.target.value, false);
                  }}
                />
              </div>

              <div className={`pal2 ${animation ? "animatedpal2" : ""}`}>
                {!validtosearch &&
                  pallete === 2 &&
                  tosugg &&
                  tosugg.length > 0 &&
                  tosugg.map((item) => (
                    <div
                      onClick={() => {
                        setvalidtosearch(true);
                        setto(item[0] + "-" + item[1].Station_name);
                        settocode(item[0]);
                        gettostations(item[0], true);
                      }}
                      className="topalette"
                      key={item[0]}
                    >
                      {item[0]}-{item[1].Station_name}
                    </div>
                  ))}
              </div>
            </div>

            <button
              className={`searchbutton1 ${animation ? "animated43" : ""}`}
              type="submit"
              onClick={() => {
                !(validfromsearch && validtosearch) && setShowModal(true);
                validfromsearch && validtosearch && setAnimation(true);
                validfromsearch && validtosearch && setissearched(true);
                getcommontrains();
              }}
            >
              <SearchIcon id="searchicon" />
              Search
            </button>
            {showModal && <div className="modalbtw">{myModal()}</div>}
          </div>
        </div>
      </div>
    </>
  );
}
