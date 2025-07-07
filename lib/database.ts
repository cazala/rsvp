// Database abstraction layer to support both Supabase and Neon

export type DatabaseProvider = 'supabase' | 'neon';

// Common database response structure
export interface DatabaseResponse<T = unknown> {
  data: T | null;
  error: Error | null;
}

// Query builder interface that mimics Supabase API
export interface QueryBuilder<T = unknown> {
  select(columns?: string): QueryBuilder<T>;
  insert(values: Record<string, unknown> | Record<string, unknown>[]): QueryBuilder<T>;
  update(values: Record<string, unknown>): QueryBuilder<T>;
  delete(): QueryBuilder<T>;
  eq(column: string, value: unknown): QueryBuilder<T>;
  order(column: string, options?: { ascending?: boolean }): QueryBuilder<T>;
  limit(count: number): QueryBuilder<T>;
  single(): QueryBuilder<T>;
  // Execute the query and return a promise
  then<TResult1 = DatabaseResponse<T>, TResult2 = never>(
    onfulfilled?: ((value: DatabaseResponse<T>) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): PromiseLike<TResult1 | TResult2>;
}

// Main database client interface
export interface DatabaseClient {
  from(table: string): QueryBuilder;
}

// Provider factory function
export function getDatabaseClient(accessLevel: 'public' | 'admin' = 'public'): DatabaseClient | null {
  const provider = (process.env.DATABASE_PROVIDER as DatabaseProvider) || 'supabase';
  
  switch (provider) {
    case 'supabase':
      return getSupabaseClientSync(accessLevel);
    case 'neon':
      return getNeonClientSync();
    default:
      console.error(`Unsupported database provider: ${provider}`);
      return null;
  }
}

// Convenience functions to match existing API
export function getDatabase(): DatabaseClient | null {
  return getDatabaseClient('public');
}

export function getDatabaseAdmin(): DatabaseClient | null {
  return getDatabaseClient('admin');
}

// Provider-specific implementations (synchronous)
function getSupabaseClientSync(accessLevel: 'public' | 'admin'): DatabaseClient | null {
  try {
    if (accessLevel === 'admin') {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getSupabaseAdmin } = require('./supabase-admin');
      const supabase = getSupabaseAdmin();
      return createSupabaseAdapter(supabase);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getSupabase } = require('./supabase');
      const supabase = getSupabase();
      return supabase ? createSupabaseAdapter(supabase) : null;
    }
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    return null;
  }
}

function getNeonClientSync(): DatabaseClient | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createNeonClient } = require('./providers/neon');
    return createNeonClient();
  } catch (error) {
    console.error('Error creating Neon client:', error);
    return null;
  }
}

// Type for Supabase client
interface SupabaseClient {
  from(table: string): SupabaseQueryBuilder;
}

interface SupabaseQueryBuilder {
  select(columns?: string): SupabaseQueryBuilder;
  insert(values: Record<string, unknown> | Record<string, unknown>[]): SupabaseQueryBuilder;
  update(values: Record<string, unknown>): SupabaseQueryBuilder;
  delete(): SupabaseQueryBuilder;
  eq(column: string, value: unknown): SupabaseQueryBuilder;
  order(column: string, options?: { ascending?: boolean }): SupabaseQueryBuilder;
  limit(count: number): SupabaseQueryBuilder;
  single(): SupabaseQueryBuilder;
  then(
    onfulfilled?: (value: { data: unknown; error: unknown }) => unknown,
    onrejected?: (reason: unknown) => unknown
  ): Promise<unknown>;
}

// Supabase adapter to match our interface
function createSupabaseAdapter(supabaseClient: SupabaseClient): DatabaseClient {
  return {
    from(table: string): QueryBuilder {
      const query = supabaseClient.from(table);
      
      // Create a proxy that maintains the Supabase API but implements our interface
      return createQueryBuilderProxy(query);
    }
  };
}

function createQueryBuilderProxy(supabaseQuery: SupabaseQueryBuilder): QueryBuilder {
  const proxy = {
    select: (columns?: string) => createQueryBuilderProxy(supabaseQuery.select(columns)),
    insert: (values: Record<string, unknown> | Record<string, unknown>[]) => 
      createQueryBuilderProxy(supabaseQuery.insert(values)),
    update: (values: Record<string, unknown>) => createQueryBuilderProxy(supabaseQuery.update(values)),
    delete: () => createQueryBuilderProxy(supabaseQuery.delete()),
    eq: (column: string, value: unknown) => createQueryBuilderProxy(supabaseQuery.eq(column, value)),
    order: (column: string, options?: { ascending?: boolean }) => 
      createQueryBuilderProxy(supabaseQuery.order(column, options)),
    limit: (count: number) => createQueryBuilderProxy(supabaseQuery.limit(count)),
    single: () => createQueryBuilderProxy(supabaseQuery.single()),
    then: <TResult1 = DatabaseResponse, TResult2 = never>(
      onfulfilled?: ((value: DatabaseResponse) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ) => {
      // Execute the Supabase query and transform the response
      return supabaseQuery.then((response: { data: unknown; error: unknown }) => {
        // Transform Supabase response to our standard format
        const transformedResponse: DatabaseResponse = {
          data: response.data,
          error: response.error as Error | null
        };
        return onfulfilled ? onfulfilled(transformedResponse) : transformedResponse;
      }, onrejected || undefined);
    }
  };

  return proxy as QueryBuilder;
}