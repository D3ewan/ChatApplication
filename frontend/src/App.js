import React, { useEffect, useState } from 'react';
import {Route, BrowserRouter, Routes} from 'react-router-dom';
import axios from 'axios';
import './App.css';

import Home from './Pages/Home/Home';
import Signin from './Pages/Register/Signin';
import Signup from './Pages/Register/Signup';
import { AuthContext } from './Context/AuthContext';

function App() {

  let [token, setToken] = useState();
  let [user, setUser] = useState();

  useEffect(() => {
    let storedToken = localStorage.getItem('token')?.split(' ')[0];
    let storedUser = {};
    storedUser._id       = localStorage.getItem('userID');
    storedUser.name      = localStorage.getItem('userName');
    storedUser.imagePath = localStorage.getItem('imagePath');
    storedUser.status    = localStorage.getItem('status');
    setToken(storedToken);
    setUser(storedUser);
  }, [])

  const login = (user, token) => {
    setToken(token);
    setUser(user);
    localStorage.setItem('token', `${token} bearer`);
    localStorage.setItem('userID', user._id);
    localStorage.setItem('userName', user.name);
    localStorage.setItem('imagePath', user.imagePath);
    localStorage.setItem('status', user.status);
  }

  const logout = () => {
    let userID = user._id;
    axios.post('http://localhost:8000/Auth/signout', {userID})
    .then(result => {
      setToken(null);
      setUser({});
      localStorage.clear();
    })
    .catch(err => console.log(err))
  }

  let routes;
  if(!!token){
    routes = (
      <Routes>
        <Route path='/' exact element={<Home/>}/>
        <Route path='*' element={<Home/>}/>
      </Routes>
    )
  } else {
    routes = (
      <Routes>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/signin' element={<Signin/>}/>
        <Route path='*' element={<Signup/>}/>
      </Routes>
    )
  }

  return (
    <div className="App">
      <AuthContext.Provider value={{user, token, isLogedIn: !!token, login, logout}}>
        <BrowserRouter>
            {routes}
        </BrowserRouter>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
