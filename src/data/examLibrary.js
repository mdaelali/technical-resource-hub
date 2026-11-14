import { seedExams } from './exams.js';

// Original AP-style practice content, aligned to the current AP CSA scope.
const mcqAdditions = [
  { prompt: 'What is printed?', code: 'int x = 4;\nint y = x++;\nSystem.out.println(x + "," + y);', options: ['4,4', '5,4', '5,5', '4,5'], answer: 1, explanation: 'Post-increment assigns the old value to y, then increments x. The values are x = 5 and y = 4.' },
  { prompt: 'Which expression is equivalent to !(a && b)?', options: ['!a && !b', '!a || !b', 'a || b', 'a && !b'], answer: 1, explanation: 'By De Morgan’s law, negating a conjunction is equivalent to the disjunction of the negated operands.' },
  { prompt: 'What is the value of result?', code: 'int result = 0;\nfor (int i = 1; i < 8; i *= 2)\n{\n    result += i;\n}', options: ['7', '11', '15', '16'], answer: 0, explanation: 'The loop uses i values 1, 2, and 4, then i becomes 8 and the condition fails. The sum is 7.' },
  { prompt: 'What is printed?', code: 'String s = "computer";\nSystem.out.println(s.substring(2, 6));', options: ['mput', 'mpu', 'ompu', 'pute'], answer: 0, explanation: 'substring includes the starting index and excludes the ending index. Indices 2 through 5 form "mput".' },
  { prompt: 'What is printed?', code: 'int[][] values = {{2, 4, 6}, {1, 3}, {8}};\nint total = 0;\nfor (int[] row : values)\n{\n    total += row[row.length - 1];\n}\nSystem.out.println(total);', options: ['12', '14', '17', '18'], answer: 2, explanation: 'The last element of each row is 6, 3, and 8. Their sum is 17.' },
  { prompt: 'What is the final contents of nums?', code: 'ArrayList<Integer> nums = new ArrayList<Integer>();\nnums.add(2); nums.add(4); nums.add(6);\nnums.remove(1);\nnums.add(1, 9);', options: ['[2, 9, 6]', '[2, 4, 9, 6]', '[9, 2, 6]', '[2, 6, 9]'], answer: 0, explanation: 'remove(1) removes the element at index 1, producing [2, 6]. add(1, 9) inserts 9 at index 1.' },
  { prompt: 'What is printed?', code: 'int count = 0;\nfor (int r = 0; r < 3; r++)\n{\n    for (int c = r; c < 3; c++)\n    {\n        count++;\n    }\n}\nSystem.out.println(count);', options: ['3', '5', '6', '9'], answer: 2, explanation: 'The inner loop runs 3 times for r=0, 2 times for r=1, and once for r=2: 6 total.' },
  { prompt: 'What is printed?', code: 'int[] a = {3, 1, 4};\nint[] b = a;\nb[0] = b[2];\nSystem.out.println(a[0]);', options: ['3', '1', '4', '0'], answer: 2, explanation: 'Both variables refer to the same array object. Updating b[0] also changes a[0] to 4.' },
  { prompt: 'Which call removes the first matching Integer value 7 from a list?', code: 'ArrayList<Integer> values = new ArrayList<Integer>();', options: ['values.remove(7);', 'values.remove(Integer.valueOf(7));', 'values.delete(7);', 'values.remove("7");'], answer: 1, explanation: 'For an ArrayList<Integer>, remove(int) selects an index. Passing Integer.valueOf(7) selects the object-removal overload.' },
  { prompt: 'What is printed?', code: 'int x = 5;\nif (x > 3)\n{\n    if (x < 5) System.out.print("A");\n    else System.out.print("B");\n}\nelse System.out.print("C");', options: ['A', 'B', 'C', 'AB'], answer: 1, explanation: 'The outer condition is true. The inner condition x < 5 is false, so the inner else prints B.' },
  { prompt: 'What is printed?', code: 'String a = new String("AP");\nString b = new String("AP");\nSystem.out.println(a.equals(b) + " " + (a == b));', options: ['true true', 'true false', 'false true', 'false false'], answer: 1, explanation: 'equals compares String contents, which match. == compares object references, which are distinct.' },
  { prompt: 'What value is returned by count?', code: 'int count = 0;\nfor (int i = 0; i < 5; i++)\n{\n    for (int j = 0; j < 5; j++)\n    {\n        if (i + j == 4) count++;\n    }\n}', options: ['4', '5', '9', '25'], answer: 1, explanation: 'The matching pairs are (0,4), (1,3), (2,2), (3,1), and (4,0): five pairs.' },
  { prompt: 'What is printed?', code: 'int[][] grid = {{1, 2}, {3, 4}, {5, 6}};\nint sum = 0;\nfor (int r = 0; r < grid.length; r++)\n{\n    sum += grid[r][grid[r].length - 1];\n}\nSystem.out.println(sum);', options: ['9', '10', '12', '21'], answer: 2, explanation: 'The last value in each row is 2, 4, and 6. The sum is 12.' },
  { prompt: 'What is printed?', code: 'int n = 1;\nwhile (n < 20)\n{\n    n = n * 2 + 1;\n}\nSystem.out.println(n);', options: ['15', '20', '31', '63'], answer: 2, explanation: 'n progresses 1, 3, 7, 15, 31. At 31 the loop condition is false.' },
  { prompt: 'Which loop visits every valid row and column of a rectangular 2D array named data?', options: ['for (int r = 0; r < data[0].length; r++) for (int c = 0; c < data.length; c++)', 'for (int r = 0; r < data.length; r++) for (int c = 0; c < data[r].length; c++)', 'for (int r = 1; r <= data.length; r++) for (int c = 1; c <= data[r].length; c++)', 'for (int r = 0; r <= data.length; r++) for (int c = 0; c <= data[r].length; c++)'], answer: 1, explanation: 'The outer bound is the number of rows. Each row has its own valid column count; both loops use zero-based indices and strict upper bounds.' },
  { prompt: 'What is printed?', code: 'int[] a = {1, 2, 3, 4, 5};\nfor (int i = 0; i < a.length / 2; i++)\n{\n    int temp = a[i];\n    a[i] = a[a.length - 1 - i];\n    a[a.length - 1 - i] = temp;\n}\nSystem.out.println(a[1] + a[3]);', options: ['6', '7', '8', '10'], answer: 0, explanation: 'The array is reversed to {5,4,3,2,1}. a[1] + a[3] is 4 + 2 = 6.' },
  { prompt: 'What is printed?', code: 'ArrayList<String> names = new ArrayList<String>();\nnames.add("Mia"); names.add("Noah"); names.add("Mia");\nfor (int i = names.size() - 1; i >= 0; i--)\n{\n    if (names.get(i).equals("Mia")) names.remove(i);\n}\nSystem.out.println(names.size());', options: ['0', '1', '2', '3'], answer: 1, explanation: 'The backwards traversal removes both Mia entries safely, leaving only Noah. The size is 1.' },
  { prompt: 'Which statement about a Java constructor is correct?', options: ['It has the same name as its class and no return type.', 'It must return an instance of its class.', 'It is called only when a static method is invoked.', 'It must be declared private.'], answer: 0, explanation: 'A constructor has the class name and no return type, including no void.' },
  { prompt: 'What is printed?', code: 'int x = 2;\nint y = 3;\nSystem.out.println(x + y * 2);', options: ['10', '12', '8', '7'], answer: 2, explanation: 'Multiplication has precedence over addition: 2 + (3 * 2) = 8.' },
  { prompt: 'What is printed?', code: 'int total = 0;\nfor (int i = 1; i <= 4; i++)\n{\n    if (i % 2 == 0) total += i * 2;\n    else total += i;\n}\nSystem.out.println(total);', options: ['10', '12', '14', '16'], answer: 3, explanation: 'The additions are 1, 4, 3, and 8, for a total of 16.' },
  { prompt: 'What is printed?', code: 'int[] values = {2, 5, 8, 11};\nint result = 0;\nfor (int i = 1; i < values.length; i += 2)\n{\n    result += values[i] - values[i - 1];\n}\nSystem.out.println(result);', options: ['4', '6', '8', '10'], answer: 1, explanation: 'At i=1 the difference is 5-2=3; at i=3 it is 11-8=3. Total 6.' },
  { prompt: 'What is printed?', code: 'int x = 0;\nfor (int i = 0; i < 4; i++)\n{\n    if (i == 2) continue;\n    x += i;\n}\nSystem.out.println(x);', options: ['3', '4', '5', '6'], answer: 1, explanation: 'The continue skips i=2. The sum is 0 + 1 + 3 = 4.' },
  { prompt: 'What is printed?', code: 'String word = "stability";\nSystem.out.println(word.indexOf("bil") + word.substring(1, 4));', options: ['3tab', '4tab', '4ta', '5tabil'], answer: 0, explanation: 'indexOf("bil") is 3. substring(1,4) is "tab". String concatenation gives "3tab".' },
  { prompt: 'What is printed?', code: 'int[][] a = {{1, 2, 3}, {4, 5, 6}};\nint value = 0;\nfor (int r = 0; r < a.length; r++)\n{\n    value += a[r][a[0].length - 1 - r];\n}\nSystem.out.println(value);', options: ['7', '8', '9', '10'], answer: 1, explanation: 'For r=0, column 2 gives 3. For r=1, column 1 gives 5. Sum = 8.' },
  { prompt: 'Which implementation correctly counts the elements greater than limit in an ArrayList<Integer> values?', options: ['int n=0; for (int i=0; i<values.size(); i++) if (values.get(i)>limit) n++;', 'int n=0; for (int i=1; i<=values.size(); i++) if (values.get(i)>limit) n++;', 'int n=0; for (int x : values) if (x>limit) n=1;', 'int n=0; while (n<values.size()) if (values.get(n)>limit) n++;'], answer: 0, explanation: 'The indexed loop visits each valid index exactly once and increments the count for each qualifying element.' },
  { prompt: 'What is printed?', code: 'int a = 17;\nint b = 5;\nSystem.out.println(a / b * b + a % b);', options: ['15', '17', '20', '22'], answer: 1, explanation: 'Integer division gives 3; 3*5 + 2 = 17, consistent with quotient/remainder.' },
  { prompt: 'What is printed?', code: 'ArrayList<Integer> nums = new ArrayList<Integer>();\nnums.add(1); nums.add(2); nums.add(3); nums.add(4);\nfor (int i = 0; i < nums.size(); i++)\n{\n    if (nums.get(i) % 2 == 0) nums.remove(i);\n}\nSystem.out.println(nums);', options: ['[1, 3]', '[1, 3, 4]', '[1, 2, 3]', '[1, 3, 2]'], answer: 0, explanation: 'Removing 2 at index 1 shifts 3 to index 1; the loop increments to index 2 and removes 4. The final list is [1, 3].' },
  { prompt: 'What is printed?', code: 'int x = 10;\nint y = 0;\nwhile (x > 0)\n{\n    x -= 3;\n    y++;\n}\nSystem.out.println(x + ":" + y);', options: ['1:3', '-2:4', '-2:3', '0:4'], answer: 1, explanation: 'x takes 10, 7, 4, 1, then -2. The loop runs four times and ends with -2.' },
  { prompt: 'What does this method return for {2, 7, 3, 9, 4}?', code: 'public static int method(int[] a)\n{\n    int result = 0;\n    for (int i = 1; i < a.length; i++)\n    {\n        if (a[i] > a[i - 1]) result++;\n    }\n    return result;\n}', options: ['1', '2', '3', '4'], answer: 1, explanation: 'The comparisons are 7>2 true, 3>7 false, 9>3 true, 4>9 false. The method returns 2.' },
  { prompt: 'What is printed?', code: 'int[][] a = {{1, 2}, {3, 4}};\nint temp = a[0][1];\na[0][1] = a[1][0];\na[1][0] = temp;\nSystem.out.println(a[0][1] + a[1][0]);', options: ['5', '6', '7', '8'], answer: 0, explanation: 'The values 2 and 3 are swapped; their sum remains 5.' },
  { prompt: 'What is printed?', code: 'int x = 1;\nfor (int i = 0; i < 4; i++)\n{\n    x = x * 2 + i;\n}\nSystem.out.println(x);', options: ['22', '26', '27', '34'], answer: 2, explanation: 'x progresses: 2, 5, 12, and 27.' }
];

