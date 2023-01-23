import * as anchor from "@project-serum/anchor";
import uuid from "short-uuid";

import { CLOCKWORK_THREAD_PROGRAM_ID } from "../../sdk";
import {
    useMaiusInvestProgram,
    useThreadProgram,
    useAnchorProvider,
    useWallet, CLUSTERS
} from "../program/program";
import {PublicKey} from "@solana/web3.js";

const SEED_QUEUE = "thread";

const anchorProvider = useAnchorProvider();
const threadProgram = useThreadProgram();
const maiusInvestProgram = useMaiusInvestProgram();
const { publicKey } = useWallet();

export const StopQueue = async (investmentThread: PublicKey, investment: PublicKey ) => {
    if (!anchorProvider) return;
    if (!publicKey) {
        console.log("Connect your wallet and try again!");
        return;
    }

    try {
        const pauseThreadTransaction = await maiusInvestProgram.methods
            .pauseThread()
            .accounts({
                investment: investment,
                investmentThread: investmentThread,
                payer: publicKey,
                clockworkProgram: CLOCKWORK_THREAD_PROGRAM_ID,
                systemProgram: anchor.web3.SystemProgram.programId
            })
            .rpc();
        console.log(`A investment thread has been stop`);
        console.log(pauseThreadTransaction);
    } catch (e) {
        console.error(e);
    }
};