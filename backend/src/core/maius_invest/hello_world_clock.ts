import * as anchor from "@project-serum/anchor";
import uuid from "short-uuid";

import { CLOCKWORK_THREAD_PROGRAM_ID } from "../../sdk";
import {
    useHelloClockworkProgram,
    useThreadProgram,
    useAnchorProvider,
    useWallet, CLUSTERS
} from "../program/program";
import {PublicKey} from "@solana/web3.js";

const SEED_QUEUE = "thread";

const anchorProvider = useAnchorProvider();
const threadProgram = useThreadProgram();
const helloClockworkProgram = useHelloClockworkProgram();
const { publicKey } = useWallet();
const threadName = uuid().new();
console.log(`thread name: ${threadName}`);
export const HandleCreateQueue = async () => {
    if (!anchorProvider) return;
    if (!publicKey) {
        console.log("Connect your wallet and try again!");
        return;
    }

    const [pda] = await anchor.web3.PublicKey.findProgramAddress(
        [
            Buffer.from(SEED_QUEUE, "utf-8"),
            publicKey.toBuffer(),
            Buffer.from(threadName, "utf-8"),
        ],
        CLOCKWORK_THREAD_PROGRAM_ID
    );

    const helloworldInstruction = await helloClockworkProgram.methods
        .helloWorld("Hello 123 alo so!")
        .accounts({ helloThread: publicKey })
        .instruction();

    try {
        const thread_transaction = await threadProgram.methods
            .threadCreate(
                threadName,
                {
                    programId: helloClockworkProgram.programId,
                    accounts: [{ pubkey: pda, isSigner: true, isWritable: true }],
                    data: helloworldInstruction.data,
                },
                {
                    cron: {
                        schedule: "*/5 * * * * * *",
                        skippable: true,
                    },
                }
            )
            .accounts({
                authority: publicKey,
                payer: publicKey,
                thread: pda,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .rpc();
        console.log(`A queue has been created with Hello World!`);
        console.log(thread_transaction);
    } catch (e) {
        console.error(e);
    }
};

export const StopCreateQueue = async () => {
    if (!anchorProvider) return;
    if (!publicKey) {
        console.log("Connect your wallet and try again!");
        return;
    }
    let [pda] = await anchor.web3.PublicKey.findProgramAddress(
        [
            Buffer.from(SEED_QUEUE, "utf-8"),
            publicKey.toBuffer(),
            Buffer.from(threadName, "utf-8"),
        ],
        CLOCKWORK_THREAD_PROGRAM_ID
    );

    try {
        const thread_transaction = await threadProgram.methods
            .threadPause()
            .accounts({
                authority: publicKey,
                thread: pda,
            })
            .rpc();
        console.log(`A queue has been pause with Hello World!`);
        console.log(thread_transaction);
    } catch (e) {
        console.error(e);
    }
};
