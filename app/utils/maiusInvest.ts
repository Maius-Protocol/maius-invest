import { MaiusInvest } from "../config/maius_invest";
import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";

export const program = anchor.workspace.MaiusInvest as Program<MaiusInvest>;

export type programTypes = MaiusInvest;
