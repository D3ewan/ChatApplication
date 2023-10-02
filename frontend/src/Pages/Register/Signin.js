import React, {useContext, useState} from "react";
import style from './Signin.module.css';
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";

const Signin = () => {
    const auth = useContext(AuthContext);
    let [state, setState] = useState({
        inputs: {
            Email: {
                value: '',
            },
            Password: {
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
        let data = {email: state.inputs.Email.value, password: state.inputs.Password.value};
        
        axios.post('http://localhost:8000/Auth/signin', data)
        .then(response => {
            let {user, token} = response.data;
            auth.login(user, token);
        })
        .catch(err => console.log(err));
    }

    return (
        <div className={style.Signin}>
            <form onSubmit={(e) => regiserHandler(e)}>
                <label>Sign In</label>
                <input type="email" placeholder="Email" onChange={(e) => changeHandler(e, 'Email')}/>
                <input type="password" placeholder="Password" onChange={(e) => changeHandler(e, 'Password')}/>
                <button type="submit">Login</button>
                <NavLink to="/signup">Signup</NavLink>
            </form>
        </div>
    )
}

export default Signin;