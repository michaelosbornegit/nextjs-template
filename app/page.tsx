"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Trash2, Edit3, Save, X } from "lucide-react"

interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([])
  const [newTitle, setNewTitle] = useState("")
  const [newContent, setNewContent] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("notes")
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      }))
      setNotes(parsedNotes)
    }
  }, [])

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])

  const addNote = () => {
    if (newTitle.trim() || newContent.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        title: newTitle.trim() || "Untitled",
        content: newContent.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setNotes([note, ...notes])
      setNewTitle("")
      setNewContent("")
    }
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id))
  }

  const startEditing = (note: Note) => {
    setEditingId(note.id)
    setEditTitle(note.title)
    setEditContent(note.content)
  }

  const saveEdit = () => {
    if (editingId) {
      setNotes(
        notes.map((note) =>
          note.id === editingId
            ? { ...note, title: editTitle.trim() || "Untitled", content: editContent.trim(), updatedAt: new Date() }
            : note,
        ),
      )
      setEditingId(null)
      setEditTitle("")
      setEditContent("")
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditTitle("")
    setEditContent("")
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Notes</h1>
          <p className="text-muted-foreground">Capture your thoughts and ideas</p>
        </div>

        {/* Add new note form */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-lg font-semibold">Add New Note</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Note title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full"
            />
            <Textarea
              placeholder="Write your note here..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full min-h-[100px] resize-none"
            />
            <Button onClick={addNote} className="w-full sm:w-auto">
              Add Note
            </Button>
          </CardContent>
        </Card>

        {/* Notes list */}
        <div className="space-y-4">
          {notes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground text-lg">No notes yet. Create your first note above!</p>
              </CardContent>
            </Card>
          ) : (
            notes.map((note) => (
              <Card key={note.id} className="transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  {editingId === note.id ? (
                    // Edit mode
                    <div className="space-y-4">
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="font-semibold text-lg"
                      />
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-[100px] resize-none"
                      />
                      <div className="flex gap-2">
                        <Button onClick={saveEdit} size="sm" className="flex items-center gap-2">
                          <Save className="w-4 h-4" />
                          Save
                        </Button>
                        <Button
                          onClick={cancelEdit}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 bg-transparent"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-lg text-foreground">{note.title}</h3>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => startEditing(note)}
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <Edit3 className="w-4 h-4" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => deleteNote(note.id)}
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                      {note.content && <p className="text-foreground whitespace-pre-wrap mb-3">{note.content}</p>}
                      <div className="text-sm text-muted-foreground">
                        Created: {formatDate(note.createdAt)}
                        {note.updatedAt.getTime() !== note.createdAt.getTime() && (
                          <span className="ml-4">Updated: {formatDate(note.updatedAt)}</span>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
