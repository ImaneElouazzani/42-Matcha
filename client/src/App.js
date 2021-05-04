import React from "react";
import Login from "./components/login";
import Register from "./components/register";
import Forget from "./components/forget";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Profile from "./components/Profile";
import Change from "./components/Change";
import Home from "./components/Home"

function App() {
  
  return (
    <div className="App">
      <Router>
       
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/Register" exact component={Register} />
          <Route path="/Forget" exact component={Forget} />
          <Route path="/profile" exact component={Profile} />
          <Route path="/Home" exact component={Home} />
          <Route path="/Change" exact component={Change} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
