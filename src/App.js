import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Main from "./Components/Main/Main";
import Feed from "./Components/Feed/Feed";
import Post from "./Components/Post/Post";
import Favorite from "./Components/Favorite/Favorite";
import ScrollToTop from "./Components/Router/ScrollToTop";
import { FeedProvider } from "./Contexts/FeedContext";
import { PostProvider } from "./Contexts/PostContext";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer"; 

const App = () => {
  return (
    <>
      <FeedProvider>
        <PostProvider>
          {/* React Router*/}
          <Router>
            {/* Scroll to Top */}
            <ScrollToTop>
              {/* Header */}
              <Header />
              {/* <Header /> */}
              {/* Router Switch */}
              <Switch>
                <Route exact path="/" component={Main} />
                <Route exact path="/home" component={Main} />
                <Route exact path="/feed" component={Feed} />
                <Route exact path="/favorite" component={Favorite} />
                <Route exact path="/post" component={Post} />
                <Route exact path="/login" />
              </Switch>
              {/* <Footer /> */}
            </ScrollToTop>
          </Router>
        </PostProvider>
      </FeedProvider>
    </>
  );
};

export default App;
