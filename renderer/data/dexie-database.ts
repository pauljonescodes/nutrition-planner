import Dexie, { Table } from "dexie";

export interface User {
  id?: number;
  email: string;
  password: string;
}

export class DexieDatabase extends Dexie {
  users?: Table<User, number>;

  constructor() {
    super("dexie-database");

    this.version(3).stores({
      users: "++id, email, password",
    });
  }
}

export const database = new DexieDatabase();
