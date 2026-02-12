import React, {useEffect} from 'react';
import './App.css';
import {useNavigate} from "react-router-dom";
import {useAppDispatch} from "./redux/store/store";
import {authActions} from "./redux/slices/authSlicer";

function App() {

    const navigate = useNavigate()

    const dispatch = useAppDispatch()

    useEffect(() => {
        if(!localStorage.getItem("access") && !localStorage.getItem("refresh"))
        {
            navigate(`/login`)
        }
        else
        {
            const token = String(localStorage.getItem("refresh"))
            dispatch(authActions.refresh({ refresh: token }))
            navigate(`/orders?page=1`)
        }
    }, [dispatch,navigate]);

  return (

    <div className="App">

    </div>
  );
}

export default App;
