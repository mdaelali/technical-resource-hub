/*
 * Practice tests for the Mock Exams page.
 * Each test has 20-25 questions: a mix of MCQ (auto-graded) and FRQ (self-checked).
 *
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
  }
];
