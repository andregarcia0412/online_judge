import { LanguageConfig } from 'src/modules/test-runner/language-config.interface';

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
    imageName: 'node:20-alpine',
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
};
