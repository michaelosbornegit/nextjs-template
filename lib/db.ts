import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface Note {
  id: number
  title: string
  content: string
  created_at: string
  updated_at: string
}

export async function getNotes(): Promise<Note[]> {
  const notes = await sql`
    SELECT id, title, content, created_at, updated_at 
    FROM notes 
    ORDER BY updated_at DESC
  `
  return notes as Note[]
}

export async function createNote(title: string, content: string): Promise<Note> {
  const [note] = await sql`
    INSERT INTO notes (title, content, created_at, updated_at)
    VALUES (${title}, ${content}, NOW(), NOW())
    RETURNING id, title, content, created_at, updated_at
  `
  return note as Note
}

export async function updateNote(id: number, title: string, content: string): Promise<Note> {
  const [note] = await sql`
    UPDATE notes 
    SET title = ${title}, content = ${content}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, title, content, created_at, updated_at
  `
  return note as Note
}

export async function deleteNote(id: number): Promise<void> {
  await sql`DELETE FROM notes WHERE id = ${id}`
}
