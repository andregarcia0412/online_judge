import checkCircle from "../../../assets/check-circle.svg";
import clock from "../../../assets/clock.svg";
import database from "../../../assets/database.svg";
import close from "../../../assets/close.svg";
import xcircle from "../../../assets/xcircle.svg";
import "./style.result-card.css";
import Button from "../../input/button/Button";
import React from "react";
import { useLockBodyScroll } from "../../../hooks/useLockBodyScroll";

type ResultCardProps = {
  accepted?: boolean;
  testCasesPassed: number;
  totalTestCases: number;
  runtime: number;
  memory: number;
  language: string;
  points: number;
  submissionDate: Date;
  onClose: () => void;
  onClickLeft?: () => void;
  onClickRight: () => void;
};

export const ResultCard = ({
  accepted,
  testCasesPassed,
  totalTestCases,
  runtime,
  memory,
  language,
  points,
  submissionDate,
  onClose,
  onClickLeft,
  onClickRight,
}: ResultCardProps) => {
  const [closing, setClosing] = React.useState<boolean>(false);

  useLockBodyScroll();

  const formattedSubmissionDate = new Intl.DateTimeFormat("pt-br", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(submissionDate));

  const handleClose = () => {
    setClosing(true);

    setTimeout(() => {
      onClose();
    }, 200);
  };

  return (
    <div className="popup-overlay">
      <div className={`result-card-container ${closing && "closing"}`}>
        <div className="result-card-title">
          <h1>Submission Result</h1>
          <img src={close} onClick={handleClose} />
        </div>
        <div className="result-card-body">
          <div className="result-card-result">
            <div
              className={`result-card-img-wrapper ${!accepted && "rejected"}`}
            >
              <img draggable={false} src={accepted ? checkCircle : xcircle} />
            </div>
            <h1 style={accepted ? { color: "#4ade80" } : { color: "#f87171" }}>
              {accepted ? "Accepted" : "Wrong Answer"}
            </h1>
            <p className="result-card-test-cases">
              {testCasesPassed}/{totalTestCases} test cases passed
            </p>
          </div>

          <hr color="#30363d" style={{ width: "100%" }} />

          <div className="result-card-metrics-wrapper">
            <div style={{ width: "48%" }}>
              <div className="result-card-metrics">
                <div className="result-card-metrics-title">
                  <img src={clock} />
                  <p>Runtime</p>
                </div>
                <h2>{runtime} ms</h2>
              </div>
            </div>

            <div style={{ width: "48%" }}>
              <div className="result-card-metrics">
                <div className="result-card-metrics-title">
                  <img src={database} />
                  <p>Memory</p>
                </div>
                <h2>{memory.toFixed(1)} MB</h2>
              </div>
            </div>
          </div>

          <div className="result-card-footer">
            <div className="result-card-footer-inner">
              <p style={{ color: "rgba(255,255,255,0.8)" }}>Language</p>
              <p>{language}</p>
            </div>
            <div className="result-card-footer-inner">
              <p style={{ color: "rgba(255,255,255,0.8)" }}>Points Awarded</p>
              <p>{points}</p>
            </div>
            <div className="result-card-footer-inner">
              <p style={{ color: "rgba(255, 255, 255, 0.8)" }}>Date/Hour</p>
              <p>{formattedSubmissionDate}</p>
            </div>
          </div>

          <div className="result-card-footer-buttons">
            <Button
              background="#000"
              text="Back to editor"
              loading={false}
              onClick={onClickLeft || handleClose}
              height={32}
              fontSize={14}
            />

            <Button
              background="#8B5CF6"
              text="Next problem"
              loading={false}
              onClick={onClickRight}
              height={32}
              fontSize={14}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
