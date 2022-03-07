import React, { useRef } from "react";
import logo from "../../asst/default-person.png";

import { AiFillCloseCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./search.scss";
import { checkroomExist, searchUser } from "../../redux/chatSlice";

const Search = ({ opensearch, setopensearch, searchref }) => {
  const inputref = useRef(null);
  const state = useSelector((state) => state.chatSlice);
  const dispatch = useDispatch();
  const skelloadin = [1, 2, 1, 1, 1, 1, 1];
  const handlesearch = (e) => {
    e.preventDefault();
    dispatch(searchUser(inputref.current.value));
  };
  const checkrooms = (id) => {
    dispatch(checkroomExist(id));
  };

  return (
    <div
      className={opensearch ? `search_menu ` : "search_menu close"}
      ref={searchref}
    >
      <div className="search_menu_content">
        <AiFillCloseCircle onClick={() => setopensearch(false)} />
        <form>
          <input type="text" placeholder="Enter Name or Email" ref={inputref} />
          <button onClick={handlesearch}>Search</button>
        </form>
        <div className="content">
          {state.searchloading ? (
            skelloadin.map((it, i) => {
              return (
                <div className="item skel" key={i}>
                  <SkeletonTheme
                    baseColor="rgba(233, 231, 231,0.95)"
                    highlightColor="white"
                    className="sekelparent"
                  >
                    <Skeleton count={1} className="sekelcircle skel" />
                    <Skeleton count={2} className="sekelline skel" />
                  </SkeletonTheme>
                </div>
              );
            })
          ) : state.searchuser.length > 0 ? (
            state.searchuser.map((per, i) => {
              return (
                <div
                  className="item"
                  key={per._id}
                  onClick={() => checkrooms(per._id)}
                >
                  <div className="img">
                    <img
                      src={per.image}
                      alt="person img"
                      onError={(e) => {
                        e.target.src = logo;
                      }}
                    />
                  </div>
                  <div className="name">
                    <p className="title">{per.name}</p>
                    <p className="email">{per.email}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p> no user Found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
