import { NextApiRequest, NextApiResponse } from "next";

let requestsInCurrentSecond = 0;
const maxRequestsPerSecond = 50;
let lastSecondTimestamp = Math.floor(Date.now() / 1000);

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const index = parseInt(req.query.index as string);

    const currentSecondTimestamp = Math.floor(Date.now() / 1000);
    if (currentSecondTimestamp > lastSecondTimestamp) {
        lastSecondTimestamp = currentSecondTimestamp;
        requestsInCurrentSecond = 0;
    }

    if (requestsInCurrentSecond >= maxRequestsPerSecond) {
        return res.status(429).json({ error: `Too many requests in one second` });
    }

    requestsInCurrentSecond++;

    const delay = Math.floor(Math.random() * 1000) + 1;

    setTimeout(() => {
      console.log(requestsInCurrentSecond, delay);
      res.json({ index: index });
    }, delay);
};