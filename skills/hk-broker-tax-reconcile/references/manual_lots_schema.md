# Manual Lots Schema

Use this reference whenever the run produces `manual_lots_needed.csv`, or when the user needs to provide acquisition cost for opening or transferred positions.

## Required CSV

Create or request a CSV with these columns:

```csv
broker,account,code,market,currency,lot_type,buy_date,transfer_date,qty,unit_cost,total_cost,fee,status,source_note
```

## Field Meanings

- `broker`: `futu`, `hafoo`, `tiger`, or another lowercase broker id.
- `account`: account identifier from the broker statement. For public examples use `ACCOUNT_001`.
- `code`: security code, such as `0001`, `AAPL`, or `IPO001`.
- `market`: `SEHK`, `US`, `SSE`, `SZSE`, or broker-provided market name.
- `currency`: `HKD`, `USD`, `CNH`, or `CNY`. Normalize `CNY` and `CNH` only for matching; preserve source rows.
- `lot_type`: `opening`, `transfer_in`, `rsu`, `gift`, or `other`.
- `buy_date`: true acquisition date. Month-only or year-only dates may be accepted with a note when only cost computation matters.
- `transfer_date`: date transferred into the broker, if different from acquisition date.
- `qty`: quantity covered by this lot.
- `unit_cost`: acquisition price per unit, excluding fee.
- `total_cost`: total acquisition cost, excluding or including fee according to the user's evidence. Prefer explicit total cost when available.
- `fee`: buy-side commissions, taxes, transfer fees, or other acquisition costs.
- `status`: use `confirmed` for usable rows. Use `pending` for rows that should not be used.
- `source_note`: short evidence note, for example `historical trade confirmation`.

## Validation

Before using manual rows:

1. Match by `broker + account + code + currency`.
2. Check summed `qty` equals the opening or transferred quantity.
3. Prefer `total_cost` over `qty * unit_cost` if both are present and disagree.
4. Treat missing or pending manual lots as blockers for final tax numbers.
5. Never infer quantities across split lots unless the user explicitly confirms the split.
