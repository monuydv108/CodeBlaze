const json ={
  "title": "Sum of Two Numbers",
  "description": "Given two integers, return their sum.",
  "difficulty": "easy",
  "tags": "array",

  "visibleTestCases": [
    {
      "input": "2 3",
      "output": "5",
      "explanation": "2 + 3 = 5"
    },
    {
      "input": "10 20",
      "output": "30",
      "explanation": "10 + 20 = 30"
    }
  ],

  "hiddenTestCases": [
    {
      "input": "100 200",
      "output": "300"
    },
    {
      "input": "7 8",
      "output": "15"
    }
  ],

  "startCode": [
    {
      "language": "javascript",
      "initialCode": "function solve(input) {\n  // write code here\n}\n"
    },
    {
      "language": "c++",
      "initialCode": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n  // write code here\n}\n"
    }
  ],

  "referenceSolution": [
    {
      "language": "javascript",
      "completeCode": "const fs = require('fs');\nconst input = fs.readFileSync(0,'utf-8').trim().split(' ');\nconst a = Number(input[0]);\nconst b = Number(input[1]);\nconsole.log(a + b);"
    },
    {
      "language": "c++",
      "completeCode": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n  int a,b;\n  cin>>a>>b;\n  cout<<a+b;\n  return 0;\n}"
    }
  ],

  "problemCreator": "64f1c2a5e4b0f2a1c8a12345"
}