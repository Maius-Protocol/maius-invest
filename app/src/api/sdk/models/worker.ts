import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { THREAD_PROGRAM_ID } from "./thread";

const SEED_WORKER = "worker";

export class Worker {
  // The worker's authority (owner).
  public authority: PublicKey;
  // The number of lamports claimable by the authority as commission for running the worker.
  public commission_balance: BN;
  // Integer between 0 and 100 determining the percentage of fees worker will keep as commission.
  public commission_rate: BN;
  // The worker's id.
  public id: BN;
  // The worker's signatory address (used to sign txs).
  public signatory: PublicKey;
  // The number delegations allocated to this worker.
  public total_delegations: BN;

  constructor(
    authority: PublicKey,
    commission_balance: BN,
    commission_rate: BN,
    id: BN,
    signatory: PublicKey,
    total_delegations: BN
  ) {
    this.authority = authority;
    this.commission_balance = commission_balance;
    this.commission_rate = commission_rate;
    this.id = id;
    this.signatory = signatory;
    this.total_delegations = total_delegations;
  }

  static async pubkey(id: BN): Promise<PublicKey> {
    const [pubkey] = await PublicKey.findProgramAddress(
      [Buffer.from(SEED_WORKER), Buffer.from(id.toString())],
      THREAD_PROGRAM_ID
    );

    return pubkey;
  }
}
