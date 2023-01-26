// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { StopQueue } from "../../src/api/core/maius_invest/maius_invest";

type Data = {
  thread_transaction: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const thread_transaction = await StopQueue(
    "CCh3YvmoZyek7Koj2zB1khr4yD4NhJRoR6FJiZkEXneb",
    "HVUo94uHtVCxeANMrbBqGN71Grsrhc6fbY38LyQFEQjk"
  );

  if (thread_transaction) {
    res.status(200).json({ thread_transaction });
  } else {
    res.status(500);
  }
}
