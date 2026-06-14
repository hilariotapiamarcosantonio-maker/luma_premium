# Luma Leads V2 - Google Sheets exact schema

## Target

- Spreadsheet ID env var: `LUMA_LEADS_SPREADSHEET_ID`
- V2 sheet tab env var: `LUMA_LEADS_SHEET_V2_NAME`
- Default V2 sheet tab: `Luma Leads V2`
- Write range: `Luma Leads V2!A:AC`
- Total fields: 29
- API writer: `appendLumaLeadV2()`
- V1 writer remains separate: `appendLumaLead()`

## Copy-ready header row

Copy this row into row 1 of the V2 Google Sheets tab:

```tsv
schema_version	created_at	locale	country	full_name	email	phone	company	role	industry	industry_detail	team_size	lead_volume	acquisition_channels	advertising_status	current_tools	main_bottleneck	desired_outcome	solution_interest	timeline	investment_range	source	page_origin	utm_source	utm_medium	utm_campaign	utm_content	utm_term	status
```

## Exact column order

| Column | Field |
| --- | --- |
| A | `schema_version` |
| B | `created_at` |
| C | `locale` |
| D | `country` |
| E | `full_name` |
| F | `email` |
| G | `phone` |
| H | `company` |
| I | `role` |
| J | `industry` |
| K | `industry_detail` |
| L | `team_size` |
| M | `lead_volume` |
| N | `acquisition_channels` |
| O | `advertising_status` |
| P | `current_tools` |
| Q | `main_bottleneck` |
| R | `desired_outcome` |
| S | `solution_interest` |
| T | `timeline` |
| U | `investment_range` |
| V | `source` |
| W | `page_origin` |
| X | `utm_source` |
| Y | `utm_medium` |
| Z | `utm_campaign` |
| AA | `utm_content` |
| AB | `utm_term` |
| AC | `status` |

## Write behavior

The V2 API path is selected only when the request includes `schema_version: "2"`. It writes through `appendLumaLeadV2()` using `LUMA_LEADS_SHEET_V2_NAME` or the default `Luma Leads V2`.

The legacy V1 path is selected when `schema_version` is missing or not `"2"`. It writes through `appendLumaLead()` using `LUMA_LEADS_SHEET_NAME` or the default `Luma Estate Leads`.

If the V2 tab does not exist in the spreadsheet, Google Sheets rejects the append range (`<tab>!A:AC`). The API catches that upstream error and returns a generic `500` response; it does not silently fall back to V1.
