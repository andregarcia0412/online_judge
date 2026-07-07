import { CategoryEnum } from '../../problem/enum/category.enum';
import { ProblemDifficultyEnum } from '../../problem/enum/problem-difficulty.enum';

interface ProblemSeed {
  title: string;
  points: number;
  author: string;
  description: string;
  inputDescription: string;
  outputDescription: string;
  inputExample: string;
  outputExample: string;
  difficulty: ProblemDifficultyEnum;
  category: CategoryEnum[];
  testCases: { input: string; output: string }[];
}

export const PROBLEM_SEED: ProblemSeed[] = [
  {
    title: 'Hello World!',
    points: 5,
    author: 'Online Judge',
    description:
      'Your first problem: simply print the phrase "Hello World!" (without the quotes) to the standard output.',
    inputDescription: 'This problem has no input.',
    outputDescription:
      'Print the message "Hello World!" followed by a line break.',
    inputExample: '',
    outputExample: 'Hello World!',
    difficulty: ProblemDifficultyEnum.EASY,
    category: [CategoryEnum.BASICS],
    testCases: [{ input: '', output: 'Hello World!\n' }],
  },
  {
    title: 'Simple Sum',
    points: 5,
    author: 'Online Judge',
    description:
      'Read two integer values, A and B, calculate their sum and print the result. This is a classic introductory problem (beecrowd 1003).',
    inputDescription:
      'The input contains two integer values, A and B, one per line.',
    outputDescription:
      'Print the message "SUM" followed by the sum of A and B, separated by a space.',
    inputExample: '30\n10',
    outputExample: 'SUM = 40',
    difficulty: ProblemDifficultyEnum.EASY,
    category: [CategoryEnum.BASICS, CategoryEnum.MATH],
    testCases: [
      { input: '30\n10\n', output: 'SUM = 40\n' },
      { input: '-30\n10\n', output: 'SUM = -20\n' },
      { input: '0\n0\n', output: 'SUM = 0\n' },
    ],
  },
  {
    title: 'Even or Odd',
    points: 5,
    author: 'Online Judge',
    description:
      'Read an integer value N and determine whether it is even (PAR) or odd (IMPAR).',
    inputDescription: 'The input contains a single integer value N.',
    outputDescription: 'Print "PAR" if N is even, or "IMPAR" if N is odd.',
    inputExample: '7',
    outputExample: 'IMPAR',
    difficulty: ProblemDifficultyEnum.EASY,
    category: [CategoryEnum.BASICS, CategoryEnum.MATH],
    testCases: [
      { input: '7\n', output: 'IMPAR\n' },
      { input: '10\n', output: 'PAR\n' },
      { input: '0\n', output: 'PAR\n' },
    ],
  },
  {
    title: 'FizzBuzz',
    points: 10,
    author: 'Online Judge',
    description:
      'For each integer from 1 to N, print "Fizz" if it is divisible by 3, "Buzz" if divisible by 5, "FizzBuzz" if divisible by both, otherwise the number itself.',
    inputDescription: 'The input contains a single integer N (1 <= N <= 100).',
    outputDescription:
      'Print one line per integer from 1 to N following the FizzBuzz rules.',
    inputExample: '5',
    outputExample: '1\n2\nFizz\n4\nBuzz',
    difficulty: ProblemDifficultyEnum.EASY,
    category: [CategoryEnum.BASICS, CategoryEnum.MATH],
    testCases: [
      { input: '5\n', output: '1\n2\nFizz\n4\nBuzz\n' },
      {
        input: '15\n',
        output:
          '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n',
      },
    ],
  },
  {
    title: 'Two Sum',
    points: 15,
    author: 'Online Judge',
    description:
      'Given an array of integers and a target value, return the 0-based indices of the two numbers that add up to the target. Exactly one solution exists and the same element may not be used twice (LeetCode #1).',
    inputDescription:
      'First line: N, the array size. Second line: N integers. Third line: the target value.',
    outputDescription:
      'Print the two indices in ascending order, separated by a space.',
    inputExample: '4\n2 7 11 15\n9',
    outputExample: '0 1',
    difficulty: ProblemDifficultyEnum.EASY,
    category: [CategoryEnum.DATA_STRUCTURES, CategoryEnum.SEARCH],
    testCases: [
      { input: '4\n2 7 11 15\n9\n', output: '0 1\n' },
      { input: '3\n3 2 4\n6\n', output: '1 2\n' },
      { input: '2\n3 3\n6\n', output: '0 1\n' },
    ],
  },
  {
    title: 'Valid Palindrome',
    points: 15,
    author: 'Online Judge',
    description:
      'Read a string and determine if it is a palindrome, i.e. it reads the same forwards and backwards. The comparison is case-sensitive and considers all characters.',
    inputDescription: 'The input contains a single line with a string S.',
    outputDescription: 'Print "YES" if S is a palindrome, otherwise "NO".',
    inputExample: 'arara',
    outputExample: 'YES',
    difficulty: ProblemDifficultyEnum.EASY,
    category: [CategoryEnum.TWO_POINTERS, CategoryEnum.BASICS],
    testCases: [
      { input: 'arara\n', output: 'YES\n' },
      { input: 'hello\n', output: 'NO\n' },
      { input: 'abba\n', output: 'YES\n' },
    ],
  },
  {
    title: 'Factorial',
    points: 15,
    author: 'Online Judge',
    description:
      'Read an integer N and print N! (the factorial of N), defined as the product of all positive integers from 1 to N. By definition 0! = 1.',
    inputDescription: 'The input contains a single integer N (0 <= N <= 12).',
    outputDescription: 'Print the value of N!.',
    inputExample: '5',
    outputExample: '120',
    difficulty: ProblemDifficultyEnum.EASY,
    category: [CategoryEnum.MATH, CategoryEnum.DYNAMIC_PROGRAMMING],
    testCases: [
      { input: '5\n', output: '120\n' },
      { input: '0\n', output: '1\n' },
      { input: '10\n', output: '3628800\n' },
    ],
  },
  {
    title: 'Fibonacci Sequence',
    points: 20,
    author: 'Online Judge',
    description:
      'Print the first N terms of the Fibonacci sequence, where F(0) = 0, F(1) = 1 and F(i) = F(i-1) + F(i-2) for i >= 2.',
    inputDescription: 'The input contains a single integer N (1 <= N <= 40).',
    outputDescription:
      'Print the first N Fibonacci numbers separated by a space.',
    inputExample: '6',
    outputExample: '0 1 1 2 3 5',
    difficulty: ProblemDifficultyEnum.MEDIUM,
    category: [CategoryEnum.DYNAMIC_PROGRAMMING, CategoryEnum.MATH],
    testCases: [
      { input: '6\n', output: '0 1 1 2 3 5\n' },
      { input: '1\n', output: '0\n' },
      { input: '10\n', output: '0 1 1 2 3 5 8 13 21 34\n' },
    ],
  },
  {
    title: 'Bubble Sort Array',
    points: 20,
    author: 'Online Judge',
    description:
      'Read an array of N integers and print it sorted in non-decreasing (ascending) order.',
    inputDescription:
      'First line: N, the array size. Second line: N integers separated by spaces.',
    outputDescription:
      'Print the N integers sorted in ascending order, separated by a space.',
    inputExample: '5\n5 1 4 2 8',
    outputExample: '1 2 4 5 8',
    difficulty: ProblemDifficultyEnum.MEDIUM,
    category: [CategoryEnum.SORTING, CategoryEnum.DATA_STRUCTURES],
    testCases: [
      { input: '5\n5 1 4 2 8\n', output: '1 2 4 5 8\n' },
      { input: '3\n3 2 1\n', output: '1 2 3\n' },
      { input: '1\n42\n', output: '42\n' },
    ],
  },
  {
    title: 'Maximum Subarray',
    points: 30,
    author: 'Online Judge',
    description:
      "Given an integer array, find the contiguous subarray with the largest sum and print that sum (Kadane's algorithm, LeetCode #53).",
    inputDescription:
      'First line: N, the array size. Second line: N integers separated by spaces.',
    outputDescription: 'Print the maximum contiguous subarray sum.',
    inputExample: '9\n-2 1 -3 4 -1 2 1 -5 4',
    outputExample: '6',
    difficulty: ProblemDifficultyEnum.HARD,
    category: [CategoryEnum.DYNAMIC_PROGRAMMING, CategoryEnum.GREEDY],
    testCases: [
      { input: '9\n-2 1 -3 4 -1 2 1 -5 4\n', output: '6\n' },
      { input: '1\n1\n', output: '1\n' },
      { input: '5\n5 4 -1 7 8\n', output: '23\n' },
    ],
  },
  {
    title: 'Temperature Conversion',
    points: 5,
    author: 'Online Judge',
    description:
      'Read a temperature in degrees Celsius and convert it to Fahrenheit using the formula F = C * 9 / 5 + 32.',
    inputDescription:
      'The input contains a single integer C, the temperature in Celsius.',
    outputDescription:
      'Print the temperature in Fahrenheit, rounded down to an integer.',
    inputExample: '100',
    outputExample: '212',
    difficulty: ProblemDifficultyEnum.EASY,
    category: [CategoryEnum.BASICS, CategoryEnum.MATH],
    testCases: [
      { input: '100\n', output: '212\n' },
      { input: '0\n', output: '32\n' },
      { input: '-40\n', output: '-40\n' },
    ],
  },
  {
    title: 'Count Vowels',
    points: 10,
    author: 'Online Judge',
    description:
      'Read a lowercase string and count how many vowels (a, e, i, o, u) it contains.',
    inputDescription: 'The input contains a single line with a string S.',
    outputDescription: 'Print the number of vowels in S.',
    inputExample: 'programming',
    outputExample: '3',
    difficulty: ProblemDifficultyEnum.EASY,
    category: [CategoryEnum.BASICS],
    testCases: [
      { input: 'programming\n', output: '3\n' },
      { input: 'aeiou\n', output: '5\n' },
      { input: 'xyz\n', output: '0\n' },
    ],
  },
  {
    title: 'GCD of Two Numbers',
    points: 15,
    author: 'Online Judge',
    description:
      'Read two positive integers A and B and print their greatest common divisor (GCD) using the Euclidean algorithm.',
    inputDescription:
      'The input contains two integers A and B, separated by a space.',
    outputDescription: 'Print the GCD of A and B.',
    inputExample: '48 18',
    outputExample: '6',
    difficulty: ProblemDifficultyEnum.MEDIUM,
    category: [CategoryEnum.MATH],
    testCases: [
      { input: '48 18\n', output: '6\n' },
      { input: '17 5\n', output: '1\n' },
      { input: '100 100\n', output: '100\n' },
    ],
  },
  {
    title: 'Binary Search',
    points: 20,
    author: 'Online Judge',
    description:
      'Given a sorted array of N integers and a target value, print the 0-based index of the target, or -1 if it is not present. Use binary search.',
    inputDescription:
      'First line: N. Second line: N sorted integers. Third line: the target value.',
    outputDescription: 'Print the index of the target, or -1 if not found.',
    inputExample: '5\n1 3 5 7 9\n7',
    outputExample: '3',
    difficulty: ProblemDifficultyEnum.MEDIUM,
    category: [CategoryEnum.SEARCH, CategoryEnum.DATA_STRUCTURES],
    testCases: [
      { input: '5\n1 3 5 7 9\n7\n', output: '3\n' },
      { input: '5\n1 3 5 7 9\n4\n', output: '-1\n' },
      { input: '1\n10\n10\n', output: '0\n' },
    ],
  },
  {
    title: 'Coin Change',
    points: 30,
    author: 'Online Judge',
    description:
      'Given a set of coin denominations and a target amount, print the minimum number of coins needed to make the amount, or -1 if it is impossible (LeetCode #322).',
    inputDescription:
      'First line: N, the number of coins. Second line: N denominations. Third line: the target amount.',
    outputDescription:
      'Print the minimum number of coins, or -1 if the amount cannot be formed.',
    inputExample: '3\n1 2 5\n11',
    outputExample: '3',
    difficulty: ProblemDifficultyEnum.HARD,
    category: [CategoryEnum.DYNAMIC_PROGRAMMING, CategoryEnum.GREEDY],
    testCases: [
      { input: '3\n1 2 5\n11\n', output: '3\n' },
      { input: '1\n2\n3\n', output: '-1\n' },
      { input: '1\n1\n0\n', output: '0\n' },
    ],
  },
  {
    title: 'Count Islands',
    points: 35,
    author: 'Online Judge',
    description:
      'Given a grid of 0s (water) and 1s (land), count the number of islands. An island is a group of adjacent land cells connected horizontally or vertically (LeetCode #200).',
    inputDescription:
      'First line: R and C, the grid dimensions. Next R lines: C characters (0 or 1) each.',
    outputDescription: 'Print the number of islands in the grid.',
    inputExample: '3 3\n110\n010\n001',
    outputExample: '2',
    difficulty: ProblemDifficultyEnum.HARD,
    category: [CategoryEnum.GRAPH, CategoryEnum.SEARCH],
    testCases: [
      { input: '3 3\n110\n010\n001\n', output: '2\n' },
      { input: '1 1\n0\n', output: '0\n' },
      { input: '2 2\n11\n11\n', output: '1\n' },
    ],
  },
  {
    title: 'Generate Permutations',
    points: 35,
    author: 'Online Judge',
    description:
      'Read an integer N and print all permutations of the numbers from 1 to N in lexicographic order, one per line, using backtracking.',
    inputDescription: 'The input contains a single integer N (1 <= N <= 6).',
    outputDescription:
      'Print each permutation on its own line, values separated by spaces, in lexicographic order.',
    inputExample: '3',
    outputExample: '1 2 3\n1 3 2\n2 1 3\n2 3 1\n3 1 2\n3 2 1',
    difficulty: ProblemDifficultyEnum.HARD,
    category: [CategoryEnum.BACKTRACKING],
    testCases: [
      { input: '1\n', output: '1\n' },
      { input: '2\n', output: '1 2\n2 1\n' },
      {
        input: '3\n',
        output: '1 2 3\n1 3 2\n2 1 3\n2 3 1\n3 1 2\n3 2 1\n',
      },
    ],
  },
];
