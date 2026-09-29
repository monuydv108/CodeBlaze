import { useState, useEffect, useRef } from 'react';
import { NavLink, useParams } from 'react-router';

/* ══════════════════════════════════════════════════════════════════════════
   CODE EXAMPLES
   ══════════════════════════════════════════════════════════════════════════ */
const CODE = {
  'array-two-sum': {
    javascript: `// Two Sum — Hash Map O(n)
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

// Example
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]`,
    java: `// Two Sum — Hash Map O(n)
import java.util.HashMap;

class Solution {
  public int[] twoSum(int[] nums, int target) {
    HashMap<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
      int complement = target - nums[i];
      if (map.containsKey(complement)) {
        return new int[]{map.get(complement), i};
      }
      map.put(nums[i], i);
    }
    return new int[]{};
  }
}`,
    cpp: `// Two Sum — Hash Map O(n)
#include <unordered_map>
#include <vector>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
  unordered_map<int, int> map;
  for (int i = 0; i < nums.size(); i++) {
    int complement = target - nums[i];
    if (map.count(complement)) {
      return {map[complement], i};
    }
    map[nums[i]] = i;
  }
  return {};
}`,
  },
  'array-kadane': {
    javascript: `// Kadane's Algorithm — Maximum Subarray O(n)
function maxSubArray(nums) {
  let maxSum = nums[0];
  let currentSum = nums[0];

  for (let i = 1; i < nums.length; i++) {
    // Either extend current subarray or start fresh
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}

// Example: [-2,1,-3,4,-1,2,1,-5,4] → 6 (subarray [4,-1,2,1])
console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]));`,
    java: `// Kadane's Algorithm — Maximum Subarray O(n)
class Solution {
  public int maxSubArray(int[] nums) {
    int maxSum = nums[0];
    int currentSum = nums[0];

    for (int i = 1; i < nums.length; i++) {
      currentSum = Math.max(nums[i], currentSum + nums[i]);
      maxSum = Math.max(maxSum, currentSum);
    }
    return maxSum;
  }
}`,
    cpp: `// Kadane's Algorithm — Maximum Subarray O(n)
#include <algorithm>
#include <vector>
using namespace std;

int maxSubArray(vector<int>& nums) {
  int maxSum = nums[0];
  int currentSum = nums[0];

  for (int i = 1; i < nums.size(); i++) {
    currentSum = max(nums[i], currentSum + nums[i]);
    maxSum = max(maxSum, currentSum);
  }
  return maxSum;
}`,
  },
  'array-prefix': {
    javascript: `// Prefix Sum — Range Sum Query O(1) after O(n) build
function buildPrefix(nums) {
  const prefix = [0];
  for (let i = 0; i < nums.length; i++) {
    prefix.push(prefix[i] + nums[i]);
  }
  return prefix;
}

function rangeSum(prefix, l, r) {
  return prefix[r + 1] - prefix[l];
}

// Example
const nums = [2, 4, 1, 6, 3];
const prefix = buildPrefix(nums); // [0,2,6,7,13,16]
console.log(rangeSum(prefix, 1, 3)); // 4+1+6 = 11`,
    java: `// Prefix Sum — Range Sum Query
class PrefixSum {
  int[] prefix;

  PrefixSum(int[] nums) {
    prefix = new int[nums.length + 1];
    for (int i = 0; i < nums.length; i++) {
      prefix[i + 1] = prefix[i] + nums[i];
    }
  }

  int rangeSum(int l, int r) {
    return prefix[r + 1] - prefix[l];
  }
}`,
    cpp: `// Prefix Sum — Range Sum Query
#include <vector>
using namespace std;

vector<int> buildPrefix(vector<int>& nums) {
  vector<int> prefix(nums.size() + 1, 0);
  for (int i = 0; i < nums.size(); i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }
  return prefix;
}

int rangeSum(vector<int>& prefix, int l, int r) {
  return prefix[r + 1] - prefix[l];
}`,
  },
  'linkedlist-reverse': {
    javascript: `// Reverse Linked List — O(n) time, O(1) space
class ListNode {
  constructor(val, next = null) {
    this.val = val; this.next = next;
  }
}

function reverseList(head) {
  let prev = null;
  let curr = head;

  while (curr !== null) {
    const next = curr.next; // save next
    curr.next = prev;       // reverse pointer
    prev = curr;            // move prev forward
    curr = next;            // move curr forward
  }
  return prev; // prev is new head
}`,
    java: `// Reverse Linked List — O(n) time, O(1) space
class Solution {
  public ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode curr = head;

    while (curr != null) {
      ListNode next = curr.next;
      curr.next = prev;
      prev = curr;
      curr = next;
    }
    return prev;
  }
}`,
    cpp: `// Reverse Linked List — O(n) time, O(1) space
struct ListNode {
  int val;
  ListNode* next;
  ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* reverseList(ListNode* head) {
  ListNode* prev = nullptr;
  ListNode* curr = head;

  while (curr) {
    ListNode* next = curr->next;
    curr->next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,
  },
  'linkedlist-cycle': {
    javascript: `// Floyd's Cycle Detection — O(n) time, O(1) space
function hasCycle(head) {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow.next;       // moves 1 step
    fast = fast.next.next;  // moves 2 steps

    if (slow === fast) return true; // cycle detected!
  }
  return false;
}

// Find cycle start
function detectCycle(head) {
  let slow = head, fast = head;
  while (fast?.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {
      // Reset slow to head, both move 1 step to find entry
      slow = head;
      while (slow !== fast) {
        slow = slow.next;
        fast = fast.next;
      }
      return slow; // cycle entry point
    }
  }
  return null;
}`,
    java: `// Floyd's Cycle Detection
class Solution {
  public boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
      slow = slow.next;
      fast = fast.next.next;
      if (slow == fast) return true;
    }
    return false;
  }

  public ListNode detectCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
      slow = slow.next;
      fast = fast.next.next;
      if (slow == fast) {
        slow = head;
        while (slow != fast) {
          slow = slow.next;
          fast = fast.next;
        }
        return slow;
      }
    }
    return null;
  }
}`,
    cpp: `// Floyd's Cycle Detection
bool hasCycle(ListNode* head) {
  ListNode* slow = head;
  ListNode* fast = head;
  while (fast && fast->next) {
    slow = slow->next;
    fast = fast->next->next;
    if (slow == fast) return true;
  }
  return false;
}`,
  },
  'stack-parentheses': {
    javascript: `// Valid Parentheses — O(n) time, O(n) space
function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };

  for (const char of s) {
    if ('({['.includes(char)) {
      stack.push(char);        // push openers
    } else {
      if (stack.pop() !== map[char]) return false; // mismatch
    }
  }
  return stack.length === 0; // stack must be empty
}

