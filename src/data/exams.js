/*
 * Practice tests for the Mock Exams page.
 *
 * Two question types:
 *   - mcq : multiple choice, A–D, auto-graded. `answer` is the 0-based index
 *           of the correct option. Optional `code` shows a snippet above the
 *           options. `explanation` is revealed on the results screen.
 *   - frq : free-response coding, AP-CSA style (full class/method declarations).
 *           Not auto-graded — the student writes Java in the editor and compares
 *           against `modelAnswer` on the results screen. `points` is informational.
 *
 * All MCQ content is verified against Java semantics; FRQ model answers use the
 * project's Allman brace convention.
 */

export const exams = [
  {
    id: 'csa-primitives',
    title: 'AP CSA · Primitive Types & Expressions',
    description: 'Integer division, modulus, casting, and variable declarations.',
    minutes: 8,
    tag: 'Unit 1',
    accent: 'from-cyan-400/30 to-violet-500/20',
    questions: [
      {
        id: 'p1',
        type: 'mcq',
        prompt: 'What is the value of the expression below in Java?',
        code: 'int result = 7 / 2;',
        options: ['3.5', '3', '4', '3.0'],
        answer: 1,
        explanation:
          'Both operands are int, so Java performs integer division and discards the fractional part: 7 / 2 = 3.'
      },
      {
        id: 'p2',
        type: 'mcq',
        prompt: 'What does 7 % 3 evaluate to?',
        options: ['1', '2', '0', '2.33'],
        answer: 0,
        explanation: 'The modulus operator returns the remainder: 7 = 2 × 3 + 1, so 7 % 3 = 1.'
      },
      {
        id: 'p3',
        type: 'mcq',
        prompt: 'What is stored in result?',
        code: 'double result = 5 / 2;',
        options: ['2.5', '2.0', '2', '3.0'],
        answer: 1,
        explanation:
          '5 / 2 is computed as integer division first (= 2), then widened to a double when stored: 2.0. The cast happens after the division, not before.'
      },
      {
        id: 'p4',
        type: 'mcq',
        prompt: 'Which is a valid Java variable declaration?',
        options: ['int 2x = 5;', 'int x-y = 5;', 'int xY = 5;', 'int class = 5;'],
        answer: 2,
        explanation:
          'Identifiers cannot start with a digit (2x), contain operators (x-y), or use reserved words (class). xY is valid.'
      },
      {
        id: 'p5',
        type: 'mcq',
        prompt: 'What is the value of the expression?',
        code: '(int)(3.9)',
        options: ['4', '3', '3.9', 'compile error'],
        answer: 1,
        explanation: 'Casting a double to int truncates toward zero — it does not round. (int)(3.9) = 3.'
      }
    ]
  },
  {
    id: 'csa-boolean',
    title: 'AP CSA · Boolean Logic & Control Flow',
    description: 'Operator precedence, loops, De Morgan’s laws, and conditionals.',
    minutes: 8,
    tag: 'Unit 3',
    accent: 'from-emerald-400/30 to-cyan-500/20',
    questions: [
      {
        id: 'b1',
        type: 'mcq',
        prompt: 'What does this expression evaluate to?',
        code: 'true && false || true',
        options: ['true', 'false', 'compile error', 'null'],
        answer: 0,
        explanation:
          '&& has higher precedence than ||, so this is (true && false) || true = false || true = true.'
      },
      {
        id: 'b2',
        type: 'mcq',
        prompt: 'How many times does the loop body execute?',
        code: 'for (int i = 0; i < 5; i++) {\n    System.out.println(i);\n}',
        options: ['4', '5', '6', 'infinite'],
        answer: 1,
        explanation: 'i takes the values 0, 1, 2, 3, 4 — that is 5 iterations. It stops when i becomes 5.'
      },
      {
        id: 'b3',
        type: 'mcq',
        prompt: 'By De Morgan’s law, !(a && b) is equivalent to:',
        options: ['!a && !b', '!a || !b', 'a || b', '!a && b'],
        answer: 1,
        explanation: 'Negating a conjunction flips it to a disjunction of negations: !(a && b) = !a || !b.'
      },
      {
        id: 'b4',
        type: 'mcq',
        prompt: 'How many times does this loop run if the condition is false to begin with?',
        code: 'while (false) {\n    // body\n}',
        options: ['0', '1', 'infinite', 'compile error'],
        answer: 0,
        explanation:
          'A while loop checks its condition before the first iteration, so a false condition means the body never runs. (A do-while would run once.)'
      },
      {
        id: 'b5',
        type: 'mcq',
        prompt: 'What is the value of y?',
        code: 'int y = (5 > 3) ? 1 : 2;',
        options: ['1', '2', '0', 'true'],
        answer: 0,
        explanation: 'The ternary evaluates the condition 5 > 3 (true), so y is assigned the first value, 1.'
      }
    ]
  },
  {
    id: 'algorithms-bigo',
    title: 'Algorithms & Big O',
    description: 'Complexity classes, sorting, searching, and core data structures.',
    minutes: 7,
    tag: 'Theory',
    accent: 'from-violet-400/30 to-pink-500/20',
    questions: [
      {
        id: 'a1',
        type: 'mcq',
        prompt: 'What is the time complexity of binary search on a sorted array?',
        options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
        answer: 1,
        explanation: 'Binary search halves the search space each step, giving logarithmic time, O(log n).'
      },
      {
        id: 'a2',
        type: 'mcq',
        prompt: 'What is the worst-case time complexity of bubble sort?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
        answer: 2,
        explanation: 'Bubble sort compares adjacent pairs across nested passes — quadratic, O(n²), in the worst case.'
      },
      {
        id: 'a3',
        type: 'mcq',
        prompt: 'Which data structure follows Last-In-First-Out (LIFO) order?',
        options: ['Queue', 'Stack', 'Linked list', 'Binary tree'],
        answer: 1,
        explanation: 'A stack removes the most recently added element first — LIFO. A queue is FIFO.'
      },
      {
        id: 'a4',
        type: 'mcq',
        prompt: 'What is the time complexity of accessing an array element by its index?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
        answer: 0,
        explanation: 'Arrays store elements contiguously, so index access is a single address computation — O(1).'
      },
      {
        id: 'a5',
        type: 'mcq',
        prompt: 'What is the time complexity of merge sort in all cases?',
        options: ['O(n)', 'O(n²)', 'O(n log n)', 'O(log n)'],
        answer: 2,
        explanation:
          'Merge sort splits the array log n times and merges in linear time at each level — O(n log n) best, average, and worst.'
      }
    ]
  },
  {
    id: 'csa-frq',
    title: 'AP CSA · Free-Response (Coding)',
    description: 'Write full Java methods and classes. Self-checked against a model answer.',
    minutes: 25,
    tag: 'FRQ',
    accent: 'from-amber-400/30 to-rose-500/20',
    questions: [
      {
        id: 'f1',
        type: 'frq',
        points: 9,
        prompt:
          'Write a complete Java method `sumArray` that takes an int array and returns the sum of all its elements. Include the full method declaration. (Return 0 for an empty array.)',
        starter:
          'public class Solution\n{\n    public int sumArray(int[] arr)\n    {\n        // your code here\n    }\n}\n',
        modelAnswer:
          'public class Solution\n{\n    public int sumArray(int[] arr)\n    {\n        int total = 0;\n        for (int value : arr)\n        {\n            total += value;\n        }\n        return total;\n    }\n}\n'
      },
      {
        id: 'f2',
        type: 'frq',
        points: 9,
        prompt:
          'Write a complete class `Counter` with a private int field starting at 0, an `increment()` method that adds 1, a `reset()` method that sets it back to 0, and a `getCount()` method that returns the current value.',
        starter:
          'public class Counter\n{\n    // fields and methods here\n}\n',
        modelAnswer:
          'public class Counter\n{\n    private int count;\n\n    public Counter()\n    {\n        count = 0;\n    }\n\n    public void increment()\n    {\n        count++;\n    }\n\n    public void reset()\n    {\n        count = 0;\n    }\n\n    public int getCount()\n    {\n        return count;\n    }\n}\n'
      },
      {
        id: 'f3',
        type: 'frq',
        points: 9,
        prompt:
          'Write a complete Java method `isPrime` that takes an int n and returns true if n is a prime number, false otherwise. Numbers less than 2 are not prime.',
        starter:
          'public class Solution\n{\n    public boolean isPrime(int n)\n    {\n        // your code here\n    }\n}\n',
        modelAnswer:
          'public class Solution\n{\n    public boolean isPrime(int n)\n    {\n        if (n < 2)\n        {\n            return false;\n        }\n        for (int i = 2; i * i <= n; i++)\n        {\n            if (n % i == 0)\n            {\n                return false;\n            }\n        }\n        return true;\n    }\n}\n'
      }
    ]
  }
];
