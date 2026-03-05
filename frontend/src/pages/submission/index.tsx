import { Editor } from "@monaco-editor/react";
import React from "react";
import "./style.css";
import AuthButton from "../../components/auth-button/AuthButton";
import { submissionService } from "../../api/services/submission.service";
import { useAuthContext } from "../../contexts/AuthContext";

export const Submission = () => {
  const { userData } = useAuthContext();
  const [code, setCode] = React.useState<string>("//code here...");
  const [language, setLanguage] = React.useState<string>("java");
  const [loading, setLoading] = React.useState<boolean>(false);
  const idProblem = 1;

  if (!userData) {
    return <div>loading...</div>;
  }

  const handleSubmit = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    console.log(userData)
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
    <div className="submission-container">
      <div className="submission-editor-wrapper">
        <Editor
          height="100%"
          defaultLanguage="java"
          value={code}
          onChange={(value) => setCode(value ?? "")}
          theme="vs-dark"
        />
      </div>
      <AuthButton
        onClick={handleSubmit}
        loading={loading}
        text="Enviar"
        background="blue"
      />
    </div>
  );
};
