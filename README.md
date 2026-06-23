# HK Broker Tax Reconcile

Offline Agent Skill and Codex Plugin for reconciling local broker statements into China individual income tax filing fields.

It is designed for local Futu-style annual XLSX statements, Hafoo-style XLSX reports, Tiger-style activity PDFs, and manual cost-basis inputs. It does not upload broker files.

## Install with npx

Install the Codex Plugin:

```bash
npx hk-broker-tax-reconcile install
```

Install the standalone Agent Skill:

```bash
npx hk-broker-tax-reconcile install skill
```

Install both:

```bash
npx hk-broker-tax-reconcile install all
```

Replace an existing install:

```bash
npx hk-broker-tax-reconcile install --force
```

After plugin installation, restart Codex and open Plugins. Choose the Personal marketplace and install or enable `hk-broker-tax-reconcile`.

## What it calculates

- Realized stock-sale gains after matched acquisition cost and transaction fees.
- Missing opening or transfer cost-basis rows that require manual input.
- HK IPO allotment cost from subscription, refund, and handling-fee cashflows.
- Gross dividends, foreign withholding tax, broker fees, and dividend make-up tax.
- RMB filing fields for the Individual Income Tax app.

## Manual opening cost input

When a statement starts with existing positions, the tool does not use opening market value as final tax cost. Fill a manual lots CSV with:

```csv
broker,account,code,market,currency,lot_type,buy_date,transfer_date,qty,unit_cost,total_cost,fee,status,source_note
```

See `skills/hk-broker-tax-reconcile/examples/sanitized_sample/manual_lots_sample.csv`.

## Direct script usage

After installing or from this repository:

```bash
python skills/hk-broker-tax-reconcile/scripts/broker_tax_reconcile.py \
  --futu-xlsx /path/to/futu_statement.xlsx \
  --hafoo-xlsx /path/to/hafoo_statement.xlsx \
  --tiger-activity-pdf /path/to/tiger_activity.pdf \
  --manual-lots /path/to/manual_lots.csv \
  --hkd-cny 0.89939 \
  --usd-hkd 7.7842 \
  --out-dir ./tax-output
```

Outputs include:

```text
realized_capital_gains.csv
dividend_withholding_items.csv
manual_lots_needed.csv
tax_summary.json
```

Only use `tax_summary.json` as final when `final_ready` is `true`.

## Privacy

This package contains only generic scripts, schemas, references, and synthetic examples. Do not publish your broker statements, account IDs, tax IDs, addresses, or generated personal outputs.

The tool is local-only by design. Any exchange-rate lookup or official tax-rule lookup should be done explicitly by the user or agent and cited separately.

## Publish to npm

From the repository root:

```bash
npm login
npm publish --access public
```

If the package name is taken, rename it to a scoped package in `package.json`, such as:

```json
"name": "@your-scope/hk-broker-tax-reconcile"
```

Users then install with:

```bash
npx @your-scope/hk-broker-tax-reconcile install
```

## License

MIT
