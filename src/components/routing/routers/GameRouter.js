import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import Game from "../../views/Game";
import Profile from "../../views/Profile";
import Edit from "../../views/Edit"
import PropTypes from "prop-types";

const GameRouter = () => {
  return (
    <div style={{display: "flex", flexDirection: "column"}}>
      <Routes>

        <Route path="" element={<Game />} />
        <Route path="dashboard" element={<Game />} />

        <Route path="profile/:userid" element={<Profile />} />

        <Route path="*" element={<Navigate to="dashboard" replace />} />

      </Routes>
    </div>
  );
};
/*
* Don't forget to export your component!
 */

GameRouter.propTypes = {
  base: PropTypes.string
}

export default GameRouter;
