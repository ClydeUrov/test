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
        res.status(429).json({ error: `Too many requests in one second` });
        return;
    }

    const delay = Math.floor(Math.random() * 10) + 1;

    setTimeout(() => {
      requestsInCurrentSecond++;
      res.json({ index: index });
    }, delay);
};