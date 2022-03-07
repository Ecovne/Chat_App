import axios from "axios";
import React, { useEffect } from "react";
import { GoogleLogin } from "react-google-login";
import { useDispatch, useSelector } from "react-redux";
import { saveuser } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import chatimage from "../../asst//chat_logo.png";
import { motion } from "framer-motion";

import "./login.scss";
import { chatavialable } from "../../redux/chatSlice";
const animation = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0.2, x: -200 },
};
function Login() {
  console.log();
  const state = useSelector((state) => state.authSlice.user);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const responseGoogle = (res) => {
    axios
      .post(`${process.env.REACT_APP_BASEURL}/login/google`, {
        tokenId: res.tokenId,
        googleId: res.googleId,
      })
      .then((res) => {
        dispatch(saveuser(res.data));
        dispatch(chatavialable());

        navigate("/", { replace: true });
        localStorage.setItem("token", res.data.token);
      })
      .catch((e) => {
        console.log(e.response);
      });
  };
  const responseFaile = (response) => {
    console.log(response);
  };
  useEffect(() => {
    if (Object.keys(state).length > 0) {
      navigate("/", { replace: true });
    }
  }, [state]);

  return (
    <motion.div
      className="login"
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      variants={animation}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <div className="title">
        <div className="img">
          <img src={chatimage} alt="chat image" />
        </div>
      </div>
      <div className="btngoogle">
        <GoogleLogin
          clientId={process.env.REACT_APP_CLIEND_ID}
          buttonText="Login With Google"
          onSuccess={responseGoogle}
          onFailure={responseFaile}
          cookiePolicy={"single_host_origin"}
          prompt="select_account"
        />
      </div>
    </motion.div>
  );
}

export default Login;
