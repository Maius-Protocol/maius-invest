// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  HandleCreateQueue,
  StopCreateQueue,
} from "../../src/api/core/maius_invest/hello_world_clock";

type Data = {
  thread_transaction: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const thread_transaction = await HandleCreateQueue();
  if (thread_transaction) {
    res.status(200).json({ thread_transaction });
  } else {
    res.status(500);
  }
}
