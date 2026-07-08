import { ConfigProvider, notification, Select, theme } from "antd";
import axios from "axios";
import React from "react";
import { problemService } from "../../api/services/problem.service";
import Add from "../../assets/add.svg";
import RingResize from "../../assets/ring-resize.svg";
import { CategoryBadge } from "../../components/card/category-badge/CategoryBadge";
import { CreateProblemCard } from "../../components/card/create-problem-card/CreateProblemCard";
import { TestCaseCard } from "../../components/card/test-case-card/TestCaseCard";
import { TestCaseWarningCard } from "../../components/card/test-case-warning-card/TestCaseWarningCard";
import { HomeHeader } from "../../components/home-header/HomeHeader";
import Button from "../../components/input/button/Button";
import { CreateProblemInput } from "../../components/input/create-problem-input/CreateProblemInput";
import { Popover } from "../../components/popover/Popover";
import type {
  CategoryDto,
  CreateProblemDto,
  CreateProblemForm,
} from "../../data/dto/problem.dto";
import { useFetch } from "../../hooks/useFetch";
import { normalizeNewLines } from "../../utils/normalizeNewLines";
import { createProblemSchema } from "../../validations/create-problem.schema";
import "./style.css";
import { useClickOutside } from "../../hooks/useClickOutside";

type TestCase = {
  input: string;
  output: string;
};