// Examples
console.log(isValid("()[]{}"));  // true
console.log(isValid("([)]"));    // false
console.log(isValid("{[]}"));    // true`,
    java: `// Valid Parentheses
import java.util.Stack;

class Solution {
  public boolean isValid(String s) {
    Stack<Character> stack = new Stack<>();
    for (char c : s.toCharArray()) {
      if (c == '(' || c == '{' || c == '[') {
        stack.push(c);
      } else {
        if (stack.isEmpty()) return false;
        char top = stack.pop();
        if (c == ')' && top != '(') return false;
        if (c == '}' && top != '{') return false;
        if (c == ']' && top != '[') return false;
      }
    }
    return stack.isEmpty();
  }
}`,
    cpp: `// Valid Parentheses
#include <stack>
#include <string>
using namespace std;

bool isValid(string s) {
  stack<char> st;
  for (char c : s) {
    if (c == '(' || c == '{' || c == '[') {
      st.push(c);
    } else {
      if (st.empty()) return false;
      char top = st.top(); st.pop();
      if (c == ')' && top != '(') return false;
      if (c == '}' && top != '{') return false;
      if (c == ']' && top != '[') return false;
    }
  }
  return st.empty();
}`,
  },
  'stack-nge': {
    javascript: `// Next Greater Element — Monotonic Stack O(n)
function nextGreaterElement(nums) {
  const n = nums.length;
  const result = new Array(n).fill(-1);
  const stack = []; // stores indices

  for (let i = 0; i < n; i++) {
    // Pop all elements smaller than current
    while (stack.length && nums[stack[stack.length-1]] < nums[i]) {
      const idx = stack.pop();
      result[idx] = nums[i]; // current is NGE for popped
    }
    stack.push(i);
  }
  return result;
}

// [2,1,2,4,3] → [4,2,4,-1,-1]
console.log(nextGreaterElement([2,1,2,4,3]));`,
    java: `// Next Greater Element — Monotonic Stack O(n)
import java.util.Stack;
import java.util.Arrays;

class Solution {
  public int[] nextGreaterElement(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];
    Arrays.fill(result, -1);
    Stack<Integer> stack = new Stack<>();

    for (int i = 0; i < n; i++) {
      while (!stack.isEmpty() && nums[stack.peek()] < nums[i]) {
        result[stack.pop()] = nums[i];
      }
      stack.push(i);
    }
    return result;
  }
}`,
    cpp: `// Next Greater Element — Monotonic Stack O(n)
#include <stack>
#include <vector>
using namespace std;

vector<int> nextGreaterElement(vector<int>& nums) {
  int n = nums.size();
  vector<int> result(n, -1);
  stack<int> st;

  for (int i = 0; i < n; i++) {
    while (!st.empty() && nums[st.top()] < nums[i]) {
      result[st.top()] = nums[i];
      st.pop();
    }
    st.push(i);
  }
  return result;
}`,
  },
  'binarysearch-basic': {
    javascript: `// Binary Search — O(log n)
function binarySearch(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);

    if (nums[mid] === target) return mid;
    else if (nums[mid] < target) left = mid + 1;  // go right
    else right = mid - 1;                          // go left
  }
  return -1; // not found
}

// Find first occurrence (Lower Bound)
function lowerBound(nums, target) {
  let lo = 0, hi = nums.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}`,
    java: `// Binary Search — O(log n)
class Solution {
  public int search(int[] nums, int target) {
    int left = 0, right = nums.length - 1;

    while (left <= right) {
      int mid = left + (right - left) / 2;
      if (nums[mid] == target) return mid;
      else if (nums[mid] < target) left = mid + 1;
      else right = mid - 1;
    }
    return -1;
  }

  // Lower bound — first index >= target
  public int lowerBound(int[] nums, int target) {
    int lo = 0, hi = nums.length;
    while (lo < hi) {
      int mid = (lo + hi) / 2;
      if (nums[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }
}`,
    cpp: `// Binary Search — O(log n)
#include <vector>
using namespace std;

int binarySearch(vector<int>& nums, int target) {
  int left = 0, right = nums.size() - 1;

  while (left <= right) {
    int mid = left + (right - left) / 2;
    if (nums[mid] == target) return mid;
    else if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

// STL: lower_bound(nums.begin(), nums.end(), target)`,
  },
  'dp-fibonacci': {
    javascript: `// Fibonacci — 3 approaches

// 1. Naive recursion O(2^n)
function fibRecursive(n) {
  if (n <= 1) return n;
  return fibRecursive(n-1) + fibRecursive(n-2);
}

// 2. Memoization O(n) time, O(n) space
function fibMemo(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  memo[n] = fibMemo(n-1, memo) + fibMemo(n-2, memo);
  return memo[n];
}

// 3. Tabulation O(n) time, O(1) space
function fibDP(n) {
  if (n <= 1) return n;
  let prev2 = 0, prev1 = 1;
  for (let i = 2; i <= n; i++) {
    const curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}`,
    java: `// Fibonacci DP
class Solution {
  // Memoization
  public int fibMemo(int n, int[] memo) {
    if (n <= 1) return n;
    if (memo[n] != 0) return memo[n];
    memo[n] = fibMemo(n-1, memo) + fibMemo(n-2, memo);
    return memo[n];
  }

  // Tabulation O(1) space
  public int fib(int n) {
    if (n <= 1) return n;
    int prev2 = 0, prev1 = 1;
    for (int i = 2; i <= n; i++) {
      int curr = prev1 + prev2;
      prev2 = prev1;
      prev1 = curr;
    }
    return prev1;
  }
}`,
    cpp: `// Fibonacci DP
// Tabulation O(n) time, O(1) space
int fib(int n) {
  if (n <= 1) return n;
  int prev2 = 0, prev1 = 1;
  for (int i = 2; i <= n; i++) {
    int curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}`,
  },
  'tree-traversal': {
    javascript: `// Tree Traversals — all four
class TreeNode {
  constructor(val, left=null, right=null) {
    this.val=val; this.left=left; this.right=right;
  }
}

// Inorder: Left → Root → Right (sorted for BST)
function inorder(root, result=[]) {
  if (!root) return result;
  inorder(root.left, result);
  result.push(root.val);
  inorder(root.right, result);
  return result;
}

// Preorder: Root → Left → Right (copy tree)
function preorder(root, result=[]) {
  if (!root) return result;
  result.push(root.val);
  preorder(root.left, result);
  preorder(root.right, result);
  return result;
}

// Level Order BFS
function levelOrder(root) {
  if (!root) return [];
  const queue = [root], result = [];
  while (queue.length) {
    const level = [];
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left)  queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}`,
    java: `// Tree Traversals
import java.util.*;

class Solution {
  // Inorder: Left → Root → Right
  public List<Integer> inorderTraversal(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    inorder(root, result);
    return result;
  }

  private void inorder(TreeNode node, List<Integer> res) {
    if (node == null) return;
    inorder(node.left, res);
    res.add(node.val);
    inorder(node.right, res);
  }

  // Level Order BFS
  public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    while (!queue.isEmpty()) {
      int size = queue.size();
      List<Integer> level = new ArrayList<>();
      for (int i = 0; i < size; i++) {
        TreeNode node = queue.poll();
        level.add(node.val);
        if (node.left != null) queue.offer(node.left);
        if (node.right != null) queue.offer(node.right);
      }
      result.add(level);
    }
    return result;
  }
}`,
    cpp: `// Tree Traversals
#include <vector>
#include <queue>
using namespace std;

// Inorder: sorted output for BST
void inorder(TreeNode* root, vector<int>& res) {
  if (!root) return;
  inorder(root->left, res);
  res.push_back(root->val);
  inorder(root->right, res);
}

// Level Order BFS
vector<vector<int>> levelOrder(TreeNode* root) {
  vector<vector<int>> result;
  if (!root) return result;
  queue<TreeNode*> q;
  q.push(root);
  while (!q.empty()) {
    int size = q.size();
    vector<int> level;
    for (int i = 0; i < size; i++) {
      TreeNode* node = q.front(); q.pop();
      level.push_back(node->val);
      if (node->left) q.push(node->left);
      if (node->right) q.push(node->right);
    }
    result.push_back(level);
  }
  return result;
}`,
  },
  'graph-bfs': {
    javascript: `// BFS — Shortest Path in Unweighted Graph
function bfs(graph, start) {
  const visited = new Set([start]);
  const queue   = [start];
  const dist    = { [start]: 0 };

  while (queue.length) {
    const node = queue.shift();

    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        dist[neighbor] = dist[node] + 1;
        queue.push(neighbor);
      }
    }
  }
  return dist;
}

// Number of Islands — BFS
function numIslands(grid) {
  let count = 0;
  const rows = grid.length, cols = grid[0].length;

  function bfsIsland(r, c) {
    const queue = [[r, c]];
    grid[r][c] = '0';
    const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
    while (queue.length) {
      const [row, col] = queue.shift();
      for (const [dr, dc] of dirs) {
        const nr = row+dr, nc = col+dc;
        if (nr>=0 && nr<rows && nc>=0 && nc<cols && grid[nr][nc]==='1') {
          grid[nr][nc] = '0';
          queue.push([nr, nc]);
        }
      }
    }
  }

  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (grid[r][c] === '1') { bfsIsland(r,c); count++; }

  return count;
}`,
    java: `// BFS — Graph Traversal
import java.util.*;

class Solution {
  public Map<Integer, Integer> bfs(Map<Integer, List<Integer>> graph, int start) {
    Map<Integer, Integer> dist = new HashMap<>();
    Queue<Integer> queue = new LinkedList<>();
    dist.put(start, 0);
    queue.offer(start);

    while (!queue.isEmpty()) {
      int node = queue.poll();
      for (int neighbor : graph.getOrDefault(node, List.of())) {
        if (!dist.containsKey(neighbor)) {
          dist.put(neighbor, dist.get(node) + 1);
          queue.offer(neighbor);
        }
      }
    }
    return dist;
  }
}`,
    cpp: `// BFS — Graph Traversal
#include <queue>
#include <unordered_map>
#include <vector>
using namespace std;

unordered_map<int,int> bfs(
  unordered_map<int, vector<int>>& graph, int start
) {
  unordered_map<int,int> dist;
  queue<int> q;
  dist[start] = 0;
  q.push(start);

  while (!q.empty()) {
    int node = q.front(); q.pop();
    for (int neighbor : graph[node]) {
      if (!dist.count(neighbor)) {
        dist[neighbor] = dist[node] + 1;
        q.push(neighbor);
      }
    }
  }
  return dist;
}`,
  },
  'sorting-merge': {
    javascript: `// Merge Sort — O(n log n) stable sort
function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid   = Math.floor(arr.length / 2);
  const left  = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else                      result.push(right[j++]);
  }
  return [...result, ...left.slice(i), ...right.slice(j)];
}

// [38, 27, 43, 3] → [3, 27, 38, 43]
console.log(mergeSort([38, 27, 43, 3, 9, 82, 10]));`,
    java: `// Merge Sort — O(n log n)
class Solution {
  public void mergeSort(int[] arr, int left, int right) {
    if (left >= right) return;
    int mid = (left + right) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
  }

  private void merge(int[] arr, int l, int m, int r) {
    int[] temp = new int[r - l + 1];
    int i = l, j = m + 1, k = 0;
    while (i <= m && j <= r) {
      if (arr[i] <= arr[j]) temp[k++] = arr[i++];
      else temp[k++] = arr[j++];
    }
    while (i <= m) temp[k++] = arr[i++];
    while (j <= r)  temp[k++] = arr[j++];
    for (int idx = 0; idx < temp.length; idx++)
      arr[l + idx] = temp[idx];
  }
}`,
    cpp: `// Merge Sort — O(n log n)
#include <vector>
using namespace std;

void merge(vector<int>& arr, int l, int m, int r) {
  vector<int> temp;
  int i = l, j = m + 1;
  while (i <= m && j <= r) {
    if (arr[i] <= arr[j]) temp.push_back(arr[i++]);
    else temp.push_back(arr[j++]);
  }
  while (i <= m) temp.push_back(arr[i++]);
  while (j <= r)  temp.push_back(arr[j++]);
  for (int k = 0; k < temp.size(); k++)
    arr[l + k] = temp[k];
}

void mergeSort(vector<int>& arr, int l, int r) {
  if (l >= r) return;
  int mid = (l + r) / 2;
  mergeSort(arr, l, mid);
  mergeSort(arr, mid + 1, r);
  merge(arr, l, mid, r);
}`,
  },
  'hashing-basic': {
    javascript: `// Hash Map patterns

// 1. Frequency Count
function frequencyCount(arr) {
  const freq = new Map();
  for (const num of arr) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }
  return freq;
}

// 2. Group Anagrams
function groupAnagrams(strs) {
  const map = new Map();
  for (const str of strs) {
    const key = str.split('').sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(str);
  }
  return [...map.values()];
}

// 3. Subarray Sum Equals K (prefix sum + hash)
function subarraySum(nums, k) {
  const map = new Map([[0, 1]]);
  let count = 0, prefixSum = 0;
  for (const num of nums) {
    prefixSum += num;
    count += (map.get(prefixSum - k) || 0);
    map.set(prefixSum, (map.get(prefixSum) || 0) + 1);
  }
  return count;
}`,
    java: `// Hash Map patterns
import java.util.*;

class Solution {
  // Group Anagrams
  public List<List<String>> groupAnagrams(String[] strs) {
    Map<String, List<String>> map = new HashMap<>();
    for (String str : strs) {
      char[] chars = str.toCharArray();
      Arrays.sort(chars);
      String key = new String(chars);
      map.computeIfAbsent(key, k -> new ArrayList<>()).add(str);
    }
    return new ArrayList<>(map.values());
  }

  // Subarray Sum Equals K
  public int subarraySum(int[] nums, int k) {
    Map<Integer, Integer> map = new HashMap<>();
    map.put(0, 1);
    int count = 0, prefixSum = 0;
    for (int num : nums) {
      prefixSum += num;
      count += map.getOrDefault(prefixSum - k, 0);
      map.merge(prefixSum, 1, Integer::sum);
    }
    return count;
  }
}`,
    cpp: `// Hash Map patterns
#include <unordered_map>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

// Group Anagrams
vector<vector<string>> groupAnagrams(vector<string>& strs) {
  unordered_map<string, vector<string>> map;
  for (auto& str : strs) {
    string key = str;
    sort(key.begin(), key.end());
    map[key].push_back(str);
  }
  vector<vector<string>> result;
  for (auto& [k, v] : map) result.push_back(v);
  return result;
}`,
  },
  'bitmask-basic': {
    javascript: `// Bit Manipulation essentials

const ops = {
  // Check if i-th bit is set
  isSet:    (n, i) => (n >> i) & 1,
  // Set i-th bit
  set:      (n, i) => n | (1 << i),
  // Clear i-th bit
  clear:    (n, i) => n & ~(1 << i),
  // Toggle i-th bit
  toggle:   (n, i) => n ^ (1 << i),
  // Count set bits (Brian Kernighan)
  countBits:(n) => { let c=0; while(n){n &= n-1; c++;} return c; },
  // Check power of 2
  isPow2:   (n) => n > 0 && (n & (n-1)) === 0,
};

// Find single number in array where all others appear twice
function singleNumber(nums) {
  return nums.reduce((xor, n) => xor ^ n, 0); // XOR of same = 0
}

// Generate all subsets using bitmask
function subsets(nums) {
  const n = nums.length;
  const result = [];
  for (let mask = 0; mask < (1 << n); mask++) {
    const subset = [];
    for (let i = 0; i < n; i++) {
      if ((mask >> i) & 1) subset.push(nums[i]);
    }
    result.push(subset);
  }
  return result;
}`,
    java: `// Bit Manipulation
class Solution {
  // Single Number — XOR trick
  public int singleNumber(int[] nums) {
    int xor = 0;
    for (int num : nums) xor ^= num;
    return xor;
  }

  // Count set bits — Brian Kernighan
  public int hammingWeight(int n) {
    int count = 0;
    while (n != 0) { n &= (n - 1); count++; }
    return count;
  }

  // Power of two
  public boolean isPowerOfTwo(int n) {
    return n > 0 && (n & (n - 1)) == 0;
  }

  // All subsets
  public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    int n = nums.length;
    for (int mask = 0; mask < (1 << n); mask++) {
      List<Integer> subset = new ArrayList<>();
      for (int i = 0; i < n; i++)
        if (((mask >> i) & 1) == 1) subset.add(nums[i]);
      result.add(subset);
    }
    return result;
  }
}`,
    cpp: `// Bit Manipulation
#include <vector>
using namespace std;

// Single Number — XOR
int singleNumber(vector<int>& nums) {
  int xor_val = 0;
  for (int n : nums) xor_val ^= n;
  return xor_val;
}

// Count set bits
int countBits(int n) {
  int count = 0;
  while (n) { n &= n - 1; count++; }
  return count;
}

// All subsets O(n * 2^n)
vector<vector<int>> subsets(vector<int>& nums) {
  int n = nums.size();
  vector<vector<int>> result;
  for (int mask = 0; mask < (1 << n); mask++) {
    vector<int> subset;
    for (int i = 0; i < n; i++)
      if ((mask >> i) & 1) subset.push_back(nums[i]);
    result.push_back(subset);
  }
  return result;
}`,
  },
};

/* ══════════════════════════════════════════════════════════════════════════
   TOPIC DATA
   ══════════════════════════════════════════════════════════════════════════ */
