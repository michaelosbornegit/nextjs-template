"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { addNote } from "@/lib/actions"

export function NoteForm() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      const result = await addNote(formData)
      if (result.success) {
        setTitle("")
        setContent("")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <h2 className="text-lg font-semibold">Add New Note</h2>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <Input
            name="title"
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
          />
          <Textarea
            name="content"
            placeholder="Write your note here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[100px] resize-none"
          />
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? "Adding..." : "Add Note"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
