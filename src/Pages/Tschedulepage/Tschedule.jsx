import SearchIcon from "@mui/icons-material/Search";
import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import { ArrowRightAlt, ReportProblem } from "@mui/icons-material";
import "./Tschedule.css";
import data from "../../Data/Trains_dict.json";
import data2 from "../../Data/Schedules_dict.json";

export default function Track({ curpage }) {
  const [animation, setAnimation] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    // perform search logic here
  }
  const [issearched, setissearched] = useState(false);
  const [validsearch, setvalidsearch] = useState(false);
  const [trainnumber, settrainnumber] = useState("");
  const [treainscheduleresults, settreainscheduleresults] = useState([]);
  const [trainsugg, settrainsugg] = useState([]);
  const [traindata, settraindata] = useState("");
  const gettrains = (value) => {
    const searchTerm = value.toUpperCase();
    const results = Object.entries(data).filter(([key, obj]) => {
      return (
        searchTerm &&
        (key.startsWith(searchTerm) || obj.Train_name.startsWith(searchTerm))
      );
    });
    settrainsugg(results);
  };

  const getschedule = () => {
    const results = Object.entries(data2).filter(
      ([key, obj]) => trainnumber && key.startsWith(trainnumber)
    );
    settreainscheduleresults(results);
  };

  const [showModal, setShowModal] = useState(false);
  const myModal = () => {
    return (
      <>
        <div className="repcls">
          <ReportProblem fontSize="medium" className="repicon" />
          <span  className="reptext">Invalid Train Data</span>
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
        className={` mid2 ${
          issearched ? " animatedmid3" : animation ? "animatedmid2" : ""
        }`}
      >
        <div>
          {animation && !issearched && (
            <div className="inactivetxt">
              <p>Enter Valid Input and </p>
              <p>Click on Search button</p>
            </div>
          )}
        </div>
        {issearched && (
          <div className={`anipage3 ${animation ? "animated831" : ""}`}>
            <div className={`tscheduletdata ${animation ? "animated833" : ""}`}>
              <div className="tscheduledata">
                {issearched &&
                  validsearch &&
                  treainscheduleresults &&
                  trainsugg.map((item) => (
                    <div className="tschedulerows">
                      <div className="row row1">
                        Train Number : <span className="rowt">{item[0]}</span>
                      </div>
                      <div className="row row2">
                        Train Name :{" "}
                        <span className="rowt">{item[1].Train_name}</span>
                      </div>
                      <div className="row row3">
                        <div className="rowtor">
                          Origin station :
                          <span className=" rowt rowto">
                            {item[1].From_station}
                          </span>
                        </div>
                        <div className="rowtde">
                          Destination station :
                          <span className="rowt rowtd">
                            {item[1].To_station}
                          </span>
                        </div>
                      </div>
                      <div className="row row4">
                        <div className="row4half1">
                          <div className="runs"> Runs on :</div>
                          <div className="dividerow">
                            <span
                              className={`rowt ${
                                item[1].Runs_on.mon === 1 ? "green" : "black"
                              }`}
                            >
                              M
                            </span>
                            <span
                              className={`rowt ${
                                item[1].Runs_on.tue === 1 ? "green" : "black"
                              }`}
                            >
                              T
                            </span>
                            <span
                              className={`rowt ${
                                item[1].Runs_on.wed === 1 ? "green" : "black"
                              }`}
                            >
                              W
                            </span>
                            <span
                              className={`rowt ${
                                item[1].Runs_on.thu === 1 ? "green" : "black"
                              }`}
                            >
                              T
                            </span>
                            <span
                              className={`rowt ${
                                item[1].Runs_on.fri === 1 ? "green" : "black"
                              }`}
                            >
                              F
                            </span>
                            <span
                              className={`rowt ${
                                item[1].Runs_on.sat === 1 ? "green" : "black"
                              }`}
                            >
                              S
                            </span>
                            <span
                              className={`rowt ${
                                item[1].Runs_on.sun === 1 ? "green" : "black"
                              }`}
                            >
                              S
                            </span>
                          </div>
                        </div>

                        <div className="row5">
                          Travel duration :
                          <span className="rowt">{item[1].Duration}Hrs</span>
                        </div>
                        <div className=" row6">
                          Travel distance :{" "}
                          <span className="rowt">{item[1].Distance} KM</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="tscheduletable">
                <table>
                  {issearched && (
                    <thead>
                      <tr>
                        <th>
                          <span className=" heading tssn">S.No</span>
                        </th>
                        <th>
                          <span className=" heading tssc">Station Code</span>
                        </th>
                        <th>
                          <span className="heading tssname">Station Name</span>
                        </th>
                        <th>
                          <span className="heading tsat">Arrival Time</span>
                        </th>
                        <th>
                          <span className="heading tsdt">Departure Time</span>
                        </th>
                        <th>
                          <span className="heading tsht">Halt Time</span>
                        </th>
                        <th>
                          <span className="heading tsdc">Distance Covered</span>
                        </th>
                        <th>
                          <span className="heading tsd">Day</span>
                        </th>
                      </tr>
                    </thead>
                  )}
                  {issearched &&
                    validsearch &&
                    treainscheduleresults &&
                    treainscheduleresults.map(([key, obj]) =>
                      Object.entries(obj).map((p) => (
                        <tbody>
                          <tr
                            className={`whichrow ${
                              p[1]["Serial_No"] % 2 !== 0 ? "oddrow" : "evenrow"
                            }`}
                          >
                            <td>
                              {" "}
                              <span className="body body1">
                                {p[1]["Serial_No"]}
                              </span>
                            </td>
                            <td>
                              {" "}
                              <span className="body body2">{p[0]} </span>
                            </td>
                            <td>
                              {" "}
                              <span className="body body3">
                                {p[1]["Station Name"]}
                              </span>
                            </td>
                            <td>
                              {" "}
                              <span className="body body4">
                                {p[1]["Arrival Time"]}
                              </span>
                            </td>
                            <td>
                              {" "}
                              <span className="body body5">
                                {p[1]["Departure Time"]}
                              </span>
                            </td>
                            <td>
                              {" "}
                              <span className="body body6">
                                {p[1]["Halt Time"]}Mins
                              </span>
                            </td>
                            <td>
                              {" "}
                              <span className="body body7">
                                {p[1]["Distance"]}KM
                              </span>
                            </td>
                            <td>
                              {" "}
                              <span className="body body8">{p[1]["Day"]}</span>
                            </td>
                          </tr>
                        </tbody>
                      ))
                    )}
                </table>
              </div>
            </div>
          </div>
        )}
        <div
          onSubmit={handleSubmit}
          className={`Tschedulepage ${animation ? "animated12" : ""}`}
        >
          <div
            onSubmit={handleSubmit}
            className={`text2 ${animation ? "animated52" : ""}`}
          >
            Enter Train number or Train name :
          </div>
          <div
            onSubmit={handleSubmit}
            className={`tscheduleform ${animation ? "animated22" : ""}`}
            role="search"
            autoComplete="off"
          >
            <div className="stc">
              <div className="tssearchbar">
                <input
                  className="Tscheduleclass"
                  type="search"
                  autoComplete="off"
                  value={traindata}
                  onChange={(e) => {
                    setShowModal(false);
                    setissearched(false);
                    setvalidsearch(false);
                    settraindata(e.target.value);
                    gettrains(e.target.value);
                  }}
                  placeholder="Train No/Name"
                  id="trainnoforschedule"
                />
              </div>
              <div className="tschedulepallette">
                {!validsearch &&
                  trainsugg &&
                  trainsugg.length > 0 &&
                  trainsugg.map((item) => (
                    <div
                      onClick={() => {
                        setvalidsearch(true);
                        settrainnumber(item[0]);
                        gettrains(item[0]);
                        settraindata(item[0] + "-" + item[1].Train_name);
                      }}
                      className="searchpalette1"
                      key={item[0]}
                    >
                      <div className="tspaletteone">
                        {item[0]} - {item[1].Train_name}
                      </div>

                      <div className="tspalettetwo">
                        <span>{item[1].From_station}</span>
                        <ArrowRightAlt />
                        <span>{item[1].To_station}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <button
              onSubmit={handleSubmit}
              className={`trainsubmitbuttontschedule ${
                animation ? "animated42" : ""
              }`}
              type="submit"
              onClick={() => {
                !validsearch && setShowModal(true);
                validsearch && setAnimation(true);
                validsearch && getschedule();
                validsearch && setissearched(true);
              }}
            >
              <SearchIcon id="searchicon1" />
              Search
            </button>
            {showModal && <div className="modal">{myModal()}</div>}
          </div>
        </div>
      </div>
    </>
  );
}