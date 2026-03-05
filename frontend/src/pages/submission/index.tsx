import { Editor } from "@monaco-editor/react";
import { ConfigProvider, Select, theme } from "antd";
import React from "react";
import { problemService } from "../../api/services/problem.service";
import { submissionService } from "../../api/services/submission.service";
import AuthButton from "../../components/auth-button/AuthButton";
import { useAuthContext } from "../../contexts/AuthContext";
import type { Problem } from "../../data/dto/problem.dto";
import "./style.css";
import { HomeHeader } from "../../components/home-header/HomeHeader";

export const Submission = () => {
  const { userData } = useAuthContext();
  const [code, setCode] = React.useState<string>("//code here...");
  const [language, setLanguage] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const idProblem = 1;
  const [problem, setProblem] = React.useState<Problem>();

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

    findProblem();
  }, []);

  if (!problem) {
    return <div></div>;
  }

  const handleSubmit = async () => {
    if (loading || !language) {
      return;
    }

    setLoading(true);
    try {
      const response = await submissionService.createSubmission({
        id_problem: idProblem,
        id_user: userData?.user.id,
        language: language,
        text: code,
      });
      console.log(response);
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <HomeHeader
        handleSearch={() => console.log("teste")}
        setText={() => console.log("teste")}
      />
      <div className="submission-container">
        <div className="submission-container-sides">
          <div className="submission-card">
            <div className="submission-card-row">
              <p>BEE 1000</p>
              <h2>Hello World!</h2>
              <p>100</p>
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
                {problem.input_example ||
                  "There are no inputs for this problem."}
              </p>
            </div>
            <hr color="#30363d" style={{ width: "100%" }} />
            <div className="submission-card-row">
              <h3>Output</h3>
              <p>{problem.output_example}</p>
            </div>
            <hr color="#30363d" style={{ width: "100%" }} />
            <div className="submission-card-row">
              <h3>Examples</h3>
              <div>
                <div>
                  <p>Input Example</p>
                </div>
                <div>
                  <p>Output Example</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="submission-container-sides">
          <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
            <Select
              style={{ width: "100%" }}
              placeholder="Choose a language"
              value={language}
              onChange={(value) => setLanguage(value)}
              options={[
                { value: "c", label: "C99" },
                { value: "java", label: "Java 21" },
                { value: "node", label: "Javascript" },
                { value: "python", label: "Python 3" },
              ]}
            />
          </ConfigProvider>
          <div className="submission-editor-wrapper">
            <Editor
              height="100%"
              defaultLanguage="plaintext"
              value={code}
              onChange={(value) => setCode(value ?? "")}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontFamily: "JetBrains Mono",
              }}
            />
          </div>
          <AuthButton
            onClick={handleSubmit}
            loading={loading}
            text="Enviar"
            background="blue"
          />
        </div>
      </div>
    </div>
  );
};
