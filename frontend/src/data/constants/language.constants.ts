export type LanguageConstantsType = {
  text: string;
  languageName: string;
};

export const LanguageConstants: Record<string, LanguageConstantsType> = {
  python: {
    text: "# Code your solution here",
    languageName: "python",
  },
  node: {
    text: "// Code your solution here",
    languageName: "javascript",
  },
  java: {
    text: "// Code your solution here",
    languageName: "java",
  },
  c: {
    text: "// Code your solution here",
    languageName: "c",
  },
  ruby: {
    text: "# Code your solution here",
    languageName: "ruby",
  },
};
