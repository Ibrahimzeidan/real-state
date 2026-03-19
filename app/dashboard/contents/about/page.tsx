"use client"

import { useState } from "react"
import { Save, Eye, Image, Plus, Trash2, GripVertical } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function AboutContentPage() {
  const [companyStory, setCompanyStory] = useState(
    "Founded in 2008, Horizon Realty has been helping families find their perfect homes for over 15 years. What started as a small team of passionate real estate professionals has grown into one of the most trusted names in luxury real estate."
  )

  const [mission, setMission] = useState(
    "Our mission is to provide exceptional real estate services that exceed our clients' expectations, while maintaining the highest standards of integrity and professionalism."
  )

  const [vision, setVision] = useState(
    "To be the most trusted name in real estate, known for our commitment to excellence and our dedication to helping people find their dream homes."
  )

  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: "John Anderson", role: "CEO & Founder", bio: "25+ years in real estate", initials: "JA" },
    { id: 2, name: "Sarah Williams", role: "Chief Operations Officer", bio: "Former Fortune 500 executive", initials: "SW" },
    { id: 3, name: "Michael Chen", role: "Head of Sales", bio: "Top 1% producer nationwide", initials: "MC" },
    { id: 4, name: "Emily Rodriguez", role: "Marketing Director", bio: "Digital marketing expert", initials: "ER" },
  ])

  const [values, setValues] = useState([
    { id: 1, title: "Integrity", description: "We operate with honesty and transparency in every transaction." },
    { id: 2, title: "Excellence", description: "We strive for excellence in everything we do." },
    { id: 3, title: "Client Focus", description: "Our clients' needs always come first." },
    { id: 4, title: "Innovation", description: "We embrace new technologies and methods to serve you better." },
  ])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">About Page</h1>
          <p className="text-muted-foreground mt-1">
            Edit your company information and team details
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Eye className="mr-2 size-4" />
            Preview
          </Button>
          <Button>
            <Save className="mr-2 size-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="story" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="story">Story</TabsTrigger>
          <TabsTrigger value="values">Values</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>

        {/* Company Story */}
        <TabsContent value="story" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Story</CardTitle>
              <CardDescription>
                Tell visitors about your company&apos;s history and journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="pageTitle">Page Title</Label>
                <Input
                  id="pageTitle"
                  defaultValue="About Horizon Realty"
                  placeholder="Enter page title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="story">Our Story</Label>
                <Textarea
                  id="story"
                  value={companyStory}
                  onChange={(e) => setCompanyStory(e.target.value)}
                  placeholder="Tell your company's story..."
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  Share the history and journey of your company
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="mission">Our Mission</Label>
                  <Textarea
                    id="mission"
                    value={mission}
                    onChange={(e) => setMission(e.target.value)}
                    placeholder="Your company's mission..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vision">Our Vision</Label>
                  <Textarea
                    id="vision"
                    value={vision}
                    onChange={(e) => setVision(e.target.value)}
                    placeholder="Your company's vision..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Year Founded</Label>
                <Input type="number" defaultValue="2008" className="w-32" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Values */}
        <TabsContent value="values" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Core Values</CardTitle>
                  <CardDescription>
                    Define the principles that guide your business
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 size-4" />
                  Add Value
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {values.map((value, index) => (
                  <div key={value.id} className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                    <div className="flex-1 space-y-3">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={value.title}
                          onChange={(e) => {
                            const newValues = [...values]
                            newValues[index].title = e.target.value
                            setValues(newValues)
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={value.description}
                          onChange={(e) => {
                            const newValues = [...values]
                            newValues[index].description = e.target.value
                            setValues(newValues)
                          }}
                          rows={2}
                        />
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Section */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    Showcase the people behind your company
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 size-4" />
                  Add Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {teamMembers.map((member, index) => (
                  <div key={member.id} className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                    <Avatar className="size-16">
                      <AvatarFallback className="bg-primary/10 text-primary text-lg">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={member.name}
                          onChange={(e) => {
                            const newMembers = [...teamMembers]
                            newMembers[index].name = e.target.value
                            setTeamMembers(newMembers)
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Input
                          value={member.role}
                          onChange={(e) => {
                            const newMembers = [...teamMembers]
                            newMembers[index].role = e.target.value
                            setTeamMembers(newMembers)
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Bio</Label>
                        <Input
                          value={member.bio}
                          onChange={(e) => {
                            const newMembers = [...teamMembers]
                            newMembers[index].bio = e.target.value
                            setTeamMembers(newMembers)
                          }}
                        />
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <Image className="mr-2 size-4" />
                        Upload Photo
                      </Button>
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media Section */}
        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Media</CardTitle>
              <CardDescription>
                Upload images for your About page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Featured Image</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <div className="mx-auto w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                    <Image className="size-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop an image, or click to browse
                  </p>
                  <Button variant="outline" size="sm">
                    Upload Image
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Recommended: 1200x600px, max 5MB
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Office Gallery</Label>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-video rounded-lg bg-muted flex items-center justify-center border-2 border-dashed">
                      <Button variant="ghost" size="sm">
                        <Plus className="mr-2 size-4" />
                        Add Image
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
