export type LanguageConstantsType = {
  text: string;
  languageName: string;
  label: string;
};

export const LanguageConstants: Record<string, LanguageConstantsType> = {
  python: {
    text: "# Code your solution here",
    languageName: "python",
    label: "Python 3",
  },
  javascript: {
    text: "// Code your solution here",
    languageName: "javascript",
    label: "JavaScript",
  },
  java: {
    text: "// Code your solution here",
    languageName: "java",
    label: "Java 21",
  },
  c: {
    text: "// Code your solution here",
    languageName: "c",
    label: "C99",
  },
  ruby: {
    text: "# Code your solution here",
    languageName: "ruby",
    label: "Ruby",
  },
  kotlin: {
    text: "// Code your solution here",
    languageName: "kotlin",
    label: "Kotlin",
  },
  lua: {
    text: "-- Code your solution here",
    languageName: "lua",
    label: "Lua",
  },
  cpp: {
    text: "// Code your solution here",
    languageName: "cpp",
    label: "C++",
  },
  clojure: {
    text: ";; Code your solution here",
    languageName: "clojure",
    label: "Clojure",
  },
  rust: {
    text: "// Code your solution here",
    languageName: "rust",
    label: "Rust",
  },
  php: {
    text: "// Code your solution here",
    languageName: "php",
    label: "PHP",
  },
};
