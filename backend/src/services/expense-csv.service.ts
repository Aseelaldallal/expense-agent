import { injectable } from 'inversify';
import Papa from 'papaparse';
import type { Expense } from '../types/services/expense-csv.types';

const REQUIRED_COLUMNS = ['date', 'employee', 'category', 'amount', 'description'] as const;

@injectable()
export class ExpenseCsvService {
  public parse(csvContent: string): Expense[] {
    const result = Papa.parse<Record<string, string>>(csvContent, {
      header: true,
      skipEmptyLines: true,
    });

    if (result.errors.length > 0) {
      throw new Error(`CSV parsing error: ${result.errors[0].message}`);
    }

    const headers = result.meta.fields ?? [];
    this.validateHeaders(headers);

    return result.data.map((row, index) => this.parseRow(row, index + 2));
  }

  private validateHeaders(headers: string[]): void {
    const missingColumns = REQUIRED_COLUMNS.filter((col) => !headers.includes(col));
    if (missingColumns.length > 0) {
      throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
    }

    const extraColumns = headers.filter(
      (col) => !REQUIRED_COLUMNS.includes(col as (typeof REQUIRED_COLUMNS)[number])
    );
    if (extraColumns.length > 0) {
      throw new Error(`Unexpected columns: ${extraColumns.join(', ')}`);
    }
  }

  private parseRow(row: Record<string, string>, rowNumber: number): Expense {
    for (const column of REQUIRED_COLUMNS) {
      const value = row[column]?.trim();
      if (!value) {
        throw new Error(`Row ${rowNumber}: ${column} is empty`);
      }
    }

    const amount = parseFloat(row.amount);
    if (isNaN(amount)) {
      throw new Error(`Row ${rowNumber}: amount is not a valid number`);
    }

    return {
      date: row.date.trim(),
      employee: row.employee.trim(),
      category: row.category.trim(),
      amount,
      description: row.description.trim(),
    };
  }
}
