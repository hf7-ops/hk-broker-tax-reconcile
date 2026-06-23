---
name: hk-broker-tax-reconcile
description: Offline reconciliation of Hong Kong and overseas broker statements for China individual income tax filing. Use when a user provides local Futu, Hafoo, Tiger, or similar broker XLSX/PDF/CSV files and asks Codex to calculate realized stock-sale capital gains, dividends, foreign withholding tax credits, missing opening cost basis, RMB conversion, or Individual Income Tax app filing fields. Use also when packaging privacy-safe broker tax workflows without uploading personal data.
---

# HK Broker Tax Reconcile

## Core Rule

Work locally and treat broker tax files as private. Never upload statements, screenshots, account identifiers, tax IDs, addresses, or generated user data. Do not copy user-specific artifacts into this skill.

Do not issue a final filing number when opening or transferred position cost basis is missing. Generate a manual-lot template and ask the user to provide acquisition date, quantity, cost, and fees.

## Workflow

1. Inventory files.
   - Read `references/broker_file_patterns.md` before classifying files.
   - Identify calendar-year statements versus CRS/AEOI or non-calendar tax forms.

2. Parse structured broker data.
   - Use `scripts/broker_tax_reconcile.py` for local XLSX parsing and summary generation.
   - Prefer Futu annual XLSX over Futu CRS/AEOI PDFs for computation.
   - Prefer Hafoo XLSX sheets for realized P/L and dividends.
   - For Tiger, use activity statements for calendar-year dividends/withholding; request exported trades if stock sales exist.

3. Check missing costs.
   - Read `references/manual_lots_schema.md` when `manual_lots_needed.csv` is produced.
   - Ask the user to fill missing opening or transfer lots.
   - Re-run after manual lots are confirmed.

4. Calculate.
   - Read `references/calculation_policy.md` before interpreting gains, IPO costs, dividends, withholding, or currency conversion.
   - Keep original-currency rows and convert with user-specified rates.
   - Record every exchange rate used.

5. Produce filing fields.
   - Read `references/tax_app_filing_guide.md` when the user asks how to fill the Individual Income Tax app.
   - Output the CNY values for property transfer taxable income, dividend taxable income, and foreign tax paid.

6. Privacy check before sharing or packaging.
   - Run a sensitive-string scan over the skill or deliverable directory.
   - Confirm no real names, account numbers, tax IDs, addresses, original filenames, or user transaction rows are present.

## Script Usage

Basic run:

```bash
python scripts/broker_tax_reconcile.py \
  --futu-xlsx /path/to/futu_annual_statement.xlsx \
  --hafoo-xlsx /path/to/hafoo_statement.xlsx \
  --manual-lots /path/to/manual_lots.csv \
  --manual-dividends /path/to/manual_dividends.csv \
  --hkd-cny 0.89939 \
  --usd-hkd 7.7842 \
  --out-dir /path/to/output
```

If Tiger has no stock sales but has dividends in a PDF activity statement, summarize Tiger dividends in a manual dividends CSV. See `examples/sanitized_sample/manual_dividends_sample.csv`.

Expected outputs:

```text
realized_capital_gains.csv
dividend_withholding_items.csv
manual_lots_needed.csv
tax_summary.json
```

Only treat `tax_summary.json` as final when:

```text
final_ready: true
```

If `final_ready` is false, resolve missing manual lots or replay warnings first.

## Manual Inputs

For opening positions or external transfers, ask for:

```text
broker, account, code, market, currency, buy_date, qty, unit_cost or total_cost, fee
```

Do not infer split quantities. If the user gives two prices for one opening position, ask for the quantity at each price.

## Filing Output Style

When the user asks what to enter into the app, respond with direct fields:

```text
财产转让所得应纳税所得额：<property_transfer_taxable_income_cny>
利息、股息、红利所得应纳税所得额：<interest_dividend_bonus_taxable_income_cny>
本年境外已纳税额：<current_year_foreign_tax_paid_cny>
```

Explain that dividend income should be the gross dividend amount before foreign tax credit. The foreign withholding tax is entered on the credit page, not subtracted from the dividend income field.

## Caveats

This skill prepares a calculation and filing support package. It is not a tax-law opinion and does not submit returns. If the user requests legal certainty or official filing policy, verify against official tax authority materials and clearly cite sources.
