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
  {
    title: 'Product of Two Numbers',
    points: 5,
    author: 'Online Judge',
    description:
      'Read two integer values A and B and print their product (beecrowd 1004).',
    inputDescription:
      'The input contains two integers A and B, separated by a space.',
    outputDescription: 'Print the product of A and B.',
    inputExample: '6 7',
    outputExample: '42',
    difficulty: ProblemDifficultyEnum.EASY,
    category: [CategoryEnum.BASICS, CategoryEnum.MATH],
    testCases: [
      { input: '6 7\n', output: '42\n' },
      { input: '-3 5\n', output: '-15\n' },
      { input: '0 100\n', output: '0\n' },
    ],
  },
  {
    title: 'Simple Subtraction',
    points: 5,
    author: 'Online Judge',
    description:
      'Read two integer values A and B and print the result of A minus B.',
    inputDescription:
      'The input contains two integers A and B, separated by a space.',
    outputDescription: 'Print the value of A - B.',
    inputExample: '10 3',
    outputExample: '7',
    difficulty: ProblemDifficultyEnum.EASY,
    category: [CategoryEnum.BASICS, CategoryEnum.MATH],
    testCases: [
      { input: '10 3\n', output: '7\n' },
      { input: '3 10\n', output: '-7\n' },
      { input: '5 5\n', output: '0\n' },
    ],
  },
  {
    title: 'Rectangle Area',
    points: 5,
    author: 'Online Judge',
    description:
      'Read the base and the height of a rectangle (integers) and print its area, computed as base times height.',
    inputDescription:
      'The input contains two integers: the base and the height, separated by a space.',
    outputDescription: 'Print the area of the rectangle.',
    inputExample: '3 4',
    outputExample: '12',
    difficulty: ProblemDifficultyEnum.EASY,
    category: [CategoryEnum.BASICS, CategoryEnum.MATH],
    testCases: [
      { input: '3 4\n', output: '12\n' },
      { input: '5 5\n', output: '25\n' },
      { input: '10 2\n', output: '20\n' },
    ],
  },
  {
    title: 'Maximum of Three',
    points: 5,
    author: 'Online Judge',
    description: 'Read three integer values and print the largest of them.',
    inputDescription: 'The input contains three integers separated by spaces.',
    outputDescription: 'Print the largest of the three values.',
    inputExample: '3 7 2',
    outputExample: '7',
    difficulty: ProblemDifficultyEnum.EASY,
    category: [CategoryEnum.BASICS],
    testCases: [
      { input: '3 7 2\n', output: '7\n' },
      { input: '9 1 5\n', output: '9\n' },
      { input: '4 4 4\n', output: '4\n' },
    ],
  },
  {
    title: 'Minimum of Three',
    points: 5,
    author: 'Online Judge',
    description: 'Read three integer values and print the smallest of them.',
    inputDescription: 'The input contains three integers separated by spaces.',
    outputDescription: 'Print the smallest of the three values.',
    inputExample: '3 7 2',
    outputExample: '2',
    difficulty: ProblemDifficultyEnum.EASY,
    category: [CategoryEnum.BASICS],
    testCases: [
      { input: '3 7 2\n', output: '2\n' },
      { input: '9 1 5\n', output: '1\n' },
      { input: '-4 4 0\n', output: '-4\n' },
    ],
  },
  {
    title: 'Absolute Value',
    points: 5,
    author: 'Online Judge',
    description: 'Read an integer N and print its absolute value.',
    inputDescription: 'The input contains a single integer N.',
    outputDescription: 'Print the absolute value of N.',
    inputExample: '-5',
    outputExample: '5',
    difficulty: ProblemDifficultyEnum.EASY,
    category: [CategoryEnum.BASICS, CategoryEnum.MATH],
    testCases: [
      { input: '-5\n', output: '5\n' },
      { input: '5\n', output: '5\n' },
      { input: '0\n', output: '0\n' },
    ],
  },
  {
    title: 'Sum from 1 to N',
    points: 5,
    author: 'Online Judge',
    description:
      'Read an integer N and print the sum of all integers from 1 to N. Try using the formula N * (N + 1) / 2.',
    inputDescription:
      'The input contains a single integer N (1 <= N <= 1000000).',
    outputDescription: 'Print the sum of the integers from 1 to N.',
    inputExample: '5',
    outputExample: '15',
    difficulty: ProblemDifficultyEnum.EASY,
    category: [CategoryEnum.MATH],
    testCases: [
      { input: '5\n', output: '15\n' },
      { input: '1\n', output: '1\n' },
      { input: '100\n', output: '5050\n' },
    ],
  },
  {
    title: 'Sum of Digits',
    points: 10,
    author: 'Online Judge',
    description:
      'Read a non-negative integer N and print the sum of its digits.',
    inputDescription: 'The input contains a single integer N (0 <= N <= 10^9).',
    outputDescription: 'Print the sum of the digits of N.',
    inputExample: '123',
    outputExample: '6',
    difficulty: ProblemDifficultyEnum.EASY,
    category: [CategoryEnum.MATH],
    testCases: [
      { input: '123\n', output: '6\n' },
      { input: '9999\n', output: '36\n' },
      { input: '0\n', output: '0\n' },
    ],
  },
  {
    title: 'Count Digits',
    points: 10,
    author: 'Online Judge',
    description: 'Read a positive integer N and print how many digits it has.',
    inputDescription:
      'The input contains a single integer N (1 <= N <= 10^18).',
    outputDescription: 'Print the number of digits of N.',
    inputExample: '12345',
    outputExample: '5',
    difficulty: ProblemDifficultyEnum.EASY,
    category: [CategoryEnum.MATH],
    testCases: [
      { input: '5\n', output: '1\n' },
      { input: '12345\n', output: '5\n' },
      { input: '1000\n', output: '4\n' },
    ],
  },
  {
    title: 'Reverse Integer',
    points: 10,
    author: 'Online Judge',
    description:
      'Read a non-negative integer N and print the number formed by reversing its digits, dropping any leading zeros (LeetCode #7, simplified).',
    inputDescription: 'The input contains a single integer N (0 <= N <= 10^9).',
    outputDescription: 'Print the reversed integer.',
    inputExample: '1200',
    outputExample: '21',
    difficulty: ProblemDifficultyEnum.EASY,
    category: [CategoryEnum.MATH],
    testCases: [
      { input: '123\n', output: '321\n' },
      { input: '1200\n', output: '21\n' },
      { input: '5\n', output: '5\n' },
    ],
  },
  {
    title: 'Last Digit',
    points: 5,
    author: 'Online Judge',
    description: 'Read a non-negative integer N and print its last digit.',
    inputDescription:
      'The input contains a single integer N (0 <= N <= 10^18).',
    outputDescription: 'Print the last digit of N.',
    inputExample: '1234',
    outputExample: '4',
    difficulty: ProblemDifficultyEnum.EASY,
    category: [CategoryEnum.BASICS, CategoryEnum.MATH],
    testCases: [
      { input: '1234\n', output: '4\n' },
      { input: '10\n', output: '0\n' },
      { input: '7\n', output: '7\n' },
    ],
  },
  {
    title: 'Multiplication Table',
    points: 5,
    author: 'Online Judge',
    description:
      'Read an integer N and print its multiplication table from 1 to 10, one line per term, in the format "N x i = result" (beecrowd 1005).',
    inputDescription: 'The input contains a single integer N (1 <= N <= 1000).',
    outputDescription:
      'Print 10 lines, each in the format "N x i = result" for i from 1 to 10.',
    inputExample: '1',
    outputExample: '1 x 1 = 1\n...\n1 x 10 = 10',
    difficulty: ProblemDifficultyEnum.EASY,
    category: [CategoryEnum.BASICS],
    testCases: [
      {
        input: '1\n',
        output:
          '1 x 1 = 1\n1 x 2 = 2\n1 x 3 = 3\n1 x 4 = 4\n1 x 5 = 5\n1 x 6 = 6\n1 x 7 = 7\n1 x 8 = 8\n1 x 9 = 9\n1 x 10 = 10\n',
      },
      {
        input: '2\n',
        output:
          '2 x 1 = 2\n2 x 2 = 4\n2 x 3 = 6\n2 x 4 = 8\n2 x 5 = 10\n2 x 6 = 12\n2 x 7 = 14\n2 x 8 = 16\n2 x 9 = 18\n2 x 10 = 20\n',
      },
    ],
  },
  {
    title: 'Leap Year',
    points: 10,
    author: 'Online Judge',
    description:
      'Read a year and determine whether it is a leap year. A year is a leap year if it is divisible by 4 and not by 100, or if it is divisible by 400.',
    inputDescription:
      'The input contains a single integer representing the year.',
    outputDescription: 'Print "YES" if it is a leap year, otherwise "NO".',
    inputExample: '2000',
    outputExample: 'YES',
    difficulty: ProblemDifficultyEnum.EASY,
    category: [CategoryEnum.BASICS, CategoryEnum.MATH],
    testCases: [
      { input: '2000\n', output: 'YES\n' },
      { input: '1900\n', output: 'NO\n' },
      { input: '2024\n', output: 'YES\n' },
    ],
  },
  {
    title: 'Is Prime',
    points: 10,
    author: 'Online Judge',
    description:
      'Read a positive integer N and determine whether it is a prime number. Recall that 1 is not prime.',
    inputDescription: 'The input contains a single integer N (1 <= N <= 10^9).',
    outputDescription: 'Print "YES" if N is prime, otherwise "NO".',
    inputExample: '7',
    outputExample: 'YES',
    difficulty: ProblemDifficultyEnum.EASY,
    category: [CategoryEnum.MATH, CategoryEnum.NUMBER_THEORY],
    testCases: [
      { input: '7\n', output: 'YES\n' },
      { input: '1\n', output: 'NO\n' },
      { input: '9\n', output: 'NO\n' },
    ],
  },
  {
    title: 'Sum of First N Even Numbers',
    points: 10,
    author: 'Online Judge',
    description:
      'Read an integer N and print the sum of the first N positive even numbers (2 + 4 + 6 + ...).',
    inputDescription: 'The input contains a single integer N (1 <= N <= 10^6).',
    outputDescription: 'Print the sum of the first N even numbers.',
    inputExample: '3',
    outputExample: '12',
    difficulty: ProblemDifficultyEnum.EASY,
    category: [CategoryEnum.MATH],
    testCases: [
      { input: '3\n', output: '12\n' },
      { input: '1\n', output: '2\n' },
      { input: '5\n', output: '30\n' },
    ],
  },
  {
    title: 'Uppercase String',
    points: 5,
    author: 'Online Judge',
    description:
      'Read a line of text in lowercase and print it converted to uppercase.',
    inputDescription: 'The input contains a single line with a string S.',
    outputDescription: 'Print S converted to uppercase.',
    inputExample: 'hello',
    outputExample: 'HELLO',
    difficulty: ProblemDifficultyEnum.EASY,
    category: [CategoryEnum.STRINGS, CategoryEnum.BASICS],
    testCases: [
      { input: 'hello\n', output: 'HELLO\n' },
      { input: 'abc xyz\n', output: 'ABC XYZ\n' },
      { input: 'java\n', output: 'JAVA\n' },
    ],
  },
  {
    title: 'String Length',
    points: 5,
    author: 'Online Judge',
    description:
      'Read a single word and print the number of characters it has.',
    inputDescription:
      'The input contains a single line with a string S (no spaces).',
    outputDescription: 'Print the length of S.',
    inputExample: 'programming',
    outputExample: '11',
    difficulty: ProblemDifficultyEnum.EASY,
    category: [CategoryEnum.STRINGS, CategoryEnum.BASICS],
    testCases: [
      { input: 'programming\n', output: '11\n' },
      { input: 'a\n', output: '1\n' },
      { input: 'online\n', output: '6\n' },
    ],
  },
  {
    title: 'Power of Two',
    points: 10,
    author: 'Online Judge',
    description:
      'Read a positive integer N and determine whether it is a power of two (LeetCode #231).',
    inputDescription: 'The input contains a single integer N (1 <= N <= 10^9).',
    outputDescription: 'Print "YES" if N is a power of two, otherwise "NO".',
    inputExample: '16',
    outputExample: 'YES',
    difficulty: ProblemDifficultyEnum.EASY,
    category: [CategoryEnum.BIT_MANIPULATION, CategoryEnum.MATH],
    testCases: [
      { input: '16\n', output: 'YES\n' },
      { input: '1\n', output: 'YES\n' },
      { input: '6\n', output: 'NO\n' },
    ],
  },
  {
    title: 'Grade Result',
    points: 5,
    author: 'Online Judge',
    description:
      'Read a student grade from 0 to 100 and print "APPROVED" if it is greater than or equal to 60, otherwise "FAILED".',
    inputDescription:
      'The input contains a single integer grade (0 <= grade <= 100).',
    outputDescription: 'Print "APPROVED" or "FAILED" according to the grade.',
    inputExample: '75',
    outputExample: 'APPROVED',
    difficulty: ProblemDifficultyEnum.EASY,
    category: [CategoryEnum.BASICS],
    testCases: [
      { input: '75\n', output: 'APPROVED\n' },
      { input: '59\n', output: 'FAILED\n' },
      { input: '60\n', output: 'APPROVED\n' },
    ],
  },
  {
    title: 'Count Even in Array',
    points: 10,
    author: 'Online Judge',
    description:
      'Read an array of N integers and print how many of them are even.',
    inputDescription:
      'First line: N, the array size. Second line: N integers separated by spaces.',
    outputDescription: 'Print the count of even numbers in the array.',
    inputExample: '5\n1 2 3 4 6',
    outputExample: '3',
    difficulty: ProblemDifficultyEnum.EASY,
    category: [CategoryEnum.BASICS, CategoryEnum.DATA_STRUCTURES],
    testCases: [
      { input: '5\n1 2 3 4 6\n', output: '3\n' },
      { input: '3\n1 3 5\n', output: '0\n' },
      { input: '1\n2\n', output: '1\n' },
    ],
  },
  {
    title: 'Sum of Array',
    points: 15,
    author: 'Online Judge',
    description:
      'Read an array of N integers and print the sum of all elements.',
    inputDescription:
      'First line: N, the array size. Second line: N integers separated by spaces.',
    outputDescription: 'Print the sum of the array elements.',
    inputExample: '5\n1 2 3 4 5',
    outputExample: '15',
    difficulty: ProblemDifficultyEnum.MEDIUM,
    category: [CategoryEnum.DATA_STRUCTURES, CategoryEnum.BASICS],
    testCases: [
      { input: '5\n1 2 3 4 5\n', output: '15\n' },
      { input: '3\n-1 -2 -3\n', output: '-6\n' },
      { input: '1\n100\n', output: '100\n' },
    ],
  },
  {
    title: 'Second Largest',
    points: 15,
    author: 'Online Judge',
    description:
      'Read an array of N distinct integers and print the second largest value.',
    inputDescription:
      'First line: N (N >= 2). Second line: N distinct integers separated by spaces.',
    outputDescription: 'Print the second largest element of the array.',
    inputExample: '4\n3 1 4 2',
    outputExample: '3',
    difficulty: ProblemDifficultyEnum.MEDIUM,
    category: [CategoryEnum.DATA_STRUCTURES],
    testCases: [
      { input: '4\n3 1 4 2\n', output: '3\n' },
      { input: '2\n10 20\n', output: '10\n' },
      { input: '5\n5 4 3 2 1\n', output: '4\n' },
    ],
  },
  {
    title: 'Reverse Array',
    points: 15,
    author: 'Online Judge',
    description:
      'Read an array of N integers and print its elements in reverse order.',
    inputDescription:
      'First line: N, the array size. Second line: N integers separated by spaces.',
    outputDescription:
      'Print the array elements in reverse order, space separated.',
    inputExample: '5\n1 2 3 4 5',
    outputExample: '5 4 3 2 1',
    difficulty: ProblemDifficultyEnum.MEDIUM,
    category: [CategoryEnum.DATA_STRUCTURES, CategoryEnum.TWO_POINTERS],
    testCases: [
      { input: '5\n1 2 3 4 5\n', output: '5 4 3 2 1\n' },
      { input: '1\n7\n', output: '7\n' },
      { input: '3\n1 1 2\n', output: '2 1 1\n' },
    ],
  },
  {
    title: 'Rotate Array Right',
    points: 20,
    author: 'Online Judge',
    description:
      'Read an array of N integers and rotate it to the right by K positions (LeetCode #189). K may be larger than N.',
    inputDescription:
      'First line: N. Second line: N integers. Third line: K, the rotation amount.',
    outputDescription: 'Print the rotated array, space separated.',
    inputExample: '5\n1 2 3 4 5\n2',
    outputExample: '4 5 1 2 3',
    difficulty: ProblemDifficultyEnum.MEDIUM,
    category: [CategoryEnum.DATA_STRUCTURES],
    testCases: [
      { input: '5\n1 2 3 4 5\n2\n', output: '4 5 1 2 3\n' },
      { input: '3\n1 2 3\n0\n', output: '1 2 3\n' },
      { input: '3\n1 2 3\n4\n', output: '3 1 2\n' },
    ],
  },
  {
    title: 'Move Zeroes',
    points: 20,
    author: 'Online Judge',
    description:
      'Read an array of N integers and move all zeroes to the end while keeping the relative order of the non-zero elements (LeetCode #283).',
    inputDescription:
      'First line: N, the array size. Second line: N integers separated by spaces.',
    outputDescription: 'Print the resulting array, space separated.',
    inputExample: '5\n0 1 0 3 12',
    outputExample: '1 3 12 0 0',
    difficulty: ProblemDifficultyEnum.MEDIUM,
    category: [CategoryEnum.TWO_POINTERS, CategoryEnum.DATA_STRUCTURES],
    testCases: [
      { input: '5\n0 1 0 3 12\n', output: '1 3 12 0 0\n' },
      { input: '1\n0\n', output: '0\n' },
      { input: '3\n1 2 3\n', output: '1 2 3\n' },
    ],
  },
  {
    title: 'Remove Sorted Duplicates',
    points: 20,
    author: 'Online Judge',
    description:
      'Read a sorted array of N integers and print the distinct values in ascending order (LeetCode #26).',
    inputDescription:
      'First line: N. Second line: N integers in non-decreasing order.',
    outputDescription: 'Print the distinct values, space separated.',
    inputExample: '5\n1 1 2 2 3',
    outputExample: '1 2 3',
    difficulty: ProblemDifficultyEnum.MEDIUM,
    category: [CategoryEnum.TWO_POINTERS, CategoryEnum.DATA_STRUCTURES],
    testCases: [
      { input: '5\n1 1 2 2 3\n', output: '1 2 3\n' },
      { input: '1\n5\n', output: '5\n' },
      { input: '4\n2 2 2 2\n', output: '2\n' },
    ],
  },
  {
    title: 'Valid Parentheses',
    points: 20,
    author: 'Online Judge',
    description:
      'Read a string containing only the characters ()[]{} and determine whether the brackets are balanced and correctly nested (LeetCode #20).',
    inputDescription:
      'The input contains a single line with a bracket string S.',
    outputDescription: 'Print "YES" if the string is valid, otherwise "NO".',
    inputExample: '()[]{}',
    outputExample: 'YES',
    difficulty: ProblemDifficultyEnum.MEDIUM,
    category: [CategoryEnum.STACK, CategoryEnum.STRINGS],
    testCases: [
      { input: '()[]{}\n', output: 'YES\n' },
      { input: '(]\n', output: 'NO\n' },
      { input: '{[]}\n', output: 'YES\n' },
    ],
  },
  {
    title: 'Contains Duplicate',
    points: 15,
    author: 'Online Judge',
    description:
      'Read an array of N integers and determine whether any value appears more than once (LeetCode #217).',
    inputDescription:
      'First line: N, the array size. Second line: N integers separated by spaces.',
    outputDescription: 'Print "YES" if there is a duplicate, otherwise "NO".',
    inputExample: '5\n1 2 3 1 5',
    outputExample: 'YES',
    difficulty: ProblemDifficultyEnum.MEDIUM,
    category: [CategoryEnum.HASHING, CategoryEnum.DATA_STRUCTURES],
    testCases: [
      { input: '5\n1 2 3 1 5\n', output: 'YES\n' },
      { input: '3\n1 2 3\n', output: 'NO\n' },
      { input: '2\n5 5\n', output: 'YES\n' },
    ],
  },
  {
    title: 'Single Number',
    points: 20,
    author: 'Online Judge',
    description:
      'Every element in the array appears exactly twice except for one, which appears once. Find and print that single element (LeetCode #136). Hint: use XOR.',
    inputDescription:
      'First line: N (odd). Second line: N integers separated by spaces.',
    outputDescription: 'Print the element that appears only once.',
    inputExample: '5\n2 2 1 3 3',
    outputExample: '1',
    difficulty: ProblemDifficultyEnum.MEDIUM,
    category: [CategoryEnum.BIT_MANIPULATION],
    testCases: [
      { input: '5\n2 2 1 3 3\n', output: '1\n' },
      { input: '1\n7\n', output: '7\n' },
      { input: '3\n4 1 4\n', output: '1\n' },
    ],
  },
  {
    title: 'Majority Element',
    points: 20,
    author: 'Online Judge',
    description:
      'Read an array of N integers where one element appears more than N/2 times. Print that majority element (LeetCode #169).',
    inputDescription:
      'First line: N, the array size. Second line: N integers separated by spaces.',
    outputDescription: 'Print the majority element.',
    inputExample: '5\n3 3 4 2 3',
    outputExample: '3',
    difficulty: ProblemDifficultyEnum.MEDIUM,
    category: [CategoryEnum.DATA_STRUCTURES, CategoryEnum.HASHING],
    testCases: [
      { input: '5\n3 3 4 2 3\n', output: '3\n' },
      { input: '1\n1\n', output: '1\n' },
      { input: '7\n2 2 1 1 2 2 2\n', output: '2\n' },
    ],
  },
  {
    title: 'Number of 1 Bits',
    points: 15,
    author: 'Online Judge',
    description:
      'Read a non-negative integer N and print how many bits are set to 1 in its binary representation (LeetCode #191, Hamming weight).',
    inputDescription: 'The input contains a single integer N (0 <= N <= 10^9).',
    outputDescription: 'Print the number of set bits in N.',
    inputExample: '11',
    outputExample: '3',
    difficulty: ProblemDifficultyEnum.MEDIUM,
    category: [CategoryEnum.BIT_MANIPULATION],
    testCases: [
      { input: '11\n', output: '3\n' },
      { input: '128\n', output: '1\n' },
      { input: '0\n', output: '0\n' },
    ],
  },
  {
    title: 'Decimal to Binary',
    points: 15,
    author: 'Online Judge',
    description:
      'Read a non-negative integer N and print its binary representation, without leading zeros.',
    inputDescription: 'The input contains a single integer N (0 <= N <= 10^9).',
    outputDescription: 'Print the binary representation of N.',
    inputExample: '10',
    outputExample: '1010',
    difficulty: ProblemDifficultyEnum.MEDIUM,
    category: [CategoryEnum.BIT_MANIPULATION, CategoryEnum.MATH],
    testCases: [
      { input: '10\n', output: '1010\n' },
      { input: '0\n', output: '0\n' },
      { input: '255\n', output: '11111111\n' },
    ],
  },
  {
    title: 'Binary to Decimal',
    points: 15,
    author: 'Online Judge',
    description:
      'Read a binary string and print its value as a decimal integer.',
    inputDescription: 'The input contains a single line with a binary string.',
    outputDescription: 'Print the decimal value of the binary number.',
    inputExample: '1010',
    outputExample: '10',
    difficulty: ProblemDifficultyEnum.MEDIUM,
    category: [CategoryEnum.BIT_MANIPULATION, CategoryEnum.MATH],
    testCases: [
      { input: '1010\n', output: '10\n' },
      { input: '0\n', output: '0\n' },
      { input: '11111111\n', output: '255\n' },
    ],
  },
  {
    title: 'Best Time to Buy Stock',
    points: 25,
    author: 'Online Judge',
    description:
      'Given daily prices of a stock, find the maximum profit from a single buy followed by a later sell. If no profit is possible, the answer is 0 (LeetCode #121).',
    inputDescription:
      'First line: N, the number of days. Second line: N prices separated by spaces.',
    outputDescription: 'Print the maximum achievable profit.',
    inputExample: '6\n7 1 5 3 6 4',
    outputExample: '5',
    difficulty: ProblemDifficultyEnum.MEDIUM,
    category: [CategoryEnum.DYNAMIC_PROGRAMMING, CategoryEnum.GREEDY],
    testCases: [
      { input: '6\n7 1 5 3 6 4\n', output: '5\n' },
      { input: '5\n7 6 4 3 1\n', output: '0\n' },
      { input: '2\n1 5\n', output: '4\n' },
    ],
  },
  {
    title: 'Climbing Stairs',
    points: 20,
    author: 'Online Judge',
    description:
      'You climb a staircase of N steps, taking 1 or 2 steps at a time. Print the number of distinct ways to reach the top (LeetCode #70).',
    inputDescription: 'The input contains a single integer N (1 <= N <= 45).',
    outputDescription: 'Print the number of distinct ways to climb the stairs.',
    inputExample: '3',
    outputExample: '3',
    difficulty: ProblemDifficultyEnum.MEDIUM,
    category: [CategoryEnum.DYNAMIC_PROGRAMMING],
    testCases: [
      { input: '2\n', output: '2\n' },
      { input: '3\n', output: '3\n' },
      { input: '5\n', output: '8\n' },
    ],
  },
  {
    title: 'Longest Common Prefix',
    points: 20,
    author: 'Online Judge',
    description:
      'Read N strings and print the longest common prefix shared by all of them. If there is none, print an empty line (LeetCode #14).',
    inputDescription: 'First line: N. Next N lines: one string each.',
    outputDescription:
      'Print the longest common prefix, or an empty line if none.',
    inputExample: '3\nflower\nflow\nflight',
    outputExample: 'fl',
    difficulty: ProblemDifficultyEnum.MEDIUM,
    category: [CategoryEnum.STRINGS],
    testCases: [
      { input: '3\nflower\nflow\nflight\n', output: 'fl\n' },
      { input: '3\ndog\ncar\nrace\n', output: '\n' },
      { input: '1\nalone\n', output: 'alone\n' },
    ],
  },
  {
    title: 'Valid Anagram',
    points: 15,
    author: 'Online Judge',
    description:
      'Read two strings and determine whether the second is an anagram of the first, i.e. it uses exactly the same characters with the same frequencies (LeetCode #242).',
    inputDescription: 'Two lines, each containing one string.',
    outputDescription: 'Print "YES" if they are anagrams, otherwise "NO".',
    inputExample: 'anagram\nnagaram',
    outputExample: 'YES',
    difficulty: ProblemDifficultyEnum.MEDIUM,
    category: [CategoryEnum.STRINGS, CategoryEnum.HASHING],
    testCases: [
      { input: 'anagram\nnagaram\n', output: 'YES\n' },
      { input: 'rat\ncar\n', output: 'NO\n' },
      { input: 'abc\ncba\n', output: 'YES\n' },
    ],
  },
  {
    title: 'Two Sum II Sorted',
    points: 20,
    author: 'Online Judge',
    description:
      'Given a sorted array and a target, find the two elements that sum to the target and print their 1-based indices. Exactly one solution exists (LeetCode #167).',
    inputDescription:
      'First line: N. Second line: N sorted integers. Third line: the target.',
    outputDescription: 'Print the two 1-based indices in ascending order.',
    inputExample: '4\n2 7 11 15\n9',
    outputExample: '1 2',
    difficulty: ProblemDifficultyEnum.MEDIUM,
    category: [CategoryEnum.TWO_POINTERS, CategoryEnum.SEARCH],
    testCases: [
      { input: '4\n2 7 11 15\n9\n', output: '1 2\n' },
      { input: '3\n2 3 4\n6\n', output: '1 3\n' },
      { input: '2\n-1 0\n-1\n', output: '1 2\n' },
    ],
  },
  {
    title: 'Count Primes',
    points: 25,
    author: 'Online Judge',
    description:
      'Read an integer N and print how many prime numbers are strictly less than N. Use the Sieve of Eratosthenes (LeetCode #204).',
    inputDescription:
      'The input contains a single integer N (0 <= N <= 5000000).',
    outputDescription: 'Print the count of primes strictly less than N.',
    inputExample: '10',
    outputExample: '4',
    difficulty: ProblemDifficultyEnum.MEDIUM,
    category: [CategoryEnum.NUMBER_THEORY, CategoryEnum.MATH],
    testCases: [
      { input: '10\n', output: '4\n' },
      { input: '2\n', output: '0\n' },
      { input: '20\n', output: '8\n' },
    ],
  },
  {
    title: 'Josephus Problem',
    points: 25,
    author: 'Online Judge',
    description:
      'N people stand in a circle numbered 1 to N. Starting the count at person 1, every K-th person is eliminated until one remains. Print the position of the survivor.',
    inputDescription:
      'The input contains two integers N and K, separated by a space.',
    outputDescription: 'Print the 1-based position of the survivor.',
    inputExample: '5 2',
    outputExample: '3',
    difficulty: ProblemDifficultyEnum.MEDIUM,
    category: [CategoryEnum.SIMULATION, CategoryEnum.MATH],
    testCases: [
      { input: '5 2\n', output: '3\n' },
      { input: '7 3\n', output: '4\n' },
      { input: '1 1\n', output: '1\n' },
    ],
  },
  {
    title: 'Max Sum Subarray Size K',
    points: 25,
    author: 'Online Judge',
    description:
      'Read an array of N integers and an integer K, and print the maximum sum among all contiguous subarrays of exactly K elements (fixed sliding window).',
    inputDescription:
      'First line: N. Second line: N integers. Third line: K (1 <= K <= N).',
    outputDescription: 'Print the maximum sum of any window of size K.',
    inputExample: '4\n2 3 1 5\n3',
    outputExample: '9',
    difficulty: ProblemDifficultyEnum.MEDIUM,
    category: [CategoryEnum.SLIDING_WINDOW, CategoryEnum.DATA_STRUCTURES],
    testCases: [
      { input: '4\n2 3 1 5\n3\n', output: '9\n' },
      { input: '5\n1 2 3 4 5\n2\n', output: '9\n' },
      { input: '3\n1 1 1\n1\n', output: '1\n' },
    ],
  },
  {
    title: 'Unique Paths',
    points: 25,
    author: 'Online Judge',
    description:
      'A robot starts at the top-left of an M x N grid and can only move right or down. Print the number of distinct paths to reach the bottom-right corner (LeetCode #62).',
    inputDescription:
      'The input contains two integers M and N, separated by a space (1 <= M, N <= 20).',
    outputDescription: 'Print the number of unique paths.',
    inputExample: '3 7',
    outputExample: '28',
    difficulty: ProblemDifficultyEnum.MEDIUM,
    category: [CategoryEnum.DYNAMIC_PROGRAMMING, CategoryEnum.MATH],
    testCases: [
      { input: '3 7\n', output: '28\n' },
      { input: '3 2\n', output: '3\n' },
      { input: '1 1\n', output: '1\n' },
    ],
  },
  {
    title: 'Longest Substring No Repeat',
    points: 30,
    author: 'Online Judge',
    description:
      'Read a string and print the length of the longest substring without repeating characters (LeetCode #3).',
    inputDescription: 'The input contains a single line with a string S.',
    outputDescription:
      'Print the length of the longest substring without repeats.',
    inputExample: 'abcabcbb',
    outputExample: '3',
    difficulty: ProblemDifficultyEnum.HARD,
    category: [CategoryEnum.SLIDING_WINDOW, CategoryEnum.STRINGS],
    testCases: [
      { input: 'abcabcbb\n', output: '3\n' },
      { input: 'bbbbb\n', output: '1\n' },
      { input: 'pwwkew\n', output: '3\n' },
    ],
  },
  {
    title: 'Longest Increasing Subseq',
    points: 35,
    author: 'Online Judge',
    description:
      'Read an array of N integers and print the length of its longest strictly increasing subsequence (LeetCode #300).',
    inputDescription:
      'First line: N, the array size. Second line: N integers separated by spaces.',
    outputDescription:
      'Print the length of the longest increasing subsequence.',
    inputExample: '8\n10 9 2 5 3 7 101 18',
    outputExample: '4',
    difficulty: ProblemDifficultyEnum.HARD,
    category: [CategoryEnum.DYNAMIC_PROGRAMMING],
    testCases: [
      { input: '8\n10 9 2 5 3 7 101 18\n', output: '4\n' },
      { input: '4\n0 1 0 3\n', output: '3\n' },
      { input: '1\n7\n', output: '1\n' },
    ],
  },
  {
    title: 'Edit Distance',
    points: 40,
    author: 'Online Judge',
    description:
      'Read two strings and print the minimum number of single-character insertions, deletions, or replacements needed to transform the first into the second (LeetCode #72).',
    inputDescription: 'Two lines, each containing one string.',
    outputDescription: 'Print the edit distance between the two strings.',
    inputExample: 'horse\nros',
    outputExample: '3',
    difficulty: ProblemDifficultyEnum.HARD,
    category: [CategoryEnum.DYNAMIC_PROGRAMMING, CategoryEnum.STRINGS],
    testCases: [
      { input: 'horse\nros\n', output: '3\n' },
      { input: 'intention\nexecution\n', output: '5\n' },
      { input: 'abc\nabc\n', output: '0\n' },
    ],
  },
  {
    title: 'Longest Common Subsequence',
    points: 35,
    author: 'Online Judge',
    description:
      'Read two strings and print the length of their longest common subsequence, i.e. the longest sequence of characters appearing in both in the same relative order (LeetCode #1143).',
    inputDescription: 'Two lines, each containing one string.',
    outputDescription: 'Print the length of the longest common subsequence.',
    inputExample: 'abcde\nace',
    outputExample: '3',
    difficulty: ProblemDifficultyEnum.HARD,
    category: [CategoryEnum.DYNAMIC_PROGRAMMING, CategoryEnum.STRINGS],
    testCases: [
      { input: 'abcde\nace\n', output: '3\n' },
      { input: 'abc\nabc\n', output: '3\n' },
      { input: 'abc\ndef\n', output: '0\n' },
    ],
  },
  {
    title: '0/1 Knapsack',
    points: 40,
    author: 'Online Judge',
    description:
      'Given N items, each with a weight and a value, and a knapsack capacity W, print the maximum total value that fits without exceeding W. Each item may be used at most once.',
    inputDescription:
      'First line: N and W. Next N lines: two integers weight and value per item.',
    outputDescription: 'Print the maximum achievable value.',
    inputExample: '3 4\n1 15\n3 20\n4 30',
    outputExample: '35',
    difficulty: ProblemDifficultyEnum.HARD,
    category: [CategoryEnum.DYNAMIC_PROGRAMMING],
    testCases: [
      { input: '3 4\n1 15\n3 20\n4 30\n', output: '35\n' },
      { input: '1 1\n2 100\n', output: '0\n' },
      { input: '2 5\n5 10\n5 20\n', output: '20\n' },
    ],
  },
  {
    title: 'Trapping Rain Water',
    points: 40,
    author: 'Online Judge',
    description:
      'Given N non-negative heights representing an elevation map where each bar is 1 unit wide, print how many units of water can be trapped after raining (LeetCode #42).',
    inputDescription:
      'First line: N, the number of bars. Second line: N heights separated by spaces.',
    outputDescription: 'Print the total amount of trapped water.',
    inputExample: '12\n0 1 0 2 1 0 1 3 2 1 2 1',
    outputExample: '6',
    difficulty: ProblemDifficultyEnum.HARD,
    category: [CategoryEnum.TWO_POINTERS, CategoryEnum.DYNAMIC_PROGRAMMING],
    testCases: [
      { input: '12\n0 1 0 2 1 0 1 3 2 1 2 1\n', output: '6\n' },
      { input: '6\n4 2 0 3 2 5\n', output: '9\n' },
      { input: '3\n1 2 3\n', output: '0\n' },
    ],
  },
  {
    title: 'Longest Palindromic Substr',
    points: 35,
    author: 'Online Judge',
    description:
      'Read a string and print the length of its longest substring that is a palindrome (LeetCode #5).',
    inputDescription: 'The input contains a single line with a string S.',
    outputDescription: 'Print the length of the longest palindromic substring.',
    inputExample: 'babad',
    outputExample: '3',
    difficulty: ProblemDifficultyEnum.HARD,
    category: [CategoryEnum.STRINGS, CategoryEnum.DYNAMIC_PROGRAMMING],
    testCases: [
      { input: 'babad\n', output: '3\n' },
      { input: 'cbbd\n', output: '2\n' },
      { input: 'a\n', output: '1\n' },
    ],
  },
  {
    title: 'N-Queens Count',
    points: 40,
    author: 'Online Judge',
    description:
      'Read an integer N and print the number of distinct ways to place N non-attacking queens on an N x N chessboard (LeetCode #52).',
    inputDescription: 'The input contains a single integer N (1 <= N <= 12).',
    outputDescription: 'Print the number of valid queen placements.',
    inputExample: '4',
    outputExample: '2',
    difficulty: ProblemDifficultyEnum.HARD,
    category: [CategoryEnum.BACKTRACKING],
    testCases: [
      { input: '1\n', output: '1\n' },
      { input: '4\n', output: '2\n' },
      { input: '8\n', output: '92\n' },
    ],
  },
];
