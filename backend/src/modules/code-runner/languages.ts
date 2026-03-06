import { LanguageConfig } from 'src/modules/test-runner/language-config.interface';

export const LANGUAGES: Record<string, LanguageConfig> = {
  python: {
    name: 'python',
    imageName: 'python:3.9-alpine',
    fileName: 'main.py',
    runCommand: 'python main.py',
    timeoutMs: 2000,
  },

  node: {
    name: 'node',
    imageName: 'node:20-alpine',
    fileName: 'main.js',
    runCommand: 'node main.js',
    timeoutMs: 2000,
  },

  c: {
    name: 'c',
    imageName: 'gcc:13',
    fileName: 'main.c',
    runCommand: 'gcc main.c -O2 -o main && ./main',
    timeoutMs: 4000,
  },

  java: {
    name: 'java',
    imageName: 'eclipse-temurin:21',
    fileName: 'Main.java',
    runCommand: 'javac Main.java && java Main',
    timeoutMs: 4000,
  },
};
