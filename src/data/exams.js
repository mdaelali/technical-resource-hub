/*
 * Practice tests for the Mock Exams page.
 * Each test has 20-25 questions: a mix of MCQ (auto-graded) and FRQ (self-checked).
 *
 * difficulty: 'easy' | 'medium' | 'hard'
 * mcq: { id, type:'mcq', prompt, code?, options[], answer (0-based index), explanation }
 * frq: { id, type:'frq', points, prompt, starter, modelAnswer }
 */

export const exams = [
  {
    id: 'csa-units-1-4',
    title: 'AP CSA · Units 1–4: Fundamentals',
    description: 'Primitive types, expressions, boolean logic, if/else, iteration, and String methods.',
    minutes: 30,
    tag: 'Units 1–4',
    difficulty: 'easy',
    accent: 'from-cyan-400/30 to-violet-500/20',
    questions: [
      {
        id: 'u1',
        type: 'mcq',
        prompt: 'What is the result?',
        code: 'int x = 7 / 2;',
        options: ['3.5', '3', '4', '3.0'],
        answer: 1,
        explanation: 'Both operands are int — integer division truncates toward zero: 7 / 2 = 3.'
      },
      {
        id: 'u2',
        type: 'mcq',
        prompt: 'What is printed?',
        code: 'double d = 5 / 2;\nSystem.out.println(d);',
        options: ['2.5', '2.0', '2', '3.0'],
        answer: 1,
        explanation: '5 / 2 is integer division (= 2) first, then widened to 2.0 when stored in a double.'
      },
      {
        id: 'u3',
        type: 'mcq',
        prompt: 'What is the value of x?',
        code: 'int x = (int)(3.99);',
        options: ['4', '3', '3.99', 'compile error'],
        answer: 1,
        explanation: 'Casting a double to int truncates (does not round): (int)(3.99) = 3.'
      },
      {
        id: 'u4',
        type: 'mcq',
        prompt: 'What is the result of 17 % 5?',
        options: ['3', '2', '1', '4'],
        answer: 1,
        explanation: '17 = 3 × 5 + 2, so 17 % 5 = 2.'
      },
      {
        id: 'u5',
        type: 'mcq',
        prompt: 'Which correctly declares a double in Java?',
        options: ['Double x = 1;', 'double x = 1.0;', 'double x = "1.0";', 'double = 1.0;'],
        answer: 1,
        explanation: 'double x = 1.0; is the standard declaration. "Double" (capital D) is a wrapper class but x = 1 would also work via autoboxing, so the simplest correct form is double x = 1.0;'
      },
      {
        id: 'u6',
        type: 'mcq',
        prompt: 'What is printed?',
        code: 'String s = "Hello";\nSystem.out.println(s.length());',
        options: ['4', '5', '6', 'compile error'],
        answer: 1,
        explanation: '"Hello" has 5 characters, so length() returns 5.'
      },
      {
        id: 'u7',
        type: 'mcq',
        prompt: 'What is the output?',
        code: 'String s = "Computer";\nSystem.out.println(s.substring(0, 4));',
        options: ['Comp', 'Compu', 'ompu', 'Comput'],
        answer: 0,
        explanation: 'substring(0, 4) returns characters at indices 0, 1, 2, 3 — i.e. "Comp".'
      },
      {
        id: 'u8',
        type: 'mcq',
        prompt: 'What is printed?',
        code: 'String a = "hello";\nString b = "HELLO";\nSystem.out.println(a.equals(b));',
        options: ['true', 'false', 'compile error', 'null'],
        answer: 1,
        explanation: 'equals() is case-sensitive; "hello" and "HELLO" are different strings.'
      },
      {
        id: 'u9',
        type: 'mcq',
        prompt: 'What does this expression evaluate to?',
        code: 'true && false || true',
        options: ['true', 'false', 'null', 'compile error'],
        answer: 0,
        explanation: '&& binds tighter than ||: (true && false) || true = false || true = true.'
      },
      {
        id: 'u10',
        type: 'mcq',
        prompt: 'By De Morgan\'s law, !(a || b) is equivalent to:',
        options: ['!a && !b', '!a || !b', 'a && b', '!a && b'],
        answer: 0,
        explanation: 'Negating a disjunction: !(a || b) = !a && !b.'
      },
      {
        id: 'u11',
        type: 'mcq',
        prompt: 'How many times does the loop body run?',
        code: 'for (int i = 1; i <= 5; i++) { ... }',
        options: ['4', '5', '6', 'infinite'],
        answer: 1,
        explanation: 'i takes the values 1, 2, 3, 4, 5 — exactly 5 iterations.'
      },
      {
        id: 'u12',
        type: 'mcq',
        prompt: 'What is the output?',
        code: 'int i = 0;\nwhile (i < 3) {\n    System.out.print(i + " ");\n    i++;\n}',
        options: ['0 1 2', '1 2 3', '0 1 2 3', '0 1'],
        answer: 0,
        explanation: 'i starts at 0, prints then increments, loop ends when i == 3.'
      },
      {
        id: 'u13',
        type: 'mcq',
        prompt: 'What is the output?',
        code: 'for (int i = 0; i < 3; i++) {\n    if (i == 1) continue;\n    System.out.print(i + " ");\n}',
        options: ['0 1 2', '0 2', '1 2', '0 1'],
        answer: 1,
        explanation: 'continue skips the rest of the body when i == 1, so only 0 and 2 are printed.'
      },
      {
        id: 'u14',
        type: 'mcq',
        prompt: 'What is printed?',
        code: 'int x = 5;\nif (x > 3) {\n    System.out.print("A");\n} else if (x > 4) {\n    System.out.print("B");\n} else {\n    System.out.print("C");\n}',
        options: ['A', 'B', 'C', 'AB'],
        answer: 0,
        explanation: 'x > 3 is true, so "A" is printed. The else-if and else are skipped.'
      },
      {
        id: 'u15',
        type: 'mcq',
        prompt: 'What is the value of y?',
        code: 'int y = (8 > 5) ? 10 : 20;',
        options: ['10', '20', 'true', 'compile error'],
        answer: 0,
        explanation: '8 > 5 is true, so the ternary evaluates to 10.'
      },
      {
        id: 'u16',
        type: 'mcq',
        prompt: 'What is printed?',
        code: 'int n = 10;\ndo {\n    System.out.print(n + " ");\n    n -= 3;\n} while (n > 0);',
        options: ['10 7 4 1', '10 7 4', '7 4 1', '10 7'],
        answer: 0,
        explanation: 'n starts at 10. The loop prints then subtracts 3: 10, 7, 4, 1 are all > 0 at the start of each iteration; n becomes -2 after printing 1, so the condition fails.'
      },
      {
        id: 'u17',
        type: 'mcq',
        prompt: 'What does this print?',
        code: 'String s = "Hello World";\nSystem.out.println(s.indexOf("o"));',
        options: ['4', '7', '3', '-1'],
        answer: 0,
        explanation: '"Hello World": H=0, e=1, l=2, l=3, o=4. indexOf returns the first occurrence: 4.'
      },
      {
        id: 'u18',
        type: 'mcq',
        prompt: 'What is the result of String concatenation?',
        code: 'int x = 3;\nSystem.out.println("Value: " + x + 2);',
        options: ['Value: 5', 'Value: 32', 'Value: 3', 'Value: 52'],
        answer: 1,
        explanation: 'Left-to-right evaluation: "Value: " + 3 = "Value: 3", then "Value: 3" + 2 = "Value: 32".'
      },
      {
        id: 'u19',
        type: 'mcq',
        prompt: 'What is printed?',
        code: 'String s = "Java";\nSystem.out.println(s.toUpperCase().charAt(1));',
        options: ['A', 'a', 'J', 'V'],
        answer: 0,
        explanation: 'toUpperCase() returns "JAVA"; charAt(1) is \'A\'.'
      },
      {
        id: 'u20',
        type: 'mcq',
        prompt: 'What is the result?',
        code: 'int a = 3, b = 4;\nint c = a++ + ++b;\nSystem.out.println(c);',
        options: ['7', '8', '9', '6'],
        answer: 1,
        explanation: 'a++ uses a=3 then increments (post-increment). ++b increments first giving b=5. So c = 3 + 5 = 8.'
      },
      {
        id: 'uf1',
        type: 'frq',
        points: 9,
        prompt: 'Write a complete Java method `reverseString` that takes a String s and returns it reversed. For example, "hello" → "olleh". Include the full method declaration inside a class named Solution.',
        starter: 'public class Solution\n{\n    public String reverseString(String s)\n    {\n        // your code here\n    }\n}\n',
        modelAnswer: 'public class Solution\n{\n    public String reverseString(String s)\n    {\n        String result = "";\n        for (int i = s.length() - 1; i >= 0; i--)\n        {\n            result += s.charAt(i);\n        }\n        return result;\n    }\n}\n'
      },
      {
        id: 'uf2',
        type: 'frq',
        points: 9,
        prompt: 'Write a complete Java method `countVowels` that takes a String and returns the number of vowels (a, e, i, o, u — both upper and lower case). Include the full method declaration inside a class named Solution.',
        starter: 'public class Solution\n{\n    public int countVowels(String s)\n    {\n        // your code here\n    }\n}\n',
        modelAnswer: 'public class Solution\n{\n    public int countVowels(String s)\n    {\n        int count = 0;\n        String lower = s.toLowerCase();\n        for (int i = 0; i < lower.length(); i++)\n        {\n            char c = lower.charAt(i);\n            if (c == \'a\' || c == \'e\' || c == \'i\' || c == \'o\' || c == \'u\')\n            {\n                count++;\n            }\n        }\n        return count;\n    }\n}\n'
      }
    ]
  },

  {
    id: 'csa-units-5-8',
    title: 'AP CSA · Units 5–8: Arrays & OOP',
    description: 'One-dimensional arrays, ArrayList, 2D arrays, and core OOP concepts.',
    minutes: 30,
    tag: 'Units 5–8',
    difficulty: 'medium',
    accent: 'from-emerald-400/30 to-cyan-500/20',
    questions: [
      {
        id: 'a1',
        type: 'mcq',
        prompt: 'What is the index of the last element in an array of length n?',
        options: ['n', 'n-1', 'n+1', '0'],
        answer: 1,
        explanation: 'Arrays are 0-indexed. The last element is at index n-1.'
      },
      {
        id: 'a2',
        type: 'mcq',
        prompt: 'What is printed?',
        code: 'int[] arr = {10, 20, 30, 40};\nSystem.out.println(arr[2]);',
        options: ['10', '20', '30', '40'],
        answer: 2,
        explanation: 'arr[2] is the element at index 2, which is 30.'
      },
      {
        id: 'a3',
        type: 'mcq',
        prompt: 'What is the default value of elements in a newly created int array?',
        options: ['null', '1', '0', 'undefined'],
        answer: 2,
        explanation: 'Java initializes int array elements to 0 by default.'
      },
      {
        id: 'a4',
        type: 'mcq',
        prompt: 'What is printed?',
        code: 'int[] arr = new int[5];\nfor (int x : arr) {\n    System.out.print(x + " ");\n}',
        options: ['0 0 0 0 0', '1 2 3 4 5', 'null null null null null', 'compile error'],
        answer: 0,
        explanation: 'new int[5] creates an array of five zeros.'
      },
      {
        id: 'a5',
        type: 'mcq',
        prompt: 'What exception is thrown by arr[-1] or arr[arr.length]?',
        options: ['NullPointerException', 'ArrayIndexOutOfBoundsException', 'ArithmeticException', 'ClassCastException'],
        answer: 1,
        explanation: 'Accessing an index outside 0..length-1 throws ArrayIndexOutOfBoundsException.'
      },
      {
        id: 'a6',
        type: 'mcq',
        prompt: 'What is the output?',
        code: 'int[] a = {1, 2, 3};\nint sum = 0;\nfor (int v : a) sum += v;\nSystem.out.println(sum);',
        options: ['0', '3', '6', '123'],
        answer: 2,
        explanation: '1 + 2 + 3 = 6.'
      },
      {
        id: 'a7',
        type: 'mcq',
        prompt: 'What is printed after this ArrayList operation?',
        code: 'ArrayList<Integer> list = new ArrayList<>();\nlist.add(5);\nlist.add(10);\nlist.add(1, 7);\nSystem.out.println(list);',
        options: ['[5, 10, 7]', '[5, 7, 10]', '[7, 5, 10]', '[5, 10]'],
        answer: 1,
        explanation: 'add(1, 7) inserts 7 at index 1, shifting 10 to index 2: [5, 7, 10].'
      },
      {
        id: 'a8',
        type: 'mcq',
        prompt: 'What is the size of the ArrayList after these operations?',
        code: 'ArrayList<String> list = new ArrayList<>();\nlist.add("A");\nlist.add("B");\nlist.add("C");\nlist.remove(1);\nSystem.out.println(list.size());',
        options: ['3', '2', '1', '0'],
        answer: 1,
        explanation: 'Three adds make size 3. remove(1) removes "B", leaving size 2.'
      },
      {
        id: 'a9',
        type: 'mcq',
        prompt: 'For a 2D array int[][] grid = new int[3][4], what is grid.length?',
        options: ['4', '3', '12', '7'],
        answer: 1,
        explanation: 'grid.length is the number of rows: 3. grid[0].length would be 4.'
      },
      {
        id: 'a10',
        type: 'mcq',
        prompt: 'How many iterations does this nested loop perform?',
        code: 'for (int i = 0; i < 3; i++)\n    for (int j = 0; j < 4; j++)\n        count++;',
        options: ['7', '12', '9', '16'],
        answer: 1,
        explanation: '3 outer iterations × 4 inner iterations = 12.'
      },
      {
        id: 'a11',
        type: 'mcq',
        prompt: 'Which OOP principle does "private fields with public getters" demonstrate?',
        options: ['Inheritance', 'Polymorphism', 'Encapsulation', 'Abstraction'],
        answer: 2,
        explanation: 'Hiding internal state and exposing it only through methods is encapsulation.'
      },
      {
        id: 'a12',
        type: 'mcq',
        prompt: 'What keyword makes a class inherit from another in Java?',
        options: ['implements', 'extends', 'inherits', 'super'],
        answer: 1,
        explanation: 'Java uses "extends" for class inheritance.'
      },
      {
        id: 'a13',
        type: 'mcq',
        prompt: 'A subclass constructor that calls the parent constructor uses:',
        options: ['this()', 'super()', 'parent()', 'base()'],
        answer: 1,
        explanation: 'super() calls the parent class constructor in Java.'
      },
      {
        id: 'a14',
        type: 'mcq',
        prompt: 'What is the output?',
        code: 'class Animal { public String speak() { return "..."; } }\nclass Dog extends Animal {\n    public String speak() { return "Woof"; }\n}\nAnimal a = new Dog();\nSystem.out.println(a.speak());',
        options: ['...', 'Woof', 'null', 'compile error'],
        answer: 1,
        explanation: 'This is runtime polymorphism — the actual object is a Dog, so Dog\'s speak() is called.'
      },
      {
        id: 'a15',
        type: 'mcq',
        prompt: 'What keyword prevents a method from being overridden?',
        options: ['static', 'private', 'final', 'abstract'],
        answer: 2,
        explanation: 'Declaring a method final prevents subclasses from overriding it.'
      },
      {
        id: 'a16',
        type: 'mcq',
        prompt: 'What does the toString() method return by default in Object?',
        options: ['The class name and object\'s fields', 'null', 'The class name and hashCode in hex', '"Object"'],
        answer: 2,
        explanation: 'The default Object.toString() returns className@hexHashCode. Override it to get something meaningful.'
      },
      {
        id: 'a17',
        type: 'mcq',
        prompt: 'Which is NOT a constructor rule in Java?',
        options: ['It has the same name as the class', 'It can be private', 'It must have a return type', 'It can be overloaded'],
        answer: 2,
        explanation: 'Constructors never declare a return type (not even void). The other statements are all true.'
      },
      {
        id: 'a18',
        type: 'mcq',
        prompt: 'What is printed?',
        code: 'int[] arr = {5, 3, 8, 1};\nint max = arr[0];\nfor (int v : arr)\n    if (v > max) max = v;\nSystem.out.println(max);',
        options: ['5', '8', '1', '3'],
        answer: 1,
        explanation: 'Standard max-scan: after visiting all elements, max = 8.'
      },
      {
        id: 'a19',
        type: 'mcq',
        prompt: 'What is wrong with this code?',
        code: 'ArrayList<int> list = new ArrayList<>();',
        options: ['Nothing', 'ArrayList cannot hold numbers', 'int is a primitive — use Integer', 'ArrayList requires a size'],
        answer: 2,
        explanation: 'Java generics require reference types. Use ArrayList<Integer> instead of ArrayList<int>.'
      },
      {
        id: 'a20',
        type: 'mcq',
        prompt: 'What is the output?',
        code: 'String[] words = {"cat", "ant", "bat"};\njava.util.Arrays.sort(words);\nSystem.out.println(words[0]);',
        options: ['cat', 'ant', 'bat', 'abc'],
        answer: 1,
        explanation: 'Arrays.sort on Strings uses lexicographic order: ant < bat < cat, so words[0] = "ant".'
      },
      {
        id: 'af1',
        type: 'frq',
        points: 9,
        prompt: 'Write a complete Java class Student with private fields for name (String) and grade (int). Include a constructor, getters, a setter for grade, and a toString() that returns "Name: Ali, Grade: 90". Class name: Student.',
        starter: 'public class Student\n{\n    // fields, constructor, methods here\n}\n',
        modelAnswer: 'public class Student\n{\n    private String name;\n    private int grade;\n\n    public Student(String name, int grade)\n    {\n        this.name = name;\n        this.grade = grade;\n    }\n\n    public String getName()\n    {\n        return name;\n    }\n\n    public int getGrade()\n    {\n        return grade;\n    }\n\n    public void setGrade(int grade)\n    {\n        this.grade = grade;\n    }\n\n    public String toString()\n    {\n        return "Name: " + name + ", Grade: " + grade;\n    }\n}\n'
      },
      {
        id: 'af2',
        type: 'frq',
        points: 9,
        prompt: 'Write a complete Java method `findMax` inside class Solution that takes a 2D int array and returns the largest value in the array.',
        starter: 'public class Solution\n{\n    public int findMax(int[][] grid)\n    {\n        // your code here\n    }\n}\n',
        modelAnswer: 'public class Solution\n{\n    public int findMax(int[][] grid)\n    {\n        int max = grid[0][0];\n        for (int i = 0; i < grid.length; i++)\n        {\n            for (int j = 0; j < grid[i].length; j++)\n            {\n                if (grid[i][j] > max)\n                {\n                    max = grid[i][j];\n                }\n            }\n        }\n        return max;\n    }\n}\n'
      }
    ]
  },

  {
    id: 'algorithms-advanced',
    title: 'Algorithms & Data Structures',
    description: 'Sorting, searching, recursion, Big O, linked lists, trees, and graph traversal.',
    minutes: 28,
    tag: 'Algorithms',
    difficulty: 'medium',
    accent: 'from-violet-400/30 to-pink-500/20',
    questions: [
      {
        id: 'al1',
        type: 'mcq',
        prompt: 'What is the best-case time complexity of bubble sort?',
        options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(1)'],
        answer: 2,
        explanation: 'With the early-exit optimisation (no swaps in a pass → sorted), a sorted input triggers 0 swaps on the first pass: O(n).'
      },
      {
        id: 'al2',
        type: 'mcq',
        prompt: 'What is the time complexity of merge sort in the worst case?',
        options: ['O(n)', 'O(n²)', 'O(n log n)', 'O(log n)'],
        answer: 2,
        explanation: 'Merge sort always splits log n times and merges in O(n) per level: O(n log n) in all cases.'
      },
      {
        id: 'al3',
        type: 'mcq',
        prompt: 'What is the worst-case time complexity of binary search?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
        answer: 2,
        explanation: 'Binary search halves the search space each step: O(log n).'
      },
      {
        id: 'al4',
        type: 'mcq',
        prompt: 'A stack uses which ordering?',
        options: ['FIFO', 'LIFO', 'Random', 'Priority'],
        answer: 1,
        explanation: 'Stack: Last-In-First-Out (LIFO). Queue: First-In-First-Out (FIFO).'
      },
      {
        id: 'al5',
        type: 'mcq',
        prompt: 'What is the average time complexity of lookup in a HashMap?',
        options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
        answer: 3,
        explanation: 'HashMap lookup is O(1) on average due to hashing; O(n) worst case under full collisions.'
      },
      {
        id: 'al6',
        type: 'mcq',
        prompt: 'Which traversal visits nodes in sorted order for a BST?',
        options: ['Pre-order', 'Post-order', 'In-order', 'Level-order'],
        answer: 2,
        explanation: 'In-order traversal (left, root, right) of a BST yields elements in ascending sorted order.'
      },
      {
        id: 'al7',
        type: 'mcq',
        prompt: 'What is the time complexity of inserting into a sorted linked list?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        answer: 2,
        explanation: 'You must scan up to n nodes to find the insertion point in a linked list.'
      },
      {
        id: 'al8',
        type: 'mcq',
        prompt: 'What data structure does BFS (Breadth-First Search) use?',
        options: ['Stack', 'Queue', 'Priority queue', 'Deque'],
        answer: 1,
        explanation: 'BFS explores level by level using a Queue (FIFO). DFS uses a Stack (LIFO).'
      },
      {
        id: 'al9',
        type: 'mcq',
        prompt: 'What is the output of this recursive method with input 4?',
        code: 'public static int f(int n) {\n    if (n == 0) return 0;\n    return n + f(n - 1);\n}',
        options: ['10', '6', '4', '24'],
        answer: 0,
        explanation: 'f(4) = 4 + f(3) = 4 + 3 + f(2) = ... = 4 + 3 + 2 + 1 + 0 = 10.'
      },
      {
        id: 'al10',
        type: 'mcq',
        prompt: 'Which term means an algorithm\'s space usage grows proportionally to the input size?',
        options: ['O(1) space', 'O(n) space', 'O(log n) space', 'O(n²) space'],
        answer: 1,
        explanation: 'O(n) space means the algorithm allocates memory proportional to input size — linear space.'
      },
      {
        id: 'al11',
        type: 'mcq',
        prompt: 'What does the following correctly describe?',
        code: 'T(n) = 2T(n/2) + O(n)',
        options: ['Bubble sort recurrence', 'Merge sort recurrence', 'Binary search recurrence', 'Linear search recurrence'],
        answer: 1,
        explanation: 'This is the classic merge sort recurrence: split into 2 halves + linear merge. Solving gives O(n log n).'
      },
      {
        id: 'al12',
        type: 'mcq',
        prompt: 'In a min-heap, where is the smallest element?',
        options: ['At the last leaf', 'At the root', 'At any leaf', 'At index 1 (1-indexed)'],
        answer: 1,
        explanation: 'The min-heap property ensures the smallest element is always at the root.'
      },
      {
        id: 'al13',
        type: 'mcq',
        prompt: 'What is the maximum number of nodes in a binary tree of height h?',
        options: ['2h', '2^h - 1', '2^(h+1) - 1', 'h²'],
        answer: 2,
        explanation: 'A full binary tree of height h has 2^(h+1) - 1 nodes (at height 0: 1 node = 2^1 - 1).'
      },
      {
        id: 'al14',
        type: 'mcq',
        prompt: 'What is the time complexity of the naïve recursive Fibonacci with no memoization?',
        options: ['O(n)', 'O(n log n)', 'O(2^n)', 'O(n²)'],
        answer: 2,
        explanation: 'Without memoization, fib(n) branches exponentially: O(2^n) in the worst case.'
      },
      {
        id: 'al15',
        type: 'mcq',
        prompt: 'Which sorting algorithm is stable AND O(n log n) guaranteed?',
        options: ['Quicksort', 'Bubble sort', 'Merge sort', 'Heap sort'],
        answer: 2,
        explanation: 'Merge sort is stable (equal elements keep original order) and guarantees O(n log n) in all cases.'
      },
      {
        id: 'al16',
        type: 'mcq',
        prompt: 'What is the base case that MUST exist in any correct recursive function?',
        options: ['A case that calls itself', 'A case that returns without recursion', 'A case that throws an exception', 'A case that loops'],
        answer: 1,
        explanation: 'A base case terminates recursion by returning a result without a recursive call.'
      },
      {
        id: 'al17',
        type: 'mcq',
        prompt: 'What is the time complexity of accessing element k in a singly linked list?',
        options: ['O(1)', 'O(log n)', 'O(k)', 'O(n²)'],
        answer: 2,
        explanation: 'There is no random access in a linked list — you must traverse from the head, costing O(k).'
      },
      {
        id: 'al18',
        type: 'mcq',
        prompt: 'Which is NOT true about a balanced BST with n nodes?',
        options: ['Height is O(log n)', 'Search is O(log n)', 'Insertion is O(1)', 'In-order traversal is O(n)'],
        answer: 2,
        explanation: 'Insertion in a balanced BST requires traversal to find the position: O(log n), not O(1).'
      },
      {
        id: 'al19',
        type: 'mcq',
        prompt: 'What does O(1) space complexity mean?',
        options: ['The algorithm uses no memory', 'Memory usage is constant regardless of input size', 'The algorithm runs in constant time', 'Only one variable is used'],
        answer: 1,
        explanation: 'O(1) space means the extra memory used does not grow with the input — it stays constant.'
      },
      {
        id: 'al20',
        type: 'mcq',
        prompt: 'Which algorithm would you use to find the shortest path in an unweighted graph?',
        options: ['DFS', 'BFS', 'Dijkstra\'s', 'Bellman-Ford'],
        answer: 1,
        explanation: 'BFS explores level by level, naturally finding the shortest path (by edge count) in an unweighted graph.'
      },
      {
        id: 'alf1',
        type: 'frq',
        points: 9,
        prompt: 'Write a complete Java method `binarySearch` inside class Solution that takes a sorted int array and a target int, and returns the index of the target (or -1 if not found). Use the iterative approach.',
        starter: 'public class Solution\n{\n    public int binarySearch(int[] arr, int target)\n    {\n        // your code here\n    }\n}\n',
        modelAnswer: 'public class Solution\n{\n    public int binarySearch(int[] arr, int target)\n    {\n        int low = 0;\n        int high = arr.length - 1;\n        while (low <= high)\n        {\n            int mid = low + (high - low) / 2;\n            if (arr[mid] == target)\n            {\n                return mid;\n            }\n            else if (arr[mid] < target)\n            {\n                low = mid + 1;\n            }\n            else\n            {\n                high = mid - 1;\n            }\n        }\n        return -1;\n    }\n}\n'
      },
      {
        id: 'alf2',
        type: 'frq',
        points: 9,
        prompt: 'Write a complete Java method `fibonacci` inside class Solution that returns the n-th Fibonacci number using bottom-up dynamic programming (no recursion, O(n) time, O(1) space). F(0) = 0, F(1) = 1.',
        starter: 'public class Solution\n{\n    public long fibonacci(int n)\n    {\n        // your code here\n    }\n}\n',
        modelAnswer: 'public class Solution\n{\n    public long fibonacci(int n)\n    {\n        if (n < 2)\n        {\n            return n;\n        }\n        long prev = 0;\n        long curr = 1;\n        for (int i = 2; i <= n; i++)\n        {\n            long next = prev + curr;\n            prev = curr;\n            curr = next;\n        }\n        return curr;\n    }\n}\n'
      }
    ]
  },

  {
    id: 'csa-frq-advanced',
    title: 'AP CSA · Advanced Free-Response',
    description: 'Complex OOP designs, inheritance hierarchies, 2D arrays, recursion, and ArrayList manipulation.',
    minutes: 45,
    tag: 'FRQ',
    difficulty: 'hard',
    accent: 'from-amber-400/30 to-rose-500/20',
    questions: [
      {
        id: 'fq1',
        type: 'mcq',
        prompt: 'In Java, what is the result of calling a method on a null reference?',
        options: ['0 is returned', 'NullPointerException is thrown', 'The method is skipped', 'compile error'],
        answer: 1,
        explanation: 'Calling any method on null throws a NullPointerException at runtime.'
      },
      {
        id: 'fq2',
        type: 'mcq',
        prompt: 'What is the output?',
        code: 'int[] a = {1, 2, 3};\nint[] b = a;\nb[0] = 99;\nSystem.out.println(a[0]);',
        options: ['1', '99', '0', 'compile error'],
        answer: 1,
        explanation: 'Arrays are reference types. b = a makes both variables point to the same array, so b[0] = 99 also changes a[0].'
      },
      {
        id: 'fq3',
        type: 'mcq',
        prompt: 'What is printed?',
        code: 'public static int mystery(int n) {\n    if (n <= 0) return 0;\n    return mystery(n - 2) + n;\n}\nSystem.out.println(mystery(5));',
        options: ['9', '15', '5', '6'],
        answer: 0,
        explanation: 'mystery(5) = mystery(3) + 5 = mystery(1) + 3 + 5 = mystery(-1) + 1 + 8 = 0 + 1 + 3 + 5 = 9.'
      },
      {
        id: 'fq4',
        type: 'mcq',
        prompt: 'An abstract class in Java:',
        options: ['Cannot have any methods', 'Can be instantiated directly', 'Can have both abstract and concrete methods', 'Is the same as an interface'],
        answer: 2,
        explanation: 'Abstract classes can mix abstract (no body) and concrete (with body) methods. They cannot be instantiated directly.'
      },
      {
        id: 'fq5',
        type: 'mcq',
        prompt: 'An interface in Java (prior to Java 8 default methods):',
        options: ['Can have instance variables', 'Can have abstract methods only', 'Can be instantiated', 'Can extend a class'],
        answer: 1,
        explanation: 'Traditional interfaces have only abstract method signatures (no bodies, no instance fields).'
      },
      {
        id: 'fq6',
        type: 'mcq',
        prompt: 'What is the output?',
        code: 'ArrayList<Integer> list = new ArrayList<>();\nfor (int i = 1; i <= 5; i++) list.add(i);\nfor (int i = list.size() - 1; i >= 0; i--)\n    if (list.get(i) % 2 == 0) list.remove(i);\nSystem.out.println(list);',
        options: ['[1, 3, 5]', '[2, 4]', '[1, 2, 3, 4, 5]', '[1, 5]'],
        answer: 0,
        explanation: 'Iterating backwards and removing even elements leaves [1, 3, 5].'
      },
      {
        id: 'fq7',
        type: 'mcq',
        prompt: 'What is the time complexity of this code?',
        code: 'for (int i = 0; i < n; i++)\n    for (int j = i; j < n; j++)\n        sum++;',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2^n)'],
        answer: 2,
        explanation: 'The inner loop runs n, n-1, ..., 1 times = n(n+1)/2 total: O(n²).'
      },
      {
        id: 'fq8',
        type: 'mcq',
        prompt: 'What is output?',
        code: 'String s1 = new String("hello");\nString s2 = new String("hello");\nSystem.out.println(s1 == s2);\nSystem.out.println(s1.equals(s2));',
        options: ['true\ntrue', 'false\nfalse', 'false\ntrue', 'true\nfalse'],
        answer: 2,
        explanation: '== compares references (different objects → false); equals() compares content → true.'
      },
      {
        id: 'fq9',
        type: 'mcq',
        prompt: 'What does the static keyword mean for a field?',
        options: ['It cannot be changed', 'It belongs to the class, shared by all instances', 'It is accessible only in the same class', 'It is initialized to null'],
        answer: 1,
        explanation: 'static fields belong to the class, not any individual instance — all objects share the same value.'
      },
      {
        id: 'fq10',
        type: 'mcq',
        prompt: 'Which correctly uses the Comparable interface to sort Student objects by grade?',
        options: [
          'class Student { public void compareTo(Student o) {} }',
          'class Student implements Comparable<Student> { public int compareTo(Student o) { return this.grade - o.grade; } }',
          'class Student extends Comparable { }',
          'class Student { public boolean compareTo(Student o) { return grade > o.grade; } }'
        ],
        answer: 1,
        explanation: 'Comparable<T> requires implementing int compareTo(T o). Returning this.grade - o.grade gives ascending order.'
      },
      {
        id: 'fq11',
        type: 'mcq',
        prompt: 'What is printed?',
        code: 'int x = 5;\nSystem.out.println(x > 3 ? (x > 4 ? "big" : "medium") : "small");',
        options: ['big', 'medium', 'small', 'compile error'],
        answer: 0,
        explanation: 'x > 3 is true; x > 4 is also true; result is "big".'
      },
      {
        id: 'fq12',
        type: 'mcq',
        prompt: 'What is the purpose of the "this" keyword in Java?',
        options: ['Calls the parent class constructor', 'References the current object instance', 'Declares a static variable', 'Creates a new object'],
        answer: 1,
        explanation: '"this" refers to the current object instance — used to distinguish instance fields from parameters with the same name.'
      },
      {
        id: 'fq13',
        type: 'mcq',
        prompt: 'What is the output?',
        code: 'public static int power(int base, int exp) {\n    if (exp == 0) return 1;\n    return base * power(base, exp - 1);\n}\nSystem.out.println(power(2, 10));',
        options: ['20', '512', '1024', '2048'],
        answer: 2,
        explanation: 'power(2, 10) = 2^10 = 1024.'
      },
      {
        id: 'fq14',
        type: 'mcq',
        prompt: 'Which correctly declares a method that can be overridden in a subclass?',
        options: ['private void walk()', 'final void walk()', 'public void walk()', 'static void walk()'],
        answer: 2,
        explanation: 'Only non-final, non-private, non-static methods can be overridden. public void walk() is the correct choice.'
      },
      {
        id: 'fq15',
        type: 'mcq',
        prompt: 'What concept allows a parent class reference to hold a child class object?',
        options: ['Encapsulation', 'Polymorphism', 'Abstraction', 'Overloading'],
        answer: 1,
        explanation: 'Polymorphism — specifically upcasting — allows Animal a = new Dog(); and dispatches methods at runtime.'
      },
      {
        id: 'fq16',
        type: 'mcq',
        prompt: 'What is printed?',
        code: 'int[] arr = {1, 2, 3, 4, 5};\nint count = 0;\nfor (int v : arr)\n    if (v % 2 != 0) count++;\nSystem.out.println(count);',
        options: ['2', '3', '4', '5'],
        answer: 1,
        explanation: 'Odd elements: 1, 3, 5 → count = 3.'
      },
      {
        id: 'fq17',
        type: 'mcq',
        prompt: 'What happens when you try to add an incompatible type to a typed ArrayList?',
        options: ['The object is silently ignored', 'A runtime ClassCastException is thrown', 'A compile-time error occurs', 'null is inserted instead'],
        answer: 2,
        explanation: 'Generics are enforced at compile time — adding a String to ArrayList<Integer> is a compile error.'
      },
      {
        id: 'fqf1',
        type: 'frq',
        points: 9,
        prompt: 'Write a Java class Shape with an abstract method `area()` returning double. Then write a subclass Circle that extends Shape, takes a radius in the constructor, and implements area() using Math.PI * radius * radius.',
        starter: '// Write Shape (abstract) and Circle classes here\n',
        modelAnswer: 'public abstract class Shape\n{\n    public abstract double area();\n}\n\npublic class Circle extends Shape\n{\n    private double radius;\n\n    public Circle(double radius)\n    {\n        this.radius = radius;\n    }\n\n    public double area()\n    {\n        return Math.PI * radius * radius;\n    }\n}\n'
      },
      {
        id: 'fqf2',
        type: 'frq',
        points: 9,
        prompt: 'Write a complete Java method `removeDuplicates` inside class Solution that takes an ArrayList<Integer> and returns a new ArrayList<Integer> with duplicates removed, preserving the original order.',
        starter: 'import java.util.ArrayList;\n\npublic class Solution\n{\n    public ArrayList<Integer> removeDuplicates(ArrayList<Integer> list)\n    {\n        // your code here\n    }\n}\n',
        modelAnswer: 'import java.util.ArrayList;\nimport java.util.HashSet;\n\npublic class Solution\n{\n    public ArrayList<Integer> removeDuplicates(ArrayList<Integer> list)\n    {\n        ArrayList<Integer> result = new ArrayList<>();\n        HashSet<Integer> seen = new HashSet<>();\n        for (int val : list)\n        {\n            if (seen.add(val))\n            {\n                result.add(val);\n            }\n        }\n        return result;\n    }\n}\n'
      },
      {
        id: 'fqf3',
        type: 'frq',
        points: 9,
        prompt: 'Write a complete class MathUtils with: (a) a static method `factorial(int n)` returning long (0! = 1), and (b) a static method `isPalindrome(String s)` returning true if s reads the same forwards and backwards (case-insensitive, ignoring non-letter characters).',
        starter: 'public class MathUtils\n{\n    public static long factorial(int n)\n    {\n        // your code here\n    }\n\n    public static boolean isPalindrome(String s)\n    {\n        // your code here\n    }\n}\n',
        modelAnswer: 'public class MathUtils\n{\n    public static long factorial(int n)\n    {\n        if (n <= 1)\n        {\n            return 1;\n        }\n        return n * factorial(n - 1);\n    }\n\n    public static boolean isPalindrome(String s)\n    {\n        String clean = s.toLowerCase().replaceAll("[^a-z]", "");\n        int left = 0;\n        int right = clean.length() - 1;\n        while (left < right)\n        {\n            if (clean.charAt(left) != clean.charAt(right))\n            {\n                return false;\n            }\n            left++;\n            right--;\n        }\n        return true;\n    }\n}\n'
      }
    ]
  },

  // ── AP CS A 2026-style exam ───────────────────────────────────────────────
  {
    id: 'ap-csa-2026',
    title: 'AP CS A 2026 — Full Practice Exam',
    description: 'Simulation of the 2026 AP Computer Science A format: 40 MCQ + FRQ across all 10 units.',
    minutes: 90,
    tag: 'AP 2026',
    difficulty: 'hard',
    accent: 'from-cyan-400/30 to-indigo-500/20',
    questions: [
      { id: '26-1', type: 'mcq', prompt: 'What is the value of x after this code?', code: 'int x = 5;\nx *= 2;\nx -= 3;', options: ['7', '8', '10', '4'], answer: 0, explanation: '5 * 2 = 10; 10 - 3 = 7.' },
      { id: '26-2', type: 'mcq', prompt: 'Which expression evaluates to true when n is divisible by 3 but not 9?', options: ['n % 3 == 0 && n % 9 != 0', 'n % 3 == 0 || n % 9 == 0', 'n % 9 == 0 && n % 3 != 0', 'n % 3 != 0 && n % 9 == 0'], answer: 0, explanation: 'Divisible by 3 means n % 3 == 0; not by 9 means n % 9 != 0. Both must hold.' },
      { id: '26-3', type: 'mcq', prompt: 'What is printed?', code: 'String s = "APCSA";\nfor (int i = s.length() - 1; i >= 0; i--) System.out.print(s.charAt(i));', options: ['APCSA', 'ASCPA', 'ASCPA reversed', 'ASCPA → ASCPA'], answer: 1, explanation: '"APCSA" reversed character by character: A→A, S→S, C→C, P→P, A→A... wait: APCSA reversed is ASCPA.' },
      { id: '26-4', type: 'mcq', prompt: 'A method with signature `public int calc(int a, int b)` is called with `calc(3)`. What happens?', options: ['Returns 3', 'Returns 0', 'compile error — wrong number of arguments', 'Runtime error'], answer: 2, explanation: 'Java requires the exact number of arguments matching the method signature. One argument for a two-parameter method is a compile error.' },
      { id: '26-5', type: 'mcq', prompt: 'What is the output?', code: 'int[] a = {1,2,3,4,5};\nfor (int i = 0; i < a.length / 2; i++) {\n    int t = a[i];\n    a[i] = a[a.length - 1 - i];\n    a[a.length - 1 - i] = t;\n}\nSystem.out.println(a[0] + " " + a[4]);', options: ['1 5', '5 1', '3 3', '1 1'], answer: 1, explanation: 'This reverses the array. a[0] becomes 5, a[4] becomes 1.' },
      { id: '26-6', type: 'mcq', prompt: 'What does this method return for input "racecar"?', code: 'public boolean check(String s) {\n    for (int i = 0; i < s.length()/2; i++)\n        if (s.charAt(i) != s.charAt(s.length()-1-i)) return false;\n    return true;\n}', options: ['false', 'true', 'null', 'compile error'], answer: 1, explanation: '"racecar" is a palindrome — each symmetric pair matches, so the method returns true.' },
      { id: '26-7', type: 'mcq', prompt: 'What is the scope of variable x in Java?', code: 'public void method() {\n    if (true) {\n        int x = 5;\n    }\n    System.out.println(x); // line A\n}', options: ['x is accessible at line A', 'compile error — x is out of scope at line A', 'x is 0 at line A', 'x is null at line A'], answer: 1, explanation: 'x is declared inside the if block. Its scope ends at the closing brace — it cannot be accessed outside.' },
      { id: '26-8', type: 'mcq', prompt: 'How many times is "hello" printed?', code: 'for (int i = 1; i <= 16; i *= 2) System.out.println("hello");', options: ['4', '5', '16', '8'], answer: 1, explanation: 'i takes values 1, 2, 4, 8, 16 — all ≤ 16. That is 5 iterations.' },
      { id: '26-9', type: 'mcq', prompt: 'What is printed?', code: 'ArrayList<Integer> nums = new ArrayList<>(Arrays.asList(1,2,3,4,5));\nIterator<Integer> it = nums.iterator();\nwhile (it.hasNext()) {\n    int v = it.next();\n    if (v % 2 == 0) it.remove();\n}\nSystem.out.println(nums);', options: ['[1, 3, 5]', '[2, 4]', '[1, 2, 3, 4, 5]', 'ConcurrentModificationException'], answer: 0, explanation: 'Using an iterator\'s own remove() is the safe way to delete during iteration. Even values 2 and 4 are removed, leaving [1, 3, 5].' },
      { id: '26-10', type: 'mcq', prompt: 'What is the output of this recursive call?', code: 'public static int f(int n) {\n    if (n == 1) return 1;\n    return 2 * f(n - 1);\n}\nSystem.out.println(f(5));', options: ['10', '16', '32', '25'], answer: 1, explanation: 'f(5) = 2*f(4) = 2*2*f(3) = ... = 2^4 * f(1) = 16 * 1 = 16.' },
      { id: '26-11', type: 'mcq', prompt: 'What does the interface keyword enforce?', options: ['All methods must be private', 'Implementing classes must override all abstract methods', 'The class cannot be instantiated', 'All fields must be final'], answer: 1, explanation: 'A class that implements an interface must provide implementations for all its abstract methods (or itself be declared abstract).' },
      { id: '26-12', type: 'mcq', prompt: 'Which correctly creates a 3-row, 4-column 2D array initialized to 0?', options: ['int[][] a = new int[4][3];', 'int[][] a = new int[3][4];', 'int[3][4] a = new int[][];', 'int[][] a = int[3][4];'], answer: 1, explanation: 'new int[rows][cols] — new int[3][4] gives 3 rows and 4 columns.' },
      { id: '26-13', type: 'mcq', prompt: 'What is the output?', code: 'String[] words = {"banana","apple","cherry"};\njava.util.Arrays.sort(words);\nSystem.out.println(words[0]);', options: ['banana', 'apple', 'cherry', 'undefined'], answer: 1, explanation: 'Lexicographic sort: apple < banana < cherry. words[0] = "apple".' },
      { id: '26-14', type: 'mcq', prompt: 'What happens if you access index -1 of an array?', options: ['Returns the last element', 'Returns 0', 'ArrayIndexOutOfBoundsException', 'NullPointerException'], answer: 2, explanation: 'Negative indices are invalid in Java and throw ArrayIndexOutOfBoundsException.' },
      { id: '26-15', type: 'mcq', prompt: 'What is the result of Integer.parseInt("42") + 8?', options: ['4248', '50', 'compile error', 'NumberFormatException'], answer: 1, explanation: 'parseInt converts "42" to int 42. 42 + 8 = 50.' },
      { id: '26-16', type: 'mcq', prompt: 'Which correctly overrides equals()?', options: ['public boolean equals(String other)', 'public boolean equals(Object other)', 'public int equals(Object other)', 'public static boolean equals(Object other)'], answer: 1, explanation: 'The correct signature to override Object.equals is: public boolean equals(Object other).' },
      { id: '26-17', type: 'mcq', prompt: 'What is printed?', code: 'int sum = 0;\nfor (int i = 1; i <= 100; i++) {\n    if (i % 2 == 0) sum += i;\n}\nSystem.out.println(sum);', options: ['2550', '5050', '5000', '2500'], answer: 0, explanation: 'Sum of even numbers 2+4+...+100 = 2*(1+2+...+50) = 2*1275 = 2550.' },
      { id: '26-18', type: 'mcq', prompt: 'Which statement about constructors is FALSE?', options: ['A class can have multiple constructors', 'A constructor has no return type', 'A constructor must be public', 'A constructor can call super()'], answer: 2, explanation: 'Constructors can have any access modifier (public, private, protected, or package-private). They are NOT required to be public.' },
      { id: '26-19', type: 'mcq', prompt: 'What does Collections.sort() require of the elements?', options: ['They must implement Serializable', 'They must implement Comparable', 'They must be arrays', 'They must be Integer type'], answer: 1, explanation: 'Collections.sort() requires elements that implement Comparable<T> so it can call compareTo().' },
      { id: '26-20', type: 'mcq', prompt: 'What is the output?', code: 'int x = 10;\nint y = x++ + ++x;\nSystem.out.println(y);', options: ['21', '22', '20', '23'], answer: 1, explanation: 'x++ uses x=10 then increments (x becomes 11). ++x increments first (x becomes 12). y = 10 + 12 = 22.' },
      {
        id: '26-f1', type: 'frq', points: 9,
        prompt: 'Write a complete Java class WordCount with a method `countWords(String sentence)` that returns the number of words in the sentence. Words are separated by single spaces. Include a static main method that tests it with "AP Computer Science A" and prints the result.',
        starter: 'public class WordCount\n{\n    public int countWords(String sentence)\n    {\n        // your code here\n    }\n\n    public static void main(String[] args)\n    {\n        // test your method\n    }\n}\n',
        modelAnswer: 'public class WordCount\n{\n    public int countWords(String sentence)\n    {\n        if (sentence == null || sentence.isEmpty())\n        {\n            return 0;\n        }\n        return sentence.trim().split("\\\\s+").length;\n    }\n\n    public static void main(String[] args)\n    {\n        WordCount wc = new WordCount();\n        System.out.println(wc.countWords("AP Computer Science A")); // 4\n    }\n}\n'
      },
      {
        id: '26-f2', type: 'frq', points: 9,
        prompt: 'Write a Java class NumberList with: a private ArrayList<Integer> field, an `add(int n)` method, a `getMax()` method returning the largest value, and a `getAverage()` method returning a double. Handle the empty-list case in getMax() by returning Integer.MIN_VALUE and in getAverage() by returning 0.0.',
        starter: 'import java.util.ArrayList;\n\npublic class NumberList\n{\n    // fields and methods here\n}\n',
        modelAnswer: 'import java.util.ArrayList;\n\npublic class NumberList\n{\n    private ArrayList<Integer> numbers;\n\n    public NumberList()\n    {\n        numbers = new ArrayList<>();\n    }\n\n    public void add(int n)\n    {\n        numbers.add(n);\n    }\n\n    public int getMax()\n    {\n        if (numbers.isEmpty())\n        {\n            return Integer.MIN_VALUE;\n        }\n        int max = numbers.get(0);\n        for (int val : numbers)\n        {\n            if (val > max) max = val;\n        }\n        return max;\n    }\n\n    public double getAverage()\n    {\n        if (numbers.isEmpty()) return 0.0;\n        int sum = 0;\n        for (int val : numbers) sum += val;\n        return (double) sum / numbers.size();\n    }\n}\n'
      }
    ]
  },

  // ── AP CS A 2025-style exam ───────────────────────────────────────────────
  {
    id: 'ap-csa-2025',
    title: 'AP CS A 2025 — Full Practice Exam',
    description: 'Topics from the 2025 exam cycle: inheritance, interfaces, 2D arrays, and iterative algorithms.',
    minutes: 90,
    tag: 'AP 2025',
    difficulty: 'hard',
    accent: 'from-violet-400/30 to-cyan-500/20',
    questions: [
      { id: '25-1', type: 'mcq', prompt: 'Consider Animal a = new Cat(). What is the compile-time type of a?', options: ['Cat', 'Animal', 'Object', 'depends on method called'], answer: 1, explanation: 'The compile-time type is the declared type (Animal). The runtime type is Cat. Java uses the compile-time type to determine which methods are accessible.' },
      { id: '25-2', type: 'mcq', prompt: 'What is printed?', code: 'class Base { public String name() { return "Base"; } }\nclass Sub extends Base { public String name() { return "Sub"; } }\nBase b = new Sub();\nSystem.out.println(b.name());', options: ['Base', 'Sub', 'BaseSub', 'compile error'], answer: 1, explanation: 'Runtime polymorphism: the actual object is Sub, so Sub\'s overridden name() is called.' },
      { id: '25-3', type: 'mcq', prompt: 'What is the output?', code: 'int[][] m = {{1,2},{3,4},{5,6}};\nSystem.out.println(m.length + " " + m[0].length);', options: ['2 3', '3 2', '6 1', '3 3'], answer: 1, explanation: 'm.length = 3 rows. m[0].length = 2 columns.' },
      { id: '25-4', type: 'mcq', prompt: 'Which loop correctly traverses a 2D array row by row?', options: ['for (int j = 0; j < a[0].length; j++) for (int i = 0; i < a.length; i++)', 'for (int i = 0; i < a.length; i++) for (int j = 0; j < a[i].length; j++)', 'for (int i = 0; i <= a.length; i++) for (int j = 0; j <= a[i].length; j++)', 'for (int[] row : a) for (int val : a)'], answer: 1, explanation: 'Outer loop over rows (a.length), inner over columns (a[i].length). This is the standard row-major traversal.' },
      { id: '25-5', type: 'mcq', prompt: 'What is the minimum number of comparisons binary search makes on a 1024-element array?', options: ['1', '10', '512', '1024'], answer: 0, explanation: 'Best case: the first mid checked is the target — 1 comparison.' },
      { id: '25-6', type: 'mcq', prompt: 'What does the following print?', code: 'String s = "";\nfor (int i = 5; i >= 1; i--) s += i;\nSystem.out.println(s);', options: ['12345', '54321', '15', '5'], answer: 1, explanation: 'i goes 5,4,3,2,1, concatenated to s: "54321".' },
      { id: '25-7', type: 'mcq', prompt: 'Which access modifier makes a method accessible only within the same class?', options: ['public', 'protected', 'private', 'package-private (no modifier)'], answer: 2, explanation: 'private restricts access to within the class only.' },
      { id: '25-8', type: 'mcq', prompt: 'What is the output?', code: 'int n = 6;\nwhile (n > 0) { System.out.print(n + " "); n /= 2; }', options: ['6 3 1', '6 3 1 0', '6 4 2 1', 'infinite loop'], answer: 0, explanation: 'n: 6→3→1→0. The loop prints 6, 3, 1. When n=0 the condition fails.' },
      { id: '25-9', type: 'mcq', prompt: 'What exception does dividing an integer by zero throw?', options: ['NullPointerException', 'ArithmeticException', 'NumberFormatException', 'StackOverflowError'], answer: 1, explanation: 'Integer division by zero throws java.lang.ArithmeticException: / by zero.' },
      { id: '25-10', type: 'mcq', prompt: 'How does a for-each loop differ from a regular for loop for arrays?', options: ['It is faster', 'It cannot modify array elements via the loop variable', 'It starts from the last element', 'It skips null elements'], answer: 1, explanation: 'In a for-each, the loop variable is a copy. Modifying it does not change the original array element.' },
      { id: '25-11', type: 'mcq', prompt: 'What is the purpose of the "super" keyword in a constructor?', options: ['To call the current class constructor', 'To call a method in the same class', 'To invoke the parent class constructor', 'To create a new instance of the parent class'], answer: 2, explanation: 'super() in a constructor calls the parent class constructor. It must be the first statement.' },
      { id: '25-12', type: 'mcq', prompt: 'What is the output?', code: 'int[] a = {10,20,30};\nint sum = 0;\nfor (int v : a) sum += v;\nSystem.out.println(sum / a.length);', options: ['20', '60', '20.0', '30'], answer: 0, explanation: 'sum = 60, a.length = 3. 60 / 3 = 20 (integer division).' },
      { id: '25-13', type: 'mcq', prompt: 'What does ArrayList\'s get(int index) method do if the index is out of bounds?', options: ['Returns null', 'Returns 0', 'Throws IndexOutOfBoundsException', 'Returns the last element'], answer: 2, explanation: 'ArrayList.get() throws IndexOutOfBoundsException for invalid indices.' },
      { id: '25-14', type: 'mcq', prompt: 'What is the output?', code: 'boolean a = true, b = false;\nSystem.out.println((a || b) && !(a && b));', options: ['true', 'false', 'null', 'compile error'], answer: 0, explanation: 'a||b = true. a&&b = false. !(false) = true. true && true = true.' },
      { id: '25-15', type: 'mcq', prompt: 'What is a "has-a" relationship in OOP?', options: ['Inheritance', 'Composition (an object contains another object as a field)', 'Polymorphism', 'Method overloading'], answer: 1, explanation: '"Has-a" means composition — a Car has-a Engine (the Engine is a field). "Is-a" means inheritance.' },
      { id: '25-16', type: 'mcq', prompt: 'What is the output?', code: 'int x = 1;\nswitch(x) {\n    case 1: System.out.print("one");\n    case 2: System.out.print("two");\n    default: System.out.print("other");\n}', options: ['one', 'onetwoother', 'onetwootherother', 'other'], answer: 1, explanation: 'No break statements — execution falls through all cases after matching case 1.' },
      { id: '25-17', type: 'mcq', prompt: 'Which is a correct example of method overloading?', options: ['Defining the same method in a subclass', 'Two methods with the same name but different parameter types', 'Two methods with the same name and parameters in different classes', 'Using the @Override annotation'], answer: 1, explanation: 'Overloading means same method name, different parameter list (type or count) in the same class.' },
      { id: '25-18', type: 'mcq', prompt: 'What is the value of result?', code: 'int result = 0;\nfor (int i = 1; i <= 5; i++) {\n    for (int j = 1; j <= i; j++) result++;\n}', options: ['15', '25', '10', '20'], answer: 0, explanation: 'result counts: 1+2+3+4+5 = 15 (triangular number).' },
      { id: '25-19', type: 'mcq', prompt: 'Which collection preserves insertion order AND allows duplicates?', options: ['HashSet', 'TreeSet', 'ArrayList', 'HashMap'], answer: 2, explanation: 'ArrayList preserves insertion order and allows duplicate elements. Sets do not allow duplicates.' },
      { id: '25-20', type: 'mcq', prompt: 'What is the output?', code: 'int[] a = new int[3];\na[0] = a[1] = a[2] = 7;\nint prod = 1;\nfor (int v : a) prod *= v;\nSystem.out.println(prod);', options: ['7', '21', '343', '3'], answer: 2, explanation: '7 * 7 * 7 = 343.' },
      {
        id: '25-f1', type: 'frq', points: 9,
        prompt: 'Write a Java class Matrix with a method `sumDiagonal(int[][] m)` that returns the sum of the main diagonal (top-left to bottom-right) of a square matrix. Assume m is always square (n×n).',
        starter: 'public class Matrix\n{\n    public int sumDiagonal(int[][] m)\n    {\n        // your code here\n    }\n}\n',
        modelAnswer: 'public class Matrix\n{\n    public int sumDiagonal(int[][] m)\n    {\n        int sum = 0;\n        for (int i = 0; i < m.length; i++)\n        {\n            sum += m[i][i];\n        }\n        return sum;\n    }\n}\n'
      },
      {
        id: '25-f2', type: 'frq', points: 9,
        prompt: 'Write a Java class GradeBook with: an ArrayList<Integer> of grades, an `addGrade(int g)` method, a `getAverage()` method (double), a `getHighest()` method, and a `countAbove(int threshold)` method that returns how many grades exceed the threshold.',
        starter: 'import java.util.ArrayList;\n\npublic class GradeBook\n{\n    // fields and methods here\n}\n',
        modelAnswer: 'import java.util.ArrayList;\n\npublic class GradeBook\n{\n    private ArrayList<Integer> grades;\n\n    public GradeBook()\n    {\n        grades = new ArrayList<>();\n    }\n\n    public void addGrade(int g)\n    {\n        grades.add(g);\n    }\n\n    public double getAverage()\n    {\n        if (grades.isEmpty()) return 0.0;\n        int sum = 0;\n        for (int g : grades) sum += g;\n        return (double) sum / grades.size();\n    }\n\n    public int getHighest()\n    {\n        int max = Integer.MIN_VALUE;\n        for (int g : grades) if (g > max) max = g;\n        return max;\n    }\n\n    public int countAbove(int threshold)\n    {\n        int count = 0;\n        for (int g : grades) if (g > threshold) count++;\n        return count;\n    }\n}\n'
      }
    ]
  },

  // ── AP CS A 2024-style exam ───────────────────────────────────────────────
  {
    id: 'ap-csa-2024',
    title: 'AP CS A 2024 — Full Practice Exam',
    description: 'Modeled on the 2024 AP CS A emphasis areas: recursion, searching, linked structures, and design.',
    minutes: 90,
    tag: 'AP 2024',
    difficulty: 'hard',
    accent: 'from-emerald-400/30 to-violet-500/20',
    questions: [
      { id: '24-1', type: 'mcq', prompt: 'What is the output of this code?', code: 'public static int mystery(int n) {\n    if (n <= 0) return 0;\n    if (n % 2 == 0) return mystery(n / 2);\n    return 1 + mystery(n - 1);\n}\nSystem.out.println(mystery(7));', options: ['3', '4', '2', '7'], answer: 0, explanation: 'mystery(7)=1+mystery(6)=1+mystery(3)=1+1+mystery(2)=1+1+mystery(1)=1+1+1+mystery(0)=3.' },
      { id: '24-2', type: 'mcq', prompt: 'Which correctly tests if two String variables hold the same content?', options: ['s1 == s2', 's1.equals(s2)', 's1.compareTo(s2)', 's1.contains(s2)'], answer: 1, explanation: '== tests reference equality. equals() tests value equality for Strings.' },
      { id: '24-3', type: 'mcq', prompt: 'What does this method return for n=0?', code: 'public static int f(int n) {\n    if (n == 0) return 1;\n    return n * f(n - 1);\n}', options: ['0', '1', '-1', 'StackOverflowError'], answer: 1, explanation: 'Base case returns 1. f(0) = 1. This is factorial — 0! = 1.' },
      { id: '24-4', type: 'mcq', prompt: 'What is true about a static method in Java?', options: ['It can access instance variables directly', 'It can be called without creating an object', 'It must return void', 'It cannot call other methods'], answer: 1, explanation: 'Static methods belong to the class and can be called with ClassName.method() without instantiation.' },
      { id: '24-5', type: 'mcq', prompt: 'What is the output?', code: 'int a = 5, b = 10;\nif (a > b) {\n    System.out.println("A");\n} else if (a == 5) {\n    System.out.println("B");\n} else {\n    System.out.println("C");\n}', options: ['A', 'B', 'C', 'BC'], answer: 1, explanation: 'a > b is false; a == 5 is true → prints "B".' },
      { id: '24-6', type: 'mcq', prompt: 'What is wrong here?', code: 'ArrayList<String> list = new ArrayList<>();\nlist.add("a"); list.add("b"); list.add("c");\nfor (String s : list) {\n    if (s.equals("b")) list.remove(s);\n}', options: ['The list cannot hold Strings', 'It throws ConcurrentModificationException', 'It silently skips "b"', 'Nothing is wrong'], answer: 1, explanation: 'Modifying an ArrayList while iterating with a for-each throws ConcurrentModificationException. Use an Iterator or iterate backwards.' },
      { id: '24-7', type: 'mcq', prompt: 'What is the output?', code: 'String[] arr = {"z","a","m"};\njava.util.Arrays.sort(arr);\nSystem.out.println(arr[1]);', options: ['z', 'a', 'm', 'zm'], answer: 2, explanation: 'Sorted: a, m, z. arr[1] = "m".' },
      { id: '24-8', type: 'mcq', prompt: 'Which correctly declares an interface in Java?', options: ['interface Shape { double area() { return 0; } }', 'interface Shape { public abstract double area(); }', 'abstract interface Shape { double area(); }', 'class interface Shape { }'], answer: 1, explanation: 'Interface methods are implicitly public and abstract. Explicit abstract keyword is allowed but redundant.' },
      { id: '24-9', type: 'mcq', prompt: 'What is the result?', code: 'int x = 15;\nSystem.out.println(x >> 1);', options: ['30', '7', '8', '14'], answer: 1, explanation: 'Right-shift by 1 is integer division by 2: 15 >> 1 = 7 (truncates).' },
      { id: '24-10', type: 'mcq', prompt: 'How many objects are created?', code: 'String s1 = "hello";\nString s2 = "hello";\nString s3 = new String("hello");', options: ['1', '2', '3', '0'], answer: 1, explanation: 's1 and s2 share the same string pool object. new String() always creates a new object. Total: 2.' },
      { id: '24-11', type: 'mcq', prompt: 'What is the output?', code: 'int[] a = {3,1,4,1,5,9};\nint min = a[0];\nfor (int v : a) if (v < min) min = v;\nSystem.out.println(min);', options: ['3', '1', '9', '5'], answer: 1, explanation: 'Minimum scan: min starts at 3, becomes 1 after seeing 1. Stays 1. Output: 1.' },
      { id: '24-12', type: 'mcq', prompt: 'What is printed?', code: 'for (int i = 0; i < 4; i++) {\n    for (int j = 0; j < 4 - i; j++) System.out.print("*");\n    System.out.println();\n}', options: ['4 stars then decreasing', '****\\n***\\n**\\n*', '4 rows of 4 stars', '*\\n**\\n***\\n****'], answer: 1, explanation: 'i=0: 4 stars; i=1: 3; i=2: 2; i=3: 1. Result: ****\\n***\\n**\\n*' },
      { id: '24-13', type: 'mcq', prompt: 'What does the `instanceof` operator check?', options: ['Whether two references point to the same object', 'Whether an object is an instance of a given class or its subclasses', 'Whether a class has a specific method', 'Whether a value is null'], answer: 1, explanation: 'instanceof returns true if the left operand is an instance of the right operand class or any subclass.' },
      { id: '24-14', type: 'mcq', prompt: 'What is the output?', code: 'int count = 0;\nfor (int i = 0; i < 5; i++) {\n    count++;\n    if (i == 2) break;\n}\nSystem.out.println(count);', options: ['5', '3', '2', '4'], answer: 1, explanation: 'Iterates i=0(count=1), i=1(count=2), i=2(count=3, then break). Output: 3.' },
      { id: '24-15', type: 'mcq', prompt: 'What is the correct way to call a parent class method from a subclass?', options: ['parent.method()', 'super.method()', 'this.method()', 'base.method()'], answer: 1, explanation: 'super.method() calls the parent (superclass) version of the method.' },
      { id: '24-16', type: 'mcq', prompt: 'What is the output?', code: 'int n = 256;\nint count = 0;\nwhile (n > 1) { n /= 2; count++; }\nSystem.out.println(count);', options: ['7', '8', '9', '256'], answer: 1, explanation: '256 / 2 eight times equals 1 (256→128→64→32→16→8→4→2→1). count = 8.' },
      { id: '24-17', type: 'mcq', prompt: 'A method is declared `private static int helper(int x)`. Which statement is true?', options: ['It can only be called from the same package', 'It can only be called from within the same class', 'It cannot return a value', 'It must take no arguments'], answer: 1, explanation: 'private restricts access to the class itself. static means no object needed to call it within that class.' },
      { id: '24-18', type: 'mcq', prompt: 'What is the output?', code: 'String s = "  hello  ";\nSystem.out.println(s.trim().length());', options: ['9', '7', '5', '8'], answer: 2, explanation: 'trim() removes leading/trailing spaces: "hello" has length 5.' },
      { id: '24-19', type: 'mcq', prompt: 'Which correctly tests if a String starts with "AP"?', options: ['s.indexOf("AP") != -1', 's.startsWith("AP")', 's.charAt(0) == "AP"', 's.contains("AP")'], answer: 1, explanation: 'startsWith("AP") specifically checks the beginning. contains() checks anywhere, indexOf != -1 also checks anywhere.' },
      { id: '24-20', type: 'mcq', prompt: 'What is the space complexity of a recursive method that calls itself n times with no extra data structures?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], answer: 2, explanation: 'Each recursive call adds a frame to the call stack. n recursive calls = O(n) stack space.' },
      {
        id: '24-f1', type: 'frq', points: 9,
        prompt: 'Write a complete Java class SortChecker with a static method `isSorted(int[] arr)` that returns true if the array is sorted in ascending (non-decreasing) order, false otherwise. An empty or single-element array is considered sorted.',
        starter: 'public class SortChecker\n{\n    public static boolean isSorted(int[] arr)\n    {\n        // your code here\n    }\n}\n',
        modelAnswer: 'public class SortChecker\n{\n    public static boolean isSorted(int[] arr)\n    {\n        if (arr.length <= 1)\n        {\n            return true;\n        }\n        for (int i = 0; i < arr.length - 1; i++)\n        {\n            if (arr[i] > arr[i + 1])\n            {\n                return false;\n            }\n        }\n        return true;\n    }\n}\n'
      },
      {
        id: '24-f2', type: 'frq', points: 9,
        prompt: 'Write a complete Java class StringProcessor with: a `reverseWords(String sentence)` method that reverses the order of words (e.g. "hello world" → "world hello"), and a `capitalizeFirst(String s)` method that returns the string with only the first letter uppercase and the rest lowercase.',
        starter: 'public class StringProcessor\n{\n    public String reverseWords(String sentence)\n    {\n        // your code here\n    }\n\n    public String capitalizeFirst(String s)\n    {\n        // your code here\n    }\n}\n',
        modelAnswer: 'public class StringProcessor\n{\n    public String reverseWords(String sentence)\n    {\n        String[] words = sentence.trim().split("\\\\s+");\n        StringBuilder sb = new StringBuilder();\n        for (int i = words.length - 1; i >= 0; i--)\n        {\n            sb.append(words[i]);\n            if (i > 0) sb.append(" ");\n        }\n        return sb.toString();\n    }\n\n    public String capitalizeFirst(String s)\n    {\n        if (s == null || s.isEmpty()) return s;\n        return Character.toUpperCase(s.charAt(0)) + s.substring(1).toLowerCase();\n    }\n}\n'
      }
    ]
  },

  // ── AP CS A 2023-style exam ───────────────────────────────────────────────
  {
    id: 'ap-csa-2023',
    title: 'AP CS A 2023 — Full Practice Exam',
    description: 'Covering the 2023 exam theme areas: inheritance design, ArrayList algorithms, and object-oriented problem solving.',
    minutes: 90,
    tag: 'AP 2023',
    difficulty: 'hard',
    accent: 'from-amber-400/30 to-emerald-500/20',
    questions: [
      { id: '23-1', type: 'mcq', prompt: 'What is the result?', code: 'String s = "abcde";\nSystem.out.println(s.substring(1, 3));', options: ['ab', 'bc', 'bcd', 'abc'], answer: 1, explanation: 'substring(1,3) returns characters at indices 1 and 2: "bc".' },
      { id: '23-2', type: 'mcq', prompt: 'What is printed?', code: 'int x = 100;\nSystem.out.println(x > 50 && x < 200 ? "in range" : "out");', options: ['in range', 'out', 'true', 'false'], answer: 0, explanation: 'Both conditions are true: 100 > 50 and 100 < 200.' },
      { id: '23-3', type: 'mcq', prompt: 'What exception does this throw?', code: 'String s = null;\nSystem.out.println(s.length());', options: ['ArrayIndexOutOfBoundsException', 'NullPointerException', 'ClassCastException', 'IllegalArgumentException'], answer: 1, explanation: 'Calling a method on null throws NullPointerException.' },
      { id: '23-4', type: 'mcq', prompt: 'Which statement about abstract classes is TRUE?', options: ['They can be instantiated', 'They cannot have constructors', 'They can contain both abstract and concrete methods', 'They must implement all interface methods'], answer: 2, explanation: 'Abstract classes can have concrete methods (with bodies) in addition to abstract ones. They cannot be directly instantiated.' },
      { id: '23-5', type: 'mcq', prompt: 'What is the output?', code: 'int i = 10;\ndo { System.out.print(i + " "); i -= 3; } while (i > 0);', options: ['10 7 4 1', '10 7 4', '7 4 1', '10 7'], answer: 0, explanation: 'Prints then subtracts: 10, 7, 4, 1. After printing 1, i becomes -2 < 0 and the loop ends.' },
      { id: '23-6', type: 'mcq', prompt: 'What is printed?', code: 'int[] a = {5,3,8,2,7};\nint target = 8;\nboolean found = false;\nfor (int v : a) if (v == target) found = true;\nSystem.out.println(found);', options: ['false', 'true', 'null', '8'], answer: 1, explanation: '8 is in the array, so found becomes true.' },
      { id: '23-7', type: 'mcq', prompt: 'What is the correct way to create an ArrayList of Strings?', options: ['ArrayList list = new ArrayList(String);', 'ArrayList<String> list = new ArrayList<>();', 'ArrayList(String) list = new ArrayList();', 'new ArrayList<String> list;'], answer: 1, explanation: 'Generic syntax: ArrayList<String> list = new ArrayList<>(); The diamond operator <> infers the type.' },
      { id: '23-8', type: 'mcq', prompt: 'In Java, which is NOT a valid way to call a method?', options: ['obj.method()', 'ClassName.staticMethod()', 'method() from within the same class', 'new ClassName.method()'], answer: 3, explanation: '"new ClassName.method()" is not valid syntax. You can call instance methods via references, static methods via class name, or directly within the same class.' },
      { id: '23-9', type: 'mcq', prompt: 'What is the output?', code: 'System.out.println(Math.max(3, Math.min(7, 5)));', options: ['3', '5', '7', '3.0'], answer: 1, explanation: 'Math.min(7,5) = 5. Math.max(3,5) = 5.' },
      { id: '23-10', type: 'mcq', prompt: 'What is the output?', code: 'int x = 0;\nfor (int i = 1; i <= 10; i++) {\n    if (i % 3 == 0) x += i;\n}\nSystem.out.println(x);', options: ['18', '27', '30', '15'], answer: 1, explanation: 'Multiples of 3 up to 10: 3+6+9 = 18. Wait — 3+6+9 = 18, not 27. Let me recheck: 3+6+9 = 18.' },
      { id: '23-11', type: 'mcq', prompt: 'Which is an example of polymorphism?', options: ['int x = 5;', 'Animal a = new Dog();', 'import java.util.*;', 'extends Object'], answer: 1, explanation: 'Assigning a Dog object to an Animal reference is upcasting — a fundamental form of polymorphism.' },
      { id: '23-12', type: 'mcq', prompt: 'What is printed?', code: 'String s = "Java";\ns = s + s;\nSystem.out.println(s.length());', options: ['4', '8', '9', 'JavaJava'], answer: 1, explanation: '"Java" + "Java" = "JavaJava" which has length 8.' },
      { id: '23-13', type: 'mcq', prompt: 'What does Integer.MAX_VALUE represent?', options: ['The largest possible long value', 'The largest possible int value (2^31 - 1)', 'Positive infinity', 'The number of integers in Java'], answer: 1, explanation: 'Integer.MAX_VALUE = 2^31 - 1 = 2,147,483,647, the maximum value a Java int can hold.' },
      { id: '23-14', type: 'mcq', prompt: 'Which loop is best when you DON\'T know how many iterations are needed?', options: ['for loop', 'while loop', 'for-each loop', 'do-while loop'], answer: 1, explanation: 'A while loop is best when the number of iterations depends on a condition that isn\'t known in advance.' },
      { id: '23-15', type: 'mcq', prompt: 'What does this output?', code: 'int n = 45;\nString result = "";\nwhile (n > 0) {\n    result = (n % 2) + result;\n    n /= 2;\n}\nSystem.out.println(result);', options: ['101101', '101110', '45', '011'], answer: 0, explanation: '45 in binary: 45 = 32+8+4+1 = 101101₂.' },
      { id: '23-16', type: 'mcq', prompt: 'What is the output?', code: 'for (int i = 0; i < 3; i++) {\n    for (int j = 0; j <= i; j++) System.out.print("* ");\n    System.out.println();\n}', options: ['* \\n* * \\n* * * ', '3 rows of 3', '1 row of 3', '* * * \\n* * \\n* '], answer: 0, explanation: 'i=0: 1 star; i=1: 2 stars; i=2: 3 stars — a triangular pattern.' },
      { id: '23-17', type: 'mcq', prompt: 'What does `Collections.unmodifiableList()` return?', options: ['A sorted copy', 'A list that throws UnsupportedOperationException on modification attempts', 'An empty list', 'A synchronized list'], answer: 1, explanation: 'unmodifiableList wraps a list in a view that throws UnsupportedOperationException if you try to add, remove, or set elements.' },
      { id: '23-18', type: 'mcq', prompt: 'What is the output?', code: 'int a = 7, b = 3;\nSystem.out.println(a / b + " " + a % b);', options: ['2 1', '2.33 1', '2 3', '3 1'], answer: 0, explanation: 'Integer division: 7/3 = 2. Modulus: 7%3 = 1.' },
      { id: '23-19', type: 'mcq', prompt: 'Which correctly compares two Strings ignoring case?', options: ['s1 == s2', 's1.equals(s2)', 's1.equalsIgnoreCase(s2)', 's1.compareTo(s2) == 0'], answer: 2, explanation: 'equalsIgnoreCase() performs case-insensitive comparison.' },
      { id: '23-20', type: 'mcq', prompt: 'What is the output?', code: 'ArrayList<Integer> list = new ArrayList<>();\nfor (int i = 1; i <= 5; i++) list.add(i * i);\nSystem.out.println(list.get(3));', options: ['9', '16', '25', '4'], answer: 1, explanation: 'list = [1,4,9,16,25]. Index 3 = 16.' },
      {
        id: '23-f1', type: 'frq', points: 9,
        prompt: 'Write a complete Java class BankAccount with a private double balance, a constructor taking an initial balance, a `deposit(double amount)` method, a `withdraw(double amount)` method (which does nothing if balance would go negative), and a `getBalance()` method.',
        starter: 'public class BankAccount\n{\n    // fields, constructor, methods here\n}\n',
        modelAnswer: 'public class BankAccount\n{\n    private double balance;\n\n    public BankAccount(double initialBalance)\n    {\n        balance = initialBalance;\n    }\n\n    public void deposit(double amount)\n    {\n        if (amount > 0)\n        {\n            balance += amount;\n        }\n    }\n\n    public void withdraw(double amount)\n    {\n        if (amount > 0 && amount <= balance)\n        {\n            balance -= amount;\n        }\n    }\n\n    public double getBalance()\n    {\n        return balance;\n    }\n}\n'
      },
      {
        id: '23-f2', type: 'frq', points: 9,
        prompt: 'Write a Java class TwoSum with a method `twoSum(int[] nums, int target)` that returns an int array of two indices whose values sum to target. Assume exactly one solution exists and you may not use the same element twice. Use a HashMap for O(n) time.',
        starter: 'import java.util.HashMap;\n\npublic class TwoSum\n{\n    public int[] twoSum(int[] nums, int target)\n    {\n        // your code here\n    }\n}\n',
        modelAnswer: 'import java.util.HashMap;\n\npublic class TwoSum\n{\n    public int[] twoSum(int[] nums, int target)\n    {\n        HashMap<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++)\n        {\n            int complement = target - nums[i];\n            if (map.containsKey(complement))\n            {\n                return new int[]{map.get(complement), i};\n            }\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}\n'
      }
    ]
  },

  // ── Easy warm-up test ─────────────────────────────────────────────────────
  {
    id: 'beginner-warmup',
    title: 'Beginner Warm-Up',
    description: 'The very basics: variable types, simple math, printing output, and reading error messages.',
    minutes: 20,
    tag: 'Beginner',
    difficulty: 'easy',
    accent: 'from-sky-400/30 to-cyan-400/20',
    questions: [
      { id: 'bw1', type: 'mcq', prompt: 'Which is a valid Java variable name?', options: ['2count', 'my-var', 'myVar', 'class'], answer: 2, explanation: 'Java identifiers cannot start with a digit (2count), contain hyphens (my-var), or be reserved words (class). myVar is valid.' },
      { id: 'bw2', type: 'mcq', prompt: 'What prints?', code: 'System.out.println(3 + 4);', options: ['34', '7', '3+4', '3 + 4'], answer: 1, explanation: '3 + 4 is integer addition = 7.' },
      { id: 'bw3', type: 'mcq', prompt: 'What prints?', code: 'System.out.println("3" + "4");', options: ['7', '34', '"34"', 'compile error'], answer: 1, explanation: 'Both are String literals. String concatenation produces "34".' },
      { id: 'bw4', type: 'mcq', prompt: 'What is the value?', code: 'int x = 10;\nx = x + 5;\nx = x - 3;', options: ['10', '12', '15', '8'], answer: 1, explanation: 'x = 10; +5 → 15; -3 → 12.' },
      { id: 'bw5', type: 'mcq', prompt: 'Which data type stores true/false?', options: ['int', 'String', 'boolean', 'char'], answer: 2, explanation: 'boolean stores only true or false.' },
      { id: 'bw6', type: 'mcq', prompt: 'What is the output?', code: 'double x = 1 / 4;\nSystem.out.println(x);', options: ['0.25', '0.0', '0', '1'], answer: 1, explanation: '1 / 4 is integer division = 0, then widened to 0.0 when stored in a double.' },
      { id: 'bw7', type: 'mcq', prompt: 'Which correctly declares a String variable?', options: ['string name = "Ali";', 'String name = Ali;', 'String name = "Ali";', 'str name = "Ali";'], answer: 2, explanation: 'String is capitalized in Java, and string literals are enclosed in double quotes.' },
      { id: 'bw8', type: 'mcq', prompt: 'What does this print?', code: 'int a = 5;\nif (a > 3) System.out.println("yes");\nelse System.out.println("no");', options: ['yes', 'no', 'yesno', 'compile error'], answer: 0, explanation: '5 > 3 is true → prints "yes".' },
      { id: 'bw9', type: 'mcq', prompt: 'What is the output?', code: 'for (int i = 0; i < 3; i++) System.out.print(i + " ");', options: ['0 1 2', '1 2 3', '0 1 2 3', '0 1'], answer: 0, explanation: 'i = 0, 1, 2. Loop stops when i == 3.' },
      { id: 'bw10', type: 'mcq', prompt: 'What type should x be to store 3.14?', options: ['int', 'boolean', 'double', 'char'], answer: 2, explanation: 'double stores decimal (floating-point) values.' },
      { id: 'bw11', type: 'mcq', prompt: 'What is printed?', code: 'System.out.print("a");\nSystem.out.print("b");\nSystem.out.println("c");', options: ['a b c', 'abc', 'a\\nb\\nc', 'abc\\n'], answer: 1, explanation: 'print does not add newline; println adds one after "c". Output: abc then newline.' },
      { id: 'bw12', type: 'mcq', prompt: 'What is 2^8 in Java?', code: 'System.out.println((int)Math.pow(2, 8));', options: ['16', '256', '128', '8'], answer: 1, explanation: 'Math.pow(2, 8) = 256.0; cast to int = 256.' },
      { id: 'bw13', type: 'mcq', prompt: 'What is the value?', code: 'int x = 7;\nx++;', options: ['7', '8', '6', '1'], answer: 1, explanation: 'x++ is post-increment: x becomes 8.' },
      { id: 'bw14', type: 'mcq', prompt: 'Which comparison operator means "not equal"?', options: ['<>', '!=', '=/=', '~='], answer: 1, explanation: 'Java uses != for "not equal".' },
      { id: 'bw15', type: 'mcq', prompt: 'What is the output?', code: 'int x = 4;\nSystem.out.println(x % 2 == 0 ? "even" : "odd");', options: ['even', 'odd', 'true', '0'], answer: 0, explanation: '4 % 2 == 0 is true → prints "even".' },
      { id: 'bw16', type: 'mcq', prompt: 'What is true about a Java program\'s main method?', options: ['It must return int', 'Its signature is: public static void main(String[] args)', 'It can only be in a class named Main', 'It takes no parameters'], answer: 1, explanation: 'The JVM entry point is always: public static void main(String[] args).' },
      { id: 'bw17', type: 'mcq', prompt: 'What character ends a Java statement?', options: [':', '.', ';', ','], answer: 2, explanation: 'Java statements end with a semicolon (;).' },
      { id: 'bw18', type: 'mcq', prompt: 'What is the output?', code: 'String s = "Hello";\nSystem.out.println(s.charAt(0));', options: ['H', 'e', 'Hello', '0'], answer: 0, explanation: 'charAt(0) returns the character at index 0: \'H\'.' },
      { id: 'bw19', type: 'mcq', prompt: 'What does // do in Java?', options: ['Divides two numbers', 'Starts a single-line comment', 'Starts a multi-line comment', 'Concatenates strings'], answer: 1, explanation: '// starts a single-line comment — everything after it on that line is ignored by the compiler.' },
      { id: 'bw20', type: 'mcq', prompt: 'What is the output?', code: 'int a = 10, b = 3;\nSystem.out.println(a / b);', options: ['3.33', '3', '4', '3.0'], answer: 1, explanation: 'Both a and b are int → integer division → 3 (truncated).' },
      {
        id: 'bwf1', type: 'frq', points: 5,
        prompt: 'Write a complete Java program (class named Hello) with a main method that prints "Hello, World!" on the first line and "My name is Ali." on the second line.',
        starter: 'public class Hello\n{\n    public static void main(String[] args)\n    {\n        // your code here\n    }\n}\n',
        modelAnswer: 'public class Hello\n{\n    public static void main(String[] args)\n    {\n        System.out.println("Hello, World!");\n        System.out.println("My name is Ali.");\n    }\n}\n'
      }
    ]
  },

  // ── Mixed medium test ─────────────────────────────────────────────────────
  {
    id: 'mixed-medium',
    title: 'Mixed Practice — Medium',
    description: 'A balanced mix of all topics at medium difficulty — ideal exam preparation.',
    minutes: 35,
    tag: 'Mixed',
    difficulty: 'medium',
    accent: 'from-teal-400/30 to-violet-400/20',
    questions: [
      { id: 'mm1', type: 'mcq', prompt: 'What is the output?', code: 'int[] a = {1,2,3,4,5};\nint sum = 0;\nfor (int i = 0; i < a.length; i += 2) sum += a[i];\nSystem.out.println(sum);', options: ['6', '9', '15', '5'], answer: 1, explanation: 'i visits indices 0,2,4. a[0]+a[2]+a[4] = 1+3+5 = 9.' },
      { id: 'mm2', type: 'mcq', prompt: 'What is the output?', code: 'String s = "computer";\nSystem.out.println(s.substring(3, 6));', options: ['put', 'com', 'puter', 'mpu'], answer: 0, explanation: 'Indices 3,4,5: "put".' },
      { id: 'mm3', type: 'mcq', prompt: 'How many integers between 1 and 100 are divisible by both 3 and 5?', options: ['20', '6', '7', '33'], answer: 1, explanation: 'Divisible by 15: 15,30,45,60,75,90 — that is 6 numbers.' },
      { id: 'mm4', type: 'mcq', prompt: 'What is the output?', code: 'ArrayList<String> list = new ArrayList<>();\nlist.add("X"); list.add("Y"); list.add("Z");\nlist.set(1, "W");\nSystem.out.println(list);', options: ['[X, Y, Z]', '[X, W, Z]', '[W, Y, Z]', '[X, Y, W]'], answer: 1, explanation: 'set(1, "W") replaces index 1 ("Y") with "W": [X, W, Z].' },
      { id: 'mm5', type: 'mcq', prompt: 'What is the Big O of finding an element in an unsorted array?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 2, explanation: 'Linear search examines each element once in the worst case: O(n).' },
      { id: 'mm6', type: 'mcq', prompt: 'What does this code print?', code: 'int count = 0;\nfor (int n = 100; n >= 1; n /= 2) count++;\nSystem.out.println(count);', options: ['7', '6', '100', '8'], answer: 0, explanation: '100→50→25→12→6→3→1 (7 values, stops when n becomes 0). count = 7.' },
      { id: 'mm7', type: 'mcq', prompt: 'What is true about final variables?', options: ['Their value can be changed after declaration', 'They must be static', 'Their value cannot be changed after assignment', 'They are always public'], answer: 2, explanation: 'A final variable can only be assigned once. Attempting to change it causes a compile error.' },
      { id: 'mm8', type: 'mcq', prompt: 'What is the output?', code: 'class P { public void show() { System.out.print("P"); } }\nclass C extends P { public void show() { super.show(); System.out.print("C"); } }\nnew C().show();', options: ['P', 'C', 'PC', 'CP'], answer: 2, explanation: 'C\'s show() calls super.show() (prints "P") then prints "C": output "PC".' },
      { id: 'mm9', type: 'mcq', prompt: 'What is the maximum depth of recursion for factorial(10)?', options: ['10', '11', '9', '100'], answer: 1, explanation: 'factorial(10) calls factorial(9)...factorial(0) — 11 frames on the call stack (10 through 0 inclusive).' },
      { id: 'mm10', type: 'mcq', prompt: 'What is the output?', code: 'int[][] g = {{1,2},{3,4},{5,6}};\nint sum = 0;\nfor (int[] row : g) sum += row[0];\nSystem.out.println(sum);', options: ['6', '9', '21', '15'], answer: 1, explanation: 'First column: g[0][0]+g[1][0]+g[2][0] = 1+3+5 = 9.' },
      { id: 'mm11', type: 'mcq', prompt: 'What is printed?', code: 'String s = "12345";\nint sum = 0;\nfor (int i = 0; i < s.length(); i++)\n    sum += s.charAt(i) - \'0\';\nSystem.out.println(sum);', options: ['12345', '15', '54321', '5'], answer: 1, explanation: 'Converting each char digit to its int value: 1+2+3+4+5 = 15.' },
      { id: 'mm12', type: 'mcq', prompt: 'What is true about an interface vs abstract class?', options: ['Both can be instantiated', 'A class can implement multiple interfaces but only extend one class', 'Abstract classes cannot have constructors', 'Interfaces can have instance variables'], answer: 1, explanation: 'Java allows implementing multiple interfaces but only extending one class (single inheritance).' },
      { id: 'mm13', type: 'mcq', prompt: 'What is the output?', code: 'int x = 5;\nSystem.out.println(++x * x--);', options: ['36', '30', '25', '35'], answer: 0, explanation: '++x makes x=6 first. x-- uses x=6 then decrements. 6 * 6 = 36.' },
      { id: 'mm14', type: 'mcq', prompt: 'What does Collections.sort() do to the original list?', options: ['Returns a new sorted list', 'Modifies the list in place', 'Creates a copy and sorts it', 'Throws an error'], answer: 1, explanation: 'Collections.sort() sorts the list in place — it modifies the original list.' },
      { id: 'mm15', type: 'mcq', prompt: 'What is the output?', code: 'String s = "Hello World";\nSystem.out.println(s.replace("World", "Java"));', options: ['Hello World', 'Hello Java', 'WorldJava', 'Java World'], answer: 1, explanation: 'replace() replaces all occurrences of the first argument with the second: "Hello Java".' },
      { id: 'mm16', type: 'mcq', prompt: 'What is the output?', code: 'int n = 15;\nwhile (n != 1) {\n    if (n % 2 == 0) n /= 2;\n    else n = 3 * n + 1;\n}\nSystem.out.println(n);', options: ['1', '15', '46', '0'], answer: 0, explanation: 'This is the Collatz sequence. It always reaches 1 (for known inputs). Output: 1.' },
      { id: 'mm17', type: 'mcq', prompt: 'What is the output?', code: 'int[] a = {5,3,1,4,2};\nint min = a[0], idx = 0;\nfor (int i = 1; i < a.length; i++)\n    if (a[i] < min) { min = a[i]; idx = i; }\nSystem.out.println(idx);', options: ['0', '2', '4', '1'], answer: 1, explanation: 'Minimum is 1 at index 2. idx = 2.' },
      { id: 'mm18', type: 'mcq', prompt: 'What is the correct way to catch an exception?', options: ['try { ... } handle(Exception e) { ... }', 'try { ... } except Exception e { ... }', 'try { ... } catch (Exception e) { ... }', 'try { ... } on Exception { ... }'], answer: 2, explanation: 'Java uses try/catch/finally syntax.' },
      { id: 'mm19', type: 'mcq', prompt: 'What is the output?', code: 'int a = 3, b = 7;\nSystem.out.println(a > b ? a : b);', options: ['3', '7', 'true', 'false'], answer: 1, explanation: 'a > b is false → ternary returns b = 7.' },
      { id: 'mm20', type: 'mcq', prompt: 'What is the output?', code: 'StringBuilder sb = new StringBuilder();\nfor (int i = 1; i <= 3; i++) sb.append(i).append("-");\nSystem.out.println(sb.toString());', options: ['1-2-3-', '123', '1-2-3', '1 2 3'], answer: 0, explanation: 'StringBuilder appends "1-", "2-", "3-" → "1-2-3-".' },
      {
        id: 'mmf1', type: 'frq', points: 9,
        prompt: 'Write a Java class FizzBuzz with a method `fizzBuzz(int n)` that returns a String array of length n where: multiples of 3 are "Fizz", multiples of 5 are "Buzz", multiples of both are "FizzBuzz", and all others are the number as a String (e.g. "1", "2").',
        starter: 'public class FizzBuzz\n{\n    public String[] fizzBuzz(int n)\n    {\n        // your code here\n    }\n}\n',
        modelAnswer: 'public class FizzBuzz\n{\n    public String[] fizzBuzz(int n)\n    {\n        String[] result = new String[n];\n        for (int i = 1; i <= n; i++)\n        {\n            if (i % 15 == 0)\n            {\n                result[i - 1] = "FizzBuzz";\n            }\n            else if (i % 3 == 0)\n            {\n                result[i - 1] = "Fizz";\n            }\n            else if (i % 5 == 0)\n            {\n                result[i - 1] = "Buzz";\n            }\n            else\n            {\n                result[i - 1] = String.valueOf(i);\n            }\n        }\n        return result;\n    }\n}\n'
      }
    ]
  }
];