const reviewedAdditions = mcqAdditions.map((q, index) => ({
  ...q,
  id: `challenge-${index + 1}`,
  type: 'mcq'
}));

const additionalChallenges = [
  { prompt: 'What is printed?', code: 'int quotient = 23 / 5;\nint remainder = 23 % 5;\nSystem.out.println(quotient + remainder * 10);', options: ['34', '35', '43', '45'], answer: 0, explanation: 'Integer division gives 4 and the remainder is 3. The expression is 4 + 3 * 10 = 34.' },
  { prompt: 'How many times does the innermost statement execute?', code: 'int count = 0;\nfor (int row = 1; row <= 3; row++)\n{\n    for (int col = 0; col < row; col++) count++;\n}', options: ['3', '5', '6', '9'], answer: 2, explanation: 'The inner loop executes 1, then 2, then 3 times, for 6 total.' },
  { prompt: 'What is printed?', code: 'int[][] data = {{2, 5}, {1, 4, 7}, {3}};\nint sum = 0;\nfor (int[] row : data)\n{\n    if (row.length > 1) sum += row[1];\n}\nSystem.out.println(sum);', options: ['4', '8', '9', '16'], answer: 2, explanation: 'Rows with index 1 contribute 5 and 4. The final row has no index 1 and is skipped. Sum = 9.' },
  { prompt: 'What is printed?', code: 'int total = 0;\nfor (int i = 0; i < 6; i++)\n{\n    if (i % 2 == 0) total += i;\n    else total -= i;\n}\nSystem.out.println(total);', options: ['-3', '0', '3', '9'], answer: 0, explanation: 'The updates are +0, -1, +2, -3, +4, -5. Their total is -3.' },
  { prompt: 'What is printed?', code: 'String word = "algorithm";\nSystem.out.println(word.substring(1, 4) + word.length());', options: ['lgo9', 'alg9', 'lgo8', 'lg9'], answer: 0, explanation: 'substring(1, 4) is "lgo" and the string length is 9, producing "lgo9".' },
  { prompt: 'What is the final contents of values?', code: 'ArrayList<Integer> values = new ArrayList<Integer>();\nvalues.add(3); values.add(8); values.add(5); values.add(2);\nfor (int i = values.size() - 1; i >= 0; i--)\n{\n    if (values.get(i) % 2 == 0) values.remove(i);\n}', options: ['[3, 5]', '[8, 2]', '[3, 8, 5, 2]', '[3, 5, 2]'], answer: 0, explanation: 'Traversing backwards removes the even values 2 and 8; the remaining elements keep their order: [3, 5].' },
  { prompt: 'What is printed?', code: 'int x = 5;\nint y = 3;\nSystem.out.println(!(x < 4 || y == 2) && x < 8);', options: ['true', 'false', '5', 'compile error'], answer: 0, explanation: 'Both inner comparisons are false, so their OR is false. Its negation is true, and x < 8 is also true.' },
  { prompt: 'How many times does the loop execute?', code: 'int n = 81;\nint count = 0;\nwhile (n > 2)\n{\n    n /= 3;\n    count++;\n}', options: ['3', '4', '5', '6'], answer: 1, explanation: 'n takes 81, 27, 9, 3, then 1. The loop executes four times.' },
  { prompt: 'What is printed?', code: 'int[] first = {4, 1, 7};\nint[] second = first;\nsecond[1] = 9;\nSystem.out.println(first[1] + second[1]);', options: ['10', '18', '9', '2'], answer: 1, explanation: 'Both variables refer to the same array, so both expressions read 9. Their sum is 18.' },
  { prompt: 'What is printed?', code: 'int[] values = {6, 2, 8, 3};\nint temp = values[0];\nvalues[0] = values[values.length - 1];\nvalues[values.length - 1] = temp;\nSystem.out.println(values[0] + values[3]);', options: ['6', '8', '9', '12'], answer: 2, explanation: 'The first and last values are swapped, so values[0] + values[3] is 3 + 6 = 9.' },
  { prompt: 'What is printed?', code: 'int total = 0;\nfor (int i = 1; i <= 5; i++)\n{\n    total += i % 3;\n}\nSystem.out.println(total);', options: ['3', '5', '6', '7'], answer: 2, explanation: 'The remainders are 1, 2, 0, 1, and 2. Their sum is 6.' },
  { prompt: 'What is printed?', code: 'ArrayList<String> names = new ArrayList<String>();\nnames.add("Ada"); names.add("Lin");\nnames.add(1, "Grace");\nnames.set(0, "Katherine");\nSystem.out.println(names);', options: ['[Ada, Grace, Lin]', '[Katherine, Grace, Lin]', '[Katherine, Lin, Grace]', '[Grace, Katherine, Lin]'], answer: 1, explanation: 'Insertion at index 1 produces [Ada, Grace, Lin]. set replaces index 0, producing [Katherine, Grace, Lin].' },
  { prompt: 'How many values are added to sum?', code: 'int[][] grid = {{1, 2, 3}, {4, 5, 6}};\nint sum = 0;\nfor (int r = 0; r < grid.length; r++)\n{\n    for (int c = 0; c < grid[r].length; c++)\n    {\n        if (r != c) sum += grid[r][c];\n    }\n}', options: ['2', '3', '4', '5'], answer: 3, explanation: 'Only cells (0,0) and (1,1) are excluded. Four of the six values are added.' },
  { prompt: 'What does maximum return for {5, 12, 4, 9}?', code: 'public static int maximum(int[] values)\n{\n    int max = values[0];\n    for (int i = 1; i < values.length; i++)\n    {\n        if (values[i] > max) max = values[i];\n    }\n    return max;\n}', options: ['4', '5', '9', '12'], answer: 3, explanation: 'The method updates max when it finds 12; no later value is larger.' },
  { prompt: 'Which expression safely checks that text is nonempty and starts with "A" when text may be null?', options: ['text.length() > 0 && text.charAt(0) == \'A\'', 'text != null && text.length() > 0 && text.charAt(0) == \'A\'', 'text.charAt(0) == \'A\' && text != null', 'text != null & text.charAt(0) == \'A\''], answer: 1, explanation: 'The left-to-right short-circuit behavior of && ensures later operations run only after text is nonnull and nonempty.' },
  { prompt: 'How many digit characters are in the output count?', code: 'String code = "CSA-2026-A";\nint count = 0;\nfor (int i = 0; i < code.length(); i++)\n{\n    if (code.charAt(i) >= \'0\' && code.charAt(i) <= \'9\') count++;\n}\nSystem.out.println(count);', options: ['2', '3', '4', '6'], answer: 2, explanation: 'The digits in 2026 are 2, 0, 2, and 6, so the count is 4.' },
  { prompt: 'What is printed?', code: 'int[][] data = {{2, 4, 6}, {1, 3, 5}};\nint sum = 0;\nfor (int c = 0; c < data[0].length; c++)\n{\n    sum += data[0][c] - data[1][c];\n}\nSystem.out.println(sum);', options: ['0', '1', '3', '6'], answer: 2, explanation: 'The column differences are 1, 1, and 1. Their sum is 3.' },
  { prompt: 'What is printed?', code: 'int value = 4;\nif (value % 2 == 0)\n{\n    if (value % 3 == 0) value++;\n    else value += 2;\n}\nSystem.out.println(value);', options: ['4', '5', '6', '7'], answer: 2, explanation: 'The outer condition is true. Since 4 is not divisible by 3, 2 is added and value becomes 6.' },
  { prompt: 'What is printed?', code: 'int x = 1;\nfor (int i = 1; i <= 4; i++)\n{\n    x += i;\n    if (x > 5) break;\n}\nSystem.out.println(x);', options: ['6', '7', '8', '11'], answer: 1, explanation: 'x progresses to 2, 4, then 7. The condition x > 5 is true after adding 3, so the loop stops at 7.' },
  { prompt: 'What is printed?', code: 'String text = "banana";\nSystem.out.println(text.indexOf("na") + text.lastIndexOf("na"));', options: ['5', '6', '7', '8'], answer: 1, explanation: 'indexOf("na") is 2 and lastIndexOf("na") is 4. The sum is 6.' },
  { prompt: 'What is printed?', code: 'int[] data = {3, 7, 2, 8};\nint count = 0;\nfor (int i = 0; i < data.length; i++)\n{\n    if (data[i] > i + 3) count++;\n}\nSystem.out.println(count);', options: ['1', '2', '3', '4'], answer: 1, explanation: 'Comparisons are 3>3 false, 7>4 true, 2>5 false, and 8>6 true. Count = 2.' },
  { prompt: 'What is printed?', code: 'int[][] grid = {{1, 2}, {3, 4}, {5, 6}};\nint sum = 0;\nfor (int r = 0; r < grid.length; r++)\n{\n    sum += grid[r][r % 2];\n}\nSystem.out.println(sum);', options: ['8', '9', '10', '12'], answer: 2, explanation: 'The selected values are grid[0][0]=1, grid[1][1]=4, and grid[2][0]=5. Sum = 10.' },
  { prompt: 'What is printed?', code: 'int n = 0;\nfor (int i = 0; i < 4; i++)\n{\n    n = n * 10 + (i + 1);\n}\nSystem.out.println(n / 10);', options: ['12', '123', '1234', '234'], answer: 1, explanation: 'n becomes 1, 12, 123, then 1234. Integer division by 10 prints 123.' },
  { prompt: 'What is printed?', code: 'ArrayList<Integer> values = new ArrayList<Integer>();\nvalues.add(4); values.add(7); values.add(2);\nint total = 0;\nfor (int i = values.size() - 1; i >= 0; i--)\n{\n    total += values.get(i) - i;\n}\nSystem.out.println(total);', options: ['7', '9', '10', '13'], answer: 2, explanation: 'The calculation is (2-2) + (7-1) + (4-0) = 0 + 6 + 4 = 10.' },
  { prompt: 'Which statement about a private instance variable is correct?', options: ['It can be accessed directly by any class in the same package.', 'It can be accessed directly only within its declaring class.', 'It must be static.', 'It cannot be initialized by a constructor.'], answer: 1, explanation: 'The private access modifier limits direct access to code in the declaring class; other classes use public methods when provided.' },
  { prompt: 'What is printed?', code: 'String a = "computer";\nString b = a.substring(0, 3);\na = a.substring(3);\nSystem.out.println(b + a);', options: ['computer', 'comp uter', 'comuter', 'com'], answer: 0, explanation: 'b is "com" and a becomes "puter". Concatenating them restores "computer".' },
  { prompt: 'What is printed?', code: 'int count = 0;\nfor (int i = 1; i <= 4; i++)\n{\n    for (int j = 1; j <= i; j++)\n    {\n        if ((i + j) % 2 == 0) count++;\n    }\n}\nSystem.out.println(count);', options: ['4', '5', '6', '7'], answer: 2, explanation: 'For i=1 there is 1 matching j; for i=2, 1; i=3, 2; i=4, 2. Total = 6.' }
].map((q, index) => ({ ...q, id: `deep-challenge-${index + 1}`, type: 'mcq' }));

