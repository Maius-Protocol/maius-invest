const tokens = [
  {
    coinGeckoId: "orca",
    decimals: 6,
    iconUrl:
      "https://assets.coingecko.com/coins/images/17547/small/Orca_Logo.png?1628781615",
    pubkey: "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE",
    symbol: "ORCA",
  },
  {
    coinGeckoId: "eversol-staked-sol",
    decimals: 9,
    iconUrl:
      "https://assets.coingecko.com/coins/images/23056/small/SUWTLy9j_400x400.jpeg?1657789195",
    pubkey: "Hg35Vd8K3BS2pLB3xwC2WqQV8pmpCm3oNRGYP1PEpmCM",
    symbol: "eSOL",
  },
  {
    decimals: 9,
    iconUrl:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EsPKhGTMf3bGoy4Qm7pCv3UCcWqAmbC1UGHBTDxRjjD4/logo.png",
    pubkey: "EsPKhGTMf3bGoy4Qm7pCv3UCcWqAmbC1UGHBTDxRjjD4",
    symbol: "FTM",
  },
  {
    decimals: 8,
    iconUrl:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/AG5j4hhrd1ReYi7d1JsZL8ZpcoHdjXvc8sdpWF74RaQh/logo.png",
    pubkey: "AG5j4hhrd1ReYi7d1JsZL8ZpcoHdjXvc8sdpWF74RaQh",
    symbol: "svtOKAY",
  },
  {
    coinGeckoId: "wrapped-solana",
    decimals: 9,
    iconUrl:
      "https://assets.coingecko.com/coins/images/21629/small/solana.jpg?1639626543",
    pubkey: "So11111111111111111111111111111111111111112",
    symbol: "SOL",
  },
  {
    coinGeckoId: "socean-staked-sol",
    decimals: 9,
    iconUrl:
      "https://assets.coingecko.com/coins/images/18468/small/biOTzfxE_400x400.png?1633662119",
    pubkey: "5oVNBeEEQvYi1cX3ir8Dx5n1P7pdxydbGF2X4TxVusJm",
    symbol: "scnSOL",
  },
  {
    coinGeckoId: "saber",
    decimals: 6,
    iconUrl:
      "https://assets.coingecko.com/coins/images/17162/small/oYs_YFz8_400x400.jpg?1626678457",
    pubkey: "Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1",
    symbol: "SBR",
  },
  {
    coinGeckoId: "hawksight",
    decimals: 6,
    iconUrl:
      "https://assets.coingecko.com/coins/images/24459/small/3CnlKM0x_400x400.jpg?1647679676",
    pubkey: "BKipkearSqAUdNKa1WDstvcMjoPsSKBuNyvKDQDDu9WE",
    symbol: "hawk",
  },
  {
    coinGeckoId: "msol",
    decimals: 9,
    iconUrl:
      "https://assets.coingecko.com/coins/images/17752/small/mSOL.png?1644541955",
    pubkey: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
    symbol: "mSOL",
  },
  {
    decimals: 9,
    iconUrl:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/kiTkNc7nYAu8dLKjQFYPx3BqdzwagZGBUrcb7d4nbN5/logo.png",
    pubkey: "kiTkNc7nYAu8dLKjQFYPx3BqdzwagZGBUrcb7d4nbN5",
    symbol: "depKI",
  },
  {
    coinGeckoId: "lido-staked-sol",
    decimals: 9,
    iconUrl:
      "https://assets.coingecko.com/coins/images/18369/small/logo_-_2021-09-15T100934.765.png?1631671781",
    pubkey: "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj",
    symbol: "stSOL",
  },
  {
    coinGeckoId: "blazestake-staked-sol",
    decimals: 9,
    iconUrl:
      "https://assets.coingecko.com/coins/images/26636/small/blazesolana.png?1659328728",
    pubkey: "bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1",
    symbol: "bsol",
  },
  {
    coinGeckoId: "solvent",
    decimals: 6,
    iconUrl:
      "https://assets.coingecko.com/coins/images/22387/small/svt.png?1641789503",
    pubkey: "svtMpL5eQzdmB3uqK9NXaQkq8prGZoKQFNVJghdWCkV",
    symbol: "svt",
  },
  {
    coinGeckoId: "solfarm",
    decimals: 6,
    iconUrl:
      "https://assets.coingecko.com/coins/images/15764/small/TqrUdBG.png?1621827144",
    pubkey: "TuLipcqtGVXP9XR62wM8WWCm6a9vhLs7T1uoWBk6FDs",
    symbol: "TULIP",
  },
  {
    coinGeckoId: "ninja-protocol",
    decimals: 6,
    iconUrl:
      "https://assets.coingecko.com/coins/images/18442/small/ninja.PNG?1632006127",
    pubkey: "FgX1WD9WzMU3yLwXaFSarPfkgzjLb2DZCqmkx9ExpuvJ",
    symbol: "NINJA",
  },
  {
    coinGeckoId: "goosefx",
    decimals: 9,
    iconUrl:
      "https://assets.coingecko.com/coins/images/19793/small/0Kjm9f4.png?1635906737",
    pubkey: "GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD",
    symbol: "GOFX",
  },
  {
    coinGeckoId: "genopet-ki",
    decimals: 9,
    iconUrl:
      "https://lhz5d4yolujipky363en2lni3p464spvtdpj6dhbq3ioukg52xca.arweave.net/WfPR8w5dEoerG_bI3S2o2_nuSfWY3p8M4YbQ6ijd1cQ?ext=png",
    pubkey: "kiGenopAScF8VF31Zbtx2Hg8qA5ArGqvnVtXb83sotc",
    symbol: "KI",
  },
  {
    coinGeckoId: "bonk",
    decimals: 5,
    iconUrl: "https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I",
    pubkey: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    symbol: "Bonk",
  },
  {
    coinGeckoId: "aurory",
    decimals: 9,
    iconUrl:
      "https://assets.coingecko.com/coins/images/19324/small/logo.png?1635076945",
    pubkey: "AURYydfxJib1ZkTir1Jn1J9ECYUtjb6rKQVmtYaixWPP",
    symbol: "AURY",
  },
  {
    coinGeckoId: "blocksmith-labs-forge",
    decimals: 9,
    iconUrl:
      "https://assets.coingecko.com/coins/images/25411/small/Logo_%281%29.png?1651733020",
    pubkey: "FoRGERiW7odcCBGU1bztZi16osPBHjxharvDathL5eds",
    symbol: "$forge",
  },
  {
    coinGeckoId: "tether",
    decimals: 6,
    iconUrl:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg",
    pubkey: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    symbol: "USDT",
  },
  {
    coinGeckoId: "arb-protocol",
    decimals: 6,
    iconUrl:
      "https://assets.coingecko.com/coins/images/26046/small/IMG_3600.png?1656916820",
    pubkey: "9tzZzEHsKnwFL1A3DyFJwj36KnZj3gZ7g4srWp9YTEoh",
    symbol: "arb",
  },
  {
    decimals: 8,
    iconUrl:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/ZScHuTtqZukUrtZS43teTKGs2VqkKL8k4QCouR2n6Uo/logo.png",
    pubkey: "ZScHuTtqZukUrtZS43teTKGs2VqkKL8k4QCouR2n6Uo",
    symbol: "wstETH",
  },
  {
    coinGeckoId: "usd-coin",
    decimals: 6,
    iconUrl:
      "https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389",
    pubkey: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    symbol: "USDC",
  },
  {
    coinGeckoId: "hedge-usd",
    decimals: 9,
    iconUrl:
      "https://assets.coingecko.com/coins/images/25481/small/ush.png?1652011029",
    pubkey: "9iLH8T7zoWhY7sBmj1WK9ENbWdS1nL8n9wAxaeRitTa6",
    symbol: "USH",
  },
  {
    decimals: 9,
    iconUrl:
      "https://www.arweave.net/aIBvYbeCHiVXWUAnfx81fyRMY-OYgQfJtuYhLu3fZnM?ext=png",
    pubkey: "jJF1SrhzpyqYawE9ruSVKrHjfxjaG5TUMFB5vnXUWVm",
    symbol: "J-JFI",
  },
  {
    coinGeckoId: "ratio-stable-coin",
    decimals: 6,
    iconUrl:
      "https://assets.coingecko.com/coins/images/26066/small/usdr_logo.png?1655469254",
    pubkey: "USDrbBQwQbQ2oWHUPfA8QBHcyVxKUq1xHyXsSLKdUq2",
    symbol: "usdr",
  },
  {
    coinGeckoId: "step-finance",
    decimals: 9,
    iconUrl:
      "https://assets.coingecko.com/coins/images/14988/small/step.png?1619274762",
    pubkey: "StepAscQoEioFxxWGnh2sLBDFp9d8rvKz2Yp39iDpyT",
    symbol: "STEP",
  },
  {
    coinGeckoId: "hubble",
    decimals: 6,
    iconUrl:
      "https://assets.coingecko.com/coins/images/22070/small/hubble.PNG?1640749942",
    pubkey: "HBB111SCo9jkCejsZfz8Ec8nH7T6THF8KEKSnvwT6XK6",
    symbol: "hbb",
  },
  {
    coinGeckoId: "hedge-protocol",
    decimals: 9,
    iconUrl:
      "https://assets.coingecko.com/coins/images/25482/small/hdg.png?1652011201",
    pubkey: "5PmpMzWjraf3kSsGEKtqdUsCoLhptg4yriZ17LKKdBBy",
    symbol: "HDG",
  },
  {
    coinGeckoId: "uxd-stablecoin",
    decimals: 6,
    iconUrl:
      "https://assets.coingecko.com/coins/images/22850/small/UXD-White.png?1642747473",
    pubkey: "7kbnvuGBxxj8AG9qp8Scn56muWGaRaFqxg1FsRp3PaFT",
    symbol: "uxd",
  },
  {
    coinGeckoId: "media-network",
    decimals: 6,
    iconUrl:
      "https://assets.coingecko.com/coins/images/15142/small/media50x50.png?1620122020",
    pubkey: "ETAtLmCmsoiEEKfNrHKJ2kYy3MoABhU6NQvpSfij5tDs",
    symbol: "MEDIA",
  },
  {
    coinGeckoId: "usdh",
    decimals: 6,
    iconUrl:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX/usdh.svg",
    pubkey: "USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX",
    symbol: "USDH",
  },
  {
    coinGeckoId: "ethereum-wormhole",
    decimals: 8,
    iconUrl:
      "https://assets.coingecko.com/coins/images/22990/small/ETH_wh_small.png?1644225466",
    pubkey: "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs",
    symbol: "WETH",
  },
  {
    coinGeckoId: "daosol",
    decimals: 9,
    iconUrl:
      "https://assets.coingecko.com/coins/images/25488/small/logo_%284%29.png?1652071503",
    pubkey: "GEJpt3Wjmr628FqXxTgxMce1pLntcPV4uFi8ksxMyPQh",
    symbol: "daosol",
  },
  {
    coinGeckoId: "lido-dao-wormhole",
    decimals: 8,
    iconUrl:
      "https://assets.coingecko.com/coins/images/22995/small/LDO_wh_small.png?1644226233",
    pubkey: "HZRCwxP2Vq9PCpPXooayhJ2bxTpo5xfpQrwB1svh332p",
    symbol: "LDO",
  },
  {
    coinGeckoId: "synesis-one",
    decimals: 9,
    iconUrl:
      "https://assets.coingecko.com/coins/images/23289/small/sns.png?1643549030",
    pubkey: "SNSNkV9zfG5ZKWQs6x4hxvBRV6s8SqMfSGCtECDvdMd",
    symbol: "sns",
  },
  {
    coinGeckoId: "genesysgo-shadow",
    decimals: 9,
    iconUrl:
      "https://assets.coingecko.com/coins/images/22271/small/Property_1_Color.png?1666926988",
    pubkey: "SHDWyBxihqiCj6YekG2GUr7wqKLeLAMK1gHZck9pL6y",
    symbol: "SHDW",
  },
  {
    coinGeckoId: "solend",
    decimals: 6,
    iconUrl:
      "https://assets.coingecko.com/coins/images/19573/small/i6AMOwun_400x400.jpg?1635458597",
    pubkey: "SLNDpmoWTVADgEdndyvWzroNL7zSi1dF9PC3xHGtPwp",
    symbol: "slnd",
  },
  {
    decimals: 9,
    iconUrl:
      "https://faom7qfupy4usepu57nwyyi7ehgqxxkohwnvvbmpgopcyjekmvgq.arweave.net/KBzPwLR-OUkR9O_bbGEfIc0L3U49m1qFjzOeLCSKZU0?ext=png",
    pubkey: "iJF17JCu78E51eAgwtCwvgULHh2ZqCeRrcFP7wgcc6w",
    symbol: "I-JFI-Q4",
  },
  {
    decimals: 6,
    iconUrl:
      "https://www.arweave.net/9smtqPjMMkwuGDhUMtlkVXunWy8PYr_IjfTDjIWWqJE?ext=png",
    pubkey: "jRAYPwLn4ZRGRSKu7GWu6B3Qx3Vj2JU88agUweEceyo",
    symbol: "J-RAY",
  },
  {
    coinGeckoId: "marinade",
    decimals: 9,
    iconUrl:
      "https://assets.coingecko.com/coins/images/18867/small/MNDE.png?1643187748",
    pubkey: "MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey",
    symbol: "MNDE",
  },
  {
    decimals: 6,
    iconUrl:
      "https://6og7gjwyy3xy6cs2ojb6pdcahvgcvtmdddpneuyq3ijcgt5kvqda.arweave.net/843zJtjG748KWnJD54xAPUwqzYMY3tJTENoSI0-qrAY?ext=png",
    pubkey: "iRAYYHCNhEpbDiVt6QKK3Q57DMgw4p8zEKsVz3WfMjW",
    symbol: "I-RAY-Q4",
  },
  {
    coinGeckoId: "meanfi",
    decimals: 6,
    iconUrl:
      "https://assets.coingecko.com/coins/images/21557/small/89934951.png?1639466364",
    pubkey: "MEANeD3XDdUmNMsRGjASkSWdC8prLYsoRJ61pPeHctD",
    symbol: "MEAN",
  },
  {
    coinGeckoId: "dust-protocol",
    decimals: 9,
    iconUrl:
      "https://assets.coingecko.com/coins/images/24289/small/dust-protocol-degod.png?1647306854",
    pubkey: "DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ",
    symbol: "DUST",
  },
  {
    coinGeckoId: "samoyedcoin",
    decimals: 9,
    iconUrl:
      "https://assets.coingecko.com/coins/images/15051/small/IXeEj5e.png?1619560738",
    pubkey: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    symbol: "SAMO",
  },
  {
    coinGeckoId: "raydium",
    decimals: 6,
    iconUrl:
      "https://assets.coingecko.com/coins/images/13928/small/PSigc4ie_400x400.jpg?1612875614",
    pubkey: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
    symbol: "RAY",
  },
  {
    coinGeckoId: "jungle-defi",
    decimals: 9,
    iconUrl:
      "https://assets.coingecko.com/coins/images/23679/small/logo.png?1644997055",
    pubkey: "GePFQaZKHcWE5vpxHfviQtH5jgxokSs51Y5Q4zgBiMDs",
    symbol: "jfi",
  },
];

export default tokens;
