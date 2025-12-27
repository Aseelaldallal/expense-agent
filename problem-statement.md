# Day 4 Mini Project: Expense Report Validator

## Problem Statement

Companies have expense policies — rules about what employees can spend and when they need approval. Expense reports come in as lists of transactions. Someone (usually a finance team member) has to manually check each expense against the policy to flag violations.

**Your task:** Build a system that takes an expense report and a company policy document, then automatically validates each expense against the rules and flags violations.

## Example

**Policy says:**

- Meals: max $50 per person
- Software: requires manager approval over $100
- Entertainment: requires client name in description

**Expense report contains:**

- $75 team lunch (3 people)
- $250 Figma license
- $180 client dinner (no client named)

**System should output:**

```
✅ Team lunch: Approved ($25/person, under limit)
⚠️ Figma license: Needs review (over $100, requires approval)
❌ Client dinner: Violation (no client name provided)
```

## Why Multi-Step Makes Sense Here

**Single-call approach:** "Here's a policy document and an expense report. Tell me which expenses violate the policy."

This forces the LLM to do three things at once:

1. Parse and understand the policy rules
2. Parse and understand each expense
3. Apply the rules correctly to each expense

When something goes wrong, you can't tell where it failed. Did it misunderstand the policy? Misread an expense? Misapply a rule?

**Multi-step approach:**

| Step | Input | Output | Why separate? |
|------|-------|--------|---------------|
| 1. Parse expenses | CSV file | Structured expense objects | Not an LLM task — deterministic parsing |
| 2. Extract rules | Policy document | Structured rule objects | You can inspect exactly what rules the LLM understood |
| 3. Validate | Expenses + Rules | Validation results | Works with clean structured data, not raw text |

**Benefits:**

- **Debuggable:** If validation is wrong, check Step 2's output. Did it extract the rules correctly? If yes, the problem is in Step 3.
- **Inspectable:** You see the intermediate outputs, not just the final answer.
- **Reliable:** Each LLM call has one focused job, reducing the chance of errors.
- **Fixable:** You can fix the specific step that's failing, rather than tweaking one giant prompt and hoping.

## What You'll Build

A system with:

- File upload for expense report (CSV) and policy document (markdown)
- A multi-step validation chain (parse → extract rules → validate)
- Results showing each expense's status with reasoning
- Debug view showing extracted rules and intermediate outputs
