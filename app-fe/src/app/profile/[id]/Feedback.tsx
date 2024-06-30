import {
  fetchFeedback,
  reviewPlayer,
  unvoteFeedback,
  voteFeedback,
} from "@/hooks/useProfile";
import styles from "./page.module.css";
import { IoMdThumbsDown, IoMdThumbsUp } from "react-icons/io";
import { FormEvent, useEffect, useState } from "react";
import ReactStars from "react-stars";
import Pagination from "@/components/Pagination";
import Avatar from "@/components/Avatar";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [ifeedbacks, setIfeedbacks] = useState(feedbacks);
  const [rating, setRating] = useState(0);
  const [sort, setSort] = useState(1);
  const [review, setReview] = useState<string>("");
  const [avg, setAvg] = useState(0);
  const [filter, setfilter] = useState(6);

  useEffect(() => {
    var sum = 0;
    ifeedbacks.map((fb) => {
      sum += fb.rate;
    });
    setAvg(sum / ifeedbacks.length);
  });

  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const handleMouseEnter = () => {
    setDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    setDropdownVisible(false);
  };

  const itemsPerPage = 2;
  const totalPages = Math.ceil(ifeedbacks.length / itemsPerPage);
  const currentFeedback = ifeedbacks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = async (type: number) => {
    const ufeedbacks = [...ifeedbacks]; // Create a copy of the ifeedbacks array

    if (type === 1) {
      const sortedByDate = ufeedbacks.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setIfeedbacks(sortedByDate);
      setSort(1);
    } else if (type === 2) {
      const sortedByVotes = ufeedbacks.sort(
        (a, b) => b.voteCount - a.voteCount
      );
      setIfeedbacks(sortedByVotes);
      setSort(2);
    }
  };

  const handleFilter = async (type: number) => {
    const feedbacks = await fetchFeedback(profile._id);
    let filteredFeedbacks;

    switch (type) {
      case 6:
        filteredFeedbacks = feedbacks;
        break;
      case 5:
        filteredFeedbacks = feedbacks.filter((fb) => fb.rate == 5);
        break;
      case 4:
        filteredFeedbacks = feedbacks.filter(
          (fb) => fb.rate >= 4 && fb.rate < 5
        );
        break;
      case 3:
        filteredFeedbacks = feedbacks.filter(
          (fb) => fb.rate >= 3 && fb.rate < 4
        );
        break;
      case 2:
        filteredFeedbacks = feedbacks.filter(
          (fb) => fb.rate >= 2 && fb.rate < 3
        );
        break;
      case 1:
        filteredFeedbacks = feedbacks.filter((fb) => fb.rate < 2);
        break;
      default:
        filteredFeedbacks = feedbacks;
        break;
    }

    setIfeedbacks(filteredFeedbacks);
    setSort(1)
    setfilter(type);
    console.log(type);
  };

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
    setRating(0);
  };

  return (
    <div>
      <div
        style={{
          width: "100%",
          display: "flex",
          border: "1px solid #ED154C",
          borderRadius: "5px",
          marginBottom: "20px",
        }}
      >
        <div className={styles.starsValueContainer}>
          <div style={{ textAlign: "center" }}>{avg}/5</div>
          <ReactStars
            edit={false}
            value={avg}
            count={5}
            size={24}
            color2={"#ffd700"}
          />
        </div>
        <div className={styles.starSelectContainer}>
          <div className={styles.starSelect} onClick={() => handleFilter(6)}>
            All Reviews
          </div>
          <div className={styles.starSelect} onClick={() => handleFilter(5)}>
            5 Stars
          </div>
          <div className={styles.starSelect} onClick={() => handleFilter(4)}>
            4 Stars
          </div>
          <div className={styles.starSelect} onClick={() => handleFilter(3)}>
            3 Stars
          </div>
          <div className={styles.starSelect} onClick={() => handleFilter(2)}>
            2 Stars
          </div>
          <div className={styles.starSelect} onClick={() => handleFilter(1)}>
            1 Star
          </div>
        </div>
      </div>
      <div
        style={{ borderBottom: "1px solid #ED154C", paddingBottom: "150px" }}
      >
        <span style={{ width: "5%", paddingRight: "20px", fontSize: "25px" }}>
          Sort
        </span>
        <div
          className={`${styles.dropdown}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button className={styles.dropbtn}>
            {sort == 1 ? "Latest Reviews" : "Most Helpful Reviews"}
          </button>
          {isDropdownVisible && (
            <div className={styles.dropdownContent}>
              <p onClick={() => handleSort(1)}>Latest Reviews</p>
              <p onClick={() => handleSort(2)}>Most Helpful Reviews</p>
            </div>
          )}
        </div>
      </div>
      {ifeedbacks.length !== 0 ? (
        <div>
          {currentFeedback.map((feedback) => {
            const userHasVoted = feedback.vote.includes(CurrentUser);

            return (
              <div key={feedback._id} className={styles.feedbackContainer}>
                <div className={styles.feedbackHeader}>
                  <div className={styles.feedbackAvatar}>
                  {feedback.sender_id?.avatar ? (
                    <Avatar
                      size={36}
                      src={feedback.sender_id?.avatar}
                      
                    />
                  ) : (
                    <Avatar
                      size={36}
                      initials={
                        feedback.sender_id?.username?.[0] ??
                        "P"
                      }
                    />
                  )}
                  </div>
                  <div className={styles.feedbackUserInfo}>
                    <span className={styles.feedbackUsername}>
                      {feedback.sender_id.username}
                    </span>
                    <div className={styles.rating}>
                      <ReactStars
                        edit={false}
                        value={feedback.rate}
                        count={5}
                        size={24}
                        color2={"#ffd700"}
                      />
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
        </div>
      ) : (
        <div style={{ marginTop: "30px", fontSize: "30px" }}>
          No feedback yet
        </div>
      )}

      {!isCurrentUser && (
        <div style={{ paddingTop: "10px", marginTop: "10px" }}>
          <div className="star-rating">
            <ReactStars
              onChange={(e) => setRating(e)}
              value={rating}
              count={5}
              size={24}
              color2={"#ffd700"}
            />
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
      )}
      {ifeedbacks.length !== 0 && (
        <Pagination
          total={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default Feedback;
