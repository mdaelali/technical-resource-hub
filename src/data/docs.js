export const docCategories = [
  {
    id: 'algorithms',
    title: 'Algorithms',
    accent: 'from-cyan-400/30 to-violet-500/20',
    description: 'Sorting, searching, graph traversal, and divide-and-conquer patterns every CS student must know cold.',
    cards: [
      {
        title: 'Bubble Sort',
        tag: 'O(n²)',
        snippetId: 'bubble-sort',
        explanation:
          'Bubble Sort repeatedly steps through a list, comparing adjacent pairs and swapping them if they are in the wrong order. After each full pass, the largest unsorted element bubbles up to its correct position at the end. Although intuitive, its quadratic running time makes it impractical for large datasets.',
        complexity: 'Time: O(n²) average and worst, O(n) best with the early-exit flag. Space: O(1).',
        example:
          'Sorting ten student grades for a tiny class report — small enough that simplicity wins over speed.',
        bullets: [
          'Stable: equal elements keep their relative order',
          'In-place: needs no extra memory beyond the input array',
          'Adaptive variant exits early when no swaps occur in a pass',
          'Useful as a teaching tool, almost never used in production'
        ],
        steps: [
          'Outer loop: i from 0 to n - 2',
          'Inner loop: j from 0 to n - 2 - i (the unsorted region shrinks each pass)',
          'If a[j] > a[j + 1], swap them',
          'Track a swapped flag — if no swaps occur in a full pass, the array is sorted, break early',
          'After n - 1 passes the array is fully sorted in ascending order'
        ],
        mistakes: [
          'Forgetting the early-exit flag and always running n - 1 passes',
          'Using i instead of n - 1 - i as the inner loop bound, wasting work',
          'Indexing j + 1 with j going up to n - 1 — out-of-bounds access'
        ],
        tips: [
          'Trace by hand on a 5-element array to internalize each pass',
          'Compare with insertion sort — same Big O but fewer swaps in practice',
          'Know it well as a baseline: interviewers often ask why you would not use it'
        ]
      },
      {
        title: 'Binary Search',
        tag: 'O(log n)',
        snippetId: 'binary-search',
        explanation:
          'Binary Search locates a target value in a sorted array by repeatedly halving the search interval. At each step it compares the target with the middle element and discards the half that cannot contain the target. It is one of the most fundamental algorithms because the divide-and-conquer pattern generalizes to many other problems.',
        complexity: 'Time: O(log n). Space: O(1) iterative, O(log n) recursive due to the call stack.',
        example:
          'Looking up a word in a dictionary: flip to the middle, decide whether to go left or right, and repeat.',
        bullets: [
          'Requires a sorted, randomly indexable structure',
          'Iterative version is preferred to avoid stack overhead',
          'Variants: lower_bound, upper_bound, search-insert position',
          'Foundation for any "first true on a monotonic predicate" problem'
        ],
        steps: [
          'Initialize low = 0, high = n - 1',
          'While low <= high, compute mid = low + (high - low) / 2',
          'If arr[mid] == target, return mid',
          'If arr[mid] < target, set low = mid + 1; else set high = mid - 1',
          'If the loop exits without a match, return -1'
        ],
        mistakes: [
          'Computing mid as (low + high) / 2 can overflow on large arrays — use low + (high - low) / 2',
          'Off-by-one updates of low or high cause infinite loops',
          'Running it on an unsorted array — the algorithm requires sorted input'
        ],
        tips: [
          'Master the "find first index where predicate is true" template',
          'Practice variants: rotated sorted array and search in a 2D matrix',
          'When stuck, manually trace the loop on small inputs to pin down boundary bugs'
        ]
      },
      {
        title: 'Merge Sort',
        tag: 'O(n log n)',
        snippetId: 'merge-sort',
        explanation:
          'Merge Sort is a stable, divide-and-conquer sort that splits the array in half, recursively sorts each half, and merges the two sorted halves. It guarantees O(n log n) running time regardless of input distribution, which is its main advantage over Quicksort. The trade-off is O(n) auxiliary space for the merge step.',
        complexity: 'Time: O(n log n) in all cases. Space: O(n) auxiliary.',
        example:
          'The JVM uses a Merge Sort variant (Timsort) inside Arrays.sort for object arrays — predictability matters for general-purpose libraries.',
        bullets: [
          'Stable — equal keys retain their order',
          'Excellent on linked lists where merging is O(1) per element',
          'Amenable to external sorting on disk',
          'Parallelizable across the recursive halves'
        ],
        steps: [
          'Base case: if the subarray length is at most 1, return',
          'Recurse on the left half [0, mid)',
          'Recurse on the right half [mid, n)',
          'Merge: walk both halves with two pointers, copying the smallest into a temp buffer',
          'Copy the temp buffer back into the original array'
        ],
        mistakes: [
          'Allocating a fresh buffer at every recursive call — pre-allocate once',
          'Wrong mid boundary leading to one-element infinite recursion',
          'Skipping the leftover-elements copy after one half is exhausted'
        ],
        tips: [
          'Implement merge as a separate, well-tested helper',
          'Compare Merge Sort against Quicksort empirically on random data',
          'On a linked list, Merge Sort beats Quicksort thanks to easy pointer manipulation'
        ]
      },
      {
        title: 'Dynamic Programming',
        tag: 'Pattern',
        snippetId: 'fibonacci',
        explanation:
          'Dynamic Programming solves problems by breaking them into overlapping subproblems and reusing previously computed answers. It applies when a problem has both optimal substructure and overlapping subproblems. The two main flavors are top-down memoization and bottom-up tabulation.',
        complexity: 'Depends on the recurrence — typical: O(states × transitions). Space can often be compressed from O(n) to O(1).',
        example:
          'Computing the minimum-edit distance between two strings — used in spell checkers and DNA alignment — is a textbook 2D DP.',
        bullets: [
          'Identify the state: which variables uniquely describe a subproblem',
          'Write the recurrence relation',
          'Choose direction: top-down (recursion + memo) vs bottom-up (table)',
          'Look for opportunities to compress space dimensions'
        ],
        steps: [
          'Define the state precisely (e.g., dp[i][j] = min cost to convert s[0..i] to t[0..j])',
          'Establish the base cases (e.g., dp[0][j] = j and dp[i][0] = i)',
          'Derive the recurrence (e.g., min of insert, delete, replace)',
          'Choose an iteration order so subproblems are filled before they are read',
          'Reconstruct the answer if needed by walking the table backwards'
        ],
        mistakes: [
          'Defining a state that is not unique — leads to wrong reuse of answers',
          'Wrong iteration direction so the recurrence reads unfilled cells',
          'Forgetting base cases, especially for empty strings or zero capacity'
        ],
        tips: [
          'Always start with brute-force recursion, then add memoization, then convert to bottom-up',
          'Drill the canonical patterns: knapsack, LIS, LCS, edit distance, coin change',
          'On 2D DPs, sketch the table and fill the first row/column by hand'
        ]
      },
      {
        title: 'Graph BFS / DFS',
        tag: 'O(V + E)',
        snippetId: 'graph-bfs',
        explanation:
          'Breadth-First Search explores the graph level by level using a queue, while Depth-First Search dives down each branch using a stack or recursion. BFS yields the shortest path on unweighted graphs; DFS is the natural choice for cycle detection, topological sort, and connectivity. Both run in O(V + E) time using an adjacency list.',
        complexity: 'Time: O(V + E). Space: O(V) for the visited set and the frontier.',
        example:
          'BFS powers shortest friend-of-friend search in social networks; DFS is the engine behind detecting deadlocks in OS resource allocation graphs.',
        bullets: [
          'Always track a visited set to avoid revisiting nodes',
          'BFS uses a Queue (FIFO); DFS uses a Stack or recursion (LIFO)',
          'DFS naturally categorizes edges into tree/back/forward/cross',
          'On weighted graphs, prefer Dijkstra (BFS-like) or Bellman-Ford'
        ],
        steps: [
          'Initialize a visited set and a frontier (queue for BFS, stack for DFS)',
          'Push the source node and mark it visited',
          'While the frontier is not empty, pop a node and process it',
          'For each unvisited neighbor: mark visited and push to the frontier',
          'Optionally record parent pointers to reconstruct the path'
        ],
        mistakes: [
          'Marking nodes visited at pop instead of push — leads to duplicates in the queue',
          'Forgetting to handle disconnected components when traversing the whole graph',
          'Using BFS on a weighted graph and expecting shortest paths'
        ],
        tips: [
          'Trace BFS and DFS on a small 5-node graph and compare visit orders',
          'Practice cycle detection with DFS using gray/black coloring',
          'Implement topological sort using both Kahn (BFS) and DFS post-order'
        ]
      },
      {
        title: 'Recursion',
        tag: 'Technique',
        snippetId: 'recursion',
        explanation:
          'Recursion is a technique where a function solves a problem by calling itself on a smaller subproblem and combining the results. Every recursive function needs a base case to terminate and a recursive case that strictly shrinks the input. Recursion makes divide-and-conquer, tree, and graph algorithms easier to write and reason about.',
        complexity: 'Depends on the recurrence T(n) = aT(n/b) + f(n) — solved by the Master Theorem. Space: O(depth) for the call stack.',
        example:
          'Computing the number of ways to climb n stairs taking 1 or 2 steps at a time, or generating all subsets of a set.',
        bullets: [
          'Define the base case first — it determines termination',
          'Trust the recursion: assume the call returns the correct answer for smaller input',
          'Tail recursion can be converted to iteration; the JVM does not optimize it',
          'Switch to iteration or an explicit stack when depth risks overflow'
        ],
        steps: [
          'Identify the smallest input you can solve trivially (the base case)',
          'Express the answer for size n in terms of one or more smaller-size answers',
          'Combine the subproblem results to form the answer for n',
          'Verify monotonic progress toward the base case',
          'Optionally memoize if subproblems repeat — turning recursion into DP'
        ],
        mistakes: [
          'Missing or unreachable base case — infinite recursion',
          'Recursing on the same input size — does not progress',
          'Stack overflow on deeply nested data — switch to iteration'
        ],
        tips: [
          'Draw the recursion tree to count subproblem invocations',
          'Practice classics: factorial, Fibonacci, tree traversals, permutations',
          'Convert recursive solutions to iterative ones to deepen your call-stack understanding'
        ]
      }
    ]
  },
  {
    id: 'logic',
    title: 'Logic Problems',
    accent: 'from-emerald-400/30 to-cyan-500/20',
    description: 'Classic interview problems that drill core data-structure thinking and pointer manipulation.',
    cards: [
      {
        title: 'Two Sum',
        tag: 'Hashing',
        snippetId: 'two-sum',
        explanation:
          'Given an array of integers and a target, return the indices of two numbers that add up to the target. The naive O(n²) approach checks every pair, but a single-pass hash map reduces this to O(n) by remembering values we have already seen. It is the canonical introduction to space-time trade-offs.',
        complexity: 'Time: O(n). Space: O(n) for the hash map.',
        example:
          'A payment system that needs to find two accounts whose balances sum to a target settlement amount.',
        bullets: [
          'Hash the complement (target - current value), not the value itself',
          'Single pass — check before insert to handle duplicates correctly',
          'Returns indices, not the values themselves',
          'Variants: 3Sum, 4Sum, Two Sum on a sorted array (two pointers)'
        ],
        steps: [
          'Create an empty hash map from value to index',
          'For each element a[i], compute complement = target - a[i]',
          'If complement is in the map, return [map.get(complement), i]',
          'Otherwise, put (a[i], i) into the map',
          'If the loop ends with no match, no pair sums to the target'
        ],
        mistakes: [
          'Putting before checking — incorrectly matches an element with itself',
          'Returning the value instead of the index',
          'Assuming the input is sorted — only the two-pointer variant requires that'
        ],
        tips: [
          'Solve the brute force first to make the speedup visible',
          'Generalize to k-Sum by sorting and using nested two-pointer scans',
          'Watch for integer overflow when target and values are near INT_MAX'
        ]
      },
      {
        title: 'Palindrome Check',
        tag: 'Two Pointers',
        snippetId: 'palindrome',
        explanation:
          'A palindrome reads the same forward and backward. The standard two-pointer technique walks one index from the start and another from the end, comparing characters as they converge. It runs in linear time with constant extra space, far better than reversing the string and comparing.',
        complexity: 'Time: O(n). Space: O(1).',
        example:
          'Validating linguistic puzzles or detecting symmetric DNA sequences in bioinformatics.',
        bullets: [
          'Two-pointer technique: O(1) extra space',
          'Often combined with case folding and non-alphanumeric filtering',
          'Variant: longest palindromic substring (DP or expand-around-center)',
          'Recursive form is elegant but uses O(n) stack'
        ],
        steps: [
          'Set left = 0 and right = s.length() - 1',
          'While left < right, compare s[left] and s[right]',
          'If they differ, return false',
          'Otherwise increment left and decrement right',
          'If the loop completes, return true'
        ],
        mistakes: [
          'Comparing chars without case folding when the spec is case-insensitive',
          'Allocating a reversed copy — wastes O(n) memory',
          'Treating Unicode incorrectly — surrogate pairs can be split'
        ],
        tips: [
          'Practice "valid palindrome with one deletion allowed" for edge-case thinking',
          'Master expand-around-center for the longest palindromic substring',
          'On Unicode strings, work with code points rather than UTF-16 chars'
        ]
      },
      {
        title: 'Fibonacci Sequence',
        tag: 'DP / Math',
        snippetId: 'fibonacci',
        explanation:
          'F(n) = F(n-1) + F(n-2) with F(0) = 0 and F(1) = 1. The naive recursion runs in exponential time because subproblems repeat; memoization or iteration drops it to O(n). For very large n, matrix exponentiation gives O(log n).',
        complexity: 'Time: O(n) iterative, O(log n) with fast doubling. Space: O(1) iterative.',
        example:
          'Models phyllotaxis (plant leaf arrangement) and underlies the Golden Ratio used in UI design and architecture.',
        bullets: [
          'Naive recursion is O(2^n) — never use it past n ≈ 30 in practice',
          'Iterative bottom-up uses two variables: prev and curr',
          'Fast doubling exploits F(2k) and F(2k+1) identities for O(log n)',
          'Watch for overflow — use long beyond F(46) in Java'
        ],
        steps: [
          'Handle base cases: if n < 2 return n',
          'Initialize prev = 0 and curr = 1',
          'Loop i from 2 to n: next = prev + curr; prev = curr; curr = next',
          'Return curr after the loop',
          'For very large n, use matrix exponentiation or BigInteger'
        ],
        mistakes: [
          'Returning the wrong base — starting curr = 0 instead of 1',
          'Off-by-one in the loop bound',
          'Forgetting that the result overflows int around F(46)'
        ],
        tips: [
          'Memoize the recursive version with a Map<Integer, Long>',
          'Practice climb-stairs and house-robber — same recurrence, different framing',
          'Implement fast doubling once to internalize the O(log n) trick'
        ]
      },
      {
        title: 'Linked List Reversal',
        tag: 'Pointers',
        snippetId: 'linked-list',
        explanation:
          'Reversing a singly linked list in place requires walking the list once with three pointers — previous, current, and next. At each step we redirect the current node\'s next pointer to the previous node and advance both. Done correctly, the operation is O(n) time and O(1) extra space.',
        complexity: 'Time: O(n). Space: O(1) iterative, O(n) recursive.',
        example:
          'Used inside higher-level operations like "reverse k nodes at a time", or to enable backwards traversal of a singly linked list.',
        bullets: [
          'Three-pointer dance: prev, curr, next',
          'Iterative is the canonical interview implementation',
          'Recursive variant is elegant but uses O(n) stack',
          'Doubly linked list reversal only swaps the prev/next pointers'
        ],
        steps: [
          'Initialize prev = null and curr = head',
          'While curr != null, save next = curr.next',
          'Set curr.next = prev to reverse this node\'s pointer',
          'Advance prev = curr and curr = next',
          'Return prev — the new head of the reversed list'
        ],
        mistakes: [
          'Not saving curr.next before overwriting — loses the rest of the list',
          'Returning curr (which is null) instead of prev at the end',
          'Forgetting to handle the empty list (head == null)'
        ],
        tips: [
          'Draw the pointers on paper for a 3-node list — visualization removes all confusion',
          'Practice "reverse a sublist between m and n" as a follow-up',
          'Implement both iterative and recursive versions and compare their clarity'
        ]
      },
      {
        title: 'Stack Implementation',
        tag: 'Data Structure',
        snippetId: 'stack',
        explanation:
          'A stack is a LIFO container with two primary operations: push (insert on top) and pop (remove from top). It can be backed by an array with dynamic resizing or by a singly linked list. Stacks are everywhere — function call frames, expression evaluation, undo history, depth-first search.',
        complexity: 'push, pop, peek: O(1) amortized. Space: O(n).',
        example:
          'The JVM evaluates arithmetic expressions on its operand stack — every Java method call frame is itself a stack frame.',
        bullets: [
          'LIFO ordering — last in, first out',
          'Array-backed: contiguous memory, cache friendly, amortized O(1) push',
          'Linked-list backed: true O(1) push without resize, more memory per node',
          'Always check isEmpty before pop to avoid underflow'
        ],
        steps: [
          'Choose a backing structure (array or linked list)',
          'Maintain a top index (array) or top pointer (linked list)',
          'push(x): place x on top, then increment or extend top',
          'pop(): read top, then decrement or shrink top, return the value',
          'Provide peek(), isEmpty(), and size() helpers'
        ],
        mistakes: [
          'Calling pop on an empty stack — throw a clear exception, do not return garbage',
          'Forgetting to resize the underlying array — index out of bounds',
          'Returning a reference that lets callers mutate internal state'
        ],
        tips: [
          'Implement both array-based and linked-list-based stacks once',
          'Use a stack to evaluate postfix expressions and validate balanced parentheses',
          'Java\'s java.util.Stack extends Vector and is legacy — prefer Deque instead'
        ]
      },
      {
        title: 'Tree Traversal',
        tag: 'Recursion / Stack',
        snippetId: 'tree-traversal',
        explanation:
          'A binary tree can be traversed in pre-order (root, left, right), in-order (left, root, right), or post-order (left, right, root). In-order on a binary search tree yields the elements in sorted order. Each traversal can be expressed recursively in three lines or iteratively with an explicit stack.',
        complexity: 'Time: O(n). Space: O(h) for recursion, where h is the tree height (O(log n) balanced, O(n) worst).',
        example:
          'Compilers traverse expression trees in post-order to evaluate them; databases use in-order traversal of B-trees for sorted scans.',
        bullets: [
          'Three orders: pre-order, in-order, post-order — all O(n)',
          'BFS (level-order) is the fourth common traversal, requires a queue',
          'Iterative versions need an explicit Stack and care to avoid revisiting',
          'Morris traversal achieves O(1) space by temporarily rewiring pointers'
        ],
        steps: [
          'Pre-order: visit node, recurse left, recurse right',
          'In-order: recurse left, visit node, recurse right',
          'Post-order: recurse left, recurse right, visit node',
          'Iterative pre-order: push root; while stack not empty, pop and visit, push right then left',
          'Iterative in-order: walk lefts pushing as you go, then pop, visit, move to right child'
        ],
        mistakes: [
          'Confusing the three orders — sketch them on a 3-node tree to remember',
          'Iterative post-order is the trickiest — reverse a pre-order or use two stacks',
          'Treating null children as actual leaves and visiting them'
        ],
        tips: [
          'Practice all four traversals (pre, in, post, level) iteratively',
          'Use in-order on a BST to verify it is a valid BST',
          'Morris traversal is a great interview signal — implement it once'
        ]
      }
    ]
  },
  {
    id: 'exam',
    title: 'Exam Prep',
    accent: 'from-violet-400/30 to-pink-500/20',
    description: 'High-yield review notes targeting the questions that actually appear on undergraduate CS exams.',
    cards: [
      {
        title: 'Big O Notation',
        tag: 'Theory',
        explanation:
          'Big O describes the upper bound of an algorithm\'s running time as input size grows, ignoring constants and lower-order terms. It tells you how the algorithm scales, not how fast it is in absolute terms. Common classes are O(1), O(log n), O(n), O(n log n), O(n²), O(2^n), O(n!).',
        complexity: 'N/A — Big O is the language we use to describe complexity itself.',
        example:
          'Saying "merge sort is O(n log n)" tells you it scales much better than the O(n²) bubble sort, before measuring real wall-clock time.',
        bullets: [
          'O(1) constant, O(log n) logarithmic, O(n) linear, O(n log n) linearithmic, O(n²) quadratic',
          'Drop constants and lower-order terms: 3n + 7 → O(n)',
          'Big Theta is a tight bound, Big Omega is a lower bound, Big O is an upper bound',
          'Amortized analysis (e.g., dynamic array push) often matters more than worst case'
        ],
        steps: [
          'Identify the dominant operation inside the deepest loop',
          'Count how the operation count grows with n',
          'Drop constant factors and non-dominant terms',
          'Express the result as O(f(n))',
          'Verify with concrete inputs — double n and check that runtime quadruples for O(n²)'
        ],
        mistakes: [
          'Confusing best, average, and worst case — Big O alone implies an upper bound',
          'Treating Big O as exact runtime — it ignores constants that matter on small n',
          'Multiplying by a constant "just to be safe" — pointless in asymptotic analysis'
        ],
        tips: [
          'Memorize the complexity of each common operation on each data structure',
          'Practice deriving Big O from nested loops and recursion trees',
          'Know the Master Theorem cases for divide-and-conquer recurrences'
        ]
      },
      {
        title: 'Data Structures Overview',
        tag: 'Foundations',
        explanation:
          'A data structure is a way of organizing data to support efficient operations. Choosing the right one is often the single biggest factor in whether a program is fast or slow. Core structures include arrays, linked lists, stacks, queues, hash maps, heaps, trees, and graphs.',
        complexity: 'Each structure has its own complexity profile — know the table cold for exams and interviews.',
        example:
          'A web browser uses a stack for back/forward history, a hash map for cookie storage, and a tree for the DOM.',
        bullets: [
          'Array: O(1) random access, O(n) insert/delete in the middle',
          'Hash map: O(1) average lookup, O(n) worst case under collisions',
          'Heap: O(log n) insert and extract-min for priority queues',
          'BST: O(log n) average, O(n) worst when unbalanced — use Red-Black or AVL trees'
        ],
        steps: [
          'Match operation requirements to structures (lookup? insert? ordered iteration?)',
          'Estimate dataset size and frequency of each operation',
          'Pick the structure with the best complexity for the dominant operation',
          'Consider memory overhead — linked structures are pointer-heavy',
          'Validate with benchmarks if performance is critical'
        ],
        mistakes: [
          'Defaulting to a list for everything — hash maps win on lookup-heavy workloads',
          'Picking a hash map when ordered iteration matters — use a TreeMap instead',
          'Ignoring constant-factor differences (HashMap vs TreeMap) on small n'
        ],
        tips: [
          'Build a mental cheat sheet of complexities for every operation on every structure',
          'Re-implement each structure from scratch in Java once',
          'Read the source of HashMap, ArrayList, and LinkedList in the JDK'
        ]
      },
      {
        title: 'OOP Principles',
        tag: 'Java',
        explanation:
          'Object-Oriented Programming organizes code around objects that encapsulate state and behavior. The four pillars are Encapsulation, Inheritance, Polymorphism, and Abstraction. Mastering them — and knowing when not to use them — is core to writing maintainable Java code.',
        complexity: 'N/A — these are design principles, not algorithms.',
        example:
          'A Vehicle base class with Car and Truck subclasses overriding drive() shows inheritance, polymorphism, and abstraction in one example.',
        bullets: [
          'Encapsulation: hide internal state behind methods (private fields, public getters)',
          'Inheritance: extend a base class to reuse and specialize behavior',
          'Polymorphism: call the same method on different concrete types',
          'Abstraction: expose "what" via interfaces, hide "how" in implementations'
        ],
        steps: [
          'Make fields private and expose only what callers need',
          'Use inheritance only when there is a true is-a relationship',
          'Program against interfaces, not concrete classes, to enable polymorphism',
          'Define abstract classes or interfaces for stable contracts',
          'Apply SOLID principles to keep designs flexible and testable'
        ],
        mistakes: [
          'Overusing inheritance where composition would be cleaner — favor composition over inheritance',
          'Exposing mutable internal collections via getters',
          'Creating deep inheritance hierarchies that are hard to refactor'
        ],
        tips: [
          'Learn SOLID: SRP, OCP, LSP, ISP, DIP — every Java interview asks',
          'Compare composition vs inheritance with concrete examples',
          'Read "Effective Java" by Joshua Bloch — the canonical reference'
        ]
      },
      {
        title: 'Database Basics',
        tag: 'SQL',
        explanation:
          'Relational databases organize data into tables of rows and columns related via primary and foreign keys. SQL is the standard query language for inserting, updating, and querying that data. Normalization rules reduce redundancy; indexes speed up lookups at the cost of slower writes.',
        complexity: 'Indexed lookup: O(log n) on B-tree indexes. Full table scan: O(n).',
        example:
          'A blogging platform stores users, posts, and comments in three tables joined by foreign keys; an index on posts.user_id makes per-user queries fast.',
        bullets: [
          'Primary key uniquely identifies a row; foreign key references another table\'s primary key',
          'Indexes accelerate reads but slow writes and use disk space',
          'Transactions provide ACID: Atomicity, Consistency, Isolation, Durability',
          'Normalization: 1NF (atomic columns), 2NF (no partial dependency), 3NF (no transitive dependency)'
        ],
        steps: [
          'Model entities and relationships in an ER diagram',
          'Translate the diagram into normalized tables',
          'Define keys and indexes based on the planned query patterns',
          'Write queries with explicit JOINs rather than implicit cross products',
          'Use EXPLAIN to verify the planner uses your indexes'
        ],
        mistakes: [
          'SELECT * everywhere — wastes I/O and breaks when columns change',
          'Ignoring indexes until queries are slow in production',
          'Storing comma-separated lists in a single column — violates 1NF'
        ],
        tips: [
          'Practice JOIN, GROUP BY, HAVING, and window functions on a sample dataset',
          'Learn one OLTP database (PostgreSQL) deeply before branching out',
          'Understand isolation levels: READ COMMITTED, REPEATABLE READ, SERIALIZABLE'
        ]
      },
      {
        title: 'Networking Fundamentals',
        tag: 'Systems',
        explanation:
          'The Internet runs on a layered protocol stack: link, network (IP), transport (TCP/UDP), and application (HTTP). TCP provides reliable, ordered, byte-stream delivery; UDP is unreliable but lower latency. HTTP is a request/response application protocol layered on top of TCP.',
        complexity: 'N/A — this is systems knowledge, not algorithmic complexity.',
        example:
          'Loading a web page: DNS resolves the domain, TCP opens a connection, TLS encrypts it, HTTP sends the request, the server replies, the browser renders the HTML.',
        bullets: [
          'OSI 7 layers vs TCP/IP 4-layer model — both are useful mental tools',
          'TCP: reliable, in-order, congestion controlled. UDP: best-effort, low overhead.',
          'HTTP/1.1 reuses connections; HTTP/2 multiplexes streams; HTTP/3 runs on QUIC',
          'DNS resolves names to IPs; TLS encrypts the byte stream'
        ],
        steps: [
          'Understand IP addressing and subnets (IPv4 vs IPv6)',
          'Learn the TCP three-way handshake and graceful close (SYN, ACK, FIN)',
          'Understand HTTP methods, status codes, and headers',
          'Know how DNS recursive vs iterative resolution works',
          'Trace a real request with `curl -v` or browser DevTools'
        ],
        mistakes: [
          'Confusing TCP and HTTP — TCP is the transport, HTTP is the application protocol',
          'Treating DNS as instant — it has caching, TTLs, and propagation delays',
          'Forgetting that HTTPS is HTTP over TLS, not a separate protocol'
        ],
        tips: [
          'Read the Wikipedia articles on TCP, HTTP, and DNS — they are excellent',
          'Use Wireshark to capture and inspect a real request',
          'Memorize status code classes: 2xx success, 3xx redirect, 4xx client error, 5xx server error'
        ]
      },
      {
        title: 'System Design Intro',
        tag: 'Architecture',
        explanation:
          'System design is the discipline of planning a large-scale software system: its components, data flow, scaling story, and failure modes. Interviews focus on a high-level whiteboard design rather than code. Master a few canonical systems (URL shortener, news feed, chat) and the building blocks transfer to most prompts.',
        complexity: 'N/A — design choices are evaluated on scalability, availability, and consistency, not Big O.',
        example:
          'Designing a URL shortener like bit.ly: assign each long URL a unique short ID, store the mapping in a key-value store, return a 301 redirect on lookup.',
        bullets: [
          'Key building blocks: load balancer, app servers, database, cache, queue, CDN',
          'CAP theorem: pick two of Consistency, Availability, Partition tolerance',
          'Vertical scaling (bigger machine) vs horizontal scaling (more machines)',
          'Caching strategies: write-through, write-back, write-around'
        ],
        steps: [
          'Clarify requirements: functional and non-functional (QPS, data size, latency)',
          'Estimate scale: storage, throughput, bandwidth',
          'Sketch the high-level architecture: client → load balancer → app → DB',
          'Drill into one or two components: data model, API, scaling',
          'Discuss trade-offs and bottlenecks; identify failure modes'
        ],
        mistakes: [
          'Diving into low-level details before agreeing on requirements',
          'Ignoring back-of-the-envelope estimates — interviewers expect them',
          'Choosing a tool because it is trendy instead of because it fits'
        ],
        tips: [
          'Read "Designing Data-Intensive Applications" by Martin Kleppmann',
          'Practice a fixed framework: clarify → estimate → high-level → deep dive → trade-offs',
          'Build a personal cheat sheet of building-block complexities'
        ]
      }
    ]
  }
];
