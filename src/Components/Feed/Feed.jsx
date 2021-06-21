import React, { useContext, useState, useEffect } from 'react';
import "./Feed.css";
import { Row, Col, Button, Form, Card } from 'react-bootstrap';
import { FaHeart, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import FadeIn from 'react-fade-in';
import FeedContext from "../../Contexts/FeedContext";
import Context from "../../Contexts/PostContext";

const Feed = () => {

  const { images, dispatchImage, alert, setAlert } = useContext(FeedContext);
  const { files } = useContext(Context);

  useEffect(() => {
    //set "files" into "images" state in FeetContext
    { files.length !== 0 && dispatchImage({ type: "UPLOAD", payload: files }); }
  }, []);

  //private state hook for modal pop up
  const [modalStyle, setModalStyle] = useState({ "display": "none" });
  const [targetImage, setTargetImage] = useState({});
  const [comments, setComments] = useState({});

  //================== increment/decrement the like count ================== 
  const handleClick = (e, id) => {
    e.stopPropagation();
    e.preventDefault();

    //find the target object
    let targetPhoto = images.imageData.find(e => e.id === id);

    //increment or decriment like/ unlike count (* use comments counts instead of unlike count due to API )
    let updatedImgObj;
    {
      e.target.className !== "likes" ?
        (targetPhoto["comments"] !== 0 ?
          (updatedImgObj = Object.assign(targetPhoto, { comments: targetPhoto["comments"] - 1 })) :
          (updatedImgObj = Object.assign(targetPhoto, { comments: targetPhoto["comments"] }))
        ) :
        (updatedImgObj = Object.assign(targetPhoto, { likes: targetPhoto["likes"] + 1 }));
    }

    //update the state
    dispatchImage({ type: "LIKE", payload: updatedImgObj });
  };

  //================== Add photo to favorite ================== 
  const addToFavorite = (e, id) => {
    e.stopPropagation(); 
    e.preventDefault();

    //find the target object
    let targetPhoto = images.imageData.find(e => e.id === id);

    //check if it is already in the local storage
    if (images.favorite.find(e => e.id === targetPhoto.id)) {
      setAlert("The photo is already in your Favorite Collection");
      setTimeout(() => { setAlert(""); }, 2000);
    } else {
      let updatedImgObj = Object.assign(targetPhoto, { favorites: targetPhoto["favorites"] + 1 });
      dispatchImage({ type: "ADD_FAVORITES", payload: updatedImgObj });
    }
  };

  //================== methods for modal ================== 
  const openModal = (id) => {
    //find which modal should open
    let clickedImgObj = images.imageData.find(e => e.id === id);
    //filter out all the comments for the targetPhoto
    let allComments = images.comments.filter(e => e.id === id);

    setTargetImage({
      imgObj: clickedImgObj,
      comments: allComments
    });

    setModalStyle({ "display": "block" });
  };

  const hideModal = () => {
    setModalStyle({ "display": "none" });
  };

  //================== Post comments ================== 
  const postComment = (e) => {
    e.preventDefault();

    //validation check
    if (e.target[0].value === "") {
      setAlert("Please add your comments");
      setTimeout(() => { setAlert(""); }, 2000);
    } else {
      dispatchImage({ type: "ADD_COMMENTS", payload: comments });
      setComments({ ...comments, comment: "" });
    }
  };

  return (
    <>
      {images ? (
        <FadeIn>
          <div className="feedContainer">
            <Row className="imgRow row row-cols-5">
              {images.imageData.map((elem, index) => (
                <>
                  <Col className="col" key={index}>
                    <div className="imagPanel">
                      <img src={elem.largeImageURL} alt={elem.tags} />
                      {/* show when hovered */}
                      <button className="hoverText" type="button" onClick={e => openModal(elem.id)}>
                        <p className="tag"># {elem.tags}</p>
                        <div className="buttons">
                          <span
                            className="likes"
                            onClick={e => handleClick(e, elem.id)}><FaThumbsUp /> {elem.likes}</span>
                          <span
                            className="unlikes"
                            onClick={e => handleClick(e, elem.id)}><FaThumbsDown /> {elem.comments}</span>
                          <span
                            className="favorites"
                            onClick={(e) => { addToFavorite(e, elem.id); }}><FaHeart /> {elem.favorites}</span>
                        </div>
                        <p className="username">{elem.user}</p>
                      </button>
                    </div>
                  </Col>
                </>
              ))}
            </Row>

            {/* Modal */}
            {targetImage.imgObj && (
              <>
                <div className="modalContainer" style={modalStyle}>
                  <button className="clsBtn" onClick={hideModal}><ImCross /></button>
                  <Row className="imageModal">
                    <img className="col col-8 largeImg" src={targetImage.imgObj.largeImageURL} alt="largeImage" />

                    <Col className="col-4 userInfo">
                      <div className="user">
                        <img src={targetImage.imgObj.userImageURL} alt="userImg" />
                        <div className="right">
                          <p>{targetImage.imgObj.user}</p>
                          <p className="tag"># {targetImage.imgObj.tags}</p>
                        </div>
                      </div>

                      <div className="buttons">
                        <span
                          className="likes"
                          onClick={e => handleClick(e, targetImage.imgObj.id)}><FaThumbsUp /> {targetImage.imgObj.likes}</span>
                        <span
                          className="unlikes"
                          onClick={e => handleClick(e, targetImage.imgObj.id)}><FaThumbsDown /> {targetImage.imgObj.comments}</span>
                        <span
                          className="favorites"
                          onClick={(e) => { addToFavorite(e, targetImage.imgObj.id); }}><FaHeart /> {targetImage.imgObj.favorites}</span>
                      </div>

                      {/* Comment input form */}
                      <Card className="commentArea">
                        <Card.Body >
                          <blockquote className="blockquote mb-0">
                            <p className="commentNum"># 1</p>
                            <p>This is default comment applied to all photos :)</p>
                          </blockquote>
                          {images.comments.length !== 0 && (
                            images.comments.filter(e => e.id === targetImage.imgObj.id).map((elem, index) => (
                              <blockquote className="blockquote mb-0" key={index}>
                                <p className="commentNum"># {index + 2}</p>
                                <p>{elem.comment}</p>
                              </blockquote>
                            ))
                          )}
                        </Card.Body>
                      </Card>

                      <Form onSubmit={postComment}>
                        <Form.Group>
                          <Form.Control type="text" placeholder="Add a comment..."
                            onChange={e => { setComments({ id: targetImage.imgObj.id, comment: e.target.value }); }}
                            onFocus={() => { setComments({ ...comments, comment: "" }); setAlert(""); }}
                            value={comments.comment}
                          />
                        </Form.Group>
                        <Button type="submit" variant="outline-info" className="postBtn">Post</Button>
                      </Form>

                      {/* alert */}
                      {alert && <p className="alert">{alert}</p>}
                    </Col>
                  </Row>
                </div>
              </>
            )}
          </div>
        </FadeIn>
      ) : (<h1 className="loading">Loading...Hang on a sec...</h1>)};
    </>
  );
};

export default Feed;
