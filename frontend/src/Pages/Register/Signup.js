import React, {useContext, useState} from "react";
import style from './Signin.module.css';

import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";
import { NavLink } from "react-router-dom";

const Signin = () => {
    const auth = useContext(AuthContext);
    let [state, setState] = useState({
        inputs: {
            Name: {
                value: '',
            },
            Email: {
                value: '',
            },
            Password: {
                value: '',
            },
            confirmPassword: {
                value: '',
            },
        }
    })

    const changeHandler = (event, fieldName) => {
        let value = event.target.value;
        let newState = {...state};

        newState.inputs[fieldName].value = value;
        setState(newState);
    }

    const regiserHandler = (event) => {
        event.preventDefault();
        let data = {
            name: state.inputs.Name.value, 
            email: state.inputs.Email.value,
            password: state.inputs.Password.value,
            confirmPass: state.inputs.confirmPassword.value,
        };

        axios.post('http://localhost:8000/Auth/signup', data)
        .then(response => {
            console.log(response)
        })
        .catch(err => console.log(err));
    }

    return (
        <div className={style.Signin}>
            <form onSubmit={(e) => regiserHandler(e)}>
                <label>Sign up</label>
                <input type="text" placeholder="Name" onChange={(e) => changeHandler(e, 'Name')}/>
                <input type="text" placeholder="Email" onChange={(e) => changeHandler(e, 'Email')}/>
                <input type="password" placeholder="Password" onChange={(e) => changeHandler(e, 'Password')}/>
                <input type="password" placeholder="confirmPassword" onChange={(e) => changeHandler(e, 'confirmPassword')}/>
                <button type="submit">Signup</button>
                <NavLink to="/signin">Signin</NavLink>
            </form>
        </div>
    )
}

export default Signin;