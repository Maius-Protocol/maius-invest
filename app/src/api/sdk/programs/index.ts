import { Program, ProgramAccount } from "@project-serum/anchor";
import {
  IdlTypes,
  TypeDef,
} from "@project-serum/anchor/dist/cjs/program/namespace/types";

import {
  ThreadProgram as ThreadProgramType,
  IDL as ThreadProgramIdl_v1_3_15,
} from "./thread_program/v1.3.15";
import {
  NetworkProgram as NetworkProgramType,
  IDL as NetworkProgramIdl_v1_3_15,
} from "./network_program/v1.3.15";
import {
  WebhookProgram as WebhookProgramType,
  IDL as WebhookProgramIdl_v1_3_15,
} from "./webhook_program/v1.3.15";
import {
  HelloClockwork,
  IDL as HelloClockworkIdl_v0_1_0,
} from "./hello_clockwork/v0.1.0";

import {
  MaiusInvest,
  IDL as MaiusInvestIdl_v0_1_0,
} from "./maius_invest/v.0.1.0";

import { PublicKey } from "@solana/web3.js";

export type Thread = ProgramAccount<TypeDef<any, IdlTypes<ThreadProgramType>>>;

// Clockwork program types
export type ThreadProgram = Program<ThreadProgramType>;
export type NetworkProgram = Program<NetworkProgramType>;
export type WebhookProgram = Program<WebhookProgramType>;
// Clockwork example program types
export type HelloClockworkProgram = Program<HelloClockwork>;
export type MaiusInvestProgram = Program<MaiusInvest>

// All program types
export type ClockworkProgram =
  | ThreadProgram
  | NetworkProgram
  | WebhookProgram
  | HelloClockworkProgram
  | MaiusInvestProgram;

// Clockwork Program Addreses
export const CLOCKWORK_THREAD_PROGRAM_ADDRESS =
  "3XXuUFfweXBwFgFfYaejLvZE4cGZiHgKiGfMtdxNzYmv";
export const CLOCKWORK_NETWORK_PROGRAM_ADDRESS =
  "F8dKseqmBoAkHx3c58Lmb9TgJv5qeTf3BbtZZSEzYvUa";
// export const CLOCKWORK_WEBHOOK_PROGRAM_ADDRESS =
//   "E7p5KFo8kKCDm6BUnWtnVFkQSYh6ZA6xaGAuvpv8NXTa";
// Clockwork Example Program Addreses
export const HELLO_CLOCKWORK_PROGRAM_ADDRESS =
  "G6JvJ96AEUsjQYaRckUMb4xUCQg1N3Sqy8DTiYnD2nw7";
export const MAIUS_INVEST_PROGRAM_ADDRESS =
    "7X2kkXFnHhttekGaCDnZZskfyj6n2Fq47rEzxrX9CSHm";

// Pubkey utility export
export const CLOCKWORK_THREAD_PROGRAM_ID = new PublicKey(
  CLOCKWORK_THREAD_PROGRAM_ADDRESS
);
export const CLOCKWORK_NETWORK_PROGRAM_ID = new PublicKey(
  CLOCKWORK_NETWORK_PROGRAM_ADDRESS
);
// export const CLOCKWORK_WEBHOOK_PROGRAM_ID = new PublicKey(
//   CLOCKWORK_WEBHOOK_PROGRAM_ADDRESS
// );
export const HELLO_CLOCKWORK_PROGRAM_ID = new PublicKey(
  HELLO_CLOCKWORK_PROGRAM_ADDRESS
);

export const MAIUS_PROGRAM_ID = new PublicKey(
    MAIUS_INVEST_PROGRAM_ADDRESS
)

// Be careful with ordering versions here.
// The first version will be used for each program ID.
export const CLOCKWORK_PROGRAMS_IDLS = {
  [CLOCKWORK_THREAD_PROGRAM_ADDRESS]: {
    "1.3.15": ThreadProgramIdl_v1_3_15,
  },
  [CLOCKWORK_NETWORK_PROGRAM_ADDRESS]: {
    "1.3.15": NetworkProgramIdl_v1_3_15,
  },
  // [CLOCKWORK_WEBHOOK_PROGRAM_ADDRESS]: {
  //   "1.3.15": WebhookProgramIdl_v1_3_15,
  // },
  [HELLO_CLOCKWORK_PROGRAM_ADDRESS]: {
    "0.1.0": HelloClockworkIdl_v0_1_0,
  },
  [MAIUS_INVEST_PROGRAM_ADDRESS]: {
    "0.1.0": MaiusInvestIdl_v0_1_0,
  },
};
