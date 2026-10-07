import SearchIcon from "@mui/icons-material/Search";
import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../Components/Navbar";
import { ArrowRightAlt, ReportProblem } from "@mui/icons-material";
import "./Tschedule.css";
import data from "../../Data/Trains_dict.json";
import data2 from "../../Data/Schedules_dict.json";
import axios from "axios";

export default function Tschedule({ curpage }) {
  const [animation, setAnimation] = useState(false);
  const [issearched, setissearched] = useState(false);
  const [validsearch, setvalidsearch] = useState(false);
  const [trainnumber, settrainnumber] = useState("");
  const [trainscheduleresults, settrainscheduleresults] = useState([]);
  const [trainsugg, settrainsugg] = useState([]);
  const [traindata, settraindata] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const searchTimeoutRef = useRef(null);

  const gettrains = (value) => {
    const searchTerm = value.toUpperCase().trim();
    if (!searchTerm) {
      settrainsugg([]);
      return;
    }
    const localResults = Object.entries(data).filter(([key, obj]) => {
      return (
        key.startsWith(searchTerm) ||
        obj.Train_name.toUpperCase().includes(searchTerm)
      );
    });
    settrainsugg(localResults);

    // Live IRCTC search for all trains across India
    if (searchTerm.length >= 3) {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => {
        axios
          .get("https://irctc1.p.rapidapi.com/api/v1/searchTrain", {
            params: { query: searchTerm },
            headers: {
              "X-RapidAPI-Key":
                "a0519be863msh55563f3caa37a19p13d4c6jsn3b8b75af7ba0",
              "X-RapidAPI-Host": "irctc1.p.rapidapi.com",
            },
          })
          .then((res) => {
            if (res.data && res.data.status && Array.isArray(res.data.data)) {
              const apiResults = res.data.data.map((t) => [
                t.train_number,
                {
                  Train_name: t.train_name || t.eng_train_name || "",
                  From_station: t.src_stn_code || t.src_stn_name || "",
                  To_station: t.dstn_stn_code || t.dstn_stn_name || "",
                  Runs_on: {
                    mon: 1,
                    tue: 1,
                    wed: 1,
                    thu: 1,
                    fri: 1,
                    sat: 1,
                    sun: 1,
                  },
                  Duration: "--",
                  Distance: "--",
                },
              ]);
              settrainsugg((prev) => {
                const seen = new Set(prev.map((item) => item[0]));
                const merged = [...prev];
                apiResults.forEach((item) => {
                  if (!seen.has(item[0])) {
                    seen.add(item[0]);
                    merged.push(item);
                  }
                });
                return merged;
              });
            }
          })
          .catch(() => {});
      }, 300);
    }
  };

  const formatMin = (m) => {
    if (m === undefined || m === null || m < 0) return "--";
    const h = Math.floor(m / 60) % 24;
    const min = m % 60;
    return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
  };

  const getschedule = (targetTrainNo) => {
    const tNo = targetTrainNo || trainnumber;
    if (!tNo) return;
    setLoading(true);
    setError(false);

    // 1. Check local static schedules first
    const localResults = Object.entries(data2).filter(([key]) =>
      key.startsWith(tNo)
    );
    if (localResults.length > 0) {
      settrainscheduleresults(localResults);
      setLoading(false);
      return;
    }

    // 2. Fall back to live IRCTC API schedule for any train in India
    axios
      .get("https://irctc1.p.rapidapi.com/api/v1/getTrainSchedule", {
        params: { trainNo: tNo },
        headers: {
          "X-RapidAPI-Key":
            "a0519be863msh55563f3caa37a19p13d4c6jsn3b8b75af7ba0",
          "X-RapidAPI-Host": "irctc1.p.rapidapi.com",
        },
      })
      .then((res) => {
        setLoading(false);
        if (
          res.data &&
          res.data.status &&
          res.data.data &&
          Array.isArray(res.data.data.route)
        ) {
          const route = res.data.data.route;
          const stoppedStations = route.filter((s) => s.stop);
          const firstStn = stoppedStations[0] || route[0] || {};
          const lastStn =
            stoppedStations[stoppedStations.length - 1] ||
            route[route.length - 1] ||
            {};

          let durationMin =
            (lastStn.sta_min || 0) -
            (firstStn.std_min || 0) +
            ((lastStn.day || 1) - (firstStn.day || 1)) * 24 * 60;
          if (durationMin < 0) durationMin += 24 * 60;
          const dH = Math.floor(durationMin / 60);
          const dM = durationMin % 60;
          const durationStr = `${String(dH).padStart(2, "0")}:${String(
            dM
          ).padStart(2, "0")}`;

          const scheduleObj = {};
          let serial = 1;
          stoppedStations.forEach((s) => {
            scheduleObj[s.station_code] = {
              Serial_No: serial++,
              "Station Name": s.station_name,
              "Arrival Time": serial === 2 ? "--" : formatMin(s.sta_min),
              "Departure Time":
                serial === stoppedStations.length + 1
                  ? "--"
                  : formatMin(s.std_min),
              "Halt Time": s.halt ? String(s.halt) : "--",
              Distance: Math.round(parseFloat(s.distance_from_source) || 0),
              Day: s.day || 1,
            };
          });

          const runDays = res.data.data.runDays || {};
          const trainSummary = {
            Train_name: res.data.data.trainName || "",
            From_station: firstStn.station_name || "",
            To_station: lastStn.station_name || "",
            Runs_on: {
              mon: runDays.mon ? 1 : 0,
              tue: runDays.tue ? 1 : 0,
              wed: runDays.wed ? 1 : 0,
              thu: runDays.thu ? 1 : 0,
              fri: runDays.fri ? 1 : 0,
              sat: runDays.sat ? 1 : 0,
              sun: runDays.sun ? 1 : 0,
            },
            Duration: durationStr,
            Distance: lastStn.distance_from_source
              ? Math.round(parseFloat(lastStn.distance_from_source))
              : "--",
          };

          settrainsugg((prev) => {
            const exists = prev.some((item) => item[0] === tNo);
            if (exists) {
              return prev.map((item) =>
                item[0] === tNo ? [tNo, { ...item[1], ...trainSummary }] : item
              );
            }
            return [[tNo, trainSummary], ...prev];
          });

          settrainscheduleresults([[tNo, scheduleObj]]);
        } else {
          setError(true);
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
        console.error(err);
      });
  };

  const [showModal, setShowModal] = useState(false);
  const myModal = () => {
    return (
      <>
        <div className="repcls">
          <ReportProblem fontSize="medium" className="repicon" />
          <span className="reptext">Invalid Train Data</span>
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

  const selectedTrainSummary = trainsugg.find((item) => item[0] === trainnumber);

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
              {loading && (
                <div style={{ color: "#fff", textAlign: "center", padding: "20px" }}>
                  Loading train schedule...
                </div>
              )}
              {error && !loading && (
                <div style={{ color: "#ff8b8b", textAlign: "center", padding: "20px" }}>
                  Unable to fetch schedule for train {trainnumber}. Please verify the train number.
                </div>
              )}
              {!loading && !error && (
                <div className="tscheduledata">
                  {selectedTrainSummary && (
                    <div className="tschedulerows" key={selectedTrainSummary[0]}>
                      <div className="row row1">
                        Train Number :{" "}
                        <span className="rowt">{selectedTrainSummary[0]}</span>
                      </div>
                      <div className="row row2">
                        Train Name :{" "}
                        <span className="rowt">
                          {selectedTrainSummary[1].Train_name}
                        </span>
                      </div>
                      <div className="row row3">
                        <div className="rowtor">
                          Origin station :
                          <span className=" rowt rowto">
                            {selectedTrainSummary[1].From_station}
                          </span>
                        </div>
                        <div className="rowtde">
                          Destination station :
                          <span className="rowt rowtd">
                            {selectedTrainSummary[1].To_station}
                          </span>
                        </div>
                      </div>
                      <div className="row row4">
                        <div className="row4half1">
                          <div className="runs"> Runs on :</div>
                          <div className="dividerow">
                            <span
                              className={`rowt ${
                                selectedTrainSummary[1].Runs_on?.mon === 1
                                  ? "green"
                                  : "black"
                              }`}
                            >
                              M
                            </span>
                            <span
                              className={`rowt ${
                                selectedTrainSummary[1].Runs_on?.tue === 1
                                  ? "green"
                                  : "black"
                              }`}
                            >
                              T
                            </span>
                            <span
                              className={`rowt ${
                                selectedTrainSummary[1].Runs_on?.wed === 1
                                  ? "green"
                                  : "black"
                              }`}
                            >
                              W
                            </span>
                            <span
                              className={`rowt ${
                                selectedTrainSummary[1].Runs_on?.thu === 1
                                  ? "green"
                                  : "black"
                              }`}
                            >
                              T
                            </span>
                            <span
                              className={`rowt ${
                                selectedTrainSummary[1].Runs_on?.fri === 1
                                  ? "green"
                                  : "black"
                              }`}
                            >
                              F
                            </span>
                            <span
                              className={`rowt ${
                                selectedTrainSummary[1].Runs_on?.sat === 1
                                  ? "green"
                                  : "black"
                              }`}
                            >
                              S
                            </span>
                            <span
                              className={`rowt ${
                                selectedTrainSummary[1].Runs_on?.sun === 1
                                  ? "green"
                                  : "black"
                              }`}
                            >
                              S
                            </span>
                          </div>
                        </div>

                        <div className="row5">
                          Travel duration :
                          <span className="rowt">
                            {selectedTrainSummary[1].Duration}Hrs
                          </span>
                        </div>
                        <div className=" row6">
                          Travel distance :{" "}
                          <span className="rowt">
                            {selectedTrainSummary[1].Distance} KM
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {!loading && !error && trainscheduleresults && trainscheduleresults.length > 0 && (
                <div className="tscheduletable">
                  <table>
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
                    <tbody>
                      {trainscheduleresults.map(([key, obj]) =>
                        Object.entries(obj).map(([stnCode, p]) => (
                          <tr
                            key={p["Serial_No"] || stnCode}
                            className={`whichrow ${
                              p["Serial_No"] % 2 !== 0 ? "oddrow" : "evenrow"
                            }`}
                          >
                            <td>
                              <span className="body body1">
                                {p["Serial_No"]}
                              </span>
                            </td>
                            <td>
                              <span className="body body2">{stnCode} </span>
                            </td>
                            <td>
                              <span className="body body3">
                                {p["Station Name"]}
                              </span>
                            </td>
                            <td>
                              <span className="body body4">
                                {p["Arrival Time"]}
                              </span>
                            </td>
                            <td>
                              <span className="body body5">
                                {p["Departure Time"]}
                              </span>
                            </td>
                            <td>
                              <span className="body body6">
                                {p["Halt Time"]}Mins
                              </span>
                            </td>
                            <td>
                              <span className="body body7">
                                {p["Distance"]}KM
                              </span>
                            </td>
                            <td>
                              <span className="body body8">{p["Day"]}</span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
        <div className={`Tschedulepage ${animation ? "animated12" : ""}`}>
          <div className={`text2 ${animation ? "animated52" : ""}`}>
            Enter Train number or Train name :
          </div>
          <div
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
              className={`trainsubmitbuttontschedule ${
                animation ? "animated42" : ""
              }`}
              type="submit"
              onClick={() => {
                let targetTrain = trainnumber;
                let isValid = validsearch;
                if (!isValid) {
                  const match = traindata.match(/\b\d{5}\b/);
                  if (match) {
                    targetTrain = match[0];
                    settrainnumber(targetTrain);
                    isValid = true;
                    setvalidsearch(true);
                  }
                }
                if (!isValid) {
                  setShowModal(true);
                  return;
                }
                setAnimation(true);
                setissearched(true);
                getschedule(targetTrain);
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