const TOPIC_DATA = {
  'arrays': {
    title: 'Arrays', color: '#6c8ef7', bg: 'rgba(108,142,247,0.08)', border: 'rgba(108,142,247,0.25)', difficulty: 'Beginner',
    timeComplexity: { Access: 'O(1)', Search: 'O(n)', Insert: 'O(n)', Delete: 'O(n)' }, spaceComplexity: 'O(n)',
    intro: `An array is the most fundamental data structure — a fixed-size, contiguous block of memory holding elements of the same type. Because memory is contiguous, CPU caching works extremely well, making array traversal one of the fastest operations in computing.

The address of arr[i] is always: base_address + (i × element_size). This formula makes O(1) random access possible. However, insertion/deletion in the middle requires shifting elements — O(n) in the worst case.

Arrays underpin almost every other data structure: stacks, queues, heaps, and hash tables are often implemented using arrays internally.`,
    sections: [
      {
        title: 'Memory Layout & Indexing', visualizer: 'array-memory',
        content: `When you declare int arr[7], the OS allocates 7 × 4 = 28 bytes at a contiguous address. arr[3] is at base + 12 — computed in one arithmetic operation, hence O(1) access no matter the size.

This makes arrays cache-friendly: when you access arr[i], the CPU pre-fetches arr[i+1], arr[i+2]... into L1 cache automatically (spatial locality).

Contrast with linked lists — nodes are scattered in memory, causing frequent cache misses.`,
      },
      {
        title: 'Two Pointer Technique', visualizer: 'two-pointer',
        content: `Two pointers solve pair/subarray problems on sorted arrays in O(n) instead of O(n²). Place one pointer at start, one at end. At each step, move one pointer based on the current sum vs target.

Why it works: in a sorted array, if sum is too small, increasing left pointer increases the sum. If too large, decreasing right pointer decreases it. Together they cover all relevant pairs.

Key problems: Two Sum (sorted), Container With Most Water, 3Sum, Valid Palindrome.`,
        code: 'array-two-sum',
      },
      {
        title: 'Sliding Window', visualizer: 'sliding-window',
        content: `A sliding window maintains a contiguous subarray and "slides" it across, adding one element on the right and removing one on the left. This avoids recomputing the window from scratch.

Fixed window: maintain a window of exactly k elements.
Variable window: expand/shrink based on a condition (e.g., longest subarray with sum ≤ k).

Time: O(n) — each element enters and leaves the window at most once.`,
      },
      {
        title: 'Prefix Sum', visualizer: 'prefix-sum',
        content: `prefix[i] = arr[0] + arr[1] + ... + arr[i]. Build this in O(n) once. Then any range sum query [l, r] = prefix[r] - prefix[l-1] in O(1).

This is transformative for problems like: subarray sum equals k, number of subarrays with even sum, and 2D range sum queries.

Extension: prefix XOR, prefix product — same concept applied to other operations.`,
        code: 'array-prefix',
      },
      {
        title: "Kadane's Algorithm", visualizer: 'kadane',
        content: `Maximum Subarray: find the contiguous subarray with the largest sum. Naive approach: O(n³) check all subarrays. Kadane's insight: at each position, either extend the existing subarray or start fresh.

currentSum = max(arr[i], currentSum + arr[i])
maxSum = max(maxSum, currentSum)

This is actually a 1D DP problem disguised as a greedy algorithm. Time: O(n), Space: O(1).`,
        code: 'array-kadane',
      },
    ],
    keyPoints: [
      'O(1) random access via index arithmetic: address = base + (i × size)',
      'Insertion/deletion at middle: O(n) due to element shifting',
      'Cache-friendly: spatial locality means CPU prefetches adjacent elements',
      'Two pointers: solve pair problems in O(n) on sorted arrays',
      'Sliding window: O(n) for subarray problems — each element enters/exits once',
      'Prefix sum: O(n) precompute → O(1) range queries',
      "Kadane's: max subarray in O(n) — extend or restart at each position",
    ],
    commonProblems: [
      { name: 'Two Sum', difficulty: 'easy' },
      { name: 'Best Time to Buy and Sell Stock', difficulty: 'easy' },
      { name: 'Maximum Subarray (Kadane\'s)', difficulty: 'medium' },
      { name: 'Product of Array Except Self', difficulty: 'medium' },
      { name: 'Container With Most Water', difficulty: 'medium' },
      { name: 'Subarray Sum Equals K', difficulty: 'medium' },
      { name: 'Trapping Rain Water', difficulty: 'hard' },
    ],
  },

  'linked-list': {
    title: 'Linked List', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', difficulty: 'Beginner',
    timeComplexity: { Access: 'O(n)', Search: 'O(n)', Insert: 'O(1)', Delete: 'O(1)' }, spaceComplexity: 'O(n)',
    intro: `A linked list is a linear data structure where elements (nodes) are stored at non-contiguous memory addresses. Each node holds data and a pointer to the next node. The last node points to null.

Unlike arrays, linked lists don't require contiguous memory, making dynamic resizing free. But you pay for it: no random access, extra memory per node for the pointer (8 bytes on 64-bit systems), and poor cache locality.

Variants: Singly linked (→), Doubly linked (↔), Circular. Used to implement stacks, queues, adjacency lists, and LRU caches.`,
    sections: [
      {
        title: 'Node Structure & Traversal', visualizer: 'linked-list-nodes',
        content: `A node struct: { data, next }. Head points to the first node. To visit all nodes, follow next pointers until null — O(n).

Singly linked: can only go forward.
Doubly linked: each node has prev and next — O(1) deletion given node pointer, but 2× memory for pointers.

Sentinel/dummy nodes: adding a dummy head node simplifies edge cases (empty list, deleting head). Common interview technique.`,
      },
      {
        title: 'Reversal — Three Pointers', visualizer: 'linked-list-reverse',
        content: `Reversing requires tracking three pointers simultaneously: prev (starts null), curr (starts head), next (temp save).

At each step:
1. Save curr.next into next
2. Point curr.next to prev (reverse the arrow)
3. Advance prev to curr
4. Advance curr to saved next

After n steps, prev points to the new head. O(n) time, O(1) space.`,
        code: 'linkedlist-reverse',
      },
      {
        title: "Floyd's Cycle Detection", visualizer: 'floyd-cycle',
        content: `Two runners: slow moves 1 step, fast moves 2 steps. If a cycle exists, fast will enter it first and lap slow — they must meet inside the cycle.

Proof: once both are in the cycle of length L, the distance between them decreases by 1 each step, so they meet in at most L steps.

To find cycle entry: reset slow to head, keep fast at meeting point, advance both 1 step at a time — they meet at the cycle start. (Based on mathematical proof involving μ and λ of the sequence.)`,
        code: 'linkedlist-cycle',
      },
    ],
    keyPoints: [
      'No random access — must traverse from head: O(n)',
      'O(1) insertion/deletion given a node pointer (just update pointers)',
      'Doubly linked list: O(1) backward traversal, 2× pointer memory',
      'Dummy/sentinel head simplifies edge cases significantly',
      "Floyd's algorithm: cycle detection in O(n) time, O(1) space",
      'Reverse in O(n) time O(1) space using three pointers (prev/curr/next)',
      'LRU Cache = HashMap + Doubly Linked List for O(1) get/put',
    ],
    commonProblems: [
      { name: 'Reverse Linked List', difficulty: 'easy' },
      { name: 'Detect Cycle (Floyd\'s)', difficulty: 'easy' },
      { name: 'Merge Two Sorted Lists', difficulty: 'easy' },
      { name: 'Find Middle of Linked List', difficulty: 'easy' },
      { name: 'Remove N-th Node From End', difficulty: 'medium' },
      { name: 'LRU Cache', difficulty: 'medium' },
      { name: 'Reverse Nodes in k-Group', difficulty: 'hard' },
    ],
  },

  'stack': {
    title: 'Stack', color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.25)', difficulty: 'Beginner',
    timeComplexity: { Push: 'O(1)', Pop: 'O(1)', Peek: 'O(1)', Search: 'O(n)' }, spaceComplexity: 'O(n)',
    intro: `A stack is a Last In, First Out (LIFO) data structure. Imagine a stack of plates — you add and remove from the top only. The three core operations are push (add to top), pop (remove from top), and peek/top (view top without removing).

Stacks are implemented with an array (using a top-index variable) or a linked list. Array-based stacks have better cache performance; linked list stacks support unlimited size.

Stacks are everywhere in computing: the CPU call stack (function calls/returns), expression evaluation (compilers), browser history (back button), undo/redo in editors.`,
    sections: [
      {
        title: 'Push, Pop & Peek', visualizer: 'stack-ops',
        content: `Array-based: maintain a top index. push increments top and writes; pop reads and decrements top; peek reads without decrement. All O(1).

Stack overflow: pushing beyond capacity (fixed array). Stack underflow: popping an empty stack.

In most languages: JavaScript array (push/pop), Java Stack/Deque, C++ std::stack.`,
      },
      {
        title: 'Balanced Parentheses', visualizer: 'stack-parentheses',
        content: `Algorithm: scan left to right. Push opening brackets onto stack. When a closing bracket is encountered, check if the stack top is the matching opener. If not — invalid. After full scan, stack must be empty.

This works because LIFO matches the nesting structure of brackets: the most recently opened bracket must be the next one to close.

Extension: this exact idea handles XML/HTML tag validation, compiler syntax checking, and mathematical expression parsing.`,
        code: 'stack-parentheses',
      },
      {
        title: 'Monotonic Stack — Next Greater Element', visualizer: 'monotonic-stack',
        content: `A monotonic stack maintains elements in strictly increasing or decreasing order. When a new element violates the order, we pop until the invariant is restored.

For Next Greater Element: iterate left to right. Maintain a decreasing stack of indices. When nums[i] > nums[stack.top()], we found the NGE for stack.top() — pop and record.

This gives O(n) time — each element is pushed and popped at most once.

Uses: Stock Span, Daily Temperatures, Largest Rectangle in Histogram.`,
        code: 'stack-nge',
      },
    ],
    keyPoints: [
      'LIFO — Last In, First Out. All operations on the top only',
      'Push/pop/peek: O(1) — constant time regardless of stack size',
      'Function calls use the system call stack (stack frames)',
      'DFS on graphs naturally maps to stack (or recursion = implicit stack)',
      'Monotonic stack: solve NGE-type problems in O(n), not O(n²)',
      'Expression evaluation: postfix notation uses a single stack',
      'Browser back button, undo/redo — all stack-based',
    ],
    commonProblems: [
      { name: 'Valid Parentheses', difficulty: 'easy' },
      { name: 'Min Stack', difficulty: 'medium' },
      { name: 'Next Greater Element', difficulty: 'medium' },
      { name: 'Daily Temperatures', difficulty: 'medium' },
      { name: 'Evaluate Reverse Polish Notation', difficulty: 'medium' },
      { name: 'Largest Rectangle in Histogram', difficulty: 'hard' },
      { name: 'Trapping Rain Water (stack approach)', difficulty: 'hard' },
    ],
  },

  'binary-search': {
    title: 'Binary Search', color: '#38bdf8', bg: 'rgba(56,189,248,0.08)', border: 'rgba(56,189,248,0.25)', difficulty: 'Intermediate',
    timeComplexity: { Search: 'O(log n)', 'Lower Bound': 'O(log n)', 'Upper Bound': 'O(log n)', Insert: 'O(n)' }, spaceComplexity: 'O(1)',
    intro: `Binary search divides a sorted search space in half at each step. With n=1,000,000,000 elements, binary search finds the answer in at most 30 comparisons (log₂ of 10⁹ ≈ 30).

The key insight: if the array is sorted and we compare against the middle element, we can eliminate half the remaining candidates — either the left half or the right half is impossible.

Binary search isn't just for arrays — it applies to any monotonic function. "Search on Answer" is a powerful technique: instead of searching for a value in an array, binary search on the answer space.`,
    sections: [
      {
        title: 'Classic Binary Search', visualizer: 'binary-search-viz',
        content: `Three-variable template: left, right, mid. Invariant: answer always lies in [left, right].

Pitfall: mid = (left + right) / 2 can overflow for large integers in C++/Java. Use: mid = left + (right - left) / 2 instead.

Template 1: while (left <= right) — exact match search.
Template 2: while (left < right) — boundary/condition search.
Template 3: Predicate binary search for lower_bound/upper_bound.`,
        code: 'binarysearch-basic',
      },
      {
        title: 'Lower & Upper Bound', visualizer: 'binary-search-bound',
        content: `Lower bound: first index where arr[i] >= target.
Upper bound: first index where arr[i] > target.

These two primitives solve: count occurrences of target = upper_bound - lower_bound. Find insertion position. Find range of a value in sorted array.

C++ STL: std::lower_bound, std::upper_bound. Java: Arrays.binarySearch.`,
      },
      {
        title: 'Search on Answer', visualizer: 'bs-search-answer',
        content: `Many optimization problems can be rephrased as: "find the minimum X such that condition(X) is true." If condition(X) is monotonic (once true, stays true), binary search on X directly.

Examples:
• Koko Eating Bananas: binary search on eating speed
• Capacity to Ship Packages: binary search on capacity
• Find Minimum in Rotated Array: binary search works because one half is always sorted`,
      },
    ],
    keyPoints: [
      'Requires sorted data (or monotonic condition)',
      'Eliminates half the search space each step → O(log n)',
      'Always use mid = left + (right - left) / 2 to avoid overflow',
      'Lower bound = first position where arr[i] >= target',
      'Upper bound = first position where arr[i] > target',
      'Search on answer: binary search on the answer space, not the array',
      'log₂(10⁹) ≈ 30 — find in billion-element sorted array in 30 comparisons',
    ],
    commonProblems: [
      { name: 'Binary Search', difficulty: 'easy' },
      { name: 'Search a 2D Matrix', difficulty: 'medium' },
      { name: 'Find Minimum in Rotated Sorted Array', difficulty: 'medium' },
      { name: 'Search in Rotated Sorted Array', difficulty: 'medium' },
      { name: 'Koko Eating Bananas', difficulty: 'medium' },
      { name: 'Capacity To Ship Packages', difficulty: 'medium' },
      { name: 'Median of Two Sorted Arrays', difficulty: 'hard' },
    ],
  },

  'sorting': {
    title: 'Sorting', color: '#84cc16', bg: 'rgba(132,204,22,0.08)', border: 'rgba(132,204,22,0.25)', difficulty: 'Beginner',
    timeComplexity: { 'Merge Sort': 'O(n log n)', 'Quick Sort': 'O(n log n)*', 'Heap Sort': 'O(n log n)', 'Bubble/Insertion': 'O(n²)' }, spaceComplexity: 'O(log n) – O(n)',
    intro: `Sorting is fundamental to computer science — it enables binary search, simplifies many algorithms, and is required in countless real-world applications. The theoretical lower bound for comparison-based sorting is Ω(n log n), proven by information theory (log₂(n!) ≈ n log n decisions needed).

Merge sort guarantees O(n log n) always. Quick sort is O(n log n) average but O(n²) worst case (avoided with random pivot). Heap sort is in-place and O(n log n) always but has poor cache performance. Counting/Radix sort break the O(n log n) barrier by not using comparisons.`,
    sections: [
      {
        title: 'Merge Sort — Divide & Conquer', visualizer: 'merge-sort-viz',
        content: `Divide array in half recursively until size 1. Merge sorted halves: compare front elements of each half, take smaller one repeatedly.

Recurrence: T(n) = 2T(n/2) + O(n). By Master Theorem → O(n log n).

Stable sort (equal elements maintain relative order). Used in: Java's Arrays.sort for objects, Python's sorted(), TimSort.

Drawback: requires O(n) extra space for the merge step.`,
        code: 'sorting-merge',
      },
      {
        title: 'Quick Sort — Partitioning', visualizer: 'quick-sort-viz',
        content: `Choose a pivot. Partition: all elements < pivot go left, > pivot go right. Recursively sort both halves.

Average case O(n log n), worst case O(n²) with bad pivot (already sorted array + last element pivot). Fix: randomize pivot or use median-of-three.

In-place (O(log n) stack space). Cache-friendly. Fastest in practice for arrays (3× faster than merge sort in benchmarks).

std::sort in C++ is typically IntroSort (hybrid: QuickSort + HeapSort + InsertionSort).`,
      },
      {
        title: 'Counting & Radix Sort', visualizer: 'counting-sort-viz',
        content: `Non-comparison sorts break the O(n log n) barrier.

Counting sort: count frequency of each element (range 0..k), then reconstruct. O(n + k). Only works for integers in a bounded range.

Radix sort: sort digit by digit from least significant to most significant using counting sort as a stable subroutine. O(n × d) where d is number of digits.

Used for: sorting integers in large ranges efficiently, sorting strings.`,
      },
    ],
    keyPoints: [
      'Comparison sort lower bound: Ω(n log n) — provably optimal',
      'Merge sort: O(n log n) always, stable, O(n) extra space',
      'Quick sort: O(n log n) average, O(n²) worst, O(log n) space in-place',
      'Heap sort: O(n log n) always, in-place, but poor cache performance',
      'Counting/Radix sort: O(n) for integers in bounded range',
      'Stable sort preserves relative order of equal elements',
      'In interviews: know when to use which sort and why',
    ],
    commonProblems: [
      { name: 'Sort Colors (Dutch Flag)', difficulty: 'medium' },
      { name: 'Merge Intervals', difficulty: 'medium' },
      { name: 'Kth Largest Element', difficulty: 'medium' },
      { name: 'Meeting Rooms II', difficulty: 'medium' },
      { name: 'Largest Number', difficulty: 'medium' },
      { name: 'Count Inversions (Merge Sort)', difficulty: 'hard' },
    ],
  },

  'hashing': {
    title: 'Hashing', color: '#e879f9', bg: 'rgba(232,121,249,0.08)', border: 'rgba(232,121,249,0.25)', difficulty: 'Intermediate',
    timeComplexity: { Insert: 'O(1)*', Delete: 'O(1)*', Search: 'O(1)*', 'Worst Case': 'O(n)' }, spaceComplexity: 'O(n)',
    intro: `Hashing maps keys to array indices via a hash function, enabling O(1) average-case insert, delete, and lookup. It's arguably the most powerful data structure for practical algorithm design.

A perfect hash function maps each key to a unique index. In practice, collisions (two keys mapping to same index) are handled by chaining (linked list at each slot) or open addressing (probe for next empty slot).

Load factor α = n/m (elements/slots). Performance degrades as α approaches 1. Rehashing occurs when α exceeds a threshold (typically 0.75 in Java HashMap).`,
    sections: [
      {
        title: 'Hash Functions & Collision', visualizer: 'hash-viz',
        content: `Hash function requirements: deterministic, uniform distribution, fast computation.

Simple example: h(k) = k mod m (for integer keys).
String hashing: polynomial rolling hash = Σ(s[i] × p^i) mod M.

Collision resolution:
• Chaining: each slot is a linked list. Simple but uses extra memory.
• Open addressing: if slot taken, probe next slot (linear/quadratic/double hashing).

Java HashMap uses chaining + tree (Red-Black tree when chain length > 8).`,
        code: 'hashing-basic',
      },
      {
        title: 'Frequency Counting Pattern', visualizer: 'hash-freq-viz',
        content: `Most common hash map application: count occurrences of elements.

Pattern: iterate array, freq[element]++. Query in O(1).

Extensions:
• Anagram check: sort both strings, compare keys OR compare frequency arrays
• Group anagrams: use sorted string as key
• First non-repeating character: frequency array + second pass
• Top K frequent elements: frequency map + heap`,
      },
      {
        title: 'Prefix Sum + Hash — Subarray Problems', visualizer: 'hash-prefix-viz',
        content: `Powerful pattern: store prefix sums in a hash map.

Subarray sum equals k: prefixSum - k seen before? Then subarray between those indices sums to k.

map[prefixSum - k] gives the count of subarrays ending at current index with sum k.

This converts O(n²) brute force to O(n) single pass. Works for: zero-sum subarrays, subarray with equal 0s and 1s, binary subarrays with sum k.`,
      },
    ],
    keyPoints: [
      'O(1) average case insert/delete/lookup — but worst case O(n) with bad hash',
      'Load factor α = n/m. Rehash when α > 0.75 (Java default)',
      'Chaining vs open addressing — chaining simpler, open addressing cache-friendly',
      'Rolling hash enables O(n) substring search (Rabin-Karp)',
      'Frequency map: count elements, find duplicates, group anagrams in O(n)',
      'Prefix sum + hash: subarray problems from O(n²) to O(n)',
      'Python dict, Java HashMap, C++ unordered_map — all hash tables',
    ],
    commonProblems: [
      { name: 'Two Sum', difficulty: 'easy' },
      { name: 'Valid Anagram', difficulty: 'easy' },
      { name: 'Group Anagrams', difficulty: 'medium' },
      { name: 'Subarray Sum Equals K', difficulty: 'medium' },
      { name: 'Top K Frequent Elements', difficulty: 'medium' },
      { name: 'Longest Consecutive Sequence', difficulty: 'medium' },
      { name: 'Minimum Window Substring', difficulty: 'hard' },
    ],
  },

  'bit-manipulation': {
    title: 'Bit Manipulation', color: '#a3e635', bg: 'rgba(163,230,53,0.08)', border: 'rgba(163,230,53,0.25)', difficulty: 'Intermediate',
    timeComplexity: { 'All Bit Ops': 'O(1)', 'Count Bits': 'O(log n)', 'Subset Enum': 'O(2^n)' }, spaceComplexity: 'O(1)',
    intro: `Bit manipulation operates directly on the binary representation of numbers. Modern CPUs perform bitwise operations in a single clock cycle, making them the fastest operations in computing.

Every integer is stored in binary. For a 32-bit int: bit 0 is least significant (rightmost), bit 31 is most significant. Bitwise operators: AND (&), OR (|), XOR (^), NOT (~), left shift (<<), right shift (>>).

XOR is especially powerful: x ^ x = 0, x ^ 0 = x, XOR is commutative and associative. These properties enable many elegant O(1) tricks.`,
    sections: [
      {
        title: 'Core Bit Operations', visualizer: 'bit-viz',
        content: `Essential operations on the i-th bit of number n:
• Check: (n >> i) & 1
• Set:   n | (1 << i)
• Clear: n & ~(1 << i)  
• Toggle: n ^ (1 << i)

Other common tricks:
• n & (n-1): clears the lowest set bit (Brian Kernighan's trick — count bits in O(log n))
• n & (-n): isolates the lowest set bit
• n & (n-1) == 0: check if n is a power of 2`,
        code: 'bitmask-basic',
      },
      {
        title: 'XOR Magic', visualizer: 'xor-viz',
        content: `XOR properties: a^a=0, a^0=a, commutative, associative.

Single Number: XOR all elements. Duplicates cancel out, single element remains. O(n) time O(1) space — better than hash map.

Find two missing numbers: XOR all 1..n with all array elements.

Swap without temp: a^=b; b^=a; a^=b; (elegant but avoid in practice — same-variable edge case).`,
      },
      {
        title: 'Bitmask DP & Subset Enumeration', visualizer: 'bitmask-viz',
        content: `Represent a subset of n elements as an n-bit integer. Bit i is 1 if element i is in the subset.

Total subsets = 2^n. Enumerate all: for (mask = 0; mask < (1<<n); mask++).

Check if element i in mask: (mask >> i) & 1.
Add element i: mask | (1 << i).
Remove element i: mask & ~(1 << i).

Bitmask DP: dp[mask] = best result using the subset represented by mask. Classic: Traveling Salesman Problem (TSP) in O(n² × 2^n).`,
      },
    ],
    keyPoints: [
      'Bitwise ops execute in single CPU clock cycle — fastest possible',
      'XOR: a^a=0, a^0=a — cancel duplicates without extra space',
      'n & (n-1) clears lowest set bit — count bits in O(count of set bits)',
      'n & (n-1) == 0 checks power of 2 in O(1)',
      'Bitmask: represent subsets as integers, enumerate 2^n subsets efficiently',
      '1 << i creates a mask with only bit i set',
      'Arithmetic right shift (>>) fills with sign bit; logic shift (>>>) fills with 0',
    ],
    commonProblems: [
      { name: 'Single Number', difficulty: 'easy' },
      { name: 'Number of 1 Bits', difficulty: 'easy' },
      { name: 'Power of Two', difficulty: 'easy' },
      { name: 'Counting Bits', difficulty: 'easy' },
      { name: 'Subsets (Bitmask)', difficulty: 'medium' },
      { name: 'Sum of Two Integers (No +)', difficulty: 'medium' },
      { name: 'Maximum XOR of Two Numbers', difficulty: 'hard' },
    ],
  },

  'trees': {
    title: 'Trees', color: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.25)', difficulty: 'Intermediate',
    timeComplexity: { 'BST Search': 'O(log n)', 'BST Insert': 'O(log n)', 'BST Delete': 'O(log n)', 'Traversal': 'O(n)' }, spaceComplexity: 'O(n)',
    intro: `A tree is a connected, acyclic graph with n nodes and n-1 edges. A rooted tree has one designated root; every other node has exactly one parent. Binary trees have at most 2 children per node (left and right).

Trees model hierarchical data everywhere: file systems, HTML DOM, decision trees in ML, syntax trees in compilers, organizational charts.

A perfect binary tree with height h has 2^(h+1) - 1 nodes and 2^h leaf nodes. Height of a balanced tree with n nodes is O(log n) — this is why BST operations are O(log n).`,
    sections: [
      {
        title: 'DFS Traversals (Inorder, Preorder, Postorder)', visualizer: 'tree-traversal',
        content: `Three recursive DFS traversals differ only in when the root is processed:

Inorder (L→Root→R): for BST, gives sorted sequence. Used to validate BST, kth smallest element.
Preorder (Root→L→R): processes root first — used to serialize a tree, copy a tree structure.
Postorder (L→R→Root): children before parent — used to calculate subtree properties, delete a tree.

BFS / Level-order: uses a queue. Processes nodes level by level. Used for finding minimum depth, connecting level siblings.`,
        code: 'tree-traversal',
      },
      {
        title: 'Binary Search Tree (BST)', visualizer: 'bst-search',
        content: `BST invariant: for every node, left subtree values < node < right subtree values. This enables O(log n) search in balanced BSTs.

Search: compare with root, go left or right. Insert: search to find position, attach new leaf. Delete: three cases — leaf (just remove), one child (replace), two children (replace with inorder successor).

BST becomes O(n) for sorted input (degenerates to linked list). Balanced BSTs (AVL, Red-Black) maintain O(log n) always — self-balancing on insert/delete.`,
      },
      {
        title: 'Tree DP — Diameter, Max Path Sum', visualizer: 'tree-dp-viz',
        content: `Many tree problems require computing a value for each subtree and combining results. This is Tree DP.

Diameter: longest path between any two nodes. For each node, diameter through it = left_height + right_height. Track global maximum. O(n) single DFS.

Max Path Sum: similar — for each node, consider paths going left, right, or through the node. Take max at each step.

Height: height(node) = 1 + max(height(left), height(right)). O(n).`,
      },
    ],
    keyPoints: [
      'Balanced BST height = O(log n) → O(log n) search/insert/delete',
      'Inorder BST traversal gives sorted sequence in O(n)',
      'Preorder: root → left → right. Used to serialize/reconstruct tree',
      'Postorder: children before parent. Used for deletion, subtree calculations',
      'BFS with queue: level-order traversal, shortest path in unweighted tree',
      'Tree DP: compute subtree properties in a single DFS, track global result',
      'LCA (Lowest Common Ancestor): O(log n) with binary lifting, O(n) naive',
    ],
    commonProblems: [
      { name: 'Maximum Depth of Binary Tree', difficulty: 'easy' },
      { name: 'Invert Binary Tree', difficulty: 'easy' },
      { name: 'Validate BST', difficulty: 'medium' },
      { name: 'Level Order Traversal (BFS)', difficulty: 'medium' },
      { name: 'Lowest Common Ancestor', difficulty: 'medium' },
      { name: 'Binary Tree Maximum Path Sum', difficulty: 'hard' },
      { name: 'Serialize and Deserialize Binary Tree', difficulty: 'hard' },
    ],
  },

  'graphs': {
    title: 'Graphs', color: '#06b6d4', bg: 'rgba(6,182,212,0.08)', border: 'rgba(6,182,212,0.25)', difficulty: 'Advanced',
    timeComplexity: { 'BFS/DFS': 'O(V+E)', 'Dijkstra': 'O((V+E)log V)', 'Bellman-Ford': 'O(VE)', 'Floyd-Warshall': 'O(V³)' }, spaceComplexity: 'O(V+E)',
    intro: `A graph G=(V,E) consists of vertices V and edges E. Graphs model the most complex real-world relationships: social networks (Facebook), maps (Google Maps), dependencies (npm packages), web links (PageRank), and circuits.

Representation: adjacency list — array of lists, O(V+E) space, efficient for sparse graphs. Adjacency matrix — V×V grid, O(V²) space, O(1) edge lookup, good for dense graphs.

Directed vs undirected, weighted vs unweighted, cyclic vs DAG (Directed Acyclic Graph) — the problem type determines which algorithm to use.`,
    sections: [
      {
        title: 'BFS — Breadth First Search', visualizer: 'graph-bfs',
        content: `BFS explores all neighbors at distance 1, then distance 2, etc. Uses a FIFO queue. Guarantees shortest path in unweighted graphs.

Algorithm: push source to queue, mark visited. While queue not empty: dequeue node, process, enqueue unvisited neighbors.

Time: O(V+E) — each vertex and edge processed once.
Space: O(V) for the queue.

Applications: shortest path (unweighted), bipartite check, finding all reachable nodes, level-order tree traversal, web crawlers.`,
        code: 'graph-bfs',
      },
      {
        title: 'DFS — Depth First Search', visualizer: 'graph-dfs',
        content: `DFS explores as deep as possible before backtracking. Uses recursion (implicit call stack) or explicit stack.

Time: O(V+E). Space: O(V) for visited array + O(h) recursion stack where h = max depth.

Applications:
• Cycle detection (back edges in DFS tree)
• Topological sort (DFS finish order reversed = topo order)
• Connected components
• Finding bridges and articulation points (Tarjan's algorithm)
• Path finding in mazes`,
      },
      {
        title: "Dijkstra's Shortest Path", visualizer: 'dijkstra',
        content: `Finds shortest paths from source to all vertices in weighted graph with non-negative edge weights.

Uses a min-heap (priority queue). Greedy: always process the unvisited vertex with smallest known distance.

Time: O((V+E) log V) with binary heap. Fails with negative edges (use Bellman-Ford instead).

For dense graphs (E ≈ V²): use simple array for "min vertex" → O(V²). This is actually faster than heap for dense graphs.`,
      },
      {
        title: 'Topological Sort (Kahn\'s Algorithm)', visualizer: 'topo-sort-viz',
        content: `Valid ordering of vertices in a DAG such that for every edge u→v, u comes before v. Only exists for DAGs (no cycles).

Kahn's Algorithm (BFS-based):
1. Compute in-degree of all vertices
2. Enqueue all vertices with in-degree 0
3. Process: dequeue vertex, add to result, decrement in-degree of neighbors
4. If neighbor's in-degree becomes 0, enqueue it

If result contains all V vertices → DAG. Otherwise → cycle exists.

Used in: build systems, course scheduling, dependency resolution.`,
      },
    ],
    keyPoints: [
      'BFS = shortest path in unweighted graph (guarantees minimum edges)',
      'DFS = cycle detection, topological sort, connected components',
      'Dijkstra: O((V+E) log V), non-negative weights only',
      'Bellman-Ford: O(VE), handles negative weights, detects negative cycles',
      'Floyd-Warshall: O(V³), all-pairs shortest paths',
      'Union-Find (DSU): O(α(n)) ≈ O(1) per operation for connectivity queries',
      'Bipartite check: BFS/DFS with 2-coloring. Topo sort: only for DAGs',
    ],
    commonProblems: [
      { name: 'Number of Islands', difficulty: 'medium' },
      { name: 'Course Schedule (Topo Sort)', difficulty: 'medium' },
      { name: 'Clone Graph', difficulty: 'medium' },
      { name: 'Network Delay Time (Dijkstra)', difficulty: 'medium' },
      { name: 'Find if Path Exists in Graph', difficulty: 'easy' },
      { name: 'Word Ladder (BFS)', difficulty: 'hard' },
      { name: 'Alien Dictionary (Topo Sort)', difficulty: 'hard' },
    ],
  },

  'dynamic-programming': {
    title: 'Dynamic Programming', color: '#ec4899', bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.25)', difficulty: 'Advanced',
    timeComplexity: { '1D DP': 'O(n)', '2D DP': 'O(n²)', 'Bitmask DP': 'O(n² × 2^n)', 'String DP': 'O(n × m)' }, spaceComplexity: 'O(n) – O(n²)',
    intro: `Dynamic Programming (DP) solves optimization problems by breaking them into overlapping subproblems and storing results to avoid recomputation. It transforms exponential algorithms into polynomial ones.

Two necessary conditions: Optimal Substructure (the optimal solution can be built from optimal solutions of subproblems) and Overlapping Subproblems (the same subproblems are solved multiple times in naive recursion).

DP is not a single algorithm — it's a technique. The hardest part is defining the state correctly. Once you define dp[i][j] (or whatever state represents the subproblem), the transitions often become clear.`,
    sections: [
      {
        title: 'Memoization vs Tabulation', visualizer: 'dp-fibonacci',
        content: `Memoization (top-down): write the natural recursion, add a cache. If subproblem already computed, return cached result. More intuitive, but has recursion overhead and stack depth limits.

Tabulation (bottom-up): fill a table iteratively from base cases upward. No recursion overhead. Often enables space optimization.

Fibonacci: naive O(2^n) → memoized O(n) time O(n) space → tabulated O(n) time O(1) space.`,
        code: 'dp-fibonacci',
      },
      {
        title: 'Classic DP Patterns', visualizer: 'dp-patterns',
        content: `1D DP patterns:
• Fibonacci-style: dp[i] = dp[i-1] + dp[i-2]
• Climbing Stairs, House Robber, Jump Game

2D DP patterns:
• Grid paths: dp[i][j] = dp[i-1][j] + dp[i][j-1]
• String problems (LCS, Edit Distance, LPS)

Interval DP: dp[i][j] = optimal for subarray [i..j]
• Matrix Chain Multiplication, Burst Balloons

Knapsack DP: dp[i][w] = max value using first i items, capacity w`,
      },
      {
        title: '0/1 Knapsack', visualizer: 'dp-knapsack',
        content: `Given n items with weights and values and capacity W, maximize total value without exceeding weight.

State: dp[i][w] = max value using items 1..i with capacity w.
Transition: dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])
(skip item i, OR take item i if w >= weight[i])

Base: dp[0][*] = 0. Answer: dp[n][W].

Space optimization: use 1D dp[w], iterate w backwards to prevent using same item twice.`,
      },
      {
        title: 'LCS & Edit Distance', visualizer: 'dp-lcs',
        content: `Longest Common Subsequence (LCS): longest sequence present in both strings (not necessarily contiguous).

dp[i][j] = LCS of s1[0..i] and s2[0..j]
If s1[i]==s2[j]: dp[i][j] = 1 + dp[i-1][j-1]
Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])

Edit Distance: minimum operations (insert, delete, replace) to convert s1 to s2.
If s1[i]==s2[j]: dp[i][j] = dp[i-1][j-1]
Else: dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])`,
      },
    ],
    keyPoints: [
      'Two conditions: optimal substructure + overlapping subproblems',
      'State design is the hardest step — what does dp[i] represent?',
      'Memoization = recursion + cache (top-down). Tabulation = iteration (bottom-up)',
      'Space optimize: if dp[i] only depends on dp[i-1], use O(1) space',
      'Common patterns: 1D (Fibonacci), 2D grid, knapsack, interval, string',
      'LCS: dp[i][j] on two strings. Edit distance: insert/delete/replace costs',
      'Bitmask DP: dp[mask] for subset problems. TSP in O(n² × 2^n)',
    ],
    commonProblems: [
      { name: 'Climbing Stairs', difficulty: 'easy' },
      { name: 'House Robber', difficulty: 'medium' },
      { name: 'Coin Change', difficulty: 'medium' },
      { name: 'Longest Common Subsequence', difficulty: 'medium' },
      { name: 'Edit Distance', difficulty: 'hard' },
      { name: '0/1 Knapsack', difficulty: 'medium' },
      { name: 'Burst Balloons', difficulty: 'hard' },
    ],
  },
};

