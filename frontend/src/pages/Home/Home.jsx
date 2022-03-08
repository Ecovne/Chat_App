import React, { useEffect, useRef, useState } from "react";
import logo from "../../asst/default-person.png";

import { AiOutlineSend } from "react-icons/ai";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import "./home.scss";
import notification from "../../asst/notification_sound.mp3";
import { chatavialable, openChat, sendMessage } from "../../redux/chatSlice";
import { socket } from "../../App";

const Home = () => {
  const scrollRef = useRef(null);
  const [textvalue, settextvalue] = useState("");
  const state = useSelector((state) => state.chatSlice);
  const usetstate = useSelector((state) => state.authSlice);
  const dispatch = useDispatch();
  const [openchat, setopenchat] = useState(false);
  const messageSend = (e) => {
    e.preventDefault();

    dispatch(
      sendMessage({
        userid: usetstate.user._id,
        roomid: state.chatId,
        messcontent: textvalue,
      })
    );
    settextvalue("");
    setTimeout(() => {
      scrollRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }, 400);
    const music = new Audio(notification);
    music.play();
  };

  const getchatuser = (chat) => {
    if (chat.userinroom[0]._id == chat.userinroom[1]._id) {
      let chatuser1 = chat.userinroom[0];

      return (
        <div
          className="item"
          key={chat._id}
          onClick={() => opepchat(chatuser1, chat._id)}
        >
          <div className="img">
            <img
              src={chatuser1.image}
              alt="person image"
              onError={(e) => {
                e.target.src = logo;
              }}
            />
          </div>
          <div className="name">
            <p>{chatuser1.name}</p>
            <p>{chatuser1.email}</p>
          </div>
        </div>
      );
    } else {
      let chatuser = chat.userinroom.find(
        (it) => it._id !== usetstate.user._id
      );
      return (
        <div
          className="item"
          key={chat._id}
          onClick={() => {
            socket.emit("leave room", state.chatId);
            opepchat(chatuser, chat._id);
          }}
        >
          <div className="img">
            <img
              src={chatuser.image}
              alt="person image1"
              onError={(e) => {
                e.target.src = logo;
              }}
            />
          </div>
          <div className="name">
            <p>{chatuser.name}</p>
            <p>{chatuser.email}</p>
          </div>
        </div>
      );
    }
  };

  const opepchat = (chatuser, id) => {
    dispatch(openChat({ chatuser, chatId: id }));
    setopenchat(true);
    setTimeout(() => {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }, 700);
  };
  useEffect(() => {
    if (Object.keys(usetstate.user).length > 0) {
      dispatch(chatavialable());
    }
  }, [Object.keys(usetstate.user).length]);

  // back message from sokiet handle

  return (
    <div className="home">
      <div className="home_container">
        <div className={openchat ? `friend close` : "friend"}>
          <h5>All chats</h5>
          {/* <BiRightArrowAlt onClick={() => setopenchat(true)} /> */}
          <div className="friend_wrap">
            {state.chatAvilable.length > 0 ? (
              state.chatAvilable.map((chat, i) => {
                return getchatuser(chat);
              })
            ) : (
              <p> no chat avilable</p>
            )}
          </div>
        </div>
        <div className={openchat ? `messagechat open` : "messagechat"}>
          <div className="header">
            <IoMdArrowRoundBack
              onClick={() => {
                setopenchat(false);
                socket.emit("leave room", state.chatId);
              }}
            />
            <h6>{state.openChate?.user?.name || "no chat select"}</h6>
          </div>
          <div className="body">
            <div className="wrap">
              {state.openChate.allChats.length > 0 ? (
                state.openChate.allChats.map((it) => {
                  return (
                    <div
                      className={
                        it.messageContent.usersend?._id == usetstate.user._id
                          ? `item me`
                          : "item"
                      }
                      key={it._id}
                    >
                      <div className="img">
                        <img
                          src={it.messageContent.usersend?.image}
                          alt=""
                          onError={(e) => {
                            e.target.src = logo;
                          }}
                        />
                      </div>
                      <p
                        className={
                          it.messageContent.usersend?._id == usetstate.user._id
                            ? `me`
                            : ""
                        }
                      >
                        {it.messageContent?.messageContent}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p>no message yet</p>
              )}
            </div>
            <div className="srcoll" ref={scrollRef}></div>
          </div>

          <div className="footer">
            <form onSubmit={messageSend}>
              <textarea
                placeholder="Message"
                onChange={(e) => settextvalue(e.target.value)}
                value={textvalue}
              />
              <button disabled={textvalue.length > 0 ? false : true}>
                <AiOutlineSend
                  style={{ opacity: textvalue.length > 0 ? "1" : "0.2" }}
                />
              </button>
            </form>
            <div className="emoje">
              <span onClick={() => settextvalue((prev) => prev + "🤣")}>
                🤣
              </span>

              <span onClick={() => settextvalue((prev) => prev + "👍")}>
                👍
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
