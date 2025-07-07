import { neon, neonConfig } from '@neondatabase/serverless';
import type { DatabaseClient, QueryBuilder, DatabaseResponse } from '../database';

// Configure WebSocket for Node.js environment
if (typeof process !== 'undefined' && process.versions?.node) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ws = require('ws');
    neonConfig.webSocketConstructor = ws;
  } catch {
    console.warn('WebSocket configuration failed, falling back to HTTP');
  }
}

export function createNeonClient(): DatabaseClient | null {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('DATABASE_URL environment variable is required for Neon');
    return null;
  }

  const sql = neon(databaseUrl);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new NeonDatabaseClient(sql as any);
}
class NeonDatabaseClient implements DatabaseClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private sql: any) {}

  from(table: string): QueryBuilder {
    return new NeonQueryBuilder(this.sql, table);
  }
}

class NeonQueryBuilder implements QueryBuilder {
  private selectedColumns: string = '*';
  private whereConditions: Array<{ condition: string; value: unknown }> = [];
  private orderColumn: string = '';
  private orderDirection: 'ASC' | 'DESC' = 'ASC';
  private limitValue: number | null = null;
  private insertData: Record<string, unknown> | Record<string, unknown>[] | null = null;
  private updateData: Record<string, unknown> | null = null;
  private isDeleteQuery: boolean = false;
  private shouldReturnSingle: boolean = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private sql: any, private table: string) {}

  // Helper method to execute SQL with proper typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async executeSql(query: string, params: unknown[] = []): Promise<any[]> {
    try {
      console.log('[Neon] Executing query:', query);
      console.log('[Neon] Parameters:', params);
      
      
      if (params.length === 0) {
        // For queries without parameters, we need to use a different approach
        // since template literal variable interpolation doesn't work properly
        console.log('[Neon] Using direct query execution for queries without params');
        
        // Use the newer query method which handles string queries properly
        return await this.sql.query(query);
      } else {
        // For queries with parameters, use sql.query() method
        console.log('[Neon] Using sql.query() for parameterized query');
        return await this.sql.query(query, params);
      }
    } catch (error) {
      console.error('[Neon] Query execution failed:', error);
      console.error('[Neon] Query was:', query);
      console.error('[Neon] Params were:', params);
      throw error;
    }
  }


  select(columns?: string): QueryBuilder {
    this.selectedColumns = columns || '*';
    return this;
  }

  insert(values: Record<string, unknown> | Record<string, unknown>[]): QueryBuilder {
    this.insertData = values;
    return this;
  }

  update(values: Record<string, unknown>): QueryBuilder {
    this.updateData = values;
    return this;
  }

  delete(): QueryBuilder {
    this.isDeleteQuery = true;
    return this;
  }

  eq(column: string, value: unknown): QueryBuilder {
    this.whereConditions.push({ condition: `${column} = $${this.whereConditions.length + 1}`, value });
    return this;
  }

  order(column: string, options?: { ascending?: boolean }): QueryBuilder {
    this.orderColumn = column;
    this.orderDirection = options?.ascending === false ? 'DESC' : 'ASC';
    return this;
  }

  limit(count: number): QueryBuilder {
    this.limitValue = count;
    return this;
  }

  single(): QueryBuilder {
    this.shouldReturnSingle = true;
    return this;
  }

  async then<TResult1 = DatabaseResponse, TResult2 = never>(
    onfulfilled?: ((value: DatabaseResponse) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): Promise<TResult1 | TResult2> {
    try {
      const result = await this.execute();
      const response: DatabaseResponse = {
        data: result,
        error: null
      };
      
      if (onfulfilled) {
        return onfulfilled(response);
      }
      return response as TResult1;
    } catch (error) {
      const response: DatabaseResponse = {
        data: null,
        error: error instanceof Error ? error : new Error(String(error))
      };
      
      if (onrejected) {
        return onrejected(error);
      }
      
      if (onfulfilled) {
        return onfulfilled(response);
      }
      return response as TResult1;
    }
  }

  private async execute(): Promise<unknown> {
    if (this.insertData) {
      return this.executeInsert();
    } else if (this.updateData) {
      return this.executeUpdate();
    } else if (this.isDeleteQuery) {
      return this.executeDelete();
    } else {
      return this.executeSelect();
    }
  }

  private async executeSelect(): Promise<unknown> {
    const whereValues = this.whereConditions.map(w => w.value);
    
    // Build the basic query
    let query = `SELECT ${this.selectedColumns} FROM ${this.table}`;
    
    // For now, disable complex JOIN queries and use simple SELECT
    // TODO: Re-implement JOIN support after fixing basic queries
    
    // Add WHERE conditions if any
    if (this.whereConditions.length > 0) {
      const whereClause = this.whereConditions.map(w => w.condition).join(' AND ');
      query += ` WHERE ${whereClause}`;
    }
    
    // Add ORDER BY if specified
    if (this.orderColumn) {
      query += ` ORDER BY ${this.orderColumn} ${this.orderDirection}`;
    }
    
    // Add LIMIT if specified
    if (this.limitValue !== null) {
      // Always add LIMIT directly since it's a number and safe to embed
      query += ` LIMIT ${this.limitValue}`;
    }

    console.log('[Neon] Executing SELECT query:', query);
    console.log('[Neon] Parameters:', whereValues);
    
    const result = await this.executeSql(query, whereValues);
    
    // Simple result transformation (no complex JOIN handling for now)
    if (this.shouldReturnSingle) {
      return result[0] || null;
    }
    
    return result;
  }

  private async executeInsert(): Promise<unknown> {
    console.log('[Neon] Table:', this.table);
    console.log('[Neon] Insert data:', this.insertData);
    
    if (!this.insertData) throw new Error('No insert data provided');
    
    const data = Array.isArray(this.insertData) ? this.insertData : [this.insertData];
    
    if (data.length === 0) throw new Error('Insert data array is empty');
    
    const columns = Object.keys(data[0]);
    const columnsList = columns.join(', ');
    
    // For multiple inserts, we need to build the VALUES clause with parameters
    const valuesPerRow = columns.length;
    const allValues: unknown[] = [];
    
    const valueRows = data.map((row, rowIndex) => {
      const rowParams = columns.map((col, colIndex) => {
        const paramIndex = rowIndex * valuesPerRow + colIndex + 1;
        allValues.push(row[col]);
        return `$${paramIndex}`;
      });
      return `(${rowParams.join(', ')})`;
    });
    
    const query = `INSERT INTO ${this.table} (${columnsList}) VALUES ${valueRows.join(', ')} RETURNING *`;
    
    console.log('[Neon] Executing INSERT:', query, 'with params:', allValues);
    
    return await this.executeSql(query, allValues);
  }

  private async executeUpdate(): Promise<unknown> {
    console.log('[Neon] Table:', this.table);
    console.log('[Neon] Update data:', this.updateData);
    
    if (!this.updateData) throw new Error('No update data provided');
    
    const updateValues = Object.values(this.updateData);
    const whereValues = this.whereConditions.map(w => w.value);
    const allValues = [...updateValues, ...whereValues];
    
    const setPairs = Object.keys(this.updateData).map((key, index) => {
      return `${key} = $${index + 1}`;
    });
    
    let query = `UPDATE ${this.table} SET ${setPairs.join(', ')}`;
    
    if (this.whereConditions.length > 0) {
      const whereClause = this.whereConditions.map((w, index) => {
        return w.condition.replace(`$${index + 1}`, `$${updateValues.length + index + 1}`);
      }).join(' AND ');
      query += ` WHERE ${whereClause}`;
    }
    
    query += ` RETURNING *`;
    
    console.log('[Neon] Executing UPDATE:', query, 'with params:', allValues);
    
    return await this.executeSql(query, allValues);
  }

  private async executeDelete(): Promise<unknown> {
    console.log('[Neon] Table:', this.table);
    console.log('[Neon] Where conditions:', this.whereConditions);
    
    const whereValues = this.whereConditions.map(w => w.value);
    
    let query = `DELETE FROM ${this.table}`;
    
    if (this.whereConditions.length > 0) {
      query += ` WHERE ${this.whereConditions.map(w => w.condition).join(' AND ')}`;
    }
    
    query += ` RETURNING *`;
    
    console.log('[Neon] Executing DELETE:', query, 'with params:', whereValues);
    
    return await this.executeSql(query, whereValues);
  }
}