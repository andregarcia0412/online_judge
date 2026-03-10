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
    text: "const input = require('fs').readFileSync('/dev/stdin', 'utf-8');\nconst lines = input.split(' ');\n\n// Code your solution here\n",
    languageName: "javascript",
    label: "JavaScript",
  },
  typescript: {
    text: "import * as fs from 'fs';\nconst input: string = fs.readFileSync('/dev/stdin', 'utf-8');\nconst lines: string[] = input.split(' ');\n\n// Code your solution here\n",
    languageName: "typescript",
    label: "TypeScript",
  },
  java: {
    text: "class Main{\n  public static void main(String[] args){\n\n    //Code your solution here\n\n  }\n}",
    languageName: "java",
    label: "Java 21",
  },
  c: {
    text: "#include <stdio.h>\n\nint main(){\n\n  // Code your solution here\n\n return 0;\n}",
    languageName: "c",
    label: "C99",
  },
  ruby: {
    text: "# Code your solution here",
    languageName: "ruby",
    label: "Ruby",
  },
  kotlin: {
    text: "import java.util.*\n\nfun main(args: Array<String>) {\n\n  // Code your solution here\n\n}",
    languageName: "kotlin",
    label: "Kotlin",
  },
  lua: {
    text: "-- Code your solution here",
    languageName: "lua",
    label: "Lua",
  },
  cpp: {
    text: "#include <iostream>\n\nint main(){\n\n  // Code your solution here\n\n  return 0;\n}",
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
