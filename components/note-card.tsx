"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Trash2, Edit3, Save, X } from "lucide-react"
import { editNote, removeNote } from "@/lib/actions"
import type { Note } from "@/lib/db"

interface NoteCardProps {
  note: Note
}

export function NoteCard({ note }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(note.title)
  const [editContent, setEditContent] = useState(note.content)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleEdit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      const result = await editNote(formData)
      if (result.success) {
        setIsEditing(false)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (formData: FormData) => {
    setIsSubmitting(true)
    await removeNote(formData)
  }

  const startEditing = () => {
    setIsEditing(true)
    setEditTitle(note.title)
    setEditContent(note.content)
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditTitle(note.title)
    setEditContent(note.content)
  }

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        {isEditing ? (
          // Edit mode
          <form action={handleEdit} className="space-y-4">
            <input type="hidden" name="id" value={note.id} />
            <Input
              name="title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="font-semibold text-lg"
            />
            <Textarea
              name="content"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting} size="sm" className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
              <Button
                type="button"
                onClick={cancelEdit}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          // View mode
          <div>
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg text-foreground">{note.title}</h3>
              <div className="flex gap-2">
                <Button onClick={startEditing} variant="ghost" size="sm" className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4" />
                  Edit
                </Button>
                <form action={handleDelete} className="inline">
                  <input type="hidden" name="id" value={note.id} />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                    {isSubmitting ? "Deleting..." : "Delete"}
                  </Button>
                </form>
              </div>
            </div>
            {note.content && <p className="text-foreground whitespace-pre-wrap mb-3">{note.content}</p>}
            <div className="text-sm text-muted-foreground">
              Created: {formatDate(note.created_at)}
              {note.updated_at !== note.created_at && (
                <span className="ml-4">Updated: {formatDate(note.updated_at)}</span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
