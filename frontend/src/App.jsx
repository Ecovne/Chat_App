import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";

import "./App.scss";
import { Routes, Route, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveuser } from "./redux/authSlice";
import axios from "axios";
import { addmessage } from "./redux/chatSlice";
import recivenotification from "./asst/recive.mp3";
const { io } = require("socket.io-client");
export const socket = io(process.env.REACT_APP_BASEURL); //process.env.REACT_APP_BASEURL
const Search = lazy(() => import("./pages/search/Search"));
const Latyout = lazy(() => import("./pages/Latyout"));
const Login = lazy(() => import("./pages/loginpage/Login"));
function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [opensearch, setopensearch] = useState(false);
  const usetstate = useSelector((state) => state.authSlice);

  const searchref = useRef(null);
  useEffect(() => {
    if (opensearch) {
      document.querySelector(".home").addEventListener("click", function (e) {
        if (e.target !== searchref.current) {
          setopensearch((pre) => false);
        }
      });
    }
  }, [opensearch]);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      axios
        .post(`${process.env.REACT_APP_BASEURL}/login/google/success`, {
          token: localStorage.getItem("token"),
        })
        .then((res) => {
          dispatch(saveuser(res.data));
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, []);

  useEffect(() => {
    socket.on("send back message", (data) => {
      const music = new Audio(recivenotification);
      music.play();
      dispatch(addmessage(data));
    });
  }, [socket]);

  return (
    <div className="App">
      <AnimatePresence exitBeforeEnter>
        <Routes key={location.pathname} location={location}>
          <Route
            path="/"
            element={
              <Suspense fallback={""}>
                <Latyout
                  opensearch={opensearch}
                  setopensearch={setopensearch}
                />
              </Suspense>
            }
          />
          <Route
            path="/login"
            element={
              <Suspense fallback={""}>
                <Login />
              </Suspense>
            }
          />
          <Route path="/*" element={<p>page not found</p>} />
        </Routes>
      </AnimatePresence>
      <Suspense fallback={""}>
        <Search
          opensearch={opensearch}
          setopensearch={setopensearch}
          searchref={searchref}
        />
      </Suspense>
    </div>
  );
}

export default App;
