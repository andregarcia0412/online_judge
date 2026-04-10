import React from "react";
import { HomeHeader } from "../../components/home-header/HomeHeader";
import { CreateProblemInput } from "../../components/input/create-problem-input/CreateProblemInput";
import type { CreateProblemForm } from "../../data/dto/problem.dto";
import "./style.css";
import { ConfigProvider, Select, theme } from "antd";
import { CategoryBadge } from "../../components/card/category-badge/CategoryBadge";

export const CreateProblem = () => {
  const [createProblemForm, setCreateProblemForm] =
    React.useState<CreateProblemForm>({
      title: "",
      author: "",
      points: "",
      difficulty: "",
      categories: [],
      description: "",
      inputDescription: "",
      outputDescription: "",
      inputExample: "",
      outputExample: "",
      testCases: [],
    });

  return (
    <div>
      <HomeHeader setText={() => {}} handleSearch={() => {}} text="" />
      <div className="create-container">
        <div className="create-title">
          <h1>Create New Problem</h1>
          <p>Fill in the fields below to create a new programming problem</p>
        </div>

        <div className="create-card">
          <h2>Basic Info</h2>

          <CreateProblemInput
            placeholder="E.g: Hello World!"
            text={createProblemForm.title}
            setText={(text) =>
              setCreateProblemForm((prev) => ({
                ...prev,
                title: text,
              }))
            }
            maxLength={32}
            title="Problem Title"
          />

          <div className="autor-points-row">
            <CreateProblemInput
              placeholder="Your name or username"
              text={createProblemForm.author}
              setText={(text) =>
                setCreateProblemForm((prev) => ({
                  ...prev,
                  author: text,
                }))
              }
              maxLength={32}
              title="Author"
            />
            <CreateProblemInput
              placeholder="4.5"
              text={createProblemForm.points}
              setText={(text) =>
                setCreateProblemForm((prev) => ({
                  ...prev,
                  points: text,
                }))
              }
              title="Points"
            />
          </div>
          <div className="create-selector">
            <p>Difficulty</p>
            <ConfigProvider
              theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                  colorPrimaryHover: "#8B5CF6",
                  colorPrimary: "#8B5CF6",
                  colorBgBase: "rgba(17, 24, 39, 0.2)",
                  colorBorder: "#374151",
                },
              }}
            >
              <Select
                style={{ width: "100%" }}
                placeholder="Choose a difficulty"
                options={[
                  { value: "easy", label: "Easy" },
                  { value: "medium", label: "Medium" },
                  { value: "hard", label: "Hard" },
                ]}
                value={
                  createProblemForm.difficulty
                    ? createProblemForm.difficulty
                    : null
                }
                onChange={(value) =>
                  setCreateProblemForm((prev) => ({
                    ...prev,
                    difficulty: value,
                  }))
                }
              />
            </ConfigProvider>
          </div>

          <CategoryBadge title="Grafos" onClick={() => console.log("Clicou")} />
        </div>
      </div>
    </div>
  );
};
