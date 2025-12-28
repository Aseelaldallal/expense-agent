# Expense Agent

## Notes

- Uploading files to server directly as opposed to GCP/AWS for simplicity (to remain focused on the actual goal)


Why parse expenses with code, not LLM?
Expenses are structured data:
csvdate,employee,category,amount,description
2024-01-15,John Smith,meal,75,Team lunch
```

- Predictable format (CSV columns, JSON keys)
- Deterministic parsing — same input always gives same output
- Fast and free (no API call)
- No ambiguity — `amount: 75` means 75

Using an LLM here would be slower, cost money, and add unpredictability for no benefit.

**Why parse policies with LLM, not code?**

Policies are natural language:
```
Meals: max $50 per person
Software over $100 requires manager approval
Entertainment requires client name in description

Unpredictable format (prose, bullets, tables, varying language)
Rules are implicit — "max $50 per person" needs interpretation
Conditions are complex — "over $100", "requires approval", "under 6 hours"
You'd need a complex NLP parser to handle all variations

Code can't reliably extract "manager approval required over $100" from arbitrary prose. LLMs can.

Could you use LLM for expenses?
Yes, but why? You'd be paying for something code does better.
Exception: If expenses were in weird formats (handwritten receipts, unstructured emails), then LLM makes sense. But for CSV/JSON — code wins.

Summary:
DataFormatParserExpensesStructured (CSV/JSON)CodePoliciesUnstructured (prose)LLM