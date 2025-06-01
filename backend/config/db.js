import { neon } from "@neondatabase/serverless";
import dotevn from "dotenv";

dotevn.config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

export const sql = neon(
	`postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}`
);
