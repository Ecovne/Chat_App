import React, { useEffect, lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
const Home = lazy(() => import("./Home/Home.jsx"));
const Nav = lazy(() => import("./nav/Nav.jsx"));

const animation = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0.2, x: -200 },
};

function Latyout({ opensearch, setopensearch }) {
  const state = useSelector((state) => state.authSlice.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (Object.keys(state).length == 0) {
      navigate("/login", { replace: true });
    }
  }, [state]);

  return (
    <motion.div
      variants={animation}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <Suspense fallback={""}>
        <Nav opensearch={opensearch} setopensearch={setopensearch} />
      </Suspense>
      <Suspense fallback={""}>
        <Home />
      </Suspense>
    </motion.div>
  );
}

export default Latyout;
