import { LanguageConfig } from 'src/shared/provider/code-runner/infra/languages/language-config.interface';

export const LANGUAGES: Record<string, LanguageConfig> = {
  python: {
    name: 'python',
    imageName: 'python:3.9-alpine',
    fileName: 'main.py',
    runCommand: 'python main.py',
    timeoutMs: 2000,
  },

  javascript: {
    name: 'javascript',
    imageName: 'node:24-alpine',
    fileName: 'main.js',
    runCommand: 'node main.js',
    timeoutMs: 2000,
  },

  c: {
    name: 'c',
    imageName: 'gcc:13',
    fileName: 'main.c',
    compileCommand: 'gcc main.c -O2 -o main',
    runCommand: './main',
    timeoutMs: 2000,
  },

  cpp: {
    name: 'cpp',
    imageName: 'gcc:13',
    fileName: 'main.cpp',
    compileCommand: 'g++ main.cpp -O2 -std=c++17 -o main',
    runCommand: './main',
    timeoutMs: 2000,
  },

  java: {
    name: 'java',
    imageName: 'eclipse-temurin:21',
    fileName: 'Main.java',
    compileCommand: 'javac Main.java',
    runCommand: 'java Main',
    timeoutMs: 2000,
  },

  ruby: {
    name: 'ruby',
    imageName: 'ruby:3.3-alpine',
    fileName: 'main.ruby',
    runCommand: 'ruby main.ruby',
    timeoutMs: 2000,
  },

  kotlin: {
    name: 'kotlin',
    imageName: 'zenika/kotlin',
    fileName: 'Main.kt',
    compileCommand: 'kotlinc Main.kt -include-runtime -d Main.jar',
    runCommand: 'java -jar Main.jar',
    timeoutMs: 2000,
  },

  lua: {
    name: 'lua',
    imageName: 'nickblah/lua',
    fileName: 'main.lua',
    runCommand: 'lua main.lua',
    timeoutMs: 2000,
  },
  clojure: {
    name: 'clojure',
    imageName: 'babashka/babashka',
    fileName: 'main.clj',
    runCommand: 'bb main.clj',
    timeoutMs: 2000,
  },
  go: {
    name: 'go',
    imageName: 'golang:1.22-alpine',
    fileName: 'main.go',
    compileCommand: 'go build -o main main.go',
    runCommand: './main',
    timeoutMs: 2000,
  },
  rust: {
    name: 'rust',
    imageName: 'rust:1.76',
    fileName: 'main.rs',
    compileCommand: 'rustc main.rs -O -o main',
    runCommand: './main',
    timeoutMs: 2000,
  },
  csharp: {
    name: 'csharp',
    imageName: 'mcr.microsoft.com/dotnet/sdk:8.0',
    fileName: 'Program.cs',
    compileCommand:
      'dotnet new console -n app && mv Program.cs app/Program.cs && cd app && dotnet build -c Release',
    runCommand: 'cd app/bin/Release/net8.0 && dotnet app.dll',
    timeoutMs: 2000,
  },
  php: {
    name: 'php',
    imageName: 'php:8.3-cli',
    fileName: 'main.php',
    runCommand: 'php main.php',
    timeoutMs: 2000,
  },
  typescript: {
    name: 'typescript',
    imageName: 'node:24-alpine',
    fileName: 'main.ts',
    runCommand: 'node main.ts',
    timeoutMs: 2000,
  },
};
