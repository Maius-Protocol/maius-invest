import React, { useContext, useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import idl from "../config/idl.json";
import { MaiusInvest } from "../config/maius_invest";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import { AnchorProvider, Program } from "@project-serum/anchor";

import {
  ConnectionProvider,
  useWallet,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { programID } from "../utils/constants";

interface IProgramContext {
  program: Program<MaiusInvest>;
}

const ProgramContext = React.createContext<IProgramContext | undefined>(
  undefined
);

const network = WalletAdapterNetwork.Devnet;
const endpoint = clusterApiUrl(network);
const preflightCommitment = "processed";

export const _ProgramProvider: React.FunctionComponent = ({ children }) => {
  const wallet = useWallet();

  const provider = useMemo(() => {
    if (!network || !wallet) {
      return;
    }
    const connection = new Connection(endpoint, preflightCommitment);
    return new AnchorProvider(connection, wallet, {
      preflightCommitment,
    });
  }, [network, wallet]);

  const program = new Program(idl, programID, provider) as Program<MaiusInvest>;

  return (
    <ProgramContext.Provider
      value={{
        program,
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
};

export const ProgramProvider = ({ children }) => {
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new UnsafeBurnerWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <_ProgramProvider>{children}</_ProgramProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export function useProgram(): IProgramContext {
  const context = useContext<any>(ProgramContext);

  if (!context) {
  }
  return context;
}
