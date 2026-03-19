"use client"

import { useState } from "react"
import { Save, Eye, Image, Plus, Trash2, GripVertical } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

export default function HomeContentPage() {
  const [heroTitle, setHeroTitle] = useState("Find Your Dream Home")
  const [heroSubtitle, setHeroSubtitle] = useState("Discover exceptional properties in the most desirable locations. Let us help you find the perfect place to call home.")
  const [ctaText, setCtaText] = useState("Browse Properties")

  const [features, setFeatures] = useState([
    { id: 1, title: "Premium Listings", description: "Access to exclusive high-end properties" },
    { id: 2, title: "Expert Agents", description: "Work with experienced real estate professionals" },
    { id: 3, title: "Virtual Tours", description: "Explore properties from the comfort of home" },
  ])

  const [stats, setStats] = useState([
    { id: 1, value: "500+", label: "Properties Sold" },
    { id: 2, value: "$2B+", label: "In Sales" },
    { id: 3, value: "15+", label: "Years Experience" },
    { id: 4, value: "98%", label: "Client Satisfaction" },
  ])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Home Page</h1>
          <p className="text-muted-foreground mt-1">
            Edit the content displayed on your homepage
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

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="cta">CTA</TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>
                The main banner that visitors see first on your homepage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="heroTitle">Main Headline</Label>
                <Input
                  id="heroTitle"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder="Enter main headline"
                />
                <p className="text-xs text-muted-foreground">
                  Keep it short and impactful - ideally under 10 words
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="heroSubtitle">Subtitle / Description</Label>
                <Textarea
                  id="heroSubtitle"
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  placeholder="Enter subtitle"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  A brief description that supports your headline
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ctaText">Button Text</Label>
                <Input
                  id="ctaText"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="Enter button text"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Hero Background</Label>
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
                    Recommended: 1920x1080px, max 5MB
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                <div>
                  <Label className="font-medium">Show Search Bar</Label>
                  <p className="text-sm text-muted-foreground">
                    Display property search on the hero section
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Section */}
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Features Section</CardTitle>
                  <CardDescription>
                    Highlight key features or benefits of your services
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 size-4" />
                  Add Feature
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.map((feature, index) => (
                <div key={feature.id} className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                  <div className="mt-2 cursor-move text-muted-foreground">
                    <GripVertical className="size-5" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={feature.title}
                        onChange={(e) => {
                          const newFeatures = [...features]
                          newFeatures[index].title = e.target.value
                          setFeatures(newFeatures)
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={feature.description}
                        onChange={(e) => {
                          const newFeatures = [...features]
                          newFeatures[index].description = e.target.value
                          setFeatures(newFeatures)
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stats Section */}
        <TabsContent value="stats" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Statistics Section</CardTitle>
                  <CardDescription>
                    Showcase impressive numbers that build trust
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 size-4" />
                  Add Stat
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {stats.map((stat, index) => (
                  <div key={stat.id} className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                    <div className="flex-1 space-y-3">
                      <div className="space-y-2">
                        <Label>Value</Label>
                        <Input
                          value={stat.value}
                          onChange={(e) => {
                            const newStats = [...stats]
                            newStats[index].value = e.target.value
                            setStats(newStats)
                          }}
                          placeholder="e.g., 500+"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Label</Label>
                        <Input
                          value={stat.label}
                          onChange={(e) => {
                            const newStats = [...stats]
                            newStats[index].label = e.target.value
                            setStats(newStats)
                          }}
                          placeholder="e.g., Properties Sold"
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

        {/* CTA Section */}
        <TabsContent value="cta" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Call to Action Section</CardTitle>
              <CardDescription>
                The final section encouraging visitors to take action
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>CTA Headline</Label>
                <Input
                  defaultValue="Ready to Find Your Perfect Home?"
                  placeholder="Enter CTA headline"
                />
              </div>

              <div className="space-y-2">
                <Label>CTA Description</Label>
                <Textarea
                  defaultValue="Contact our team of experts today and let us help you find your dream property."
                  placeholder="Enter CTA description"
                  rows={2}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Primary Button Text</Label>
                  <Input defaultValue="Contact Us" placeholder="Button text" />
                </div>
                <div className="space-y-2">
                  <Label>Primary Button Link</Label>
                  <Input defaultValue="/contact" placeholder="/page-url" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Secondary Button Text</Label>
                  <Input defaultValue="View Properties" placeholder="Button text" />
                </div>
                <div className="space-y-2">
                  <Label>Secondary Button Link</Label>
                  <Input defaultValue="/projects" placeholder="/page-url" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
