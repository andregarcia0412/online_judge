import { Editor } from "@monaco-editor/react";
import React from "react";
import "./style.css";

export const Submission = () => {
  const [code, setCode] = React.useState<string>("//code here...");
  const [language, setLanguage] = React.useState<string>("javascript")
  const idProblem = 1;
  const userId = localStorage.getItem("")

  return (
    <div className="submission-container">
      <div className="submission-editor-wrapper">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          onChange={(value) => setCode(value ?? "")}
          theme="vs-dark"
        />
      </div>
    </div>
  );
};
