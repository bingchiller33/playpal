import {
  fetchFeedback,
  reviewPlayer,
  unvoteFeedback,
  voteFeedback,
} from "@/hooks/useProfile";
import styles from "./page.module.css";
import { IoMdThumbsDown, IoMdThumbsUp } from "react-icons/io";
import { FormEvent, useEffect, useState } from "react";
import { Rating } from "react-simple-star-rating";

interface FeedbackProps {
  profile: any;
  isCurrentUser: boolean;
  CurrentUser: any;
  feedbacks: any[];
}
const formatDate = (iDate: any) => {
  const date = new Date(iDate);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

const Feedback = ({
  profile,
  isCurrentUser,
  feedbacks,
  CurrentUser,
}: FeedbackProps) => {
  const [ifeedbacks, setIfeedbacks] = useState(feedbacks);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState<string>("");

  const handleRating = (rate: number) => {

    setRating(rate);
    console.log(rate);
    
    // other logic
  };
  // Optinal callback functions
  const onPointerEnter = () => console.log("Enter");
  const onPointerLeave = () => console.log("Leave");
  const onPointerMove = (value: number, index: number) =>
    console.log(value, index);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleReview();
    }
  };

  const handleVote = async (id: any, currentUser: any) => {
    try {
      await voteFeedback(id, currentUser);
      const updatedFeedbacks = await fetchFeedback(profile._id);
      setIfeedbacks(updatedFeedbacks);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnvote = async (id: any, currentUser: any) => {
    try {
      await unvoteFeedback(id, currentUser);
      const updatedFeedbacks = await fetchFeedback(profile._id);
      setIfeedbacks(updatedFeedbacks);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReview = async () => {
    try {
      await reviewPlayer(profile._id, CurrentUser, rating, review);
      const updatedFeedbacks = await fetchFeedback(profile._id);
      setIfeedbacks(updatedFeedbacks);
    } catch (error) {
      console.error(error);
    }
    setReview("");
  };

  return (
    <div style={{ borderTop: "1px solid #ED154C" }}>
      {ifeedbacks.map((feedback) => {
        const userHasVoted = feedback.vote.includes(CurrentUser);

        return (
          <div key={feedback._id} className={styles.feedbackContainer}>
            <div className={styles.feedbackHeader}>
              <img
                src={feedback.sender_id.avatar_url}
                alt={`${feedback.sender_id.username}'s avatar`}
                className={styles.feedbackAvatar}
              />
              <div className={styles.feedbackUserInfo}>
                <span className={styles.feedbackUsername}>
                  {feedback.sender_id.username}
                </span>
                <div className={styles.rating}>
                  {Array.from({ length: feedback.rate }, (_, i) => (
                    <span key={i} className={styles.star}>
                      ⭐
                    </span>
                  ))}
                </div>
                <span className={styles.feedbackDate}>
                  {formatDate(feedback.createdAt)}
                </span>
              </div>
            </div>
            <div className={styles.feedbackText}>{feedback.text}</div>
            <div className={styles.feedbackActions}>
              {userHasVoted ? (
                <button
                  onClick={() => handleUnvote(feedback.id, CurrentUser)}
                  className={styles.unUsefulButton}
                >
                  <IoMdThumbsUp className={styles.icon} />
                  Useful
                </button>
              ) : (
                <button
                  onClick={() => handleVote(feedback.id, CurrentUser)}
                  className={styles.usefulButton}
                >
                  <IoMdThumbsUp className={styles.icon} />
                  Useful
                </button>
              )}
              <span style={{ paddingLeft: "5px", color: "GrayText" }}>
                {feedback.voteCount} users think this review is useful
              </span>
            </div>
          </div>
        );
      })}
      <div style={{ paddingTop: "10px" }}>
        <div className="star-rating">
          <Rating onClick={handleRating} initialValue={rating} />
        </div>
        <input
          className={styles.reviewInput}
          type="text"
          value={review}
          onKeyDown={handleKeyDown}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write your review here"
        />
        <button onClick={handleReview} className={styles.sendButton}>
          <svg viewBox="0 0 24 24">
            <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Feedback;
