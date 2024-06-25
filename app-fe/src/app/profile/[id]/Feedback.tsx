import styles from "./page.module.css";

interface FeedbackProps {
  profile: any;
  isCurrentUser: boolean;
  feedback: any;
}


const Feedback = ({ profile, isCurrentUser, feedback }: FeedbackProps) => (
  <div>This is feedback</div>
);

export default Feedback;
