import Editor from '@monaco-editor/react';

export const STARTER_CODE = {
  javascript: `/**
 * Write your solution below
 */
function solve(input) {
    // your code here
};`,

  java: `import java.util.*;

public class Solution {
    public int solve(int[] nums) {
        // your code here
        return 0;
    }
}`,

  cpp: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int solve(vector<int>& nums) {
        // your code here
    }
};`,
};

/* ─── localStorage helpers ───────────────────────────────────────────────── */

// Key format: "blaze_code_{problemId}_{language}"
export const CODE_STORAGE = {
  key: (problemId, language) => `blaze_code_${problemId}_${language}`,

  save: (problemId, language, code) => {
    if (!problemId || !language) return;
    try {
      localStorage.setItem(CODE_STORAGE.key(problemId, language), code);
    } catch (e) {
      // localStorage full — silently ignore
    }
  },

  load: (problemId, language) => {
    if (!problemId || !language) return null;
    try {
      return localStorage.getItem(CODE_STORAGE.key(problemId, language));
    } catch (e) {
      return null;
    }
  },

  // Call this when submission is accepted — optionally clear saved code
  clear: (problemId, language) => {
    if (!problemId || !language) return;
    try {
      localStorage.removeItem(CODE_STORAGE.key(problemId, language));
    } catch (e) {}
  },

  // Clear all saved code for a problem (all languages)
  clearAll: (problemId) => {
    if (!problemId) return;
    try {
      ['javascript', 'java', 'cpp'].forEach(lang => {
        localStorage.removeItem(CODE_STORAGE.key(problemId, lang));
      });
    } catch (e) {}
  },
};

export default function CodeEditor({ language, value, onChange }) {
  return (
    <Editor
      height="100%"
      language={language === 'cpp' ? 'cpp' : language}
      value={value}
      theme="vs-dark"
      onChange={onChange}
      options={{
        fontSize: 14,
        fontFamily: "'Fira Code', 'Cascadia Code', monospace",
        fontLigatures: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        lineNumbers: 'on',
        renderLineHighlight: 'all',
        bracketPairColorization: { enabled: true },
        padding: { top: 16 },
      }}
    />
  );
}
