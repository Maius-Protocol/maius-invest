import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import type { AppProps } from "next/app";
import type { FC } from "react";
import React, { useEffect, useMemo, useState } from "react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import "antd/dist/reset.css";
import styles from "../styles/Home.module.css";
import Head from "next/head";
import { useRouter } from "next/router";
import { Card, Segmented } from "antd";
import Home from "./index";
import dynamic from "next/dynamic";

// Use require instead of import since order matters
require("@solana/wallet-adapter-react-ui/styles.css");
require("../styles/globals.css");

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const router = useRouter();
  const [tab, setTab] = useState<string | number>("Invests");
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new UnsafeBurnerWalletAdapter()],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );
  useEffect(() => {
    if (tab === "Invests") {
      router.push("/");
    }
    if (tab === "Positions") {
      router.push("/positions");
    }
  }, [tab]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className={styles.container}>
            <Head>
              <title>Maius Invest</title>
              <meta name="description" content="Maius Invest" />
              <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
              <div className={styles.walletButtons}>
                <Card
                  title={
                    <div style={{ width: "100%", padding: "12px 4px" }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div style={{ width: "100%" }}>Maius Invest</div>
                        <div style={{ zIndex: 9999999 }}>
                          <WalletMultiButtonDynamic />
                        </div>
                      </div>
                      <Segmented
                        block
                        options={["Invests", "Positions"]}
                        style={{ marginTop: "12px" }}
                        value={tab}
                        onChange={setTab}
                      />
                    </div>
                  }
                  bordered={false}
                  style={{ width: 500, minHeight: 500 }}
                >
                  <Component {...pageProps} />
                </Card>
              </div>
            </main>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
