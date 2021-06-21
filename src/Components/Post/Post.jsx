import React, { Component } from "react";
import "./Post.css";
import { Consumer } from "../../Contexts/PostContext";
import { Col, Form, Row, } from "react-bootstrap";
import FadeIn from 'react-fade-in';

class Post extends Component {
  state = {
    user: "",
    previewURL: "",
    largeImageURL: "",
    tags: "",
    likes: 0,
    comments: 0,
    favorites: 0,
    userImageURL: "",
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = (dispatch, e) => {
    e.preventDefault();

    const { user, previewURL, largeImageURL,tags } = this.state;
    const imageFile = e.target.elements[1].files[0]; 
    const imageUrl = URL.createObjectURL(imageFile); 
    console.log(imageUrl); 

    const newPost = {
      user,
      previewURL : imageUrl,
      largeImageURL : imageUrl,
      tags,
      likes:0,
      comments:0,
      favorites:0
    };

    dispatch({ type: "UPLOAD", payload: newPost });
    this.props.history.push({ pathname: '/feed' });
  };

  render() {
    return (
      <Consumer>
        {(value) => {
          const { dispatch } = value;
          const { user, previewURL, tags } = this.state;
          return (
            <>
              <h1> POST</h1>
              <Form className="Form" 
                onSubmit={
                  this.onSubmit.bind(this, dispatch)}
              >
                <Form.Group as={Row} controlId="formUser">
                  <Form.Label  column sm={1}>User Name</Form.Label>
                  <Col sm={5}>
                    <Form.Control className="user"
                      type="text"
                      value={user}
                      name="user"
                      placeholder="Enter your username"
                      onChange={this.onChange}
                    />
                  </Col>
                </Form.Group>

                   <br />
                   <br />
                <Form.Group as={Row} controlId="formImage">
                  <Form.Label column sm={1}>Image</Form.Label>
                  <Col sm={5}>
                    <Form.File
                      type="file"
                      value={previewURL}
                      name="previewURL"
                      placeholder="Choose a image"
                      onChange={this.onChange}
                      accept="image/*"
                     />
                  </Col>
                </Form.Group>

                  <br />
                  <br />
                
                <Form.Group as={Row} controlId="formTag">
                  <Form.Label column sm={1}> Tag </Form.Label>
                  <Col sm={5}>
                    <Form.Control rows ={5}
                      type="text"
                      value={tags}
                      name="tags"
                      placeholder="Enter tag"
                      onChange={this.onChange}
                    />
                  </Col>
                </Form.Group>

                
                <Form.Group as={Row} controlId="formSubmit">
                  <Col sm={2}>
                  <Form.Control className="submit"
                    type="submit"
                    value="submit"
                  />
                  </Col>
                </Form.Group>
  
                <br />
                <br />

              </Form>
            </>
          );
        }}
      </Consumer>
    );
  }
}

export default Post;

