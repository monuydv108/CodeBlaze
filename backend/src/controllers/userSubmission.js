const Problem = require("../models/problem");
const Submission = require("../models/submission");
const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");

// Normalizes any language variant to what the Submission model enum expects:
// enum: ['javascript', 'c++', 'java']
const normalizeLanguage = (lang) => {
  if (!lang) return '';
  const lower = lang.toLowerCase().trim();
  if (lower === 'c++' || lower === 'cpp') return 'c++';
  if (lower === 'javascript' || lower === 'js') return 'javascript';
  if (lower === 'java') return 'java';
  return lower;
};

const judgeStatus = (id) => {
  switch (id) {
    case 3:  return 'accepted';
    case 4:  return 'wrong';
    case 5:  return 'tle';
    case 6:  return 'error';
    default: return 'error';
  }
};

const submitCode = async (req, res) => {
  try {
    const userId    = req.result._id;
    const problemId = req.params.id;
    const { code, language } = req.body;

    if (!userId || !code || !problemId || !language)
      return res.status(400).send("Some field missing");

    const normalizedLang = normalizeLanguage(language);

    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).send("Problem not found");

    const submittedResult = await Submission.create({
      userId,
      problemId,
      code,
      language:       normalizedLang,
      status:         'pending',
      testCasesTotal: problem.hiddenTestCases.length,
    });

    const languageId  = getLanguageById(normalizedLang);
    const submissions = problem.hiddenTestCases.map((tc) => ({
      source_code:     code,
      language_id:     languageId,
      stdin:           tc.input,
      expected_output: tc.output,
    }));

    const tokens     = await submitBatch(submissions);
    const testResult = await submitToken(tokens);
    //console.log('[SUBMIT] Judge0 results:', testResult);

    let testCasesPassed = 0;
    let runtime         = 0;
    let memory          = 0;
    let status          = 'accepted';
    let errorMessage    = null;

    for (const test of testResult) {
      if (test.status_id === 3) {
        testCasesPassed++;
        runtime += parseFloat(test.time || 0);
        memory   = Math.max(memory, test.memory || 0);
      } else {
        if (status === 'accepted') {
          status       = judgeStatus(test.status_id);
          errorMessage = test.stderr || test.compile_output || test.message || null;
        }
      }
    }

    submittedResult.status          = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.errorMessage    = errorMessage;
    submittedResult.runtime         = parseFloat(runtime.toFixed(3));
    submittedResult.memory          = memory;
    await submittedResult.save();

    if (status === 'accepted' && !req.result.problemSolved.includes(problemId)) {
      req.result.problemSolved.push(problemId);
      await req.result.save();
    }

    return res.status(201).json({
      accepted:        status === 'accepted',
      totalTestCases:  submittedResult.testCasesTotal,
      passedTestCases: testCasesPassed,
      runtime:         submittedResult.runtime,
      memory,
      error:           status !== 'accepted' ? (errorMessage || status) : null,
    });

  } catch (err) {
    console.error('[SUBMIT] Error:', err);
    return res.status(500).send("Internal Server Error: " + err.message);
  }
};

const runCode = async (req, res) => {
  try {
    const userId    = req.result._id;
    const problemId = req.params.id;
    const { code, language } = req.body;

    if (!userId || !code || !problemId || !language)
      return res.status(400).send("Some field missing");
    console.log("hello world")

    const normalizedLang = normalizeLanguage(language);

    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).send("Problem not found");

    const languageId  = getLanguageById(normalizedLang);
    const submissions = problem.visibleTestCases.map((tc) => ({
      source_code:     code,
      language_id:     languageId,
      stdin:           tc.input,
      expected_output: tc.output,
    }));

    const tokens     = await submitBatch(submissions);
    const testResult = await submitToken(tokens);
    //console.log('[RUN] Judge0 results:', testResult);

    let allPassed = true;
    let runtime   = 0;
    let memory    = 0;

    for (const test of testResult) {
      if (test.status_id === 3) {
        runtime += parseFloat(test.time || 0);
        memory   = Math.max(memory, test.memory || 0);
      } else {
        allPassed = false;
      }
    }

    return res.status(200).json({
      success:   allPassed,
      testCases: testResult,
      runtime:   parseFloat(runtime.toFixed(3)),
      memory,
    });

  } catch (err) {
    console.error('[RUN] Error:', err);
    return res.status(500).send("Internal Server Error: " + err.message);
  }
};

module.exports = { submitCode, runCode };

//     language_id: 54,
//     stdin: '2 3',
//     expected_output: '5',
//     stdout: '5',
//     status_id: 3,
//     created_at: '2025-05-12T16:47:37.239Z',
//     finished_at: '2025-05-12T16:47:37.695Z',
//     time: '0.002',
//     memory: 904,
//     stderr: null,
//     token: '611405fa-4f31-44a6-99c8-6f407bc14e73',