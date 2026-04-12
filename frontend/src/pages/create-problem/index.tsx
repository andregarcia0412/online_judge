import { ConfigProvider, Select, theme } from "antd";
import React from "react";
import { CreateProblemCard } from "../../components/card/create-problem-card/CreateProblemCard";
import { HomeHeader } from "../../components/home-header/HomeHeader";
import { CreateProblemInput } from "../../components/input/create-problem-input/CreateProblemInput";
import type { CreateProblemForm } from "../../data/dto/problem.dto";
import "./style.css";

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

        <CreateProblemCard title="Basic Info">
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

          <div className="inputs-row">
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
                styles={{
                  popup: {
                    root: {
                      backgroundColor: "rgba(17, 24, 39, 1)",
                    },
                  },
                }}
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
        </CreateProblemCard>

        <CreateProblemCard title="Problem Description">
          <CreateProblemInput
            title="Description"
            text={createProblemForm.description}
            setText={(text) =>
              setCreateProblemForm((prev) => ({
                ...prev,
                description: text,
              }))
            }
            placeholder="Describe the problem clearly and objectively"
            maxLength={1024}
            type="textarea"
            height={150}
          />

          <CreateProblemInput
            title="Input Description"
            text={createProblemForm.inputDescription}
            setText={(text) =>
              setCreateProblemForm((prev) => ({
                ...prev,
                inputDescription: text,
              }))
            }
            placeholder="Explain the input formatting"
            height={100}
            type="textarea"
            maxLength={512}
          />

          <CreateProblemInput
            title="Output Description"
            text={createProblemForm.outputDescription}
            setText={(text) =>
              setCreateProblemForm((prev) => ({
                ...prev,
                outputDescription: text,
              }))
            }
            placeholder="Explain the output formatting"
            height={100}
            type="textarea"
            maxLength={512}
          />
        </CreateProblemCard>

        <CreateProblemCard title="Examples">
          <div className="inputs-row">
            <CreateProblemInput
              placeholder="5\n10\n"
              setText={(text) =>
                setCreateProblemForm((prev) => ({
                  ...prev,
                  inputExample: text,
                }))
              }
              text={createProblemForm.inputExample}
              title="Input Example"
              height={100}
              maxLength={512}
              type="textarea"
            />

            <CreateProblemInput
              placeholder="15\n"
              setText={(text) =>
                setCreateProblemForm((prev) => ({
                  ...prev,
                  outputExample: text,
                }))
              }
              text={createProblemForm.outputExample}
              title="Output Example"
              height={100}
              maxLength={512}
              type="textarea"
            />
          </div>
        </CreateProblemCard>

        <CreateProblemCard
          title="Test Cases"
          subtitle="Add the test cases that will be used to validate the submissions"
        ></CreateProblemCard>
      </div>
    </div>
  );
};
