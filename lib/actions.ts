"use server"

import { revalidatePath } from "next/cache"
import { createNote, updateNote, deleteNote } from "./db"

export async function addNote(formData: FormData) {
  const title = formData.get("title") as string
  const content = formData.get("content") as string

  if (!title.trim() && !content.trim()) {
    return { error: "Title or content is required" }
  }

  try {
    await createNote(title.trim() || "Untitled", content.trim())
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error creating note:", error)
    return { error: "Failed to create note" }
  }
}

export async function editNote(formData: FormData) {
  const id = Number.parseInt(formData.get("id") as string)
  const title = formData.get("title") as string
  const content = formData.get("content") as string

  try {
    await updateNote(id, title.trim() || "Untitled", content.trim())
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error updating note:", error)
    return { error: "Failed to update note" }
  }
}

export async function removeNote(formData: FormData) {
  const id = Number.parseInt(formData.get("id") as string)

  try {
    await deleteNote(id)
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error deleting note:", error)
    return { error: "Failed to delete note" }
  }
}
