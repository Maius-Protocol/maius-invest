import type { AppProps } from "next/app";
import type { FC } from "react";
import React, { useEffect, useState } from "react";
import "antd/dist/reset.css";
import styles from "../styles/Home.module.css";
import Head from "next/head";
import { useRouter } from "next/router";
import { Card, Segmented } from "antd";
import dynamic from "next/dynamic";
import { QueryClient, QueryClientProvider } from "react-query";
import { ProgramProvider } from "../contexts/useProgram";

// Use require instead of import since order matters
require("@solana/wallet-adapter-react-ui/styles.css");
require("../styles/globals.css");

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);
const queryClient = new QueryClient();

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();
  const [tab, setTab] = useState<string | number>("Invests");
  useEffect(() => {
    if (tab === "Invests") {
      router.push("/");
    }
    if (tab === "Positions") {
      router.push("/positions");
    }
  }, [tab]);

  return (
    <QueryClientProvider client={queryClient}>
      <ProgramProvider>
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
      </ProgramProvider>
    </QueryClientProvider>
  );
};

export default App;
