# Calculation Policy

Use this reference when deciding how to calculate realized capital gains, dividends, withholding tax, and filing fields.

## Capital Gains

Calculate realized gains per security and currency before aggregation:

```text
realized gain = net sale proceeds - matched acquisition cost
net sale proceeds = sale gross amount - sale-side fees
matched acquisition cost = buy price + buy-side commissions/taxes/fees
```

For broker rows that already provide net settlement amount, do not subtract sale fees again.

Allow current-year gains and losses from the same asset-transfer category to offset each other. Do not carry a net loss into future years unless the user explicitly provides a valid local rule and asks for that treatment.

## Opening and Transfer Lots

Never use opening market value as final tax cost. If a broker statement starts with a non-zero position and no acquisition record is present, generate `manual_lots_needed.csv` and stop short of a final filing number.

The user must supply true acquisition date, quantity, cost, and fees for:

- opening positions
- external transfers
- gifts
- RSUs or employee awards
- other asset-in records with no cost basis

## IPO Allotments

For HK IPO subscriptions split across cashflow and asset-in sections, calculate cost as:

```text
IPO cost = subscription cash out - refund cash in + IPO handling fees
```

Only attach this cost to successfully allotted shares. Unsuccessful subscription fees should be kept as separate fees unless the user gives another tax treatment.

## Dividends

Use tax-before-credit fields:

```text
gross dividend income = gross cash or reconstructed gross amount
domestic tax before credit = gross dividend income * 20%
make-up tax = max(0, domestic tax before credit - foreign withholding tax)
```

For broker remarks such as `(-10%)` or `10% TAX INCLUDED`, treat cash received as net after 10% withholding and reconstruct:

```text
gross = net_cash / 0.9
withholding = gross - net_cash
```

Broker handling fees are not foreign income tax credits. Keep them separate from withholding tax.

## Currency Conversion

Use the user-specified reporting date and exchange rates. Record rates in every output. Keep original-currency rows and add converted values rather than overwriting originals.

For a calendar-year filing where the user requests year-end conversion, use:

```text
CNY amount = HKD amount * HKD_CNY
HKD amount = USD amount * USD_HKD
HKD amount = CNY/CNH amount / HKD_CNY
```

Do not silently fetch live exchange rates. If rates are missing, ask for them or clearly label any external lookup source.
