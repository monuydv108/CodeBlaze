const axios = require('axios');

// ce.judge0.com — official free public instance, no API key required
const JUDGE0_BASE_URL = 'https://ce.judge0.com';

const getLanguageById = (lang) => {
  const language = {
    "c++":        54,
    "java":       62,
    "javascript": 63,
  };
  return language[lang.toLowerCase()];
};

const submitBatch = async (submissions) => {
  try {
    console.log('[submitBatch] Sending', submissions.length, 'submission(s) to Judge0');

    const response = await axios.post(
      `${JUDGE0_BASE_URL}/submissions/batch`,
      { submissions },
      {
        params: { base64_encoded: 'false' },
        headers: { 'Content-Type': 'application/json' },
      }
    );

    // response.data = [{ token: "abc..." }, { token: "xyz..." }, ...]
    const tokens = response.data.map((item) => item.token);
    console.log('[submitBatch] Tokens received:', tokens);
    return tokens;

  } catch (error) {
    console.error('[submitBatch] Error:', error.response?.data || error.message);
    throw error;
  }
};

// Properly waits using Promise — setTimeout alone doesn't work with async/await
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const submitToken = async (tokens) => {
  const MAX_RETRIES = 10;
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    try {
      const response = await axios.get(
        `${JUDGE0_BASE_URL}/submissions/batch`,
        {
          params: {
            tokens:        tokens.join(','),
            base64_encoded: 'false',
            fields:        '*',
          },
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const { submissions } = response.data;

      // status_id 1 = In Queue, 2 = Processing, >2 = done
      const isDone = submissions.every((r) => r.status_id > 2);

      if (isDone) {
        console.log('[submitToken] All done after', attempts + 1, 'poll(s)');
        return submissions;
      }

      console.log('[submitToken] Still processing, retrying in 1s... attempt', attempts + 1);
      await wait(1000);
      attempts++;

    } catch (error) {
      console.error('[submitToken] Error:', error.response?.data || error.message);
      throw error;
    }
  }

  throw new Error('Judge0 timed out after ' + MAX_RETRIES + ' attempts');
};

module.exports = { getLanguageById, submitBatch, submitToken };