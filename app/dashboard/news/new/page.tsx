"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  ArrowLeft, 
  Save, 
  Eye,
  Upload,
  Calendar,
  Tag
} from "lucide-react"
import Link from "next/link"

export default function NewNewsPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [publishImmediately, setPublishImmediately] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    router.push("/dashboard/news")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/news">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Create News Article</h1>
          <p className="text-muted-foreground mt-1">
            Share updates and announcements with your audience
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Article Content</CardTitle>
                <CardDescription>
                  Write your news article
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Headline</Label>
                  <Input 
                    id="title" 
                    placeholder="Enter a compelling headline..."
                    className="bg-background text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Summary</Label>
                  <Textarea 
                    id="excerpt" 
                    placeholder="Brief summary of the news article..."
                    className="bg-background resize-none"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Full Article</Label>
                  <Textarea 
                    id="content" 
                    placeholder="Write the full article content here..."
                    className="bg-background resize-none min-h-[300px]"
                    rows={12}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
                <CardDescription>
                  Add a header image for your article
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm font-medium text-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, WebP (max. 5MB)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Publish Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Publish Immediately</Label>
                    <p className="text-xs text-muted-foreground">
                      Make visible right away
                    </p>
                  </div>
                  <Switch 
                    checked={publishImmediately}
                    onCheckedChange={setPublishImmediately}
                  />
                </div>

                {!publishImmediately && (
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="publish-date">Schedule Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="publish-date" 
                        type="datetime-local"
                        className="pl-10 bg-background"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="company">Company News</SelectItem>
                      <SelectItem value="market">Market Update</SelectItem>
                      <SelectItem value="awards">Awards & Recognition</SelectItem>
                      <SelectItem value="events">Events</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="tags" 
                      placeholder="Add tags separated by commas"
                      className="pl-10 bg-background"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meta-title">Meta Title</Label>
                  <Input 
                    id="meta-title" 
                    placeholder="SEO title..."
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta-description">Meta Description</Label>
                  <Textarea 
                    id="meta-description" 
                    placeholder="Brief description for search engines..."
                    className="bg-background resize-none"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              <Button 
                type="submit" 
                className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? "Publishing..." : "Publish Article"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
