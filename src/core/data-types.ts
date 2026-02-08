/**
 * Data type inference and field analysis
 */

export type FieldType = 'quantitative' | 'temporal' | 'ordinal' | 'nominal';

export interface FieldInfo {
  name: string;
  type: FieldType;
  domain: [any, any];
  nullable: boolean;
  cardinality: number; // Number of unique values
}

export interface DataTypeStats {
  fields: Record<string, FieldInfo>;
  rowCount: number;
}

/**
 * Infer the type of a field from sample values
 */
export function inferFieldType(values: any[]): FieldType {
  const nonNull = values.filter((v) => v != null);
  if (nonNull.length === 0) return 'nominal';

  // Check if temporal
  const firstValue = nonNull[0];
  if (firstValue instanceof Date) return 'temporal';
  if (typeof firstValue === 'string') {
    // Try parsing as date
    const parsed = new Date(firstValue);
    if (!isNaN(parsed.getTime()) && /\d{4}/.test(firstValue)) {
      return 'temporal';
    }
  }

  // Check if quantitative
  if (typeof firstValue === 'number') {
    return 'quantitative';
  }

  // Check if ordinal (has natural order) vs nominal
  const uniqueCount = new Set(nonNull).size;
  const ratio = uniqueCount / nonNull.length;

  // If low cardinality relative to data size, likely categorical
  if (ratio < 0.5) {
    return 'ordinal';
  }

  return 'nominal';
}

/**
 * Get domain (min/max or unique values) for a field
 */
export function inferDomain(values: any[], type: FieldType): [any, any] {
  const nonNull = values.filter((v) => v != null);

  if (type === 'quantitative') {
    const numbers = nonNull.map((v) => (typeof v === 'number' ? v : parseFloat(v)));
    const validNumbers = numbers.filter((n) => !isNaN(n));
    if (validNumbers.length === 0) return [0, 1];
    return [Math.min(...validNumbers), Math.max(...validNumbers)];
  }

  if (type === 'temporal') {
    const dates = nonNull.map((v) => (v instanceof Date ? v : new Date(v)));
    const validDates = dates.filter((d) => !isNaN(d.getTime()));
    if (validDates.length === 0) return [new Date(), new Date()];
    const times = validDates.map((d) => d.getTime());
    return [new Date(Math.min(...times)), new Date(Math.max(...times))];
  }

  // For nominal/ordinal, return unique values
  const unique = Array.from(new Set(nonNull));
  return [unique[0], unique[unique.length - 1]];
}

/**
 * Analyze all fields in a dataset
 */
export function analyzeData<T extends Record<string, any>>(data: T[]): DataTypeStats {
  if (data.length === 0) {
    return { fields: {}, rowCount: 0 };
  }

  const firstRow = data[0];
  const fieldNames = Object.keys(firstRow);
  const fields: Record<string, FieldInfo> = {};

  for (const name of fieldNames) {
    const values = data.map((row) => row[name]);
    const type = inferFieldType(values);
    const domain = inferDomain(values, type);
    const nonNull = values.filter((v) => v != null);
    const uniqueCount = new Set(nonNull).size;

    fields[name] = {
      name,
      type,
      domain,
      nullable: nonNull.length < values.length,
      cardinality: uniqueCount
    };
  }

  return {
    fields,
    rowCount: data.length
  };
}

/**
 * Select default x and y fields from analyzed data
 */
export function selectDefaultFields(stats: DataTypeStats): { x?: string; y?: string } {
  const fieldList = Object.values(stats.fields);

  // Prefer first temporal or ordinal field for x
  const xField =
    fieldList.find((f) => f.type === 'temporal') ||
    fieldList.find((f) => f.type === 'ordinal') ||
    fieldList.find((f) => f.type === 'quantitative');

  // Prefer first quantitative field (not x) for y
  const yField = fieldList.find((f) => f.name !== xField?.name && f.type === 'quantitative');

  return {
    x: xField?.name,
    y: yField?.name
  };
}
