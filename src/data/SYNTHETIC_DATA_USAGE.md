# Synthetic Data Usage Documentation

## Overview
This document lists all places where synthetic data is used in the application due to insufficient data in the scraped Excel files.

## Data Sources
- **Real Data**: `sales_skills_report_1.xlsx` and `sales_skills_report_2.xlsx`
- **Total Records**: 66+ unique job postings
- **Total Occurrences**: ~19,000+

---

## 100% REAL DATA (from Excel files)

| Data Point | Source |
|------------|--------|
| Job titles & roles | `roles`, `mainRole` fields |
| Company names | `competitors` field |
| Locations | `location` field |
| Skills lists | `skills` field |
| Occurrence counts | `occurrencesCount` field |
| Job descriptions | `jobDescription` field |
| Source URLs | `sourceUrl` field |
| Data sources | `source` field |
| Posting dates | `postingDate` field |
| Trending status | `trending` field |
| Skills AI summaries | `skillsAiSummary` field |

---

## SYNTHETIC DATA (due to missing information)

### marketData.ts

| Field | Reason for Synthetic |
|-------|---------------------|
| `supplyRatio` | Requires internal workforce supply data |
| `avgPremium` | No salary/compensation data in scraped files |
| `growthRate` | Requires historical comparison data |
| `avgTimeToFill` | Not available in job posting data |
| `monthlyTrends` | No time-series historical data |
| `skillGapIndex` | Requires internal skill inventory |
| `demandIndex` | Derived algorithmically from occurrence counts |
| `skillVolatility` | Requires historical trend data |

### departmentData.ts

| Department | Data Type |
|------------|-----------|
| Engineering | 100% Synthetic |
| Marketing | 100% Synthetic |
| Finance | 100% Synthetic |
| HR | 100% Synthetic |
| Operations | 100% Synthetic |
| **Sales** | **Mostly Real** |

### employeeData.ts

| Data Point | Reason |
|------------|--------|
| Employee records | Internal workforce data not in scraped files |
| Skill scores | Internal assessment data |
| Learning progress | Internal L&D system data |
| Readiness scores | Internal calculation |
| Training metrics | Internal training system |
| Business impact metrics | Internal performance data |

---

## Components Using Synthetic Data

1. **SkillGalaxy.tsx** - `supplyRatio`, `growthRate` for bubble positioning
2. **CompetitorSkillMatrix.tsx** - Skill adoption levels (derived)
3. **TrendingRolesWithBuckets.tsx** - `demandIndex`, `growthRate`
4. **Dashboard.tsx** - `skillGapIndex`, `skillVolatility`
5. **Non-Sales Department Views** - All data is synthetic

---

## Recommendations for Full Real Data Integration

To eliminate synthetic data, the following additional data would be needed:

1. **Historical job posting data** (6-12 months) for trend analysis
2. **Internal workforce skills inventory** for supply ratio calculation
3. **Salary/compensation benchmarks** for premium calculations
4. **Internal employee database** for workforce analytics
5. **Training and L&D system data** for learning metrics
6. **Time-to-fill metrics** from HR/recruiting systems
7. **Department-specific scraped data** for Engineering, Marketing, etc.
