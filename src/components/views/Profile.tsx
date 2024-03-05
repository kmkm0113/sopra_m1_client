import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Profile.scss";
import BaseContainer from "components/ui/BaseContainer";
import { Spinner } from "../ui/Spinner";

const Profile = () => {
  const id = useParams().userid;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const backToGame = async () => {
    navigate("/game")
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/users/" + id);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setUser(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the users! See the console for details.");
      }
    }
    fetchData();
  }, []);

  let content = <Spinner />;

  if (user) {
    content = (
      <div className="game">
        <h2>This is a profile page</h2>
        <ul className="game user-list">
          <li>Username: {user.username}</li>
          <li>Status: {user.status}</li>
          <li>Creation_Date:  {user.creationDate}</li>
          <li>Birthday: {user.birthday}</li>
        </ul>
        <Button
          width="100%"
          //onClick={() => goToEdit()}
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
    <BaseContainer className="game container">
      { content }
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default Profile;
