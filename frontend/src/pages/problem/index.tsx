import { Editor } from "@monaco-editor/react";
import { ConfigProvider, Select, theme } from "antd";
import React from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { problemService } from "../../api/services/problem.service";
import { submissionService } from "../../api/services/submission.service";
import play from "../../assets/play.svg";
import send from "../../assets/send.svg";
import { ResultCard } from "../../components/card/result-card/ResultCard";
import { HomeHeader } from "../../components/home-header/HomeHeader";
import Button from "../../components/input/button/Button";
import { useAuthContext } from "../../contexts/AuthContext";
import { LanguageConstants } from "../../data/constants/language.constants";
import type { Submission } from "../../data/dto/submission.dto";
import { useFetch } from "../../hooks/useFetch";
import { celebrate } from "../../utils/celebrate";
import "./style.css";

export const ProblemScreen = () => {
  const { idProblem } = useParams();
  const safeIdProblem = Number(idProblem);
  const isInvalidId = Number.isNaN(safeIdProblem);

  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [language, setLanguage] = React.useState<string>("java");
  const [code, setCode] = React.useState<string>(
    LanguageConstants[language].text,
  );
  const [loadingSubmit, setLoadingSubmit] = React.useState<boolean>(false);
  const [loadingRun, setLoadingRun] = React.useState<boolean>(false);
  const [showPopup, setShowPopup] = React.useState<boolean>();
  const [submissionInfo, setSubmissionInfo] = React.useState<Submission | null>(
    null,
  );
  const [quickSearchText, setQuickSearchText] = React.useState<string>("");

  React.useEffect(() => {
    setShowPopup(false);
    setSubmissionInfo(null);
    setLanguage("java");
    setCode(LanguageConstants["java"].text);
  }, [safeIdProblem]);

  const {
    data: problem,
    loading,
    error,
  } = useFetch(() => problemService.findById(safeIdProblem), [safeIdProblem]);

  if (!user || isInvalidId || error) {
    return <Navigate to="/not-found" replace />;
  }

  if (loading || !problem) {
    return null;
  }

  const handleSubmit = async () => {
    if (loadingSubmit || !language || loadingRun) {
      return;
    }

    setLoadingSubmit(true);
    try {
      const response = await submissionService.createSubmission({
        id_problem: safeIdProblem,
        language: language,
        text: code,
      });
      setSubmissionInfo(response);
      if (response.status == "accepted") {
        celebrate();
      }
      console.log(response);
    } catch (e) {
      console.error(
        "Error while creating submission:",
        e instanceof Error ? e.message : "Unknown Error",
      );
      throw e;
    } finally {
      setLoadingSubmit(false);
      setShowPopup(true);
    }
  };

  const handleTestSubmit = async () => {
    if (loadingSubmit || !language || loadingRun) {
      return;
    }

    setLoadingRun(true);
    try {
      const response = await submissionService.submitPlayground({
        id_problem: safeIdProblem,
        language: language,
        text: code,
      });
      console.log(response);
    } catch (e) {
      console.error(
        "Error while creating playground submission:",
        e instanceof Error ? e.message : "Unknown Error",
      );
      throw e;
    } finally {
      setLoadingRun(false);
    }
  };

  const handleLanguageChange = (value: string) => {
    if (code === LanguageConstants[language].text || code === "") {
      setCode(LanguageConstants[value].text);
    }
    setLanguage(value);
  };

  return (
    <div>
      <HomeHeader
        text={quickSearchText}
        handleSearch={() => console.log("teste")}
        setText={(text) => setQuickSearchText(text)}
      />
      <div className="problem-container">
        <div className="problem-container-sides">
          <div className="problem-card title">
            <div className="problem-card-row">
              <h2>
                {problem.id}. {problem.title}
              </h2>
            </div>

            <div className="problem-card-points">
              <p>Points</p>
              <p className="problem-card-points-label">{problem.points}</p>
            </div>
          </div>

          <div className="problem-card">
            <div className="problem-card-row">
              <h3>Description</h3>
              <p>{problem.description}</p>
            </div>
            <hr color="#30363d" style={{ width: "100%" }} />
            <div className="problem-card-row">
              <h3>Input</h3>
              <p>
                {problem.input_description ||
                  "There are no inputs for this problem."}
              </p>
            </div>
            <hr color="#30363d" style={{ width: "100%" }} />
            <div className="problem-card-row">
              <h3>Output</h3>
              <p>{problem.output_description}</p>
            </div>
            <hr color="#30363d" style={{ width: "100%" }} />
            <div className="problem-card-row">
              <h3>Examples</h3>
              <div className="problem-examples">
                {problem.input_example && (
                  <div className="problem-example">
                    <p>Input Example</p>
                    <div className="problem-example-box">
                      <p>{problem.input_example}</p>
                    </div>
                  </div>
                )}
                <div className="problem-example">
                  <p>Output Example</p>
                  <div className="problem-example-box">
                    <p>{problem.output_example}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="problem-container-sides">
          <div
            className="problem-card language-select-card"
            style={{ height: "auto" }}
          >
            <div className="problem-selector">
              <ConfigProvider
                theme={{
                  algorithm: theme.darkAlgorithm,
                  token: {
                    colorPrimaryHover: "#8B5CF6",
                    colorPrimary: "#8B5CF6",
                  },
                }}
              >
                <Select
                  style={{ width: "100%" }}
                  placeholder="Choose a language"
                  value={language}
                  onChange={(value) => handleLanguageChange(value)}
                  options={Object.entries(LanguageConstants).map(
                    ([_, lang]) => {
                      return {
                        value: lang.languageName,
                        label: lang.label,
                      };
                    },
                  )}
                />
              </ConfigProvider>
            </div>

            <div className="submit-button-wrapper" style={{ width: "40%" }}>
              <Button
                icon={play}
                height={40}
                onClick={handleTestSubmit}
                loading={loadingRun}
                text="Run"
                background="#000"
              />

              <Button
                icon={send}
                height={40}
                onClick={handleSubmit}
                loading={loadingSubmit}
                text="Submit"
                background="#8B5CF6"
              />
            </div>
          </div>
          <div className="problem-editor-wrapper">
            <Editor
              height="100%"
              language={LanguageConstants[language].languageName}
              value={code}
              onChange={(value) => setCode(value ?? "")}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontFamily: "JetBrains Mono",
                automaticLayout: true,
                stickyScroll: { enabled: !showPopup },
              }}
            />
          </div>
        </div>
      </div>
      {showPopup && submissionInfo && (
        <ResultCard
          language={LanguageConstants[language].label}
          memory={submissionInfo.memory_usage_MB}
          points={problem.points}
          runtime={submissionInfo.execution_time}
          testCasesPassed={submissionInfo.test_cases_passed}
          totalTestCases={problem.test_cases.length}
          accepted={submissionInfo.status === "accepted"}
          submissionDate={submissionInfo.submission_date}
          status={submissionInfo.status}
          onClose={() => setShowPopup(false)}
          onClickRight={() => {
            navigate(`/problem/${safeIdProblem + 1}`);
          }}
        />
      )}
    </div>
  );
};
