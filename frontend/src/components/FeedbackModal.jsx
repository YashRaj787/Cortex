import { useState, useEffect } from "react";
import { track } from "../lib/analytics.js";
import { GOOGLE_FORM_URL } from "../config/feedback.js";

/**
 * Simple modal component for collecting feedback.
 * It does not depend on any external UI library – just plain CSS.
 */
export default function FeedbackModal({ isOpen, onClose }) {
  const [type, setType] = useState("Bug Report");
  const [message, setMessage] = useState("");

  // Track when the modal is opened
  useEffect(() => {
    if (isOpen) {
      track("feedback_opened");
    }
  }, [isOpen]);

  if (!isOpen) return null;

const handleSubmit = (e) => {
    e.preventDefault();
    // Open the Google Form in a new tab
    const formUrl = `${GOOGLE_FORM_URL}&entry.123456=${encodeURIComponent(
      type
    )}&entry.654321=${encodeURIComponent(message)}`;
    // Track submission
    track("feedback_submitted", { feedbackType: type, messageLength: message.length });
    // Track that the form is being opened
    track("feedback_form_opened");
    window.open(formUrl, "_blank");
    // Close modal
    onClose();
  };

  return (
    <div className="feedback-modal-overlay" onClick={onClose}>
      <div
        className="feedback-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Send Feedback</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Type:
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option>Bug Report</option>
              <option>Feature Request</option>
              <option>General Feedback</option>
            </select>
          </label>
          <label>
            Message:
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </label>
          <div className="feedback-modal-actions">
            <button type="submit" className="btn primary">
              Submit
            </button>
            <button
              type="button"
              className="btn"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/*
 * Basic styles – in a real project you would move these to a CSS module
 * or a global stylesheet. For the purpose of this task we keep them
 * inline to avoid adding new files.
 */
const style = document.createElement("style");
style.textContent = `
  .feedback-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .feedback-modal {
    background: #fff;
    padding: 1.5rem;
    border-radius: 4px;
    width: 90%;
    max-width: 400px;
  }
  .feedback-modal h2 {
    margin-top: 0;
  }
  .feedback-modal label {
    display: block;
    margin-bottom: 0.5rem;
  }
  .feedback-modal textarea {
    width: 100%;
    height: 80px;
    margin-top: 0.25rem;
  }
  .feedback-modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1rem;
  }
`;
document.head.appendChild(style);
