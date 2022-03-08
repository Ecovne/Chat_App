import React from "react";
import { BsSearch } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import logo from "../../asst/default-person.png";
import chatlogo from "../../asst//chat_logo.png";
import "./nav.scss";
import { logOut } from "../../redux/authSlice";
import { socket } from "../../App";
function Nav({ opensearch, setopensearch }) {
  const state = useSelector((state) => state.authSlice);
  const chatstate = useSelector((state) => state.chatSlice);
  const dispatch = useDispatch();
  const logout = () => {
    socket.emit("leave room", chatstate.chatId);
    dispatch(logOut());
  };
  return (
    <nav>
      <div className="nav_container">
        <div className="search" onClick={() => setopensearch(!opensearch)}>
          <img src={chatlogo} alt="chat logo" />
          <BsSearch />
        </div>
        <div className="userinfo_logouts">
          <div className="logo">
            <img
              src={state.user?.image}
              alt="Person image"
              onError={(e) => {
                e.target.src = logo;
              }}
            />
          </div>
          <p>{state.user?.name || ""}</p>
          <FiLogOut onClick={logout} />
        </div>
      </div>
    </nav>
  );
}

export default Nav;
