import mysql from 'mysql2/promise';
import { timeout } from '../utils/time';

const options: mysql.PoolOptions = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_ACCOUNT,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT ? +process.env.MYSQL_PORT : 3306,
  timezone: process.env.MYSQL_TIMEZONE,
};

export const pool = mysql.createPool(options);

export async function pingMySql(): Promise<void> {
  let conn: mysql.PoolConnection | null = null;

  for (let i = 1; i <= 10; i++) {
    await timeout(3000);
    try {
      conn = await pool.getConnection();
      await conn.ping();
      console.log('Successfully connected to MySQL.');
      return;
    } catch (error: unknown) {
      console.log(`MySQL ping failed, tried ${i} times`);
      continue;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  throw new Error('MySQL connection failed.');
}

/**
 * Executes a SQL query.
 * @param {string} query - The SQL query to execute.
 * @param {any[]} [params] - The parameters for the query.
 * @returns {Promise<mysql.RowDataPacket[]>} - The results of the query.
 */
export async function execute(query: string, params?: any[]): Promise<mysql.RowDataPacket[]> {
  const connection = await pool.getConnection();

  try {
    const [results] = await connection.execute<mysql.RowDataPacket[]>(query, params);
    return results;
  } catch (error) {
    console.log('SQL execute failed, ', error);
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Begins a SQL transaction.
 * @returns {Promise<mysql.PoolConnection>} - The connection with the transaction begun.
 */
export async function txBegin(): Promise<mysql.PoolConnection> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    return connection;
  } catch (error: unknown) {
    console.log('SQL transaction begin failed, error: ', error);
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Executes a SQL query within a transaction.
 * @param {mysql.PoolConnection} connection - The transaction connection.
 * @param {string} query - The SQL query to execute.
 * @param {any[]} params - The parameters for the query.
 * @returns {Promise<mysql.QueryResult>} - The results of the query.
 */
export async function txExec(
  connection: mysql.PoolConnection,
  query: string,
  params: any[]
): Promise<mysql.QueryResult> {
  try {
    const [results] = await connection.execute(query, params);
    return results;
  } catch (error: unknown) {
    await connection.rollback();
    console.log('SQL transaction query execute failed, error: ', error);
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Commits a SQL transaction.
 * @param {mysql.PoolConnection} connection - The transaction connection.
 * @returns {Promise<void>} - Void promise after committing the transaction.
 */
export async function txCommit(connection: mysql.PoolConnection): Promise<void> {
  try {
    await connection.commit();
  } catch (error: unknown) {
    await connection.rollback();
    console.log('SQL transaction commit failed, error: ', error);
    throw error;
  } finally {
    connection.release();
  }
}
