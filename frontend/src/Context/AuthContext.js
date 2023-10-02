import { createContext } from 'react';

export const AuthContext = createContext({
    user: {},
    token: null,
    isLogedIn: false,   // (!!) turns token into (true) or (false) in App.js
    login: () => {},
    logout: () => {},
})


// Note:

// createContext creates a context object {...data}.

// this context will wrape the whole app.js (root node) content, 
// to provide the authintication object to the rest child components on the app level.

// the useContext() Hook will be called in any needed component to use the context object data,
// used in: app.js, NavLinks.js, PlaceItem.js