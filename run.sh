#!/usr/bin/env bash

rm -rf test-ledger

anchor build

clockwork localnet \
    --bpf-program srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX \
    --bpf-program ~/maius-invest/dex/serum_dex.so \
    --bpf-program ~/maius-invest/target/deploy/openbook_crank-keypair.json \
    --bpf-program ~/maius-invest/target/deploy/openbook_crank.so \
    --bpf-program ~/maius-invest/target/deploy/maius_invest-keypair.json \
    --bpf-program ~/maius-invest/target/deploy/maius_invest.so

