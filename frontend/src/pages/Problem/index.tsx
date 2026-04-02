import { Editor } from "@monaco-editor/react";
import { ConfigProvider, Select, theme } from "antd";
import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { problemService } from "../../api/services/problem.service";
import { submissionService } from "../../api/services/submission.service";
import play from "../../assets/play.svg";
import send from "../../assets/send.svg";
import { ResultCard } from "../../components/card/result-card/ResultCard";
import { HomeHeader } from "../../components/home-header/HomeHeader";
import Button from "../../components/input/button/Button";
import { useAuthContext } from "../../contexts/AuthContext";
import { LanguageConstants } from "../../data/constants/language.constants";
import type { Problem } from "../../data/dto/problem.dto";
import type { Submission } from "../../data/dto/submission.dto";
import type { TestCase } from "../../data/dto/test-case.dto";
import { celebrate } from "../../utils/celebrate";
import "./style.css";

export const ProblemScreen = () => {
  const idProblem = Number(useParams().idProblem);
  const { userData } = useAuthContext();
  const [language, setLanguage] = React.useState<string>("java");
  const [code, setCode] = React.useState<string>(
    LanguageConstants[language].text,
  );
  const [loadingSubmit, setLoadingSubmit] = React.useState<boolean>(false);
  const [loadingRun, setLoadingRun] = React.useState<boolean>(false);
  const [problem, setProblem] = React.useState<Problem | null | undefined>(
    undefined,
  );
  const [showPopup, setShowPopup] = React.useState<boolean>();
  const [submissionInfo, setSubmissionInfo] = React.useState<Submission | null>(
    null,
  );
  const [testCases, setTestCases] = React.useState<TestCase[] | null>(null);
  const [quickSearchText, setQuickSearchText] = React.useState<string>("");

  if (!userData) {
    return null;
  }

  React.useEffect(() => {
    const findProblem = async () => {
      try {
        const problem = await problemService.findById(idProblem);
        setProblem(problem);
      } catch (e: any) {
        if (e.response?.status === 404) {
          setProblem(null);
        }
      }
    };

    const findTestCases = async () => {
      try {
        const testCases = await problemService.findAllTestCasesById(idProblem);
        setTestCases(testCases);
        console.log(testCases);
      } catch (e) {
        throw e;
      }
    };

    findProblem();
    findTestCases();
  }, [idProblem]);

  if (problem === null) {
    return <Navigate to="/not-found" replace />;
  }

  if (problem === undefined) {
    return null;
  }

  const handleSubmit = async () => {
    if (loadingSubmit || !language || loadingRun) {
      return;
    }

    setLoadingSubmit(true);
    try {
      const response = await submissionService.createSubmission({
        id_problem: idProblem,
        id_user: userData?.user.id,
        language: language,
        text: code,
      });
      setSubmissionInfo(response);
      if (response.status == "accepted") {
        celebrate();
      }
      console.log(response);
    } catch (e) {
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
        id_problem: idProblem,
        id_user: userData?.user.id,
        language: language,
        text: code,
      });
      console.log(response);
    } catch (e) {
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
                <div className="problem-example">
                  <p>Input Example</p>
                  <div className="problem-example-box">
                    <p>{problem.input_example}</p>
                  </div>
                </div>
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
              }}
            />
          </div>
        </div>
      </div>
      {showPopup && submissionInfo && testCases && (
        <ResultCard
          language={LanguageConstants[language].label}
          memory={submissionInfo.memory_usage_MB}
          points={problem.points}
          runtime={submissionInfo.execution_time}
          testCasesPassed={submissionInfo.test_cases_passed}
          totalTestCases={testCases.length}
          accepted={submissionInfo.status === "accepted"}
          submissionDate={submissionInfo.submission_date}
          onClose={() => setShowPopup(false)}
          onClickRight={() => console.log("A")}
        />
      )}
    </div>
  );
};
