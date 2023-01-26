import { BN, Instruction } from "@project-serum/anchor";
import { PublicKey, AccountMeta } from "@solana/web3.js";
import { ClockData } from "./clock";

export class InstructionData {
  programId: PublicKey;
  accounts: AccountMetaData[];
  data: Uint8Array;
  constructor(
    programId: PublicKey,
    accounts: AccountMetaData[],
    data: Uint8Array
  ) {
    this.programId = programId;
    this.accounts = accounts;
    this.data = data;
  }
}

export class AccountMetaData {
  pubkey: PublicKey;
  isSigner: boolean;
  isWritable: boolean;
  constructor(pubkey: PublicKey, isSigner: boolean, isWritable?: boolean) {
    this.pubkey = pubkey;
    this.isSigner = isSigner;
    this.isWritable = isWritable || true;
  }

  public static newReadonly(pubkey: PublicKey, isSigner: boolean) {
    return new AccountMetaData(pubkey, isSigner, false);
  }
}

enum TriggerContext {
  Account = "Account",
  Cron = "Cron",
  Immediate = "Immediate",
}

interface AccountTriggerContext {
  data_hash: BN;
  type: TriggerContext.Account;
}

interface CronTriggerContext {
  started_at: number;
  type: TriggerContext.Cron;
}

type ImmediateTriggerContext = {
  type: TriggerContext.Immediate;
};

type TriggerContextUnion =
  | AccountTriggerContext
  | CronTriggerContext
  | ImmediateTriggerContext;

enum Trigger {
  Account = "Account",
  Cron = "Cron",
  Immediate = "Immediate",
}

interface AccountTrigger {
  address: PublicKey;
  offset: number;
  size: number;
  type: Trigger.Account;
}

interface CronTrigger {
  schedule: string;
  skippable: boolean;
  type: Trigger.Cron;
}

type ImmediateTrigger = {
  type: Trigger.Immediate;
};

type TriggerUnion = AccountTrigger | CronTrigger | ImmediateTrigger;

export class ExecContext {
  /**
   * Number of execs since the last tx reimbursement.
   */
  execs_since_reimbursement: BN;

  /**
   * Number of execs in this slot.
   */
  execs_since_slot: BN;

  /**
   * Slot of the last exec
   */
  last_exec_at: BN;

  /**
   * Context for the triggering condition
   */
  trigger_context: TriggerContextUnion;

  constructor(
    execs_since_reimbursement: BN,
    execs_since_slot: BN,
    last_exec_at: BN,
    trigger_context: TriggerContextUnion
  ) {
    this.execs_since_reimbursement = execs_since_reimbursement;
    this.execs_since_slot = execs_since_slot;
    this.last_exec_at = last_exec_at;
    this.trigger_context = trigger_context;
  }
}

export const SEED_THREAD = "thread";

export const THREAD_PROGRAM_ID = new PublicKey(
  "3XXuUFfweXBwFgFfYaejLvZE4cGZiHgKiGfMtdxNzYmv"
);

export class Thread {
  authority: PublicKey;
  created_at: ClockData;
  exec_context: undefined | ExecContext;
  fee: number;
  id: string;
  kickoff_instruction: InstructionData;
  next_instruction: InstructionData;
  paused: boolean;
  rate_limit: number;
  trigger: TriggerUnion;

  constructor(
    authority: PublicKey,
    created_at: ClockData,
    exec_context: undefined | ExecContext,
    fee: number,
    id: string,
    kickoff_instruction: InstructionData,
    next_instruction: InstructionData,
    paused: boolean,
    rate_limit: number,
    trigger: TriggerUnion
  ) {
    this.authority = authority;
    this.created_at = created_at;
    this.exec_context = exec_context;
    this.fee = fee;
    this.id = id;
    this.kickoff_instruction = kickoff_instruction;
    this.next_instruction = next_instruction;
    this.paused = paused;
    this.rate_limit = rate_limit;
    this.trigger = trigger;
  }

  static async pubkey(authority: PublicKey, id: string): Promise<PublicKey> {
    const [pubkey] = await PublicKey.findProgramAddress(
      [Buffer.from(SEED_THREAD), authority.toBuffer(), Buffer.from(id)],
      THREAD_PROGRAM_ID
    );
    return pubkey;
  }
}
