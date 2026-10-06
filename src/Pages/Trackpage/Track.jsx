import SearchIcon from "@mui/icons-material/Search";
import React, { useState, useRef, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import "./Track.css";
import data from "../../Data/Trains_dict.json";
import { ArrowRightAlt, ReportProblem } from "@mui/icons-material";
// import ds from "../../Data2/run.json";
import VoiceChatIcon from "@mui/icons-material/VoiceChat";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
// import { useInView } from "react-intersection-observer";
import { useSpeechSynthesis } from "../../hooks/useSpeechSynthesis";
import axios from "axios";

export default function Track({ curpage }) {
  const [animation, setAnimation] = useState(false);
  function handleSubmit(event) {
    event.preventDefault();
  }
  const dotRef = useRef(null);
  const handleButtonClick = () => {
    if (dotRef.current) {
      const dotRect = dotRef.current.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const targetY = dotRect.top + scrollTop - window.innerHeight / 2;
      window.scrollTo({
        top: targetY,
        behavior: "smooth",
      });
    }
  };

  const getlivetraindata = (event) => {
    event.preventDefault();
      const options = {
        method: "GET",
        url: "https://irctc1.p.rapidapi.com/api/v1/liveTrainStatus",
        params: { trainNo: trainnumber, startDay: travelday },
        headers: {
          "X-RapidAPI-Key":
            "a0519be863msh55563f3caa37a19p13d4c6jsn3b8b75af7ba0",
          "X-RapidAPI-Host": "irctc1.p.rapidapi.com",
        },
      };
      axios
        .request(options)
        .then(function (response) {
          console.log(response.data);
          setds(response.data);
        })
        .catch(function (error) {
          seterror(true);
          console.error(error);
        });
  };
  const [refresh, setrefresh] = useState(false);
  const [ds,setds]=useState({});
  const [error, seterror] = useState(false);
  const [validsearch, setvalidsearch] = useState(false);
  const [trainsugg, settrainsugg] = useState([]);
  const [traindata, settraindata] = useState("");
  const [trainnumber, settrainnumber] = useState("");
  const [issearched, setissearched] = useState(false);
  const [travelday, settravelday] = useState(0);
  const [stpno, setstpno] = useState(0);
  const [wantspal, setwantspal] = useState(false);
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

  const handleSelectChange = (event) => {
    setissearched(false);
    setrefresh(false);
    settravelday(Number(event.target.value));
    // console.log("Selected value:", event.target.value);
  };

  // const [ref, inView] = useInView();
  const [icon, setIcon] = useState(<ArrowDownwardIcon className="down" />);
const handleScroll = () => {
  if (dotRef.current) {
    const dotRect = dotRef.current.getBoundingClientRect();
    const viewportMidpoint = window.innerHeight / 2;
    const dotMidpoint = dotRect.top + dotRect.height / 2;
    const distanceFromViewportMidpoint = Math.abs(
      viewportMidpoint - dotMidpoint
    );

    if (distanceFromViewportMidpoint < 50) {
      refresh !== true && setrefresh(true);
      setIcon(<RefreshIcon className="refresh" />);
    } else if (dotMidpoint < viewportMidpoint) {
      refresh !== false && setrefresh(false);
      setIcon(<ArrowUpwardIcon className="up" />);
    } else {
      refresh !== false && setrefresh(false);
      setIcon(<ArrowDownwardIcon className="down" />);
    }
  }
};

window.addEventListener("scroll", handleScroll);

  const { speak } = useSpeechSynthesis();
  const handlevoiceButtonClick = () => {
    const delayMessages = ds.data.current_location_info
      .filter((info) => info.type === 1)
      .map((info) => `${info.readable_message} with a  ${info.hint} `);

    const delayMessage = delayMessages.join(", ");

    speak(
      new SpeechSynthesisUtterance(
        `${ds.data.seo_train_name} has ${delayMessage}`.replace(
          /m\b/g,
          "minutes"
        )
      )
    );
  };

  return (
    <>
      <Navbar curpage={curpage} />
      <div
        className={` mid ${
          issearched ? " animatedmid31" : animation ? "animatedmid21" : ""
        }`}
      >
        <div>
          {animation && !issearched && (
            <div className="inactivetxttrack">
              <p>Enter Valid Input and </p>
              <p>Click on Search button</p>
            </div>
          )}
        </div>
        <div className={`anipage2 ${animation ? "animated8311" : ""}`}>
          <div className={`trackdata ${animation ? "animated8331" : ""}`}>
            {issearched && error && (
              <div className="msg">An error occured,please try again later</div>
            )}
            {issearched && !error && (
              <div className="">
                <div className="msg">{ds.status === false && ds.message}</div>
                <div className="msg">
                  {ds.status === true &&
                    ds.data.at_src_dstn === true &&
                    (ds.data.at_src === true
                      ? "The train is not started yet"
                      : "The train has reached it's destination")}
                </div>
                <div className="">
                  {ds.status === true && ds.data.at_src_dstn === false && (
                    <div className="trackdata1">
                      <div className="tracktrainname">
                        {ds.data.train_number} - {ds.data.seo_train_name}
                      </div>
                      <div className="trdata">
                        <div className="vertrow">
                          {ds.data.previous_stations.map((item) => (
                            <div
                              className="trackdata2"
                              onClick={() => {
                                setwantspal(!wantspal);
                                stpno === item.stoppage_number
                                  ? setstpno(0)
                                  : setstpno(item.stoppage_number);
                              }}
                            >
                              <div className="trackdata21">
                                <div className="start">
                                  <div>{item.sta}</div>
                                  <div className="startsec">{item.eta}</div>
                                </div>
                                <div className="v1">
                                  <div className="vert"></div>

                                  <div className="name">
                                    <div className="circle"></div>
                                    <div className="ns1">
                                      <div className="name1">
                                        {item.station_code}-{item.station_name}
                                      </div>{" "}
                                      <div className="name2">
                                        <div className="name21">
                                          {item.distance_from_source} KM
                                        </div>
                                        <div className="name22">
                                          Day:{" "}
                                          <span className="bold">
                                            {item.a_day}
                                          </span>
                                        </div>
                                        <div className="">
                                          Platform:{" "}
                                          <span className="bold">
                                            {item.platform_number}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="end">
                                  <div>{item.std}</div>
                                  <div className="startsec">{item.etd}</div>
                                </div>
                              </div>
                              {wantspal &&
                                item.stoppage_number === stpno &&
                                (ds.data.stoppage_number !== 0 ||
                                  (ds.data.stoppage_number === 0 &&
                                    item.stoppage_number !==
                                      ds.data.previous_stations.length)) && (
                                  <div className="trackdata22">
                                    {Object.entries(item.non_stops).map((a) => (
                                      <div className="td21">
                                        <div className="v3">
                                          <div className="ver3"></div>
                                          <div className="trackcontent">
                                            <div className="circle1"></div>
                                            <div className="tc">
                                              <div className="trackcontent1">
                                                {" "}
                                                {a[1].station_code}-
                                                {a[1].station_name}
                                              </div>
                                              <div className="trackcontent2">
                                                {a[1].distance_from_source} KM
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              {(!wantspal || item.stoppage_number !== stpno) &&
                                (ds.data.stoppage_number !== 0 ||
                                  (ds.data.stoppage_number === 0 &&
                                    item.stoppage_number !==
                                      ds.data.previous_stations.length)) && (
                                  <div className="gap">
                                    <div className="vgap"></div>
                                  </div>
                                )}
                              {ds.data.stoppage_number === 0 &&
                                item.stoppage_number ===
                                  ds.data.previous_stations.length && (
                                  <div className="trackdata22">
                                    {Object.entries(item.non_stops).map((a) => (
                                      <div className="td21">
                                        <div className="v3">
                                          <div className="ver3"></div>
                                          <div className="trackcontent">
                                            <div className="circle1"></div>
                                            <div className="tc">
                                              <div className="trackcontent1">
                                                {" "}
                                                {a[1].station_code}-
                                                {a[1].station_name}
                                              </div>
                                              <div className="trackcontent2">
                                                {a[1].distance_from_source} KM
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>
                        <div className="spot" ref={dotRef}>
                          {ds.data.stoppage_number === 0 && (
                            <div className="tstop">
                              <div className="start1">
                                <div>{ds.data.cur_stn_sta}</div>
                                <div className="startsec">{ds.data.eta}</div>
                              </div>
                              <div className="v">
                                <div className="vert3"></div>
                                <div className="content">
                                  <div className="namestop">
                                    <div className="circle4">
                                      <img
                                        // ref={ref}
                                        src="/assets/loc_logo.png"
                                        alt=""
                                        className="logo1"
                                      />
                                      <div className="message">
                                        {ds.data.current_location_info
                                          .filter((a) => a.type === 1)
                                          .map(
                                            (a) =>
                                              a.readable_message +
                                              " with a " +
                                              a.hint
                                          )}
                                      </div>
                                    </div>
                                    <div className="name211">
                                      <div className="name1s">
                                        {ds.data.current_station_code}-
                                        {ds.data.current_station_name}
                                      </div>
                                      <div className="name2">
                                        {ds.data.distance_from_source} KM
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="end1">
                                <div>{ds.data.cur_stn_std}</div>
                                <div className="startsec">{ds.data.etd}</div>
                              </div>
                            </div>
                          )}
                          {ds.data.stoppage_number !== 0 && (
                            <div className="tnstop">
                              <div className="start12">
                                <div>{ds.data.cur_stn_sta}</div>
                                <div className="startsec">{ds.data.eta}</div>
                              </div>
                              <div className="v">
                                <div className="vert3"></div>
                                <div className="content">
                                  <div className="namenstop">
                                    <div className="circle4">
                                      <img
                                        // ref={ref}
                                        src="/assets/loc_logo.png"
                                        alt=""
                                        className="logo1"
                                      />
                                      <div className="message">
                                        {ds.data.current_location_info
                                          .filter((a) => a.type === 1)
                                          .map(
                                            (a) =>
                                              a.readable_message +
                                              " with a " +
                                              a.hint
                                          )}
                                      </div>
                                    </div>
                                    <div className="name212">
                                      <div className="name1">
                                        {ds.data.current_station_code}-
                                        {ds.data.current_station_name}
                                      </div>
                                      <div className="name2">
                                        <div className="name21">
                                          {" "}
                                          {ds.data.distance_from_source} KM
                                        </div>{" "}
                                        <div className="name22">
                                          Day:{" "}
                                          <span className="bold">
                                            {ds.data.a_day}
                                          </span>
                                        </div>
                                        <div>
                                          {" "}
                                          Platform:{" "}
                                          <span className="bold">
                                            {" "}
                                            {ds.data.platform_number}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="end12">
                                <div>{ds.data.cur_stn_std}</div>
                                <div className="startsec">{ds.data.etd}</div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="">
                          {ds.data.upcoming_stations.map((item) => (
                            <div
                              className="trackdata2"
                              onClick={() => {
                                setwantspal(!wantspal);
                                stpno === item.stoppage_number
                                  ? setstpno(0)
                                  : setstpno(item.stoppage_number);
                              }}
                            >
                              <div className="">
                                {item.si_no === 0 && (
                                  <>
                                    <div className="trackdata22">
                                      {Object.entries(item.non_stops).map(
                                        (a) => (
                                          <div className="td21">
                                            <div className="v3">
                                              <div className="ver3"></div>
                                              <div className="trackcontent">
                                                <div className="circle1"></div>
                                                <div className="tc">
                                                  <div className="trackcontent1">
                                                    {" "}
                                                    {a[1].station_code}-
                                                    {a[1].station_name}
                                                  </div>
                                                  <div className="trackcontent2">
                                                    {a[1].distance_from_source}{" "}
                                                    KM
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </>
                                )}

                                {item.si_no !== 0 && (
                                  <>
                                    <div className="trackdata21">
                                      <div className="start">
                                        <div>{item.sta}</div>
                                        <div className="startsec">
                                          {item.eta}
                                        </div>
                                      </div>
                                      <div className="v1">
                                        <div className="vert"></div>

                                        <div className="name">
                                          <div className="circle"></div>
                                          <div className="ns1">
                                            <div className="name1">
                                              {item.station_code}-
                                              {item.station_name}
                                            </div>{" "}
                                            <div className="name2">
                                              <div className="name21">
                                                {item.distance_from_source} KM
                                              </div>
                                              <div className="name22">
                                                Day:{" "}
                                                <span className="bold">
                                                  {" "}
                                                  {item.a_day}
                                                </span>
                                              </div>
                                              <div className="">
                                                Platform:{" "}
                                                <span className="bold">
                                                  {item.platform_number}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="end">
                                        <div>{item.std}</div>
                                        <div className="startsec">
                                          {item.etd}
                                        </div>
                                      </div>
                                    </div>
                                    {wantspal &&
                                      item.stoppage_number === stpno &&
                                      item.stoppage_number !==
                                        ds.data.upcoming_stations.length && (
                                        <div className="trackdata22">
                                          {Object.entries(item.non_stops).map(
                                            (a) => (
                                              <div className="td21">
                                                <div className="v3">
                                                  <div className="ver3"></div>
                                                  <div className="trackcontent">
                                                    <div className="circle1"></div>
                                                    <div className="tc">
                                                      <div className="trackcontent1">
                                                        {" "}
                                                        {a[1].station_code}-
                                                        {a[1].station_name}
                                                      </div>
                                                      <div className="trackcontent2">
                                                        {
                                                          a[1]
                                                            .distance_from_source
                                                        }{" "}
                                                        KM
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      )}
                                    {(!wantspal ||
                                      item.stoppage_number !== stpno) &&
                                      item.stoppage_number !==
                                        ds.data.upcoming_stations.length && (
                                        <div className="gap">
                                          <div className="vgap"></div>
                                        </div>
                                      )}
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {animation && (
                        <div
                          className={` ${animation ? "additionalicons" : ""}`}
                        >
                          {/* <RefreshIcon className ="refresh" style={{ fontSize: 48 }} /> */}
                          <button
                            className="arrow"
                            onClick={(event) => {
                              validsearch && handleButtonClick();
                              validsearch &&
                                issearched &&
                                refresh &&
                                getlivetraindata(event);
                            }}
                          >
                            {icon}
                          </button>

                          <button
                            className="voice1"
                            onClick={() => {
                              validsearch && handlevoiceButtonClick();
                            }}
                          >
                            <VoiceChatIcon
                              className="voice"
                              style={{ fontSize: 30 }}
                            />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div
          onSubmit={handleSubmit}
          className={`Trackpage ${animation ? "animated1" : ""}`}
        >
          <div
            onSubmit={handleSubmit}
            className={`text1 ${animation ? "animated5" : ""}`}
          >
            Enter Train number or Train name :
          </div>
          <div
            onSubmit={handleSubmit}
            className={`trackform ${animation ? "animated2" : ""}`}
            role="search"
            autocomplete="off"
          >
            <div
              onSubmit={handleSubmit}
              className={`col ${animation ? "animated3" : ""}`}
            >
              <div className="stick">
                <div className="searchbar">
                  <input
                    className="Trainclass"
                    type="search"
                    value={traindata}
                    onChange={(e) => {
                      setShowModal(false);
                      setrefresh(false);
                      setvalidsearch(false);
                      setissearched(false);
                      settraindata(e.target.value);
                      gettrains(e.target.value);
                    }}
                    placeholder="Train No/Name"
                    id="trainno"
                    autoComplete="off"
                  />
                </div>
                <div className="Palette">
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
                        className="searchpalette"
                        key={item[0]}
                      >
                        <div className="paletteone">
                          {item[0]} - {item[1].Train_name}
                        </div>

                        <div className="palettetwo">
                          <span>{item[1].From_station}</span> <ArrowRightAlt />
                          <span>{item[1].To_station}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <select value={travelday} onChange={handleSelectChange}>
                <option value="" disabled hidden>
                  Start Day
                </option>
                <option value="0">Today</option>
                <option value="1">Yesterday</option>
                <option value="2">2 days ago</option>
                <option value="3">3 days ago</option>
              </select>
            </div>
            <button
              onSubmit={handleSubmit}
              className={`trainsubmitbutton ${animation ? "animated4" : ""}`}
              type="submit"
              onClick={(event) => {
                !validsearch && setShowModal(true);
                validsearch && setAnimation(true);
                validsearch && setissearched(true);
                validsearch && handleButtonClick();
                validsearch && seterror(false);
                validsearch && getlivetraindata(event);
                setrefresh(false);
                // console.log(travelday);
              }}
            >
              <SearchIcon id="searchicon" />
              Search
            </button>
            {showModal && <div className="modal">{myModal()}</div>}
          </div>
        </div>
      </div>
    </>
  );
}
