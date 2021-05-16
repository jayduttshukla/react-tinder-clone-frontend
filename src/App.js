// import logo from './logo.svg';
import React from "react";
import './App.css';
import MainScreen from './pages/MainScreen';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Profile from './pages/ProfileSetting/ProfileSetting';
import {
  BrowserRouter as Router,
  Switch,
  Route,
 Redirect
} from "react-router-dom";
import {Helmet} from "react-helmet";
import {useHistory } from "react-router-dom";

export const AuthContext = React.createContext();

const routes = [
  {
    path: "/login",
    component: Login
  },
  {
    path: "/signup",
    component: Signup
  },
  {
    path: "/profile",
    component: Profile
  },
  {
    path: "/cards",
    component: MainScreen,
    // routes: [
    //   {
    //     path: "/tacos/bus",
    //     component: Bus
    //   },
    //   {
    //     path: "/tacos/cart",
    //     component: Cart
    //   }
    // ]
  }
];

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", JSON.stringify(action.payload.token));
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token
      };
    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null
      };
    default:
      return state;
  }
};

function App() {
  let history = useHistory();
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <AuthContext.Provider 
    value={{
      state,
      dispatch
    }}>
    <div className="app">
      <Helmet>
                <meta charSet="utf-8" />
                <title>Tinder - clone by JD</title>
                <link rel="canonical" href="https://tinder.com/favicon-32x32.png" />
     </Helmet>
          <Router>
            <div>
              {/* <ul>
                <li>
                  <Link to="/tacos">Tacos</Link>
                </li>
                <li>
                  <Link to="/sandwiches">Sandwiches</Link>
                </li>
              </ul> */}
              
              <Switch>
              <Route
                exact
                path="/"
                render={() => {
                    return (
                      // state.isAuthenticated || localStorage.getItem("token") !== null ?
                      // <Redirect to="/cards" /> : 
                       <Redirect to="/login" /> 
                    )
                }}
              />
                {routes.map((route, i) => (
                  <RouteWithSubRoutes key={i} {...route} />
                ))}
              </Switch>
            </div>
          </Router>
    </div>
    </AuthContext.Provider>
  );
}
function RouteWithSubRoutes(route) {
  return (
    <Route
      path={route.path}
      render={props => (
        // pass the sub-routes down to keep nesting
        <route.component {...props} routes={route.routes} />
      )}
    />
  );
}
export default App;
