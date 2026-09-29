🚀 LEETCODE BACKEND REQUIREMENTS (COMPLETE LIST)
🧑‍💻 1. Authentication & User
User signup/login (JWT or cookies)
Logout
User profile
Track solved problems
Track submissions
📚 2. Problem Management
Create problem (admin)
Update/delete problem
Get all problems (with pagination + filters)
Get single problem by ID
Fields:
title
description
difficulty
tags
constraints
examples
visible testcases
hidden testcases (secure ❗)
⚙️ 3. Code Execution (Run)
Run code on visible testcases
Return:
stdout
runtime
memory
errors
No DB storage required
🧪 4. Code Submission (Submit)
Run code on hidden testcases
Store submission in DB
Return:
status (accepted / wrong / error)
testCasesPassed
runtime
memory
Prevent duplicate solve marking
📊 5. Submission System
Store:
userId
problemId
code
language
status
runtime
memory
APIs:
Get all submissions (user)
Get submissions by problem
Get single submission
⏳ 6. Execution Handling
Async execution (polling or queue)
Status flow:
pending → running → completed
Handle:
compile error
runtime error
time limit exceeded
🚫 7. Rate Limiting
Limit requests per user/IP
Separate limits:
run (loose)
submit (strict)
🔐 8. Security
Never expose hidden testcases
Validate inputs
Sanitize code input
Protect routes (auth middleware)
🧠 9. Output Evaluation
Trim output ("5" vs "5\n")
Handle edge cases:
whitespace
empty output
(optional) floating point tolerance
📈 10. Pagination & Filtering
Problems:
page, limit
difficulty filter
tag filter
Submissions:
page, limit
sort (latest, runtime)
⚡ 11. Performance (Optional but Important)
Caching (Redis)
Queue system (BullMQ)
Avoid blocking requests
🪵 12. Logging & Error Handling
Global error handler
Log:
submissions
failures
system errors
🌐 13. API Standards
Consistent response format:
{
  "success": true,
  "data": {},
  "message": ""
}
Proper HTTP status codes
🔄 14. Environment & Config
Use .env for:
DB URI
JWT secret
API keys
No hardcoding ❌
🌍 15. CORS & Deployment
Enable CORS
Configurable PORT
Ready for deployment (Render / AWS / etc.)