/* ══════════════════════════════════════════════════════════════════════════
   VISUALIZERS
   ══════════════════════════════════════════════════════════════════════════ */

function ArrayMemoryViz({ color }) {
  const data = [12, 45, 7, 23, 56, 3, 89];
  const [hi, setHi] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setHi(h => (h+1) % data.length), 900);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ textAlign:'center', padding:'16px 0' }}>
      <div style={{ fontSize:10, fontFamily:'JetBrains Mono,monospace', color:'#4a4d60', marginBottom:10 }}>
        Base Address: <span style={{ color }}>0x1000</span> | Element size: 4 bytes
      </div>
      <div style={{ display:'flex', gap:3, justifyContent:'center', marginBottom:8 }}>
        {data.map((v, i) => (
          <div key={i} style={{ textAlign:'center' }}>
            <div style={{
              width:50, height:50, border:`1.5px solid ${hi===i ? color : '#2a2d3a'}`,
              background: hi===i ? `rgba(108,142,247,0.18)` : '#111318',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:14, fontWeight:700, fontFamily:'JetBrains Mono,monospace',
              color: hi===i ? color : '#5a5f78', borderRadius:7, transition:'all .3s',
            }}>{v}</div>
            <div style={{ fontSize:9, fontFamily:'JetBrains Mono,monospace', color:'#4a4d60', marginTop:3 }}>[{i}]</div>
            <div style={{ fontSize:8, fontFamily:'JetBrains Mono,monospace', color:'#2a2d3a', marginTop:1 }}>
              0x{(0x1000+i*4).toString(16).toUpperCase()}
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontSize:11, fontFamily:'JetBrains Mono,monospace', color, marginTop:6 }}>
        arr[{hi}] at address 0x{(0x1000+hi*4).toString(16).toUpperCase()} = {data[hi]}
        <span style={{ color:'#4a4d60', marginLeft:8 }}>← O(1) direct access</span>
      </div>
    </div>
  );
}