const AP_OUT_OF_SCOPE = /\b(inheritance|inheritance hierarchy|polymorphism|polymorphic|interface|abstract class|binary\s+search|merge sort|bubble sort|quick\s?sort|heap|graph|linked list|hashmap|hash map|dynamic programming|Big\s?O|do-while|ternary operator|float|char)\b|\b(stack|queue)\s+(data structure|uses|is a|follows)/i;

function isInApScope(question)
{
  const content = [question.prompt, question.code, question.explanation, ...(question.options || [])]
    .filter(Boolean)
    .join(' ');
  return !AP_OUT_OF_SCOPE.test(content) && !/\b(?:O\s*\(\s*(?:log|n\s*log|2\^n)|T\s*\(\s*n\s*\))\b/i.test(content)
    && !/\bdo\s*\{/i.test(question.code || '')
    && !(/\?[^?\n]+:\s*[^\n;]+/.test(question.code || '') && !/\?\s*:/.test(question.code || ''));
}

function uniqueQuestions(questions)
{
  const seen = new Set();
  return questions.filter((question) =>
  {
    if (question.type !== 'mcq' || !isInApScope(question)) return false;
    const key = `${question.prompt}|${question.code || ''}|${(question.options || []).join('|')}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const seedQuestions = (difficulty, type) => seedExams
  .filter((exam) => exam.difficulty === difficulty && exam.id !== 'algorithms-advanced')
  .flatMap((exam) => exam.questions.filter((question) => question.type === type));

const mcqPools = {
  easy: uniqueQuestions(seedQuestions('easy', 'mcq')),
  medium: uniqueQuestions([...seedQuestions('medium', 'mcq'), ...reviewedAdditions]),
  hard: uniqueQuestions([...seedQuestions('hard', 'mcq'), ...additionalChallenges])
};

const apFrqs = [
  {
    id: 'frq-methods-window', type: 'frq', points: 7,
    prompt: 'A sensor records nonnegative readings in an int array. Implement `countInRange`, which returns the number of values from `start` (inclusive) through `end` (exclusive) that are between `low` and `high`, inclusive. Assume 0 <= start <= end <= readings.length and low <= high. Your solution must not modify the array.',
    starter: 'public class ReadingLog\n{\n    public int countInRange(int[] readings, int start, int end, int low, int high)\n    {\n        // your code here\n    }\n}\n',
    modelAnswer: 'public class ReadingLog\n{\n    public int countInRange(int[] readings, int start, int end, int low, int high)\n    {\n        int count = 0;\n        for (int i = start; i < end; i++)\n        {\n            if (readings[i] >= low && readings[i] <= high)\n            {\n                count++;\n            }\n        }\n        return count;\n    }\n}\n'
  },
  {
    id: 'frq-methods-run', type: 'frq', points: 7,
    prompt: 'Implement `longestRun`, which returns the length of the longest contiguous run of equal values in an int array. The array contains at least one element. For `{4, 4, 2, 2, 2, 8}`, the method returns 3.',
    starter: 'public class RunAnalyzer\n{\n    public int longestRun(int[] values)\n    {\n        // your code here\n    }\n}\n',
    modelAnswer: 'public class RunAnalyzer\n{\n    public int longestRun(int[] values)\n    {\n        int longest = 1;\n        int current = 1;\n        for (int i = 1; i < values.length; i++)\n        {\n            if (values[i] == values[i - 1])\n            {\n                current++;\n            }\n            else\n            {\n                current = 1;\n            }\n            if (current > longest) longest = current;\n        }\n        return longest;\n    }\n}\n'
  },
  {
    id: 'frq-class-reading', type: 'frq', points: 7,
    prompt: 'Write a `Reading` class with private `title` and `minutes` fields. Its constructor initializes both. Implement `addMinutes(int amount)`, which changes the stored minutes only when amount is positive, and `getTitle()`. Do not add other public mutators.',
    starter: 'public class Reading\n{\n    // fields, constructor, and methods\n}\n',
    modelAnswer: 'public class Reading\n{\n    private String title;\n    private int minutes;\n\n    public Reading(String title, int minutes)\n    {\n        this.title = title;\n        this.minutes = minutes;\n    }\n\n    public void addMinutes(int amount)\n    {\n        if (amount > 0) minutes += amount;\n    }\n\n    public String getTitle()\n    {\n        return title;\n    }\n}\n'
  },
  {
    id: 'frq-class-inventory', type: 'frq', points: 7,
    prompt: 'Design a `Book` class with a title, a positive page count, and a current page initially set to 0. The constructor receives the title and page count. `turnPages(int amount)` advances the current page by amount but never past the final page; nonpositive amounts do nothing. Include `getCurrentPage()`.',
    starter: 'public class Book\n{\n    // fields, constructor, and methods\n}\n',
    modelAnswer: 'public class Book\n{\n    private String title;\n    private int pages;\n    private int currentPage;\n\n    public Book(String title, int pages)\n    {\n        this.title = title;\n        this.pages = pages;\n        currentPage = 0;\n    }\n\n    public void turnPages(int amount)\n    {\n        if (amount > 0) currentPage = Math.min(pages, currentPage + amount);\n    }\n\n    public int getCurrentPage()\n    {\n        return currentPage;\n    }\n}\n'
  },
  {
    id: 'frq-list-clean', type: 'frq', points: 7,
    prompt: 'Implement `removeBelow`, which removes every Integer less than `threshold` from an ArrayList and returns the number removed. Preserve the order of all remaining elements. Do not skip elements after a removal.',
    starter: 'import java.util.ArrayList;\n\npublic class ScoreTools\n{\n    public int removeBelow(ArrayList<Integer> scores, int threshold)\n    {\n        // your code here\n    }\n}\n',
    modelAnswer: 'import java.util.ArrayList;\n\npublic class ScoreTools\n{\n    public int removeBelow(ArrayList<Integer> scores, int threshold)\n    {\n        int removed = 0;\n        for (int i = scores.size() - 1; i >= 0; i--)\n        {\n            if (scores.get(i) < threshold)\n            {\n                scores.remove(i);\n                removed++;\n            }\n        }\n        return removed;\n    }\n}\n'
  },
  {
    id: 'frq-list-streak', type: 'frq', points: 7,
    prompt: 'Implement `longestIncreasingStreak` for an ArrayList<Integer>. Return the length of its longest contiguous strictly increasing subsequence. Return 0 for an empty list. For `[2, 4, 4, 5, 8]`, return 3.',
    starter: 'import java.util.ArrayList;\n\npublic class TrendAnalyzer\n{\n    public int longestIncreasingStreak(ArrayList<Integer> values)\n    {\n        // your code here\n    }\n}\n',
    modelAnswer: 'import java.util.ArrayList;\n\npublic class TrendAnalyzer\n{\n    public int longestIncreasingStreak(ArrayList<Integer> values)\n    {\n        if (values.size() == 0) return 0;\n        int longest = 1;\n        int current = 1;\n        for (int i = 1; i < values.size(); i++)\n        {\n            if (values.get(i) > values.get(i - 1)) current++;\n            else current = 1;\n            if (current > longest) longest = current;\n        }\n        return longest;\n    }\n}\n'
  },
  {
    id: 'frq-grid-neighbors', type: 'frq', points: 7,
    prompt: 'Implement `countNeighbors`, which returns how many values in a 2D int array are strictly greater than the value immediately to their left. The first column has no left neighbor and is not counted. Assume the array has at least one row and each row has at least one column.',
    starter: 'public class GridAnalysis\n{\n    public int countNeighbors(int[][] data)\n    {\n        // your code here\n    }\n}\n',
    modelAnswer: 'public class GridAnalysis\n{\n    public int countNeighbors(int[][] data)\n    {\n        int count = 0;\n        for (int r = 0; r < data.length; r++)\n        {\n            for (int c = 1; c < data[r].length; c++)\n            {\n                if (data[r][c] > data[r][c - 1]) count++;\n            }\n        }\n        return count;\n    }\n}\n'
  },
  {
    id: 'frq-grid-column', type: 'frq', points: 7,
    prompt: 'Implement `columnSum`, which returns the sum of the values in column `col` of a rectangular 2D int array. Assume col is a valid column index for every row.',
    starter: 'public class GridAnalysis\n{\n    public int columnSum(int[][] data, int col)\n    {\n        // your code here\n    }\n}\n',
    modelAnswer: 'public class GridAnalysis\n{\n    public int columnSum(int[][] data, int col)\n    {\n        int sum = 0;\n        for (int r = 0; r < data.length; r++)\n        {\n            sum += data[r][col];\n        }\n        return sum;\n    }\n}\n'
  },
  {
    id: 'frq-string-format', type: 'frq', points: 7,
    prompt: 'Implement `everyOther`, which returns a new String containing the characters at indices 0, 2, 4, and so on from the input. Do not modify the input. An empty input returns an empty String.',
    starter: 'public class StringTools\n{\n    public String everyOther(String text)\n    {\n        // your code here\n    }\n}\n',
    modelAnswer: 'public class StringTools\n{\n    public String everyOther(String text)\n    {\n        String result = "";\n        for (int i = 0; i < text.length(); i += 2)\n        {\n            result += text.substring(i, i + 1);\n        }\n        return result;\n    }\n}\n'
  }
].map((q) => ({
  ...q,
  rubric: ({
    'frq-methods-window': [
      { criterion: 'Uses the requested method signature and traverses only start through end - 1.', points: 2 },
      { criterion: 'Counts values inclusively between low and high.', points: 3 },
      { criterion: 'Returns the count and leaves the input array unchanged.', points: 2 }
    ],
    'frq-methods-run': [
      { criterion: 'Initializes the current and longest run correctly.', points: 2 },
      { criterion: 'Compares adjacent values and resets the run when values differ.', points: 3 },
      { criterion: 'Tracks and returns the maximum run length.', points: 2 }
    ],
    'frq-class-reading': [
      { criterion: 'Declares the required private fields and initializes them in the constructor.', points: 3 },
      { criterion: 'Adds minutes only when the amount is positive.', points: 2 },
      { criterion: 'Implements the requested title getter.', points: 2 }
    ],
    'frq-class-inventory': [
      { criterion: 'Declares the required fields and initializes currentPage to zero.', points: 2 },
      { criterion: 'Advances only for positive amounts and caps the page at the final page.', points: 4 },
      { criterion: 'Returns the current page.', points: 1 }
    ],
    'frq-list-clean': [
      { criterion: 'Uses a traversal that does not skip elements after removal.', points: 2 },
      { criterion: 'Removes exactly the values below threshold.', points: 3 },
      { criterion: 'Returns the number removed and preserves remaining order.', points: 2 }
    ],
    'frq-list-streak': [
      { criterion: 'Returns zero for an empty list and initializes a nonempty list correctly.', points: 2 },
      { criterion: 'Counts strictly increasing adjacent values and resets at a break or tie.', points: 3 },
      { criterion: 'Tracks and returns the longest streak.', points: 2 }
    ],
    'frq-grid-neighbors': [
      { criterion: 'Traverses every row and begins columns at index 1.', points: 2 },
      { criterion: 'Compares each value with its immediate left neighbor.', points: 3 },
      { criterion: 'Returns the correct count.', points: 2 }
    ],
    'frq-grid-column': [
      { criterion: 'Initializes an accumulator and traverses each row.', points: 2 },
      { criterion: 'Adds the requested column value from every row.', points: 3 },
      { criterion: 'Returns the sum.', points: 2 }
    ],
    'frq-string-format': [
      { criterion: 'Creates and returns a new result without changing the input.', points: 2 },
      { criterion: 'Visits indices 0, 2, 4, and so on without exceeding the string.', points: 3 },
      { criterion: 'Handles an empty string and returns the expected characters.', points: 2 }
    ]
  })[q.id] || ['Correct method or class signature.', 'Correct algorithm and control flow.', 'Correct result and specified edge cases.']
}));

const easyFrqs = [
  {
    id: 'frq-easy-method-count', area: 'methods', type: 'frq', points: 5,
    prompt: 'Implement `countPassing`, which returns how many scores in an int array are at least 60. The array may be empty and must not be changed.',
    starter: 'public class ScoreTools\n{\n    public int countPassing(int[] scores)\n    {\n        // your code here\n    }\n}\n',
    modelAnswer: 'public class ScoreTools\n{\n    public int countPassing(int[] scores)\n    {\n        int count = 0;\n        for (int score : scores)\n        {\n            if (score >= 60) count++;\n        }\n        return count;\n    }\n}\n'
  },
  {
    id: 'frq-easy-class-counter', area: 'class', type: 'frq', points: 5,
    prompt: 'Write a `StudyTimer` class with a private `minutes` field initialized to 0. Add `record(int amount)`, which adds only positive amounts, and `getMinutes()`.',
    starter: 'public class StudyTimer\n{\n    // fields, constructor, and methods\n}\n',
    modelAnswer: 'public class StudyTimer\n{\n    private int minutes;\n\n    public StudyTimer()\n    {\n        minutes = 0;\n    }\n\n    public void record(int amount)\n    {\n        if (amount > 0) minutes += amount;\n    }\n\n    public int getMinutes()\n    {\n        return minutes;\n    }\n}\n'
  },
  {
    id: 'frq-easy-list-total', area: 'list', type: 'frq', points: 5,
    prompt: 'Implement `sumValues`, which returns the sum of all Integers in an ArrayList<Integer>. An empty list should return 0, and the list must not be changed.',
    starter: 'import java.util.ArrayList;\n\npublic class ListTools\n{\n    public int sumValues(ArrayList<Integer> values)\n    {\n        // your code here\n    }\n}\n',
    modelAnswer: 'import java.util.ArrayList;\n\npublic class ListTools\n{\n    public int sumValues(ArrayList<Integer> values)\n    {\n        int sum = 0;\n        for (int value : values) sum += value;\n        return sum;\n    }\n}\n'
  },
  {
    id: 'frq-easy-grid-row', area: 'grid', type: 'frq', points: 5,
    prompt: 'Implement `rowSum`, which returns the sum of the values in the specified row of a nonempty rectangular 2D int array. Assume the row index is valid.',
    starter: 'public class GridTools\n{\n    public int rowSum(int[][] grid, int row)\n    {\n        // your code here\n    }\n}\n',
    modelAnswer: 'public class GridTools\n{\n    public int rowSum(int[][] grid, int row)\n    {\n        int sum = 0;\n        for (int col = 0; col < grid[row].length; col++)\n        {\n            sum += grid[row][col];\n        }\n        return sum;\n    }\n}\n'
  }
];

const easyFrqRubrics = {
  'frq-easy-method-count': [
    { criterion: 'Uses a count initialized to zero and traverses every score once.', points: 2 },
    { criterion: 'Counts only scores greater than or equal to 60.', points: 2 },
    { criterion: 'Returns the count without modifying the input.', points: 1 }
  ],
  'frq-easy-class-counter': [
    { criterion: 'Declares a private minutes field and initializes it to zero.', points: 2 },
    { criterion: 'Adds amount only when it is positive.', points: 2 },
    { criterion: 'Returns minutes from the getter.', points: 1 }
  ],
  'frq-easy-list-total': [
    { criterion: 'Initializes the sum to zero and traverses each list element.', points: 2 },
    { criterion: 'Adds each unboxed Integer value exactly once.', points: 2 },
    { criterion: 'Returns the sum without changing the list.', points: 1 }
  ],
  'frq-easy-grid-row': [
    { criterion: 'Initializes an accumulator and uses the requested row.', points: 2 },
    { criterion: 'Traverses every valid column and adds each value.', points: 2 },
    { criterion: 'Returns the row sum.', points: 1 }
  ]
};
const easyFrqsWithRubrics = easyFrqs.map((question) => ({
  ...question,
  rubric: easyFrqRubrics[question.id]
}));

const difficultyPools = {
  easy: [...mcqPools.easy],
  medium: [...mcqPools.medium],
  hard: [...mcqPools.hard]
};
const frqPools = {
  easy: easyFrqsWithRubrics,
  medium: apFrqs.filter((q) => ['frq-methods-window', 'frq-class-reading', 'frq-list-streak', 'frq-string-format'].includes(q.id)),
  hard: apFrqs.filter((q) => ['frq-methods-run', 'frq-class-inventory', 'frq-list-clean', 'frq-grid-neighbors', 'frq-grid-column'].includes(q.id))
};

const frqByArea = {
  methods: [...easyFrqsWithRubrics.filter((q) => q.area === 'methods'), ...apFrqs.filter((q) => ['frq-methods-window', 'frq-methods-run', 'frq-string-format'].includes(q.id))],
  class: [...easyFrqsWithRubrics.filter((q) => q.area === 'class'), ...apFrqs.filter((q) => ['frq-class-reading', 'frq-class-inventory'].includes(q.id))],
  list: [...easyFrqsWithRubrics.filter((q) => q.area === 'list'), ...apFrqs.filter((q) => ['frq-list-clean', 'frq-list-streak'].includes(q.id))],
  grid: [...easyFrqsWithRubrics.filter((q) => q.area === 'grid'), ...apFrqs.filter((q) => ['frq-grid-neighbors', 'frq-grid-column'].includes(q.id))]
};

function take(pool, start, count, formPrefix)
{
  if (!pool?.length || count > pool.length)
  {
    throw new Error(`Question pool ${formPrefix} has ${pool?.length || 0} items; ${count} are required.`);
  }
  return Array.from({ length: count }, (_, index) =>
  {
    const source = pool[(start + index) % pool.length];
    return { ...source, id: `${formPrefix}-${index + 1}` };
  });
}

function fullExamFrqs(index)
{
  return ['methods', 'class', 'list', 'grid'].map((area, areaIndex) =>
  {
    const pool = frqByArea[area].filter((question) => !question.id.startsWith('frq-easy-'));
    return { ...pool[(index + areaIndex) % pool.length], id: `full-${index + 1}-frq-${areaIndex + 1}` };
  });
}

function makeExam({ id, title, description, tag, format, minutes, difficulty, mcqStart = 0, mcqCount = 0, frqStart = 0, frqCount = 0, balancedFrq = false })
{
  const questions = [
    ...take(difficultyPools[difficulty], mcqStart, mcqCount, `${id}-mcq`),
    ...(balancedFrq
      ? fullExamFrqs(frqStart)
      : take(frqPools[difficulty], frqStart, frqCount, `${id}-frq`))
  ];
  return { id, title, description, tag, format, minutes, difficulty, questions };
}

const FULL_LEVELS = ['medium', 'medium', 'hard', 'hard', 'hard'];
const MCQ_LEVELS = ['easy', 'easy', 'medium', 'medium', 'medium', 'hard', 'hard', 'hard'];
const FRQ_LEVELS = ['easy', 'easy', 'medium', 'medium', 'hard', 'hard', 'hard'];
const MIXED_LEVELS = ['easy', 'easy', 'easy', 'medium', 'medium', 'medium', 'medium', 'hard', 'hard', 'hard'];

const fullExams = FULL_LEVELS.map((difficulty, index) => makeExam({
  id: `ap-full-${index + 1}`,
  title: `AP-Style Full Exam ${String(index + 1).padStart(2, '0')}`,
  description: 'Full simulation aligned to AP timing: 42 multiple-choice questions and 4 original FRQs, one from each major coding area.',
  tag: 'Full exam', format: 'full', difficulty, minutes: 180,
  mcqStart: index * 11, mcqCount: 42, frqStart: index, balancedFrq: true
}));

const mcqExams = MCQ_LEVELS.map((difficulty, index) => makeExam({
  id: `ap-mcq-${index + 1}`,
  title: `Multiple-Choice Practice ${String(index + 1).padStart(2, '0')}`,
  description: '24 original, syllabus-aligned questions for focused timed practice.',
  tag: 'MCQ', format: 'mcq', difficulty, minutes: 50,
  mcqStart: index * 9 + 3, mcqCount: 24
}));

const frqExams = FRQ_LEVELS.map((difficulty, index) => makeExam({
  id: `ap-frq-${index + 1}`,
  title: `Free-Response Practice ${String(index + 1).padStart(2, '0')}`,
  description: 'Four original Java coding tasks with model solutions and a self-check rubric.',
  tag: 'FRQ', format: 'frq', difficulty, minutes: 90,
  frqStart: index % frqPools[difficulty].length, frqCount: 4
}));

const mixedExams = MIXED_LEVELS.map((difficulty, index) => makeExam({
  id: `ap-mixed-${index + 1}`,
  title: `Section Practice ${String(index + 1).padStart(2, '0')}`,
  description: 'A shorter original set combining code analysis and Java implementation.',
  tag: 'Mixed', format: 'mixed', difficulty, minutes: 55,
  mcqStart: index * 5 + 2, mcqCount: 14,
  frqStart: index % frqPools[difficulty].length, frqCount: 2
}));

export const exams = [...fullExams, ...mcqExams, ...frqExams, ...mixedExams];