export const CreateProblem = () => {
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = React.useCallback(
    (
      type: "success" | "info" | "warning" | "error",
      title: string,
      message: string,
    ) => {
      api[type]({
        title: title,
        description: message,
      });
    },
    [api],
  );
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
      testCaseInput: "",
      testCaseOutput: "",
    });
  const [testCases, setTestCases] = React.useState<TestCase[]>([]);
  const [loadingCreate, setLoadingCreate] = React.useState<boolean>(false);
  const [visiblePopover, setVisiblePopover] = React.useState<boolean>(false);
  const popoverRef = React.useRef<HTMLDivElement | null>(null);

  useClickOutside(popoverRef, () => setVisiblePopover(false));

  const { data: availableCategoriesData, error: categoriesError } = useFetch<
    CategoryDto[]
  >(() => problemService.findAllCategories(), []);
  const availableCategories = availableCategoriesData ?? [];

  React.useEffect(() => {
    if (categoriesError) {
      openNotificationWithIcon(
        "error",
        "Error",
        axios.isAxiosError(categoriesError) && categoriesError.response
          ? categoriesError.response.data.message
          : "Error fetching available categories",
      );
    }
  }, [categoriesError, openNotificationWithIcon]);

  const handleCreateTestCase = () => {
    setTestCases((prev) => [
      ...prev,
      {
        input: createProblemForm.testCaseInput,
        output: createProblemForm.testCaseOutput,
      },
    ]);
    setCreateProblemForm((prev) => ({
      ...prev,
      testCaseInput: "",
      testCaseOutput: "",
    }));
  };

  const handleCreateProblem = async () => {
    if (loadingCreate) return;

    const parsing = createProblemSchema.safeParse(createProblemForm);

    if (!parsing.success) {
      openNotificationWithIcon(
        "error",
        "Error",
        parsing.error.issues[0].message,
      );
      return;
    }

    if (testCases.length <= 0) {
      openNotificationWithIcon(
        "error",
        "Error",
        "Problem should have at least one Test Case",
      );
      return;
    }

    setLoadingCreate(true);

    try {
      const createProblemDto: CreateProblemDto = {
        title: createProblemForm.title,
        points: Number(createProblemForm.points),
        author: createProblemForm.author,
        description: createProblemForm.description,
        input_description: createProblemForm.inputDescription,
        output_description: createProblemForm.outputDescription,
        input_example: createProblemForm.inputExample,
        output_example: createProblemForm.outputExample,
        difficulty: createProblemForm.difficulty,
        category: createProblemForm.categories.map((category) => ({
          category: category.value,
        })),
        test_cases: testCases.map((testCase) => ({
          input: normalizeNewLines(testCase.input),
          output: normalizeNewLines(testCase.output),
        })),
      };
      const response = await problemService.create(createProblemDto);
      console.log(response);
      openNotificationWithIcon(
        "success",
        "Success!",
        "Problem created successfully",
      );
    } catch (e) {
      openNotificationWithIcon(
        "error",
        "Error",
        axios.isAxiosError(e) ? e.response?.data.message : "Unknown Error",
      );
    } finally {
      setLoadingCreate(false);
    }
  };

  return (
    <div>
      <HomeHeader setText={() => {}} handleSearch={() => {}} text="" />
      <div className="create-container">
        <div className="create-title">
          <h1>Create New Problem</h1>
          <p>Fill in the fields below to create a new programming problem</p>
        </div>

        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
            token: {
              colorBgElevated: "rgba(0, 0, 0, 0.8)",
              colorBorder: "#30363d",
              borderRadiusLG: 6,
            },
            components: {
              Notification: {
                colorBgElevated: "rgba(0, 0, 0, 0.8)",
              },
            },
          }}
        >
          {contextHolder}
        </ConfigProvider>

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

          <div className="create-categories-wrapper" ref={popoverRef}>
            <div className="create-categories-title">
              <p>Categories</p>

              <button onClick={() => setVisiblePopover((prev) => !prev)}>
                <img src={Add} />
              </button>

              {
                <Popover open={visiblePopover}>
                  {availableCategories.length > 0 ? (
                    availableCategories.map((category) => {
                      const isSelected = createProblemForm.categories.some(
                        (value) => value.value === category.value,
                      );

                      return (
                        <CategoryBadge
                          title={category.label}
                          highlighted={isSelected}
                          onClick={() =>
                            setCreateProblemForm((prev) => ({
                              ...prev,
                              categories: isSelected
                                ? prev.categories
                                : [...prev.categories, category],
                            }))
                          }
                          onSelectedClick={() =>
                            setCreateProblemForm((prev) => ({
                              ...prev,
                              categories: prev.categories.filter(
                                (value) => value.value !== category.value,
                              ),
                            }))
                          }
                        />
                      );
                    })
                  ) : (
                    <img src={RingResize} />
                  )}
                </Popover>
              }
            </div>
            <div className="create-categories">
              {createProblemForm.categories.length <= 0 ? (
                <p>No selected categories</p>
              ) : (
                createProblemForm.categories.map((category) => {
                  return (
                    <CategoryBadge
                      title={category.label}
                      highlighted
                      readonly
                    />
                  );
                })
              )}
            </div>
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
        >
          <div className="create-test-case-card-inner">
            <TestCaseWarningCard />

            {testCases.length > 0 &&
              testCases.map((testCase, index) => {
                return (
                  <TestCaseCard
                    onDelete={() =>
                      setTestCases((prev) => prev.filter((_, i) => i !== index))
                    }
                    index={index + 1}
                    input={testCase.input}
                    output={testCase.output}
                  />
                );
              })}

            <div className="create-test-case-container">
              <p>Add new test case</p>
              <div className="inputs-row">
                <CreateProblemInput
                  text={createProblemForm.testCaseInput}
                  setText={(text) =>
                    setCreateProblemForm((prev) => ({
                      ...prev,
                      testCaseInput: text,
                    }))
                  }
                  placeholder="10\n5\n"
                  title="Input"
                  type="textarea"
                  height={100}
                />
                <CreateProblemInput
                  text={createProblemForm.testCaseOutput}
                  setText={(text) =>
                    setCreateProblemForm((prev) => ({
                      ...prev,
                      testCaseOutput: text,
                    }))
                  }
                  placeholder="15\n"
                  title="Output"
                  type="textarea"
                  height={100}
                />
              </div>
              <Button
                background="linear-gradient(to right, #9333EA, #2563EB)"
                loading={false}
                onClick={handleCreateTestCase}
                text="Add Test Case"
                height={40}
                disabled={
                  !createProblemForm.testCaseInput ||
                  !createProblemForm.testCaseOutput
                }
              />
            </div>
          </div>
        </CreateProblemCard>

        <div className="create-button-row">
          <Button
            background="rgba(0, 0, 0, 0.5)"
            loading={false}
            onClick={() => ""}
            text="Cancel"
            border="1px solid #374151"
            height={40}
          />
          <Button
            background="linear-gradient(to right, #9333EA, #2563EB)"
            loading={loadingCreate}
            onClick={handleCreateProblem}
            text="Create Problem"
            height={40}
          />
        </div>
      </div>
    </div>
  );
};