function TwoPointerViz({ color }) {
  const arr = [1,3,5,7,9,11,13]; const target = 14;
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(arr.length-1);
  const [found, setFound] = useState(false);
  const reset = () => { setLeft(0); setRight(arr.length-1); setFound(false); };
  const next = () => {
    if (found||left>=right) { reset(); return; }
    const sum = arr[left]+arr[right];
    if (sum===target) setFound(true);
    else if (sum<target) setLeft(l=>l+1);
    else setRight(r=>r-1);
  };
  const sum = arr[left]+arr[right];
  return (
    <div style={{ padding:'14px 0', textAlign:'center' }}>
      <div style={{ fontSize:10, fontFamily:'JetBrains Mono,monospace', color:'#4a4d60', marginBottom:12 }}>
        Find pair summing to <span style={{ color }}>{target}</span>
      </div>
      <div style={{ display:'flex', gap:4, justifyContent:'center', marginBottom:10 }}>
        {arr.map((v,i) => {
          const isL=i===left, isR=i===right, ok=found&&(isL||isR);
          return (
            <div key={i} style={{ textAlign:'center' }}>
              <div style={{ fontSize:9, fontFamily:'JetBrains Mono,monospace', color: isL?'#6c8ef7':isR?'#a78bfa':'transparent', marginBottom:3 }}>
                {isL?'L':isR?'R':'·'}
              </div>
              <div style={{
                width:42, height:42, border:`1.5px solid ${ok?'#22c55e':(isL||isR)?color:'#2a2d3a'}`,
                background: ok?'rgba(34,197,94,0.15)':(isL||isR)?'rgba(108,142,247,0.12)':'#111318',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:13, fontWeight:700, fontFamily:'JetBrains Mono,monospace',
                color: ok?'#22c55e':(isL||isR)?color:'#5a5f78',
                borderRadius:6, transition:'all .25s',
              }}>{v}</div>
            </div>
          );
        })}
      </div>
      <div style={{ fontSize:11, fontFamily:'JetBrains Mono,monospace', color: found?'#22c55e':'#8b8fa8', marginBottom:10 }}>
        {found ? `✓ Found! ${arr[left]} + ${arr[right]} = ${target}` :
         left>=right ? 'No pair found' :
         sum<target ? `${arr[left]}+${arr[right]}=${sum} < ${target} → move L right` :
         `${arr[left]}+${arr[right]}=${sum} > ${target} → move R left`}
      </div>
      <button onClick={next} style={{ padding:'5px 14px', borderRadius:6, cursor:'pointer', fontSize:11, fontFamily:'JetBrains Mono,monospace', fontWeight:600, color, background:'rgba(108,142,247,0.1)', border:`1px solid rgba(108,142,247,0.3)` }}>
        {found||left>=right ? 'Reset' : 'Next Step →'}
      </button>
    </div>
  );
}

function SlidingWindowViz({ color }) {
  const arr=[2,1,5,1,3,2,4,8]; const k=3;
  const [ws, setWs] = useState(0);
  useEffect(() => { const id=setInterval(()=>setWs(w=>w>=(arr.length-k)?0:w+1),900); return()=>clearInterval(id); },[]);
  const wsum = arr.slice(ws,ws+k).reduce((a,b)=>a+b,0);
  const maxSum = Math.max(...Array.from({length:arr.length-k+1},(_,i)=>arr.slice(i,i+k).reduce((a,b)=>a+b,0)));
  return (
    <div style={{ padding:'14px 0', textAlign:'center' }}>
      <div style={{ fontSize:10, fontFamily:'JetBrains Mono,monospace', color:'#4a4d60', marginBottom:10 }}>
        Window k={k} | Current: <span style={{color}}>{wsum}</span> | Max: <span style={{color:'#22c55e'}}>{maxSum}</span>
      </div>
      <div style={{ display:'flex', gap:4, justifyContent:'center', marginBottom:8 }}>
        {arr.map((v,i) => {
          const inW = i>=ws && i<ws+k;
          return (
            <div key={i} style={{
              width:44, height:44, border:`1.5px solid ${inW?color:'#2a2d3a'}`,
              background: inW?'rgba(108,142,247,0.14)':'#111318',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:13, fontWeight:700, fontFamily:'JetBrains Mono,monospace',
              color: inW?color:'#5a5f78', borderRadius:6, transition:'all .25s',
            }}>{v}</div>
          );
        })}
      </div>
      <div style={{ fontSize:10, fontFamily:'JetBrains Mono,monospace', color:'#4a4d60' }}>
        [{ws}..{ws+k-1}] → {arr.slice(ws,ws+k).join('+')} = {wsum}
      </div>
    </div>
  );
}

function PrefixSumViz({ color }) {
  const arr=[2,4,1,6,3,5]; const prefix=[0,...arr.reduce((acc,v)=>[...acc,(acc[acc.length-1]||0)+v],[])];
  const [l,setL]=useState(1); const [r,setR]=useState(4);
  const sum=prefix[r+1]-prefix[l];
  return (
    <div style={{ padding:'14px 0', textAlign:'center' }}>
      <div style={{ fontSize:10, fontFamily:'JetBrains Mono,monospace', color:'#4a4d60', marginBottom:8 }}>Original array</div>
      <div style={{ display:'flex', gap:4, justifyContent:'center', marginBottom:14 }}>
        {arr.map((v,i) => (
          <div key={i} style={{
            width:44, height:44, border:`1.5px solid ${i>=l&&i<=r?color:'#2a2d3a'}`,
            background: i>=l&&i<=r?'rgba(108,142,247,0.14)':'#111318',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:13, fontWeight:700, fontFamily:'JetBrains Mono,monospace',
            color: i>=l&&i<=r?color:'#5a5f78', borderRadius:6,
          }}>{v}</div>
        ))}
      </div>
      <div style={{ fontSize:10, fontFamily:'JetBrains Mono,monospace', color:'#4a4d60', marginBottom:6 }}>Prefix sum array</div>
      <div style={{ display:'flex', gap:4, justifyContent:'center', marginBottom:10 }}>
        {prefix.map((v,i) => (
          <div key={i} style={{
            width:44, height:44, border:`1px solid ${(i===l||i===r+1)?'#22c55e':'#2a2d3a'}`,
            background: (i===l||i===r+1)?'rgba(34,197,94,0.12)':'#161820',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:12, fontWeight:700, fontFamily:'JetBrains Mono,monospace',
            color: (i===l||i===r+1)?'#22c55e':'#5a5f78', borderRadius:6,
          }}>{v}</div>
        ))}
      </div>
      <div style={{ fontSize:11, fontFamily:'JetBrains Mono,monospace', color:'#22c55e' }}>
        sum[{l}..{r}] = prefix[{r+1}]({prefix[r+1]}) − prefix[{l}]({prefix[l]}) = <span style={{color}}>{sum}</span>
      </div>
      <div style={{ display:'flex', gap:12, justifyContent:'center', marginTop:10 }}>
        <div style={{ fontSize:10, color:'#4a4d60', fontFamily:'JetBrains Mono,monospace' }}>
          L: <button onClick={()=>setL(v=>Math.max(0,v-1))} style={btnStyle}>-</button>
          <span style={{margin:'0 4px'}}>{l}</span>
          <button onClick={()=>setL(v=>Math.min(r,v+1))} style={btnStyle}>+</button>
        </div>
        <div style={{ fontSize:10, color:'#4a4d60', fontFamily:'JetBrains Mono,monospace' }}>
          R: <button onClick={()=>setR(v=>Math.max(l,v-1))} style={btnStyle}>-</button>
          <span style={{margin:'0 4px'}}>{r}</span>
          <button onClick={()=>setR(v=>Math.min(arr.length-1,v+1))} style={btnStyle}>+</button>
        </div>
      </div>
    </div>
  );
}
const btnStyle = { padding:'1px 6px', borderRadius:4, cursor:'pointer', fontSize:11, color:'#6c8ef7', background:'rgba(108,142,247,0.1)', border:'1px solid rgba(108,142,247,0.3)' };

