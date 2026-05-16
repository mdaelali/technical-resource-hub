export const snippets = [
  {
    id: 'binary-search',
    name: 'BinarySearch.java',
    description: 'Classic iterative binary search over a sorted int array.',
    code: `public class BinarySearch
{
    public static int search(int[] arr, int target)
    {
        int low = 0;
        int high = arr.length - 1;

        while (low <= high)
        {
            int mid = low + (high - low) / 2;

            if (arr[mid] == target)
            {
                return mid;
            }
            else if (arr[mid] < target)
            {
                low = mid + 1;
            }
            else
            {
                high = mid - 1;
            }
        }

        return -1;
    }

    public static void main(String[] args)
    {
        int[] data = { 1, 3, 5, 7, 9, 11, 13, 15 };
        System.out.println("Index of 11: " + search(data, 11));
        System.out.println("Index of 4 : " + search(data, 4));
    }
}
`,
    output: `Index of 11: 5
Index of 4 : -1`
  },
  {
    id: 'bubble-sort',
    name: 'BubbleSort.java',
    description: 'In-place bubble sort with early exit when the array is already ordered.',
    code: `public class BubbleSort
{
    public static void sort(int[] arr)
    {
        int n = arr.length;

        for (int i = 0; i < n - 1; i++)
        {
            boolean swapped = false;

            for (int j = 0; j < n - 1 - i; j++)
            {
                if (arr[j] > arr[j + 1])
                {
                    int tmp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = tmp;
                    swapped = true;
                }
            }

            if (!swapped)
            {
                break;
            }
        }
    }

    public static void main(String[] args)
    {
        int[] data = { 5, 1, 4, 2, 8 };
        sort(data);
        for (int v : data)
        {
            System.out.print(v + " ");
        }
    }
}
`,
    output: `1 2 4 5 8 `
  },
  {
    id: 'merge-sort',
    name: 'MergeSort.java',
    description: 'Top-down merge sort with a pre-allocated auxiliary buffer.',
    code: `public class MergeSort
{
    public static void sort(int[] arr)
    {
        int[] aux = new int[arr.length];
        sort(arr, aux, 0, arr.length - 1);
    }

    private static void sort(int[] arr, int[] aux, int lo, int hi)
    {
        if (lo >= hi)
        {
            return;
        }

        int mid = lo + (hi - lo) / 2;
        sort(arr, aux, lo, mid);
        sort(arr, aux, mid + 1, hi);
        merge(arr, aux, lo, mid, hi);
    }

    private static void merge(int[] arr, int[] aux, int lo, int mid, int hi)
    {
        for (int k = lo; k <= hi; k++)
        {
            aux[k] = arr[k];
        }

        int i = lo;
        int j = mid + 1;

        for (int k = lo; k <= hi; k++)
        {
            if (i > mid)
            {
                arr[k] = aux[j++];
            }
            else if (j > hi)
            {
                arr[k] = aux[i++];
            }
            else if (aux[i] <= aux[j])
            {
                arr[k] = aux[i++];
            }
            else
            {
                arr[k] = aux[j++];
            }
        }
    }

    public static void main(String[] args)
    {
        int[] data = { 7, 2, 9, 4, 1, 6, 3 };
        sort(data);
        for (int v : data)
        {
            System.out.print(v + " ");
        }
    }
}
`,
    output: `1 2 3 4 6 7 9 `
  },
  {
    id: 'fibonacci',
    name: 'Fibonacci.java',
    description: 'Bottom-up dynamic programming for the n-th Fibonacci number.',
    code: `public class Fibonacci
{
    public static long fib(int n)
    {
        if (n < 2)
        {
            return n;
        }

        long prev = 0;
        long curr = 1;

        for (int i = 2; i <= n; i++)
        {
            long next = prev + curr;
            prev = curr;
            curr = next;
        }

        return curr;
    }

    public static void main(String[] args)
    {
        for (int i = 0; i < 10; i++)
        {
            System.out.print(fib(i) + " ");
        }
    }
}
`,
    output: `0 1 1 2 3 5 8 13 21 34 `
  },
  {
    id: 'graph-bfs',
    name: 'GraphBFS.java',
    description: 'Breadth-first traversal of an unweighted adjacency-list graph.',
    code: `import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class GraphBFS
{
    public static List<Integer> bfs(List<List<Integer>> adj, int source)
    {
        List<Integer> order = new ArrayList<>();
        Set<Integer> visited = new HashSet<>();
        Deque<Integer> queue = new ArrayDeque<>();

        visited.add(source);
        queue.add(source);

        while (!queue.isEmpty())
        {
            int node = queue.poll();
            order.add(node);

            for (int next : adj.get(node))
            {
                if (visited.add(next))
                {
                    queue.add(next);
                }
            }
        }

        return order;
    }

    public static void main(String[] args)
    {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < 6; i++)
        {
            adj.add(new ArrayList<>());
        }
        adj.get(0).add(1); adj.get(0).add(2);
        adj.get(1).add(3); adj.get(2).add(4);
        adj.get(3).add(5); adj.get(4).add(5);

        System.out.println(bfs(adj, 0));
    }
}
`,
    output: `[0, 1, 2, 3, 4, 5]`
  },
  {
    id: 'recursion',
    name: 'Recursion.java',
    description: 'Recursive factorial — the canonical example of a base case plus a recursive step.',
    code: `public class Recursion
{
    public static long factorial(int n)
    {
        if (n <= 1)
        {
            return 1;
        }

        return n * factorial(n - 1);
    }

    public static void main(String[] args)
    {
        for (int i = 0; i <= 6; i++)
        {
            System.out.println(i + "! = " + factorial(i));
        }
    }
}
`,
    output: `0! = 1
1! = 1
2! = 2
3! = 6
4! = 24
5! = 120
6! = 720`
  },
  {
    id: 'two-sum',
    name: 'TwoSum.java',
    description: 'Single-pass hash-map solution that returns the indices of two numbers summing to a target.',
    code: `import java.util.HashMap;
import java.util.Map;

public class TwoSum
{
    public static int[] indices(int[] nums, int target)
    {
        Map<Integer, Integer> seen = new HashMap<>();

        for (int i = 0; i < nums.length; i++)
        {
            int complement = target - nums[i];

            if (seen.containsKey(complement))
            {
                return new int[] { seen.get(complement), i };
            }

            seen.put(nums[i], i);
        }

        return new int[] { -1, -1 };
    }

    public static void main(String[] args)
    {
        int[] nums = { 2, 7, 11, 15 };
        int[] result = indices(nums, 9);
        System.out.println("[" + result[0] + ", " + result[1] + "]");
    }
}
`,
    output: `[0, 1]`
  },
  {
    id: 'palindrome',
    name: 'Palindrome.java',
    description: 'Two-pointer palindrome check with case folding and non-alphanumeric filtering.',
    code: `public class Palindrome
{
    public static boolean isPalindrome(String s)
    {
        int left = 0;
        int right = s.length() - 1;

        while (left < right)
        {
            while (left < right && !Character.isLetterOrDigit(s.charAt(left)))
            {
                left++;
            }
            while (left < right && !Character.isLetterOrDigit(s.charAt(right)))
            {
                right--;
            }

            char a = Character.toLowerCase(s.charAt(left));
            char b = Character.toLowerCase(s.charAt(right));

            if (a != b)
            {
                return false;
            }

            left++;
            right--;
        }

        return true;
    }

    public static void main(String[] args)
    {
        System.out.println(isPalindrome("A man, a plan, a canal: Panama"));
        System.out.println(isPalindrome("race a car"));
    }
}
`,
    output: `true
false`
  },
  {
    id: 'linked-list',
    name: 'LinkedList.java',
    description: 'Iterative reversal of a singly linked list, in-place and O(1) extra memory.',
    code: `public class LinkedList
{
    static class Node
    {
        int value;
        Node next;

        Node(int value)
        {
            this.value = value;
        }
    }

    public static Node reverse(Node head)
    {
        Node prev = null;
        Node curr = head;

        while (curr != null)
        {
            Node next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }

        return prev;
    }

    public static void main(String[] args)
    {
        Node head = new Node(1);
        head.next = new Node(2);
        head.next.next = new Node(3);
        head.next.next.next = new Node(4);

        Node reversed = reverse(head);
        StringBuilder sb = new StringBuilder();
        while (reversed != null)
        {
            sb.append(reversed.value);
            if (reversed.next != null)
            {
                sb.append(" -> ");
            }
            reversed = reversed.next;
        }
        System.out.println(sb);
    }
}
`,
    output: `4 -> 3 -> 2 -> 1`
  },
  {
    id: 'stack',
    name: 'Stack.java',
    description: 'Array-backed stack with dynamic resizing and clear underflow handling.',
    code: `public class Stack
{
    private int[] data;
    private int size;

    public Stack()
    {
        this.data = new int[8];
        this.size = 0;
    }

    public void push(int value)
    {
        if (size == data.length)
        {
            int[] grown = new int[data.length * 2];
            System.arraycopy(data, 0, grown, 0, size);
            data = grown;
        }
        data[size++] = value;
    }

    public int pop()
    {
        if (size == 0)
        {
            throw new IllegalStateException("Stack is empty");
        }
        return data[--size];
    }

    public int peek()
    {
        if (size == 0)
        {
            throw new IllegalStateException("Stack is empty");
        }
        return data[size - 1];
    }

    public boolean isEmpty()
    {
        return size == 0;
    }

    public static void main(String[] args)
    {
        Stack s = new Stack();
        s.push(1);
        s.push(2);
        s.push(3);

        System.out.println("peek: " + s.peek());
        System.out.println("pop : " + s.pop());
        System.out.println("pop : " + s.pop());
        System.out.println("size: " + (s.isEmpty() ? 0 : 1));
    }
}
`,
    output: `peek: 3
pop : 3
pop : 2
size: 1`
  },
  {
    id: 'tree-traversal',
    name: 'TreeTraversal.java',
    description: 'Recursive in-order, pre-order, and post-order traversal of a binary tree.',
    code: `import java.util.ArrayList;
import java.util.List;

public class TreeTraversal
{
    static class Node
    {
        int value;
        Node left;
        Node right;

        Node(int value)
        {
            this.value = value;
        }
    }

    public static List<Integer> inOrder(Node root)
    {
        List<Integer> out = new ArrayList<>();
        walkInOrder(root, out);
        return out;
    }

    private static void walkInOrder(Node node, List<Integer> out)
    {
        if (node == null)
        {
            return;
        }
        walkInOrder(node.left, out);
        out.add(node.value);
        walkInOrder(node.right, out);
    }

    public static void main(String[] args)
    {
        //        4
        //       / \\
        //      2   6
        //     / \\ / \\
        //    1  3 5  7
        Node root = new Node(4);
        root.left = new Node(2);
        root.right = new Node(6);
        root.left.left = new Node(1);
        root.left.right = new Node(3);
        root.right.left = new Node(5);
        root.right.right = new Node(7);

        System.out.println(inOrder(root));
    }
}
`,
    output: `[1, 2, 3, 4, 5, 6, 7]`
  }
];
