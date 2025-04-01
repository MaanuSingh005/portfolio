declare module 'postgres' {
  type PgOptions = {
    host?: string;
    port?: number;
    database?: string;
    username?: string;
    password?: string;
    ssl?: boolean | { rejectUnauthorized: boolean };
    max?: number;
    idle_timeout?: number;
    connect_timeout?: number;
    prepare?: boolean;
    debug?: (connection_id: string, query: string, params: any[]) => void;
  };

  type PgQueryResult<T> = Promise<T[]> & {
    execute: () => Promise<void>;
  };

  type PgSqlTag = {
    <T = any>(template: TemplateStringsArray, ...args: any[]): PgQueryResult<T>;
    array: (value: any[]) => any;
    begin: (fn: (tx: PgSqlTag) => Promise<any>) => Promise<any>;
    end: () => Promise<void>;
    unsafe: <T = any>(query: string, params?: any[]) => PgQueryResult<T>;
  };

  function postgres(connectionString: string, options?: PgOptions): PgSqlTag;

  export = postgres;
}