function KadaneViz({ color }) {
  const arr=[-2,1,-3,4,-1,2,1,-5,4];
  const [step,setStep]=useState(0);
  useEffect(()=>{ const id=setInterval(()=>setStep(s=>s>=arr.length-1?0:s+1),900); return()=>clearInterval(id); },[]);
  let cs=arr[0],ms=arr[0],cs_=arr[0];
  const cs_arr=[arr[0]], ms_arr=[arr[0]];
  for(let i=1;i<arr.length;i++){
    cs_=Math.max(arr[i],cs_arr[i-1]+arr[i]);
    cs_arr.push(cs_);
    ms_arr.push(Math.max(ms_arr[i-1],cs_));
  }
  return (
    <div style={{ padding:'14px 0', textAlign:'center' }}>
      <div style={{ fontSize:10, fontFamily:'JetBrains Mono,monospace', color:'#4a4d60', marginBottom:8 }}>
        currentSum vs maxSum at each step
      </div>
      <div style={{ display:'flex', gap:3, justifyContent:'center', marginBottom:10 }}>
        {arr.map((v,i) => (
          <div key={i} style={{ textAlign:'center' }}>
            <div style={{
              width:40, height:40, border:`1.5px solid ${i===step?color:i<step?'rgba(108,142,247,0.4)':'#2a2d3a'}`,
              background: i===step?'rgba(108,142,247,0.18)':i<step?'rgba(108,142,247,0.06)':'#111318',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:12, fontWeight:700, fontFamily:'JetBrains Mono,monospace',
              color: i===step?color:i<step?'#8b8fa8':'#4a4d60', borderRadius:6, transition:'all .3s',
            }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize:11, fontFamily:'JetBrains Mono,monospace', color:'#4a4d60', marginBottom:4 }}>
        currentSum: <span style={{color}}>{cs_arr[step]}</span> | maxSum: <span style={{color:'#22c55e'}}>{ms_arr[step]}</span>
      </div>
      {step>0 && <div style={{ fontSize:10, fontFamily:'JetBrains Mono,monospace', color:'#5a5f78' }}>
        max({arr[step]}, {cs_arr[step-1]}+{arr[step]}={cs_arr[step-1]+arr[step]}) = {cs_arr[step]}
      </div>}
    </div>
  );
}

function StackOpsViz({ color }) {
  const [stack,setStack]=useState([3,7,1]);
  const [msg,setMsg]=useState('');
  const push=()=>{ const v=Math.floor(Math.random()*20)+1; setStack(s=>[...s,v]); setMsg(`Pushed ${v}`); };
  const pop=()=>{ if(!stack.length){setMsg('Underflow!');return;} const v=stack[stack.length-1]; setStack(s=>s.slice(0,-1)); setMsg(`Popped ${v}`); };
  return (
    <div style={{ padding:'14px 0', display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
      <div style={{ fontSize:10, fontFamily:'JetBrains Mono,monospace', color:'#4a4d60' }}>STACK (LIFO)</div>
      <div style={{ display:'flex', flexDirection:'column-reverse', gap:3, minHeight:120 }}>
        {stack.map((v,i)=>(
          <div key={i} style={{
            width:90, height:34, border:`1.5px solid ${i===stack.length-1?color:'#2a2d3a'}`,
            background: i===stack.length-1?'rgba(248,113,113,0.14)':'#161820',
            display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 12px',
            borderRadius:6, fontSize:13, fontWeight:700, fontFamily:'JetBrains Mono,monospace',
            color: i===stack.length-1?color:'#8b8fa8', transition:'all .2s',
          }}>
            <span>{v}</span>
            {i===stack.length-1 && <span style={{fontSize:8,color}}>TOP</span>}
          </div>
        ))}
        {!stack.length && <div style={{width:90,height:34,border:'1px dashed #2a2d3a',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontFamily:'JetBrains Mono,monospace',color:'#2a2d3a'}}>empty</div>}
      </div>
      <div style={{ display:'flex', gap:8 }}>
        <button onClick={push} style={{padding:'5px 12px',borderRadius:6,cursor:'pointer',fontSize:11,fontFamily:'JetBrains Mono,monospace',color,background:'rgba(248,113,113,0.1)',border:'1px solid rgba(248,113,113,0.3)'}}>Push</button>
        <button onClick={pop} style={{padding:'5px 12px',borderRadius:6,cursor:'pointer',fontSize:11,fontFamily:'JetBrains Mono,monospace',color:'#ef4444',background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.25)'}}>Pop</button>
      </div>
      {msg && <div style={{fontSize:11,fontFamily:'JetBrains Mono,monospace',color:'#22c55e'}}>{msg}</div>}
    </div>
  );
}

function StackParenViz({ color }) {
  const examples=['({[]})','{[()}','((()))'];
  const [ei,setEi]=useState(0);
  const [step,setStep]=useState(0);
  const s=examples[ei]; const openers='({[';
  const match={'(':')','{':'}','[':']'};
  let stack_=[], valid=true, steps_=[];
  for(let i=0;i<s.length;i++){
    if(openers.includes(s[i])) stack_=[...stack_,s[i]];
    else{ if(!stack_.length||match[stack_[stack_.length-1]]!==s[i]){valid=false;steps_.push({stack:[...stack_],char:s[i],ok:false});break;}else stack_=stack_.slice(0,-1); }
    steps_.push({stack:[...stack_],char:s[i],ok:true});
  }
  const cur=steps_[Math.min(step,steps_.length-1)]||{stack:[],char:'',ok:true};
  return (
    <div style={{ padding:'14px 0', textAlign:'center' }}>
      <div style={{ display:'flex', justifyContent:'center', gap:8, marginBottom:12 }}>
        {examples.map((e,i)=>(
          <button key={i} onClick={()=>{setEi(i);setStep(0);}} style={{padding:'3px 10px',borderRadius:6,cursor:'pointer',fontSize:11,fontFamily:'JetBrains Mono,monospace',color:ei===i?color:'#4a4d60',background:ei===i?'rgba(248,113,113,0.1)':'transparent',border:`1px solid ${ei===i?color:'#2a2d3a'}`}}>{e}</button>
        ))}
      </div>
      <div style={{ display:'flex', gap:3, justifyContent:'center', marginBottom:12 }}>
        {s.split('').map((c,i)=>(
          <div key={i} style={{
            width:36, height:36, border:`1.5px solid ${i===step?color:'#2a2d3a'}`,
            background: i===step?'rgba(248,113,113,0.15)':i<step?'rgba(108,142,247,0.06)':'#111318',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:14, fontWeight:700, fontFamily:'JetBrains Mono,monospace',
            color: i===step?color:'#5a5f78', borderRadius:6,
          }}>{c}</div>
        ))}
      </div>
      <div style={{ fontSize:11, fontFamily:'JetBrains Mono,monospace', color:'#4a4d60', marginBottom:8 }}>
        Stack: [{cur.stack.join(', ')}]
      </div>
      <div style={{ display:'flex', gap:8, justifyContent:'center' }}>
        <button onClick={()=>setStep(s=>Math.max(0,s-1))} style={{...btnStyle}}>← Prev</button>
        <button onClick={()=>setStep(s=>Math.min(steps_.length-1,s+1))} style={{...btnStyle}}>Next →</button>
      </div>
    </div>
  );
}

function MonotonicStackViz({ color }) {
  const arr=[2,1,2,4,3,6,5]; const nge=arr.map((v,i)=>{ for(let j=i+1;j<arr.length;j++) if(arr[j]>v) return arr[j]; return -1; });
  const [step,setStep]=useState(0);
  useEffect(()=>{ const id=setInterval(()=>setStep(s=>s>=arr.length-1?0:s+1),900); return()=>clearInterval(id); },[]);
  return (
    <div style={{ padding:'14px 0', textAlign:'center' }}>
      <div style={{ fontSize:10, fontFamily:'JetBrains Mono,monospace', color:'#4a4d60', marginBottom:10 }}>Next Greater Element — Monotonic Stack</div>
      <div style={{ display:'flex', gap:4, justifyContent:'center', marginBottom:8 }}>
        {arr.map((v,i)=>(
          <div key={i} style={{ textAlign:'center' }}>
            <div style={{
              width:42, height:42, border:`1.5px solid ${i===step?color:'#2a2d3a'}`,
              background: i===step?'rgba(248,113,113,0.15)':'#111318',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:13, fontWeight:700, fontFamily:'JetBrains Mono,monospace',
              color: i===step?color:'#5a5f78', borderRadius:6, transition:'all .3s',
            }}>{v}</div>
            <div style={{ fontSize:9, fontFamily:'JetBrains Mono,monospace', marginTop:3, color: nge[i]===-1?'#4a4d60':'#22c55e' }}>
              {nge[i]===-1?'−':nge[i]}
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontSize:10, fontFamily:'JetBrains Mono,monospace', color:'#4a4d60' }}>
        NGE[{step}]({arr[step]}) = <span style={{color:nge[step]===-1?'#ef4444':'#22c55e'}}>{nge[step]===-1?'none':nge[step]}</span>
      </div>
    </div>
  );
}

function BinarySearchViz({ color }) {
  const arr=[1,3,7,12,18,24,31,42,56,67]; const target=24;
  const [left,setLeft]=useState(0); const [right,setRight]=useState(arr.length-1); const [found,setFound]=useState(false);
  const mid=Math.floor((left+right)/2);
  const reset=()=>{ setLeft(0); setRight(arr.length-1); setFound(false); };
  const next=()=>{
    if(found){reset();return;}
    if(arr[mid]===target){setFound(true);return;}
    if(arr[mid]<target) setLeft(mid+1);
    else setRight(mid-1);
  };
  return (
    <div style={{ padding:'14px 0', textAlign:'center' }}>
      <div style={{ fontSize:10, fontFamily:'JetBrains Mono,monospace', color:'#4a4d60', marginBottom:10 }}>
        Search target = <span style={{color}}>{target}</span>
      </div>
      <div style={{ display:'flex', gap:3, justifyContent:'center', marginBottom:8, flexWrap:'wrap' }}>
        {arr.map((v,i)=>{
          const isL=i===left,isR=i===right,isM=i===mid,elim=i<left||i>right;
          return (
            <div key={i} style={{
              width:40, height:40, border:`1.5px solid ${found&&isM?'#22c55e':isM?color:(isL||isR)?'rgba(108,142,247,0.4)':'#2a2d3a'}`,
              background: found&&isM?'rgba(34,197,94,0.2)':isM?'rgba(108,142,247,0.18)':elim?'transparent':'#111318',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:11, fontWeight:700, fontFamily:'JetBrains Mono,monospace',
              color: found&&isM?'#22c55e':isM?color:elim?'#2a2d3a':'#5a5f78',
              borderRadius:6, transition:'all .25s', opacity:elim?0.3:1,
            }}>{v}</div>
          );
        })}
      </div>
      <div style={{ fontSize:11, fontFamily:'JetBrains Mono,monospace', color:'#8b8fa8', marginBottom:8 }}>
        {found ? `✓ Found ${target} at index ${mid}` :
         left>right ? 'Not found' :
         arr[mid]<target ? `arr[${mid}]=${arr[mid]} < ${target} → search right` :
         `arr[${mid}]=${arr[mid]} > ${target} → search left`}
      </div>
      <button onClick={next} style={{...btnStyle, color}}>
        {found||left>right?'Reset':'Next Step →'}
      </button>
    </div>
  );
}

function FibDPViz({ color }) {
  const n=9; const dp=[0,1]; for(let i=2;i<=n;i++) dp[i]=dp[i-1]+dp[i-2];
  const [step,setStep]=useState(0);
  useEffect(()=>{ const id=setInterval(()=>setStep(s=>s>=n?0:s+1),700); return()=>clearInterval(id); },[]);
  return (
    <div style={{ padding:'14px 0', textAlign:'center' }}>
      <div style={{ fontSize:10, fontFamily:'JetBrains Mono,monospace', color:'#4a4d60', marginBottom:10 }}>Tabulation — filling dp table bottom-up</div>
      <div style={{ display:'flex', gap:4, justifyContent:'center', flexWrap:'wrap', marginBottom:10 }}>
        {dp.slice(0,n+1).map((v,i)=>(
          <div key={i} style={{ textAlign:'center' }}>
            <div style={{
              width:46, height:46, border:`1.5px solid ${i===step?color:i<step?'rgba(236,72,153,0.4)':'#2a2d3a'}`,
              background: i===step?'rgba(236,72,153,0.2)':i<step?'rgba(236,72,153,0.07)':'#111318',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:13, fontWeight:700, fontFamily:'JetBrains Mono,monospace',
              color: i<=step?(i===step?'#ec4899':color):'#2a2d3a',
              borderRadius:7, transition:'all .3s',
            }}>{i<=step?v:'?'}</div>
            <div style={{fontSize:9,fontFamily:'JetBrains Mono,monospace',color:'#4a4d60',marginTop:3}}>[{i}]</div>
          </div>
        ))}
      </div>
      {step>=2 && <div style={{ fontSize:11, fontFamily:'JetBrains Mono,monospace', color }}>
        dp[{step}] = dp[{step-1}]({dp[step-1]}) + dp[{step-2}]({dp[step-2]}) = {dp[step]}
      </div>}
    </div>
  );
}

function TreeTraversalViz({ color }) {
  const nodes=[{id:1,x:50,y:12,l:2,r:3},{id:2,x:25,y:40,l:4,r:5},{id:3,x:75,y:40,l:6,r:7},{id:4,x:12,y:68,l:null,r:null},{id:5,x:38,y:68,l:null,r:null},{id:6,x:62,y:68,l:null,r:null},{id:7,x:88,y:68,l:null,r:null}];
  const orders={inorder:[4,2,5,1,6,3,7],preorder:[1,2,4,5,3,6,7],postorder:[4,5,2,6,7,3,1],'level-order':[1,2,3,4,5,6,7]};
  const [mode,setMode]=useState('inorder');
  const [step,setStep]=useState(0);
  const seq=orders[mode];
  useEffect(()=>{ setStep(0); const id=setInterval(()=>setStep(s=>s>=seq.length-1?0:s+1),800); return()=>clearInterval(id); },[mode]);
  const active=seq[step];
  return (
    <div style={{ padding:'12px 0', textAlign:'center' }}>
      <div style={{ display:'flex', justifyContent:'center', gap:6, marginBottom:12, flexWrap:'wrap' }}>
        {Object.keys(orders).map(m=>(
          <button key={m} onClick={()=>setMode(m)} style={{padding:'3px 9px',borderRadius:20,cursor:'pointer',fontSize:10,fontFamily:'JetBrains Mono,monospace',color:mode===m?color:'#4a4d60',background:mode===m?'rgba(34,197,94,0.1)':'transparent',border:`1px solid ${mode===m?color:'#2a2d3a'}`}}>{m}</button>
        ))}
      </div>
      <svg viewBox="0 0 100 82" style={{width:'100%',height:160}}>
        {nodes.filter(n=>n.l).map(n=>{ const c=nodes.find(x=>x.id===n.l); return <line key={`${n.id}l`} x1={n.x} y1={n.y+4} x2={c.x} y2={c.y-4} stroke="#2a2d3a" strokeWidth=".7"/>; })}
        {nodes.filter(n=>n.r).map(n=>{ const c=nodes.find(x=>x.id===n.r); return <line key={`${n.id}r`} x1={n.x} y1={n.y+4} x2={c.x} y2={c.y-4} stroke="#2a2d3a" strokeWidth=".7"/>; })}
        {nodes.map(n=>(
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={5.5} fill={n.id===active?`rgba(34,197,94,0.25)`:'#161820'} stroke={n.id===active?'#22c55e':'#2a2d3a'} strokeWidth={n.id===active?1.5:1}/>
            <text x={n.x} y={n.y+1.5} textAnchor="middle" fontSize={3.8} fill={n.id===active?'#22c55e':'#8b8fa8'} fontFamily="JetBrains Mono,monospace" fontWeight="700">{n.id}</text>
          </g>
        ))}
      </svg>
      <div style={{ fontSize:11, fontFamily:'JetBrains Mono,monospace', color:'#4a4d60' }}>
        {seq.slice(0,step+1).join(' → ')}
      </div>
    </div>
  );
}

function GraphBFSViz({ color }) {
  const nodes=[{id:0,x:50,y:15},{id:1,x:20,y:45},{id:2,x:80,y:45},{id:3,x:10,y:75},{id:4,x:40,y:75},{id:5,x:70,y:75}];
  const edges=[[0,1],[0,2],[1,3],[1,4],[2,4],[2,5]];
  const bfsOrder=[[0],[1,2],[3,4,5]];
  const [step,setStep]=useState(0);
  useEffect(()=>{ const id=setInterval(()=>setStep(s=>s>=bfsOrder.length-1?0:s+1),1000); return()=>clearInterval(id); },[]);
  const visited=bfsOrder.slice(0,step+1).flat();
  const current=bfsOrder[step]||[];
  return (
    <div style={{ padding:'12px 0', textAlign:'center' }}>
      <div style={{ fontSize:10, fontFamily:'JetBrains Mono,monospace', color:'#4a4d60', marginBottom:8 }}>
        BFS from node 0 | Level <span style={{color}}>{step}</span>
      </div>
      <svg viewBox="0 0 100 95" style={{width:'100%',height:170}}>
        {edges.map(([a,b],i)=>{ const na=nodes[a],nb=nodes[b]; return <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} stroke="#2a2d3a" strokeWidth=".8"/>; })}
        {nodes.map(n=>{
          const isCur=current.includes(n.id), isVis=visited.includes(n.id)&&!isCur;
          return (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={7} fill={isCur?`rgba(6,182,212,0.3)`:isVis?`rgba(6,182,212,0.1)`:'#161820'} stroke={isCur?color:isVis?'rgba(6,182,212,0.5)':'#2a2d3a'} strokeWidth={isCur?1.5:1}/>
              <text x={n.x} y={n.y+1.5} textAnchor="middle" fontSize={4.5} fill={isCur?color:isVis?'rgba(6,182,212,0.8)':'#5a5f78'} fontFamily="JetBrains Mono,monospace" fontWeight="700">{n.id}</text>
            </g>
          );
        })}
      </svg>
      <div style={{ fontSize:11, fontFamily:'JetBrains Mono,monospace', color:'#4a4d60' }}>
        Queue: [{current.join(', ')}] | Visited: {visited.join('→')}
      </div>
    </div>
  );
}

function LinkedListViz({ color }) {
  const vals=[5,12,3,8,1];
  const [hi,setHi]=useState(0);
  useEffect(()=>{ const id=setInterval(()=>setHi(h=>(h+1)%vals.length),800); return()=>clearInterval(id); },[]);
  return (
    <div style={{ padding:'16px 0', textAlign:'center' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:0 }}>
        <div style={{ fontSize:11, fontFamily:'JetBrains Mono,monospace', color:'#4a4d60', marginRight:8 }}>HEAD</div>
        <div style={{ width:8, height:1.5, background:'#4a4d60' }} />
        {vals.map((v,i)=>(
          <div key={i} style={{ display:'flex', alignItems:'center' }}>
            <div style={{
              display:'flex', border:`1.5px solid ${hi===i?color:'#2a2d3a'}`,
              borderRadius:7, overflow:'hidden', transition:'all .3s',
            }}>
              <div style={{ padding:'8px 12px', background:hi===i?'rgba(245,158,11,0.14)':'#111318', fontSize:13, fontWeight:700, fontFamily:'JetBrains Mono,monospace', color:hi===i?color:'#8b8fa8' }}>{v}</div>
              <div style={{ padding:'8px 8px', background:'#161820', fontSize:10, fontFamily:'JetBrains Mono,monospace', color:'#4a4d60', borderLeft:'1px solid #2a2d3a' }}>
                {i<vals.length-1?`→${vals[i+1]}`:'null'}
              </div>
            </div>
            {i<vals.length-1 && <div style={{ width:12, height:1.5, background:'#4a4d60' }} />}
          </div>
        ))}
      </div>
      <div style={{ marginTop:10, fontSize:11, fontFamily:'JetBrains Mono,monospace', color:'#4a4d60' }}>
        Traversing: node[{hi}] = {vals[hi]} <span style={{color:'#2a2d3a'}}>→</span> <span style={{color}}>{hi<vals.length-1?vals[hi+1]:'null'}</span>
      </div>
    </div>
  );
}

function LinkedListReverseViz({ color }) {
  const vals=[1,2,3,4,5];
  const steps=[
    {prev:null,curr:0,desc:'Initial state'},
    {prev:0,curr:1,desc:'Reversed: 1→null'},
    {prev:1,curr:2,desc:'Reversed: 2→1→null'},
    {prev:2,curr:3,desc:'Reversed: 3→2→1→null'},
    {prev:3,curr:4,desc:'Reversed: 4→3→2→1→null'},
    {prev:4,curr:null,desc:'Done! 5→4→3→2→1→null'},
  ];
  const [step,setStep]=useState(0);
  useEffect(()=>{ const id=setInterval(()=>setStep(s=>s>=steps.length-1?0:s+1),1000); return()=>clearInterval(id); },[]);
  const s=steps[step];
  return (
    <div style={{ padding:'14px 0', textAlign:'center' }}>
      <div style={{ display:'flex', gap:4, justifyContent:'center', marginBottom:10 }}>
        {vals.map((v,i)=>(
          <div key={i} style={{
            width:42, height:42, border:`1.5px solid ${i===s.curr?color:i===s.prev?'#22c55e':'#2a2d3a'}`,
            background: i===s.curr?'rgba(245,158,11,0.14)':i===s.prev?'rgba(34,197,94,0.1)':'#111318',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:13, fontWeight:700, fontFamily:'JetBrains Mono,monospace',
            color: i===s.curr?color:i===s.prev?'#22c55e':'#5a5f78', borderRadius:6,
          }}>{v}</div>
        ))}
      </div>
      <div style={{ display:'flex', gap:14, justifyContent:'center', marginBottom:8, fontSize:10, fontFamily:'JetBrains Mono,monospace' }}>
        <span style={{color:'#22c55e'}}>■ prev = {s.prev!==null?vals[s.prev]:'null'}</span>
        <span style={{color}}>■ curr = {s.curr!==null?vals[s.curr]:'null'}</span>
      </div>
      <div style={{ fontSize:11, fontFamily:'JetBrains Mono,monospace', color:'#8b8fa8' }}>{s.desc}</div>
    </div>
  );
}

function FloydCycleViz({ color }) {
  const positions=8; const cycleStart=3;
  const [slow,setSlow]=useState(0); const [fast,setFast]=useState(0); const [met,setMet]=useState(false);
  useEffect(()=>{
    if(met) return;
    const id=setInterval(()=>{
      setSlow(s=>{ const ns=(s+1)%positions; return ns; });
      setFast(f=>{ const nf=(f+2)%positions; return nf; });
    },700);
    return()=>clearInterval(id);
  },[met]);
  useEffect(()=>{ if(slow===fast&&slow!==0) setMet(true); },[slow,fast]);
  const angles=Array.from({length:positions},(_,i)=>(i/positions)*2*Math.PI-Math.PI/2);
  const nodePos=(i)=>({ x:50+38*Math.cos(angles[i]), y:50+38*Math.sin(angles[i]) });
  return (
    <div style={{ padding:'12px 0', textAlign:'center' }}>
      <div style={{ fontSize:10, fontFamily:'JetBrains Mono,monospace', color:'#4a4d60', marginBottom:6 }}>
        Cycle starts at node {cycleStart} | Slow=1x Fast=2x
      </div>
      <svg viewBox="0 0 100 100" style={{width:200,height:200,margin:'0 auto',display:'block'}}>
        {Array.from({length:positions},(_,i)=>{
          const next=(i===positions-1)?cycleStart:(i+1)%positions;
          const p1=nodePos(i),p2=nodePos(next);
          return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#2a2d3a" strokeWidth=".8"/>;
        })}
        {Array.from({length:positions},(_,i)=>{
          const p=nodePos(i),isSlow=i===slow,isFast=i===fast,isBoth=isSlow&&isFast;
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={5.5} fill={isBoth?'rgba(34,197,94,0.3)':isSlow?'rgba(245,158,11,0.3)':isFast?`rgba(108,142,247,0.3)`:`${i>=cycleStart?'rgba(108,142,247,0.05)':'#111318'}`} stroke={isBoth?'#22c55e':isSlow?'#f59e0b':isFast?color:i>=cycleStart?'rgba(108,142,247,0.3)':'#2a2d3a'} strokeWidth={1.2}/>
              <text x={p.x} y={p.y+1.5} textAnchor="middle" fontSize={3.5} fill={isBoth?'#22c55e':isSlow?'#f59e0b':isFast?color:'#5a5f78'} fontFamily="JetBrains Mono,monospace" fontWeight="700">{i}</text>
            </g>
          );
        })}
      </svg>
      <div style={{ display:'flex', gap:12, justifyContent:'center', fontSize:10, fontFamily:'JetBrains Mono,monospace' }}>
        <span style={{color:'#f59e0b'}}>● Slow = {slow}</span>
        <span style={{color}}>● Fast = {fast}</span>
        {met && <span style={{color:'#22c55e'}}>✓ Met! Cycle detected</span>}
      </div>
      {met && <button onClick={()=>{setSlow(0);setFast(0);setMet(false);}} style={{...btnStyle,marginTop:8}}>Reset</button>}
    </div>
  );
}

function MergeSortViz({ color }) {
  const arr=[38,27,43,3,9,82,10];
  const [phase,setPhase]=useState(0);
  const phases=[
    {label:'Original',...{data:[[38,27,43,3,9,82,10]]}},
    {label:'Split → halves',...{data:[[38,27,43],[3,9,82,10]]}},
    {label:'Split further',...{data:[[38],[27,43],[3,9],[82,10]]}},
    {label:'Base cases',...{data:[[38],[27],[43],[3],[9],[82],[10]]}},
    {label:'Merge pairs',...{data:[[27,38],[43],[3,9],[10,82]]}},
    {label:'Merge groups',...{data:[[27,38,43],[3,9,10,82]]}},
    {label:'Final sorted',...{data:[[3,9,10,27,38,43,82]]}},
  ];
  useEffect(()=>{ const id=setInterval(()=>setPhase(p=>p>=phases.length-1?0:p+1),1000); return()=>clearInterval(id); },[]);
  const p=phases[phase];
  return (
    <div style={{ padding:'14px 0', textAlign:'center' }}>
      <div style={{ fontSize:10, fontFamily:'JetBrains Mono,monospace', color:'#4a4d60', marginBottom:10 }}>
        Phase {phase+1}/{phases.length}: <span style={{color}}>{p.label}</span>
      </div>
      <div style={{ display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap' }}>
        {p.data.map((group,gi)=>(
          <div key={gi} style={{ display:'flex', gap:2, padding:'6px 8px', border:'1px solid #2a2d3a', borderRadius:8, background:'#111318' }}>
            {group.map((v,vi)=>(
              <div key={vi} style={{ width:36, height:36, border:`1px solid ${phase===phases.length-1?'#22c55e':color}`, background:phase===phases.length-1?'rgba(34,197,94,0.12)':'rgba(132,204,22,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, fontFamily:'JetBrains Mono,monospace', color:phase===phases.length-1?'#22c55e':color, borderRadius:5 }}>{v}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function BitViz({ color }) {
  const [num,setNum]=useState(42);
  const bits=Array.from({length:8},(_,i)=>(num>>(7-i))&1);
  return (
    <div style={{ padding:'14px 0', textAlign:'center' }}>
      <div style={{ fontSize:10, fontFamily:'JetBrains Mono,monospace', color:'#4a4d60', marginBottom:10 }}>
        Decimal: <span style={{color}}>{num}</span> | Binary representation (8-bit)
      </div>
      <div style={{ display:'flex', gap:4, justifyContent:'center', marginBottom:10 }}>
        {bits.map((b,i)=>(
          <div key={i} style={{ textAlign:'center' }}>
            <div style={{ fontSize:8, fontFamily:'JetBrains Mono,monospace', color:'#4a4d60', marginBottom:3 }}>{7-i}</div>
            <div style={{
              width:38, height:38, border:`1.5px solid ${b?color:'#2a2d3a'}`,
              background: b?'rgba(163,230,53,0.14)':'#111318',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:16, fontWeight:800, fontFamily:'JetBrains Mono,monospace',
              color: b?color:'#2a2d3a', borderRadius:6,
            }}>{b}</div>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:8 }}>
        {[1,5,10,42,100,255].map(v=>(
          <button key={v} onClick={()=>setNum(v)} style={{...btnStyle,color:num===v?color:'#4a4d60',background:num===v?'rgba(163,230,53,0.1)':'transparent',border:`1px solid ${num===v?color:'#2a2d3a'}`}}>{v}</button>
        ))}
      </div>
      <div style={{ fontSize:10, fontFamily:'JetBrains Mono,monospace', color:'#4a4d60' }}>
        Set bits: {bits.filter(b=>b).length} | n&(n-1)={num&(num-1)} | isPow2: {(num>0&&(num&(num-1))===0)?'yes':'no'}
      </div>
    </div>
  );
}

function getVisualizer(type, color) {
  const map = {
    'array-memory':          <ArrayMemoryViz color={color}/>,
    'two-pointer':           <TwoPointerViz color={color}/>,
    'sliding-window':        <SlidingWindowViz color={color}/>,
    'prefix-sum':            <PrefixSumViz color={color}/>,
    'kadane':                <KadaneViz color={color}/>,
    'stack-ops':             <StackOpsViz color={color}/>,
    'stack-parentheses':     <StackParenViz color={color}/>,
    'monotonic-stack':       <MonotonicStackViz color={color}/>,
    'binary-search-viz':     <BinarySearchViz color={color}/>,
    'binary-search-bound':   <BinarySearchViz color={color}/>,
    'bs-search-answer':      <BinarySearchViz color={color}/>,
    'dp-fibonacci':          <FibDPViz color={color}/>,
    'dp-patterns':           <FibDPViz color={color}/>,
    'dp-knapsack':           <FibDPViz color={color}/>,
    'dp-lcs':                <FibDPViz color={color}/>,
    'tree-traversal':        <TreeTraversalViz color={color}/>,
    'bst-search':            <TreeTraversalViz color={color}/>,
    'tree-dp-viz':           <TreeTraversalViz color={color}/>,
    'graph-bfs':             <GraphBFSViz color={color}/>,
    'graph-dfs':             <GraphBFSViz color={color}/>,
    'dijkstra':              <GraphBFSViz color={color}/>,
    'topo-sort-viz':         <GraphBFSViz color={color}/>,
    'linked-list-nodes':     <LinkedListViz color={color}/>,
    'linked-list-reverse':   <LinkedListReverseViz color={color}/>,
    'floyd-cycle':           <FloydCycleViz color={color}/>,
    'merge-sort-viz':        <MergeSortViz color={color}/>,
    'quick-sort-viz':        <MergeSortViz color={color}/>,
    'counting-sort-viz':     <MergeSortViz color={color}/>,
    'hash-viz':              <FibDPViz color={color}/>,
    'hash-freq-viz':         <FibDPViz color={color}/>,
    'hash-prefix-viz':       <PrefixSumViz color={color}/>,
    'bit-viz':               <BitViz color={color}/>,
    'xor-viz':               <BitViz color={color}/>,
    'bitmask-viz':           <BitViz color={color}/>,
  };
  return map[type] || <div style={{ padding:20, textAlign:'center', color:'#4a4d60', fontFamily:'JetBrains Mono,monospace', fontSize:12, border:'1px dashed #2a2d3a', borderRadius:8 }}>Visualizer loading...</div>;
}

/* ══════════════════════════════════════════════════════════════════════════
   CODE VIEWER COMPONENT
   ══════════════════════════════════════════════════════════════════════════ */
function CodeViewer({ codeKey, color }) {
  const [lang, setLang] = useState('javascript');
  const codeObj = CODE[codeKey];
  if (!codeObj) return null;
  const langs = Object.keys(codeObj);
  return (
    <div style={{ marginTop: 14, border: '1px solid #2a2d3a', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 14px', background:'#0d0e11', borderBottom:'1px solid #2a2d3a' }}>
        <span style={{ fontSize:10, fontFamily:'JetBrains Mono,monospace', color:'#4a4d60', textTransform:'uppercase', letterSpacing:'.6px' }}>// Code</span>
        <div style={{ display:'flex', gap:5 }}>
          {langs.map(l => (
            <button key={l} onClick={() => setLang(l)} style={{
              padding:'3px 9px', borderRadius:5, cursor:'pointer',
              fontSize:10, fontFamily:'JetBrains Mono,monospace', fontWeight:600,
              color: lang===l ? color : '#4a4d60',
              background: lang===l ? `rgba(108,142,247,0.12)` : 'transparent',
              border: `1px solid ${lang===l ? color : '#2a2d3a'}`,
              transition:'all .15s',
            }}>{l === 'javascript' ? 'JS' : l === 'java' ? 'Java' : 'C++'}</button>
          ))}
        </div>
      </div>
      <pre style={{
        margin:0, padding:'14px 16px', background:'#0d0e11',
        fontFamily:'JetBrains Mono,monospace', fontSize:11, lineHeight:1.7,
        color:'#8b8fa8', overflowX:'auto', maxHeight:320, overflowY:'auto',
      }}>
        <code style={{ color:'#c4c7d8' }}>{codeObj[lang]}</code>
      </pre>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   STYLES
   ══════════════════════════════════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Syne:wght@400;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width:4px; height:4px; } ::-webkit-scrollbar-thumb { background:#2a2d3a; border-radius:4px; }

  .tp-root { min-height:100vh; background:#0d0e11; color:#e8eaf0; font-family:'Syne',sans-serif; }

  .tp-nav { display:flex; align-items:center; justify-content:space-between; padding:0 24px; height:48px; background:#111318; border-bottom:1px solid #2a2d3a; position:sticky; top:0; z-index:50; }
  .tp-nav-left { display:flex; align-items:center; gap:12px; }
  .tp-back { display:flex; align-items:center; gap:6px; padding:5px 12px; border-radius:7px; font-size:12px; font-weight:600; color:#5a5f78; border:1px solid #2a2d3a; background:transparent; text-decoration:none; transition:all .15s; }
  .tp-back:hover { color:#e8eaf0; border-color:#3d4155; background:#1c1f28; }

  .tp-page { max-width:860px; margin:0 auto; padding:40px 24px 80px; }

  .tp-header { margin-bottom:36px; }
  .tp-header-top { display:flex; align-items:center; gap:16px; margin-bottom:16px; }
  .tp-icon { width:54px; height:54px; border-radius:13px; display:flex; align-items:center; justify-content:center; font-size:20px; font-weight:800; font-family:'JetBrains Mono',monospace; flex-shrink:0; }
  .tp-title { font-size:28px; font-weight:800; letter-spacing:-.5px; }
  .tp-intro { font-size:13px; color:#8b8fa8; line-height:1.85; white-space:pre-line; }

  .tp-complexity { display:flex; gap:8px; flex-wrap:wrap; margin-top:20px; }
  .tp-cx { padding:8px 14px; border-radius:9px; border:1px solid #2a2d3a; background:#111318; text-align:center; }
  .tp-cx-op { font-size:9px; color:#4a4d60; text-transform:uppercase; letter-spacing:.6px; font-family:'JetBrains Mono',monospace; }
  .tp-cx-val { font-size:14px; font-weight:700; font-family:'JetBrains Mono',monospace; margin-top:2px; }

  .tp-section { border:1px solid #2a2d3a; border-radius:14px; overflow:hidden; margin-bottom:16px; background:#111318; animation:tp-fi .3s ease both; }
  @keyframes tp-fi { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }

  .tp-section-hd { padding:14px 20px; background:#161820; border-bottom:1px solid transparent; display:flex; align-items:center; gap:10px; cursor:pointer; user-select:none; transition:background .15s; }
  .tp-section-hd:hover { background:#1c1f28; }
  .tp-section-hd.open { border-bottom-color:#2a2d3a; }
  .tp-section-num { width:22px; height:22px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:800; font-family:'JetBrains Mono',monospace; flex-shrink:0; }
  .tp-section-title { font-size:14px; font-weight:700; flex:1; }
  .tp-chevron { transition:transform .2s; color:#4a4d60; flex-shrink:0; }
  .tp-chevron.open { transform:rotate(180deg); }

  .tp-section-body { padding:20px; }
  .tp-content { font-size:13px; color:#8b8fa8; line-height:1.85; white-space:pre-line; margin-bottom:14px; }

  .tp-viz-box { border:1px solid #2a2d3a; border-radius:10px; background:#0d0e11; padding:14px; }
  .tp-viz-label { font-size:9px; font-family:'JetBrains Mono',monospace; color:#4a4d60; text-transform:uppercase; letter-spacing:.8px; margin-bottom:6px; }

  .tp-keypoints { border:1px solid #2a2d3a; border-radius:14px; padding:22px; margin-bottom:16px; background:#111318; }
  .tp-kp-title { font-size:10px; font-weight:700; font-family:'JetBrains Mono',monospace; color:#4a4d60; text-transform:uppercase; letter-spacing:.8px; margin-bottom:14px; }
  .tp-kp-list { list-style:none; display:grid; gap:8px; }
  .tp-kp-item { font-size:12px; color:#8b8fa8; padding-left:16px; position:relative; line-height:1.55; }
  .tp-kp-item::before { content:'›'; position:absolute; left:0; font-weight:700; }

  .tp-problems { border:1px solid #2a2d3a; border-radius:14px; padding:22px; background:#111318; }
  .tp-pb-title { font-size:10px; font-weight:700; font-family:'JetBrains Mono',monospace; color:#4a4d60; text-transform:uppercase; letter-spacing:.8px; margin-bottom:14px; }
  .tp-pb-list { display:grid; gap:8px; }
  .tp-pb-item { display:flex; align-items:center; justify-content:space-between; padding:10px 14px; border-radius:8px; background:#0d0e11; border:1px solid #1e2130; font-size:13px; }
  .tp-diff { font-size:9px; font-weight:700; font-family:'JetBrains Mono',monospace; padding:2px 7px; border-radius:20px; border:1px solid; text-transform:uppercase; letter-spacing:.4px; }
  .d-easy   { color:#22c55e; background:rgba(34,197,94,.08);  border-color:rgba(34,197,94,.25); }
  .d-medium { color:#f59e0b; background:rgba(245,158,11,.08); border-color:rgba(245,158,11,.25); }
  .d-hard   { color:#ef4444; background:rgba(239,68,68,.08);  border-color:rgba(239,68,68,.25); }

  .tp-404 { text-align:center; padding:80px 20px; }
  .tp-404 h2 { font-size:22px; margin-bottom:10px; }
  .tp-404 p  { color:#4a4d60; font-family:'JetBrains Mono',monospace; font-size:12px; margin-top:6px; }
  .ps-logo {
  width: 26px;
  height: 26px;
  background: linear-gradient(135deg, #6c8ef7, #4f6cf7);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  color: white;
  font-family: 'JetBrains Mono', monospace;
}
  .ps-brand-text {
  font-size: 13px;
  font-weight: 600;
  color: #cfd3ff;
  letter-spacing: 0.3px;
}
  html {
  font-size: 110%; /* increases overall font size */
}
`;

/* ══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════════════════ */
export default function DSATopic() {
  const { slug } = useParams();
  const [open, setOpen] = useState({});
  const topic = TOPIC_DATA[slug];
  const toggle = i => setOpen(s => ({ ...s, [i]: !s[i] }));

  const diffColor = d => d==='Beginner'?{c:'#22c55e',bg:'rgba(34,197,94,.08)',b:'rgba(34,197,94,.25)'}:d==='Intermediate'?{c:'#f59e0b',bg:'rgba(245,158,11,.08)',b:'rgba(245,158,11,.25)'}:{c:'#ef4444',bg:'rgba(239,68,68,.08)',b:'rgba(239,68,68,.25)'};

  return (
    <>
      <style>{STYLES}</style>
      <div className="tp-root">
        <nav className="tp-nav">
          <div className="tp-nav-left">
            <div className="ps-brand">
            <NavLink to="/" className="ps-brand">
           <span className="ps-logo">CB</span>
          </NavLink>
           </div>
            <NavLink to="/topics" className="tp-back">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              Topics
            </NavLink>
            {topic && <span style={{ fontSize:13, fontWeight:700, color:topic.color }}>{topic.title}</span>}
          </div>
        </nav>

        <div className="tp-page">
          {!topic ? (
            <div className="tp-404">
              <h2>Topic coming soon</h2>
              <p>"{slug}" page is being built.</p>
              <p style={{ marginTop:8 }}>Available: arrays · linked-list · stack · binary-search · sorting · hashing · bit-manipulation · trees · graphs · dynamic-programming</p>
              <NavLink to="/topics" style={{ color:'#6c8ef7', display:'inline-block', marginTop:16, fontSize:12 }}>← All topics</NavLink>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="tp-header">
                <div className="tp-header-top">
                  <div className="tp-icon" style={{ background:topic.bg, border:`1px solid ${topic.border}`, color:topic.color }}>{topic.title.charAt(0)}</div>
                  <div>
                    <div className="tp-title">{topic.title}</div>
                    <span style={{ fontSize:10, fontWeight:700, fontFamily:'JetBrains Mono,monospace', padding:'2px 8px', borderRadius:20, border:'1px solid', textTransform:'uppercase', letterSpacing:'.4px', display:'inline-block', marginTop:6, color:diffColor(topic.difficulty).c, background:diffColor(topic.difficulty).bg, borderColor:diffColor(topic.difficulty).b }}>
                      {topic.difficulty}
                    </span>
                  </div>
                </div>
                <p className="tp-intro">{topic.intro}</p>
                <div className="tp-complexity">
                  {Object.entries(topic.timeComplexity).map(([op,val])=>(
                    <div key={op} className="tp-cx">
                      <div className="tp-cx-op">{op}</div>
                      <div className="tp-cx-val" style={{color:topic.color}}>{val}</div>
                    </div>
                  ))}
                  <div className="tp-cx">
                    <div className="tp-cx-op">Space</div>
                    <div className="tp-cx-val" style={{color:'#a78bfa'}}>{topic.spaceComplexity}</div>
                  </div>
                </div>
              </div>

              {/* Sections */}
              {topic.sections.map((sec, i) => (
                <div key={i} className="tp-section" style={{ animationDelay:`${i*.07}s` }}>
                  <div className={`tp-section-hd ${open[i]!==false?'open':''}`} onClick={() => toggle(i)}>
                    <div className="tp-section-num" style={{ background:topic.bg, border:`1px solid ${topic.border}`, color:topic.color }}>{i+1}</div>
                    <span className="tp-section-title">{sec.title}</span>
                    <svg className={`tp-chevron ${open[i]!==false?'open':''}`} width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  {open[i] !== false && (
                    <div className="tp-section-body">
                      <div className="tp-content">{sec.content}</div>
                      {sec.visualizer && (
                        <div className="tp-viz-box">
                          <div className="tp-viz-label">// Interactive Visualizer</div>
                          {getVisualizer(sec.visualizer, topic.color)}
                        </div>
                      )}
                      {sec.code && <CodeViewer codeKey={sec.code} color={topic.color} />}
                    </div>
                  )}
                </div>
              ))}

              {/* Key Points */}
              <div className="tp-keypoints">
                <div className="tp-kp-title">Key Takeaways</div>
                <ul className="tp-kp-list">
                  {topic.keyPoints.map((pt,i)=>(
                    <li key={i} className="tp-kp-item" style={{'--accent':topic.color}}>
                      <span style={{position:'absolute',left:0,color:topic.color}}>›</span>{pt}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Problems */}
              <div className="tp-problems">
                <div className="tp-pb-title">Common Problems ({topic.commonProblems.length})</div>
                <div className="tp-pb-list">
                  {topic.commonProblems.map((p,i)=>(
                    <div key={i} className="tp-pb-item">
                      <span>{p.name}</span>
                      <span className={`tp-diff d-${p.difficulty}`}>{p.difficulty}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
