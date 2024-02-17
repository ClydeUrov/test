import { NextApiRequest, NextApiResponse } from "next";

let requestCount = 0;
let lastRequestTime = 0;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const index = parseInt(req.query.index as string);

  requestCount++;

  if (requestCount > 50) {
    res.status(429).json({ error: `Too many requests: ${requestCount}` });
    if(index === 1000) {
      requestCount = 0
    }
    return;
  }

  const delay = Math.floor(Math.random() * 1000) + 1;

  if (lastRequestTime !== 0) {
    const timeDifference = Date.now() - lastRequestTime;
    const timeToWait = 1000 / 50 - timeDifference;

    if (timeToWait > 0) {
      await new Promise((resolve) => setTimeout(resolve, timeToWait));
    }
  }

  lastRequestTime = Date.now();

  setTimeout(() => {
    requestCount--;
  }, delay);

  if(requestCount > 50) {
    res.status(429).json({ error: `Too many requests: ${requestCount}` });
    return;
  } else {
    res.json({
      index: index
    });
  }
};
