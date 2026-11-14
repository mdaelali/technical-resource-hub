const units = [
  {
    id: 'ap-csa-unit-1', title: 'Unit 1 · Using Objects and Methods', tag: '15–25% of MCQ',
    description: 'Build Java foundations: values, expressions, APIs, objects, methods, and Strings.',
    topics: [
      ['1.1', 'Introduction to Algorithms, Programming, and Compilers', 'An algorithm is an ordered set of steps. Learn how Java source is compiled and distinguish compile-time, logic, and run-time errors.', 'Trace a short plan, then classify a missing semicolon, a wrong result, and an invalid array index.', 'A program can compile successfully and still have a logic error.'],
      ['1.2', 'Variables and Data Types', 'Choose between primitive values such as int, double, and boolean and reference types such as String. Declare variables with compatible types.', 'Declare a score, an average, and a completion flag using appropriate types.', 'A String is an object reference, not a primitive type.'],
      ['1.3', 'Expressions and Output', 'Evaluate arithmetic, literals, operator precedence, integer division, and print versus println. Java evaluates expressions according to type and precedence.', 'Predict each output for 7 / 2, 7.0 / 2, and "score=" + 7 + 2.', 'Integer division truncates; concatenation proceeds left to right.'],
      ['1.4', 'Assignment Statements and Input', 'Assignment stores the value on the right in a compatible variable on the left. Learn the course’s Scanner and input examples and how assignment changes state.', 'Trace three assignments to the same variable and show its value after each statement.', 'The equals sign in Java assignment is not a mathematical equality test.'],
      ['1.5', 'Casting and Ranges of Variables', 'Widening and narrowing casts change numeric types. Review int limits, overflow, truncation, and why floating-point calculations can round.', 'Predict (int) 6.9 and identify which operation can overflow an int.', 'A cast to int truncates toward zero; it does not round.'],
      ['1.6', 'Compound Assignment Operators', 'Operators such as +=, -=, *=, /=, and %= update a variable using its previous value. Track the conversion and evaluation of each update.', 'Rewrite total += price as a regular assignment, then trace the result.', 'The update occurs in place; do not confuse assignment with comparison.'],
      ['1.7', 'Application Program Interface (API) and Libraries', 'Libraries group reusable classes. An API documents their constructors, methods, parameters, and return values so code can use them correctly.', 'Use a method signature to identify a valid call and its return type.', 'Match arguments to parameter types and order.'],
      ['1.8', 'Documentation with Comments', 'Comments explain code but are ignored by the compiler. Preconditions describe what must be true before a method; postconditions describe its result.', 'Write one precondition and one postcondition for a method that returns an array average.', 'A comment does not validate inputs or change program behavior.'],
      ['1.9', 'Method Signatures', 'A method signature identifies a method by its name and ordered parameter types. Parameters receive copies of argument values when a method is called.', 'Given two overloaded methods, select the matching call and predict its return value.', 'A return type is not part of a Java method signature.'],
      ['1.10', 'Calling Class Methods', 'A class (static) method is called using its class name and does not require an object instance. Read the API to understand the method’s contract.', 'Write a call to Math.abs using the class name and store the returned value.', 'Do not try to call an instance method without an object.'],
      ['1.11', 'Math Class', 'Use the AP Quick Reference methods abs, pow, sqrt, and random. Check each method’s parameter types and return type.', 'Use Math.random to produce an integer from 0 through 9, then explain the bounds.', 'Math.random returns a value from 0 inclusive to 1 exclusive.'],
      ['1.12', 'Objects: Instances of Classes', 'A class describes a reference type; an object is one instance. Reference variables can point to the same object or contain null.', 'Draw two variables that refer to one object, then show how a field change is shared.', 'Assigning one reference variable to another does not copy the object.'],
      ['1.13', 'Object Creation and Storage (Instantiation)', 'Constructors initialize an object and share the class name. Use new with arguments that match a constructor’s parameter list.', 'Create two objects with different constructor arguments and compare their state.', 'A constructor has no return type, not even void.'],
      ['1.14', 'Calling Instance Methods', 'An instance method is called on an object reference. Follow the receiver, arguments, state changes, return value, and point where execution resumes.', 'Trace two method calls on the same object and record the state after each call.', 'The object before the dot is the receiver of the call.'],
      ['1.15', 'String Manipulation', 'Strings are immutable. Practice concatenation, equality, length, substring, indexOf, and tracing how each call returns a value.', 'Trace "computer".substring(2, 5) and check the starting and ending indices.', 'String methods return results; they do not modify the original String.']
    ]
  },
  {
    id: 'ap-csa-unit-2', title: 'Unit 2 · Selection and Iteration', tag: '25–35% of MCQ',
    description: 'Write and trace decisions and loops, then use them to build algorithms and reason about run time.',
    topics: [
      ['2.1', 'Algorithms with Selection and Repetition', 'Algorithms combine sequencing, decisions, and repetition. The order and conditions of these steps determine the result.', 'Describe a real task as a sequence with one decision and one repeated step.', 'Check whether a condition is evaluated before or after a step.'],
      ['2.2', 'Boolean Expressions', 'Relational operators compare primitive values and produce true or false. Carefully distinguish equality from assignment.', 'Evaluate x >= 4 and x != 7 for several values of x.', 'Use == for primitive equality; = assigns a value.'],
      ['2.3', 'if Statements', 'An if or if-else statement selects a branch using a Boolean expression. Only the selected branch executes.', 'Trace an if-else that classifies a temperature at boundary values.', 'Test the boundary itself, not only values clearly above or below it.'],
      ['2.4', 'Nested if Statements', 'A nested conditional evaluates an inner decision only when execution reaches it. Braces make each branch’s scope clear.', 'Trace a nested grade-and-attendance rule for all branch combinations.', 'An else pairs with the nearest unmatched if.'],
      ['2.5', 'Compound Boolean Expressions', 'Combine conditions with !, &&, and ||. Java short-circuits when the first value determines the result.', 'Rewrite “outside 10 through 20” with a correct compound condition.', 'For an inclusive range use &&; many incorrect answers use ||.'],
      ['2.6', 'Comparing Boolean Expressions', 'Equivalent Boolean expressions have the same result for every input. For objects, == compares references, while equals can compare content.', 'Build a truth table for a condition and compare two distinct String objects.', 'Use equals for String content; use == only when reference identity is intended.'],
      ['2.7', 'while loops', 'A while loop checks its condition before each pass and may run zero times. Update state so the loop eventually stops.', 'Trace a counter loop and identify its first and last executed values.', 'Watch for off-by-one bounds and an unchanged loop variable.'],
      ['2.8', 'for loops', 'A for loop groups initialization, continuation condition, and update. The update runs after the body, then the condition is checked again.', 'Trace a loop with a non-unit increment and list each control-variable value.', 'The loop variable is updated after each body execution.'],
      ['2.9', 'Implementing Selection and Iteration Algorithms', 'Combine conditions and loops to count values, find extrema, calculate sums or averages, inspect digits, and detect divisibility.', 'Write a method that returns how many array values meet a stated condition.', 'Initialize a minimum or maximum from real data when possible, not an arbitrary zero.'],
      ['2.10', 'Implementing String Algorithms', 'Strings can be traversed with index-based loops to count matching characters, inspect substrings, or build a new reversed String.', 'Create a new String containing the characters of an input in reverse order.', 'Use indices from 0 through length() - 1.'],
      ['2.11', 'Nested Iteration', 'A nested loop finishes all inner iterations for each outer-loop iteration. Track both control variables to understand the total work.', 'For a small pair of loop bounds, list every (row, column) pair visited.', 'The inner loop often resets each time the outer loop advances.'],
      ['2.12', 'Informal Run-Time Analysis', 'Estimate work by counting statement executions as inputs grow. Compare simple loop patterns without relying on advanced asymptotic analysis.', 'Count how many times a statement executes in a triangular nested loop.', 'Do not confuse total loop iterations with the number of distinct output values.']
    ]
  },
  {
    id: 'ap-csa-unit-3', title: 'Unit 3 · Class Creation', tag: '10–18% of MCQ',
    description: 'Design classes that manage state, expose behaviors, and make program responsibilities clear.',
    topics: [
      ['3.1', 'Program Design', 'Use abstraction to identify useful data and behaviors, split a problem into methods, and describe how classes work together.', 'Sketch a class with its responsibilities before writing its fields and methods.', 'Avoid placing unrelated responsibilities in one class.'],
      ['3.2', 'Impact of Program Design', 'Consider reliability, privacy, data quality, accessibility, and legal or ethical impacts when designing programs.', 'Name one benefit, one risk, and one mitigation for an app collecting student data.', 'A technically correct program can still cause harmful outcomes.'],
      ['3.3', 'Anatomy of a Class', 'A class groups fields and methods. Encapsulation keeps fields private and exposes appropriate public behaviors.', 'Design a class with two private fields and methods that safely read or update them.', 'Do not expose mutable internal state without considering its effects.'],
      ['3.4', 'Constructors', 'A constructor establishes a valid initial object state. Assign parameters to fields and validate or copy mutable inputs when required.', 'Write a constructor that sets every field for a simple study-session class.', 'A constructor name matches its class and has no return type.'],
      ['3.5', 'Methods: How to Write Them', 'Method headers define visibility, return type, name, and parameters. The body should satisfy the specified behavior for the allowed inputs.', 'Implement a method from a short specification and test normal and boundary inputs.', 'Every non-void path must return a compatible value.'],
      ['3.6', 'Methods: Passing and Returning References of an Object', 'Java passes argument values, including object references, by value. A copied reference can still access and mutate the same object.', 'Trace a method that changes an object field and another that reassigns its local parameter.', 'Reassigning a parameter does not change the caller’s variable; mutating the shared object can.'],
      ['3.7', 'Class Variables and Methods', 'A static field belongs to the class and is shared across its instances. A static method has no implicit current object.', 'Count how many objects have been created using one static counter.', 'A class method cannot directly use an instance field without an object.'],
      ['3.8', 'Scope and Access', 'Scope determines where a variable can be used. Distinguish local variables, parameters, instance fields, and class members; apply public and private access.', 'Resolve a name collision by identifying the nearest declared variable.', 'A local variable can shadow a field, so read the declaration and scope.'],
      ['3.9', 'this Keyword', 'this refers to the current object. It clarifies field access when a parameter has the same name as a field.', 'Complete a constructor assignment using this.field = parameter.', 'Without this, a same-named parameter may be assigned to itself.']
    ]
  },
  {
    id: 'ap-csa-unit-4', title: 'Unit 4 · Data Collections', tag: '30–40% of MCQ',
    description: 'Reason about data, arrays, ArrayLists, text files, searching, sorting, and recursion.',
    topics: [
      ['4.1', 'Ethical and Social Issues Around Data Collection', 'Evaluate privacy risks, data quality, collection bias, and whether a data set is suitable for a question.', 'Explain how a biased or incomplete student dataset could lead to a harmful conclusion.', 'A large data set is not automatically representative or accurate.'],
      ['4.2', 'Introduction to Using Data Sets', 'A data set organizes observations and attributes. Determine what a data set can answer and what cannot be inferred from it.', 'Choose fields for a question and identify one limitation in the collected data.', 'Do not draw conclusions beyond the data’s population or collection method.'],
      ['4.3', 'Array Creation and Access', 'Arrays have a fixed length and zero-based indices. Learn initializer lists, default values, element types, and the length field.', 'Create an int array, predict its default values, and safely access its first and last entries.', 'The final valid index is length - 1.'],
      ['4.4', 'Array Traversals', 'Traverse an array with an indexed loop, while loop, or enhanced for loop. Choose a form that matches whether an index is needed.', 'Sum all values and then update one selected element by index.', 'Changing an enhanced-for primitive variable does not write back to the array.'],
      ['4.5', 'Implementing Array Algorithms', 'Use array traversals for totals, averages, extrema, counts, neighbor comparisons, duplicates, shifts, rotations, and reversal.', 'Write a method to count adjacent equal pairs without changing the input.', 'Check empty and one-element inputs before using neighboring indices.'],
      ['4.6', 'Using Text Files', 'Read file tokens with Scanner and a File, loop while data remains, parse values, and close the scanner. Handle file-opening exceptions.', 'Read each token from a sample file and split a line into fields.', 'The AP scope excludes keyboard input and special regular-expression syntax.'],
      ['4.7', 'Wrapper Classes', 'Integer and Double wrap primitive numbers as objects. Understand boxing, unboxing, and parsing numeric Strings.', 'Convert "42" to an int and explain when an Integer is unboxed.', 'Parsing text can fail if the String is not a valid number.'],
      ['4.8', 'ArrayList Methods', 'ArrayLists can grow or shrink. Practice size, add, get, set, and remove, including the distinction between removing by index and by object.', 'Trace an insert, a replacement, and a removal while tracking shifted indices.', 'For ArrayList<Integer>, remove(2) removes index 2; remove(Integer.valueOf(2)) removes the value.'],
      ['4.9', 'ArrayList Traversals', 'Traverse by index or enhanced for loop. Account for size changes and avoid skipping values when removing during iteration.', 'Remove every matching value using a safe index-based approach.', 'After removal, later elements shift left; do not increment blindly.'],
      ['4.10', 'Implementing ArrayList Algorithms', 'Apply traversals to totals, extrema, counts, duplicates, consecutive pairs, insertion, deletion, shifting, and reversal.', 'Remove all values below a threshold while preserving the remaining order.', 'When removing by index, re-check the index that shifted into that position.'],
      ['4.11', '2D Array Creation and Access', 'A 2D array is an array of row arrays. Access values with [row][column] and use row lengths to support uneven rows.', 'Create a grid and explain the difference between grid.length and grid[row].length.', 'The first index selects a row; the second selects a column.'],
      ['4.12', '2D Array Traversals', 'Use nested loops to visit every row and column. For potentially uneven arrays, use the current row’s length.', 'Print each grid value and then calculate one column total.', 'Do not use the number of rows as the column bound.'],
      ['4.13', 'Implementing 2D Array Algorithms', 'Combine nested traversal with conditions to compute row or column totals, count values, inspect neighbors, or transform a grid.', 'Count positive values and calculate a sum for each row.', 'Check boundary conditions before accessing neighboring cells.'],
      ['4.14', 'Searching Algorithms', 'Linear search checks elements in order and stops when it finds a match or reaches the end. Search each row in turn for 2D data.', 'Return the index of the first matching value, or a documented not-found result.', 'A linear search does not assume the collection is sorted.'],
      ['4.15', 'Sorting Algorithms', 'Trace selection sort and insertion sort as the sorted region grows. Follow every comparison, swap, and shift.', 'Show the array after each outer-loop pass of selection sort and insertion sort.', 'Insertion sort shifts items; selection sort places a selected extreme.'],
      ['4.16', 'Recursion', 'A recursive method calls itself and needs a base case that stops. Trace calls and returns to determine behavior.', 'Draw a call stack for a method that reduces an integer until it reaches zero.', 'Every recursive path must reach a base case.']
    ]
  }
];

export const apcsaCategories = units.map((unit) => ({
  id: unit.id,
  title: unit.title,
  accent: 'from-emerald-400/20 to-sky-400/10',
  description: `${unit.description} ${unit.tag} on the multiple-choice section.`,
  cards: unit.topics.map(([number, title, explanation, practice, pitfall]) => ({
    title: `${number} · ${title}`,
    tag: unit.tag,
    explanation,
    example: practice,
    bullets: [`Goal: explain the concept and trace or implement a Java example.`, `Practice: ${practice}`, `Watch for: ${pitfall}`],
    steps: [`State the input and the required result.`, `Trace values or write the smallest correct Java method.`, `Test a normal case and a boundary case.`],
    mistakes: [pitfall],
    tips: [`Use the official AP Course and Exam Description linked above to check the full required knowledge and exclusions.`]
  }))
}));

export const apcsaTopicCount = apcsaCategories.reduce((count, unit) => count + unit.cards.length, 0);
