import { Card, CardContent } from "@/components/ui/card"
import { getNotes } from "@/lib/db"
import { NoteForm } from "@/components/note-form"
import { NoteCard } from "@/components/note-card"

export default async function NotesApp() {
  const notes = await getNotes()

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Notes</h1>
          <p className="text-muted-foreground">Capture your thoughts and ideas</p>
        </div>

        {/* Add new note form */}
        <NoteForm />

        {/* Notes list */}
        <div className="space-y-4">
          {notes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground text-lg">No notes yet. Create your first note above!</p>
              </CardContent>
            </Card>
          ) : (
            notes.map((note) => <NoteCard key={note.id} note={note} />)
          )}
        </div>
      </div>
    </div>
  )
}
