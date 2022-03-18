import React from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Home from "./pages/home"
import Add from "./pages/add"
import Login from "./pages/login"
import User from "./pages/user"
import Register from "./pages/register"
import Modify from "./pages/modify"
import ScrollToTop from "./components/scrollToTop"

const PrivateRoute = (props) => {
	const token = sessionStorage.getItem('token');
	let isAuthenticated = true
	if (!token) {
		isAuthenticated = false
		sessionStorage.clear()
	}
	return isAuthenticated ? (
	  	<Route {...props} />
	) : (
		<Redirect to={{pathname: "/"}}/>
	);
};

export default function App() {
	return (
	  <Router>
		<ScrollToTop />
		<Switch>
			<PrivateRoute path="/user" component={User} />
			<PrivateRoute path="/add" component={Add} />
			<PrivateRoute path="/home" component={Home} />
			<PrivateRoute path="/modify" component={Modify} />
			<Route path="/register" component={Register} />
			<Route path="/" component={Login} />
		</Switch>
	  </Router>
	);
}