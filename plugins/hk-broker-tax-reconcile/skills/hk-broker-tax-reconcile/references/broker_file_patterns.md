# Broker File Patterns

Use this reference when deciding which parser to run and which files are reliable for a calendar-year filing.

## Futu

Useful files:

- Annual XLSX statement with sheets such as `账户信息`, `证券-持仓总览`, `证券-交易流水`, `证券-资产进出`, and `证券-资金进出`.
- Monthly PDFs can help validate cashflows but are less convenient than XLSX.

Treat AEOI/CRS reported-information PDFs as reconciliation references only. They usually contain year-end balance, dividends, interest, gross proceeds, and other income. They are not cost-basis or final tax-calculation files.

Special parsing rules:

- `证券-交易流水`: ordinary buys and sells.
- `证券-资产进出`: IPO allotment shares and transfers.
- `证券-资金进出`: IPO subscription/refund cashflows, dividends, withholding, and handling fees.
- `证券-持仓总览`: opening and ending positions. Opening price is market value, not true cost.
- A-share Connect may use `CNY` in holdings and `CNH` in trades; normalize for matching.

## Hafoo

Useful XLSX sheets:

- `个股盈亏`: broker-reported realized P/L by code.
- `交易明细`: sell date, quantity, settlement amount, commissions, and fees.
- `分红派息`: gross dividend, net dividend, withholding rate, and withholding tax.

If `个股盈亏` and `交易明细` reconcile, use broker-reported realized P/L as the realized-gain input and keep implied cost as audit detail.

## Tiger

Distinguish these files carefully:

- Activity statement: often calendar-year, useful for cash, holdings, dividends, withholding, interest, and withdrawals.
- Tax form: may follow a non-calendar tax year such as `YYYY-04-01` to next `YYYY-03-31`; do not mix it into a calendar-year filing unless the user explicitly chooses that period.

Tiger PDF extraction can usually read activity-statement dividend rows, including cash dividend, dividend tax, action fee, net cash, currency, date, and ticker. Use the direct Tiger PDF parser first.

Tiger PDF extraction may not expose a clean trade table. If the user confirms there were no sells, set realized capital gains to zero and use the activity statement for dividends. If sells exist, request exported trade confirmations or transaction CSV/XLSX.

For dividends from Tiger activity statements, use a manual dividend summary CSV only when PDF table extraction is unreliable or the extracted rows fail to reconcile with the statement totals.
