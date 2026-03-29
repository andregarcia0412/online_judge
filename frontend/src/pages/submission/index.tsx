import { Editor } from "@monaco-editor/react";
import { ConfigProvider, Select, theme } from "antd";
import React from "react";
import { problemService } from "../../api/services/problem.service";
import { submissionService } from "../../api/services/submission.service";
import play from "../../assets/play.svg";
import send from "../../assets/send.svg";
import Button from "../../components/button/Button";
import { HomeHeader } from "../../components/home-header/HomeHeader";
import { ResultCard } from "../../components/result-card/ResultCard";
import { useAuthContext } from "../../contexts/AuthContext";
import { LanguageConstants } from "../../data/constants/language.constants";
import type { Problem } from "../../data/dto/problem.dto";
import type { Submission } from "../../data/dto/submission.dto";
import { celebrate } from "../../utils/celebrate";
import "./style.css";
import type { TestCase } from "../../data/dto/test-case.dto";

export const SubmissionScreen = () => {
  const { userData } = useAuthContext();
  const [language, setLanguage] = React.useState<string>("java");
  const [code, setCode] = React.useState<string>(
    LanguageConstants[language].text,
  );
  const [loadingSubmit, setLoadingSubmit] = React.useState<boolean>(false);
  const [loadingRun, setLoadingRun] = React.useState<boolean>(false);
  const idProblem = 1;
  const [problem, setProblem] = React.useState<Problem>();
  const [showPopup, setShowPopup] = React.useState<boolean>();
  const [submissionInfo, setSubmissionInfo] = React.useState<Submission | null>(
    null,
  );
  const [testCases, setTestCases] = React.useState<TestCase[] | null>(null);

  if (!userData) {
    return null;
  }

  React.useEffect(() => {
    const findProblem = async () => {
      try {
        const problem = await problemService.findById(idProblem);
        setProblem(problem);
        console.log(problem);
      } catch (e) {
        throw e;
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
  }, []);

  if (!problem) {
    return <div></div>;
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
        handleSearch={() => console.log("teste")}
        setText={() => console.log("teste")}
      />
      <div className="submission-container">
        <div className="submission-container-sides">
          <div className="submission-card title">
            <div className="submission-card-row">
              <h2>
                {problem.id}. {problem.title}
              </h2>
            </div>

            <div className="submission-card-points">
              <p>Points</p>
              <p className="submission-card-points-label">{problem.points}</p>
            </div>
          </div>

          <div className="submission-card">
            <div className="submission-card-row">
              <h3>Description</h3>
              <p>{problem.description}</p>
            </div>
            <hr color="#30363d" style={{ width: "100%" }} />
            <div className="submission-card-row">
              <h3>Input</h3>
              <p>
                {problem.input_description ||
                  "There are no inputs for this problem."}
              </p>
            </div>
            <hr color="#30363d" style={{ width: "100%" }} />
            <div className="submission-card-row">
              <h3>Output</h3>
              <p>{problem.output_description}</p>
            </div>
            <hr color="#30363d" style={{ width: "100%" }} />
            <div className="submission-card-row">
              <h3>Examples</h3>
              <div className="submission-examples">
                <div className="submission-example">
                  <p>Input Example</p>
                  <div className="submission-example-box">
                    <p>{problem.input_example}</p>
                  </div>
                </div>
                <div className="submission-example">
                  <p>Output Example</p>
                  <div className="submission-example-box">
                    <p>{problem.output_example}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="submission-container-sides">
          <div
            className="submission-card language-select-card"
            style={{ height: "auto" }}
          >
            <div className="submission-selector">
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
          <div className="submission-editor-wrapper">
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
