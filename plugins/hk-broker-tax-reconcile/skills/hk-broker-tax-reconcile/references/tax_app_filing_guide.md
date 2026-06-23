# China Individual Income Tax App Filing Guide

Use this reference when the user asks how to enter calculated broker income into the Individual Income Tax app. This is a filing-assistance workflow, not legal advice.

## Property Transfer Income

For stock sales, enter the CNY-converted net realized capital gain as:

```text
财产转让所得应纳税所得额
```

Use the final `property_transfer_taxable_income_cny` value from `tax_summary.json`.

The app generally calculates tax at 20%:

```text
财产转让所得应纳税额 = 应纳税所得额 * 20%
```

Do not enter total sale proceeds. Enter net realized gain after matched acquisition cost and reasonable transaction fees.

## Interest, Dividends, and Bonus Income

For dividends, enter the CNY-converted gross dividend income as:

```text
利息、股息、红利所得应纳税所得额
```

Use `interest_dividend_bonus_taxable_income_cny` from `tax_summary.json`.

Do not enter only the make-up tax or a back-solved income number. The app should calculate:

```text
应纳税额 = 税前股息所得 * 20%
```

## Foreign Tax Credit

When the app asks for:

```text
本年境外已纳税额
```

enter `current_year_foreign_tax_paid_cny` from `tax_summary.json`.

This should include actual foreign withholding taxes, not broker handling fees, ADR fees, platform fees, or trading taxes.

If the app shows a foreign tax credit page:

- Previous-year carryforward amounts are usually zero unless the user provides records.
- `本年境外已纳税额` should match the calculated withholding tax amount.
- Verify the final return summary reduces tax by the allowed credit.

## Common Mistakes

- Do not put the dividend make-up tax into the dividend income field.
- Do not put broker CRS/AEOI gross proceeds into capital gains.
- Do not include non-calendar-year tax forms in a calendar-year filing without explicit user choice.
- Do not treat broker fees as foreign income tax credits.
- Do not claim tax-sparing credit unless the user has explicit support for it.

## Suggested User-Facing Filing Summary

Present the final values as:

```text
财产转让所得应纳税所得额：<property_transfer_taxable_income_cny>
利息、股息、红利所得应纳税所得额：<interest_dividend_bonus_taxable_income_cny>
本年境外已纳税额：<current_year_foreign_tax_paid_cny>
```
