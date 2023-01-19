export const threadFilter = (regexp: RegExp, row: any) => {
  if (row.account.name) {
    return threadFilterV1_0_6(regexp, row);
  }
  return threadFilterV1_2_14(regexp, row);
};

export const threadFilterV1_0_6 = (regexp: RegExp, row: any) =>
  row.publicKey.toString().match(regexp) || row.account.name.match(regexp);

export const threadFilterV1_2_14 = (regexp: RegExp, row: any) =>
  row.publicKey.toString().match(regexp) || row.account.id.match(regexp);
