import {
  ClockworkProgram,
  CLOCKWORK_NETWORK_PROGRAM_ADDRESS,
  CLOCKWORK_PROGRAMS_IDLS,
  CLOCKWORK_THREAD_PROGRAM_ADDRESS,
  // CLOCKWORK_WEBHOOK_PROGRAM_ADDRESS,
  HelloClockworkProgram,
  MaiusInvestProgram,
  HELLO_CLOCKWORK_PROGRAM_ADDRESS,
  NetworkProgram,
  MAIUS_INVEST_PROGRAM_ADDRESS,
} from "../../sdk";
import { Program } from "@project-serum/anchor";
import { ThreadProgram } from "../../sdk";
import { AnchorProvider } from "@project-serum/anchor";
import base58 from "bs58";
import { Keypair, Connection, clusterApiUrl } from "@solana/web3.js";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import exp from "constants";
import { MaiusInvest } from "../../sdk/programs/maius_invest/v.0.1.0";

export const walletKeypair = Keypair.fromSecretKey(
  base58.decode(
    "5A1v58EfgcwxX2BXkndTewGfzUgwaqk2LF3USs5T3DddgxzrnvgcwbaMyr5sUWjWTKM1fZjZYkuygNnpZunxG3pu"
  )
);

export type ClusterType = "mainnet-beta" | "testnet" | "devnet" | "custom";

type SolanaCluster = {
  label: string;
  network: ClusterType;
  endpoint: string;
};

type SolanaContextType = {
  cluster: SolanaCluster;
  setCluster: (cluster: SolanaCluster) => void;
  customEndpoint: string;
  setCustomEndpoint: (endpoint: string) => void;
  isActiveCluster: (selectedCluster: SolanaCluster) => boolean;
};

export const LOCALNET_URL = "http://127.0.0.1:8899";

export const CLUSTERS: SolanaCluster[] = [
  {
    label: "Mainnet (Solana)",
    network: "mainnet-beta",
    endpoint:
      "https://rpc.helius.xyz/?api-key=3335ba9e-dad8-419d-b1e9-9deaa1f084b2",
  },
  {
    label: "Testnet",
    network: "testnet",
    endpoint: clusterApiUrl("testnet"),
  },
  {
    label: "Devnet",
    network: "devnet",
    endpoint: clusterApiUrl("devnet"),
  },
  {
    label: "Custom RPC",
    network: "custom",
    endpoint: LOCALNET_URL,
  },
];

export const useWallet = () => {
  let nodeWallet = new NodeWallet(walletKeypair);
  return nodeWallet;
};

export const AnchorProviderProvider = () => {
  let wallet = useWallet();
  let cluster = CLUSTERS[2];
  const c = new Connection(cluster.endpoint);

  if (!wallet) {
    // @ts-ignore
    return new AnchorProvider(c, Keypair.generate(), {});
  }
  const provider = new AnchorProvider(c, wallet, {
    preflightCommitment: "processed",
    commitment: "processed",
  });
  return provider;
};

export const ClockworkProgramsProvider = () => {
  let anchorProvider = useAnchorProvider();

  const clockworkPrograms = Object.entries(CLOCKWORK_PROGRAMS_IDLS).map(
    ([programId, idls]) => {
      // default to first idl version for each program id.
      const [[firstIdlVersion, firstIdl]] = Object.entries(idls);
      return new Program(
        firstIdl,
        programId,
        anchorProvider
      ) as ClockworkProgram;
    }
  );
  return clockworkPrograms;
};

export const useAnchorProvider = () => {
  const context = AnchorProviderProvider();

  return context;
};

export const useClockworkPrograms = () => {
  const clockworkPrograms = ClockworkProgramsProvider();

  if (!clockworkPrograms) {
    throw new Error(
      "Make sure to wrap your component with ClockworkProgramsProvider"
    );
  }

  return clockworkPrograms;
};

export const selectClockworkProgram =
  (programs: ClockworkProgram[]) => (programAddress: string) =>
    programs.find((program) => program.programId.toBase58() === programAddress);

export const useThreadProgram = () => {
  const programs = useClockworkPrograms();
  const program = selectClockworkProgram(programs)(
    CLOCKWORK_THREAD_PROGRAM_ADDRESS
  ) as ThreadProgram;
  if (!programs) {
    throw new Error("Thread program not found.");
  }
  return program;
};

export const useNetworkProgram = () => {
  const programs = useClockworkPrograms();
  const program = selectClockworkProgram(programs)(
    CLOCKWORK_NETWORK_PROGRAM_ADDRESS
  ) as NetworkProgram;
  if (!programs) {
    throw new Error("Network program not found.");
  }
  return program;
};

export const useHelloClockworkProgram = () => {
  const programs = useClockworkPrograms();
  const program = selectClockworkProgram(programs)(
    HELLO_CLOCKWORK_PROGRAM_ADDRESS
  ) as HelloClockworkProgram;
  if (!programs) {
    throw new Error("Network program not found.");
  }
  return program;
};

export const useMaiusInvestProgram = () => {
  const programs = useClockworkPrograms();
  const program = selectClockworkProgram(programs)(
    MAIUS_INVEST_PROGRAM_ADDRESS
  ) as MaiusInvestProgram;
  if (!programs) {
    throw new Error("Network program not found.");
  }
  return program;
};
