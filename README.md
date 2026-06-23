# HK Broker Tax Reconcile

面向中国居民个人境外投资申报的本地离线对账 Skill / Codex Plugin。

它把富途、哈富、老虎等港股券商导出的账单整理成更接近个人所得税 APP 填报需要的结果：股票卖出资本利得、股息收入、境外已扣税、可能需要补缴的税额，以及必须人工补充的期初持仓成本。

> 这是辅助整理和计算工具，不构成税务、法律或投资意见。最终申报口径请以当地税务机关、申报系统提示和专业税务顾问意见为准。

## 亮点

- **本地离线处理**：账单文件在用户自己的电脑上解析，不上传券商账单、身份证明、税务数据或生成结果。
- **多券商统一口径**：已针对富途年度账单、哈富交易报表、老虎活动 PDF 等样例做适配，把不同格式统一成资本利得、股息和税额明细。
- **自动识别期初成本缺口**：如果账单里只有卖出、没有对应买入记录，会列出需要人工补充的买入时间、股数、买入价或总成本，而不是用期初市值冒充税务成本。
- **新股/IPO 现金流处理**：识别申购、退款、手续费和分配结果，尽量把新股成本从普通交易里分出来。
- **股息补税辅助**：汇总股息总额、境外已扣税、费用，并按目标税率计算可能需要补差额的部分。
- **个税 APP 填报提示**：输出和参考文档会提示资本利得、股息、境外已纳税额/抵免额在 APP 里大致应该怎么理解和填写。
- **结果可审计**：输出明细 CSV 和 `tax_summary.json`，可以追溯每笔卖出、每笔股息和每个缺失成本，而不是只给一个总数。
- **Codex Plugin + Agent Skill + npx**：可以作为 Codex Plugin 使用，也可以作为独立 Agent Skill 安装；发布 npm 后用户可一行 `npx ... install` 安装。

## 安装

安装 Codex Plugin：

```bash
npx hk-broker-tax-reconcile install
```

只安装独立 Agent Skill：

```bash
npx hk-broker-tax-reconcile install skill
```

Plugin 和 Skill 都安装：

```bash
npx hk-broker-tax-reconcile install all
```

覆盖已有安装：

```bash
npx hk-broker-tax-reconcile install --force
```

安装 Plugin 后，重启 Codex，打开 Plugins，在 Personal marketplace 里启用 `hk-broker-tax-reconcile`。

## 支持的输入

- 富途风格年度账单 XLSX
- 哈富风格交易报表 XLSX
- 老虎风格活动 PDF
- 人工补充期初持仓成本 CSV
- 人工补充股息 CSV

不同券商的导出格式可能会变化。如果解析失败，优先检查字段名、日期范围、币种和文件是否为原始导出版本。

## 人工补充期初成本

如果账单开始时已经有持仓，工具不会把期初市值直接当成买入成本。它会输出 `manual_lots_needed.csv`，提示哪些股票需要补充：

- 买入日期
- 股数
- 买入单价或总成本
- 买入费用
- 转仓日期或来源说明
- 支持对话框输入后让 agent 自己填 CSV

人工成本 CSV 字段：

```csv
broker,account,code,market,currency,lot_type,buy_date,transfer_date,qty,unit_cost,total_cost,fee,status,source_note
```

示例见：

```text
skills/hk-broker-tax-reconcile/examples/sanitized_sample/manual_lots_sample.csv
```

## 直接运行脚本

安装后，或在本仓库根目录下：

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

输出包括：

```text
realized_capital_gains.csv
dividend_withholding_items.csv
manual_lots_needed.csv
tax_summary.json
```

只有当 `tax_summary.json` 里的 `final_ready` 为 `true` 时，才建议把汇总结果作为最终申报辅助数字使用。

## 个税 APP 填报辅助

常见理解方式：

- 股票卖出盈利通常整理到财产转让所得相关字段。
- 股息、红利通常整理到利息、股息、红利所得相关字段。
- 已在境外扣缴的税额，需要结合 APP 的境外已纳税额、抵免限额、可抵免税额等页面理解。
- 如果股息已被境外扣 10%，而目标口径按 20% 估算，工具会辅助计算可能需要补差额的部分。

不同地区、不同年份、不同资产和申报页面可能存在差异。请用工具输出做底稿，最终仍以 APP 页面、税务机关要求和专业意见为准。

## 隐私

本包只包含通用脚本、schema、参考说明和脱敏示例。不要把自己的券商原始账单、账号、税号、地址或个人计算结果提交到 GitHub 或 npm。

工具默认本地运行。汇率查询、税务规则查询等需要联网的信息，应由用户或 agent 明确发起，并单独记录来源。

```

## English Summary

HK Broker Tax Reconcile is an offline Agent Skill and Codex Plugin for reconciling local broker statements into China individual income tax filing fields.

It is designed for local Futu-style annual XLSX statements, Hafoo-style XLSX reports, Tiger-style activity PDFs, and manual cost-basis inputs. It does not upload broker files.

It calculates realized stock-sale gains, missing opening cost-basis rows, IPO allotment cost, gross dividends, foreign withholding tax, broker fees, dividend make-up tax, and RMB filing fields for the Individual Income Tax app.

## License

MIT
