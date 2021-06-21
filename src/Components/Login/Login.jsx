import React, { useContext, useState } from 'react';
import "./Login.css";
import { Form, Button } from 'react-bootstrap';
import FeedContext from "../../Contexts/FeedContext";
import FadeIn from 'react-fade-in';

const Login = () => {

  const [error, setError] = useState("");
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const { dispatchUser } = useContext(FeedContext);

  const login = (e) => {
    e.preventDefault();

    //validation check
    if ((user.name === "") || (user.email === "") || (user.password === "")) {
      setError("please enter your credential");
    } else {
      dispatchUser({ type: "LOGIN", payload: user });
      setUser({ name: "", email: "", password: "" });
    }
  };

  const logOut = (e) => {
    e.preventDefault();
    dispatchUser({ type: "LOGOUT" });
  };

  return (
    <>
      <FadeIn>
        <div className="loginContainer">
          <h2>Log in</h2>
          {(error !== "") ? (
            <>
              <p className="errorMsg">{error}</p>
            </>
          ) : ""}
          <Form className="loginForm" onSubmit={login}>
            <Form.Group controlId="formGroupName">
              <Form.Label>Name:</Form.Label>
              <Form.Control type="text" placeholder="Enter your name"
                onChange={e => setUser({ ...user, name: e.target.value })}
                value={user.name}
                onFocus={() => { setError(""); setUser({ name: "", email: "", password: "" }); }} />
            </Form.Group>
            <Form.Group controlId="formGroupEmail">
              <Form.Label>Email address:</Form.Label>
              <Form.Control type="email" placeholder="Enter email"
                onChange={e => setUser({ ...user, email: e.target.value })}
                value={user.email}
                onFocus={() => { setError(""); }} />
            </Form.Group>
            <Form.Group controlId="formGroupPassword">
              <Form.Label>Password:</Form.Label>
              <Form.Control type="password" placeholder="Password"
                onChange={e => setUser({ ...user, password: e.target.value })}
                value={user.password}
                onFocus={() => { setError(""); }} />
            </Form.Group>

            <Button variant="primary" type="submit" className="logInBtn">Log in</Button>
            
            <Button variant="outline-info" type="button"
              className="logOutBtn"
              onClick={logOut}
            >Log out</Button>
          </Form>
        </div>
      </FadeIn>
    </>
  );
};

export default Login;
