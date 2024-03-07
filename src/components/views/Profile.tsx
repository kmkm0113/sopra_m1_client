import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Profile.scss";
import BaseContainer from "components/ui/BaseContainer";
import { Spinner } from "../ui/Spinner";
import PropTypes from "prop-types";

const FormField = (props) => {
  return (
    <div className="Update field">
      <label className="update label">
        {props.label}
      </label>
      <input
        className="update input"
        placeholder="enter here.."
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};


const Profile = () => {
  const id = useParams().userid;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [birthday, setBirthday] = useState(null);
  const [updateTrigger, setUpdateTrigger] = useState(false);

  const backToGame = async () => {
    navigate("/game")
  }

  const updateProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      // check birthday format
      const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
      console.log(birthday);

      if (birthday !== null && !dateFormat.test(birthday)) {
        alert("Birthday must be in yyyy-mm-dd format!");
        
        return;
      }

      const requestBody = JSON.stringify({ id, username, birthday, token});
      await api.put("/users/" + id, requestBody);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Profile has been updated!");
      setUpdateTrigger(!updateTrigger);
    } catch (error) {
      alert(
        `Something went wrong during the update: \n${handleError(error)}`
      );
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/users/" + id);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setUser(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the users: \n${handleError(error)}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the users! See the console for details."
        );
      }
    }
    fetchData();
  }, [updateTrigger]);

  let content = <Spinner />;

  if (user) {
    content = (
      <div className="player">
        <h2>This is a profile page</h2>
        <ul className="player user-list">
          <li>Username: {user.username}</li>
          <li>Status: {user.status}</li>
          <li>Creation_Date:  {user.creationDate}</li>
          <li>Birthday: {user.birthday}</li>
        </ul>

        <h3>You can edit your own profile below!</h3>
        Note that:
        <br/>
        <li>Leave blank if you do not want to change</li>
        <li>Birthday should be yyyy-mm-dd</li>
        <div className="Update container">
          <div className="update form">
            <FormField
              label="Username"
              value={username}
              onChange={un => setUsername(un)}
            />
            <FormField
              label="Birthday"
              value={birthday}
              onChange={n => setBirthday(n)}
            />
          </div>
        </div>
        <Button
          disabled={!username && !birthday}
          width="100%"
          onClick={() => updateProfile()}
        >
          Edit
        </Button>
        <Button
          width="100%"
          onClick={() => backToGame()}
        >
          Back
        </Button>
      </div>
    );
  }

  return (
    <BaseContainer className="profile container">
      { content }
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default Profile;
