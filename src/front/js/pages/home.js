import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/theme.css";

export const Home = () => {
    const { store, actions } = useContext(Context);

    return (
        <div className="text-center mt-5">
            <h1>Hello !!</h1>
            <p>
                <img src={rigoImageUrl} alt="Rigo Baby" />
            </p>
            
            <Link to="/theme">
                <button className="btn-large btn-primary">Go to Theme Form</button>
            </Link>
        </div>
    );
};
