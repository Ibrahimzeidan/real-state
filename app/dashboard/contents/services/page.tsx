"use client"

import { useState } from "react"
import { Save, Eye, Image, Plus, Trash2, GripVertical } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

export default function ServicesContentPage() {
  const [pageTitle, setPageTitle] = useState("Our Services")
  const [pageDescription, setPageDescription] = useState(
    "We offer comprehensive real estate services to help you buy, sell, or invest in properties with confidence."
  )

  const [services, setServices] = useState([
    {
      id: 1,
      title: "Buying Services",
      description: "Find your dream home with our expert guidance. We help you navigate the buying process from search to closing.",
      features: ["Property Search", "Market Analysis", "Negotiation", "Closing Support"],
      icon: "Home",
      isActive: true,
    },
    {
      id: 2,
      title: "Selling Services",
      description: "Maximize your property's value with our proven selling strategies and extensive market reach.",
      features: ["Home Valuation", "Professional Staging", "Marketing", "Open Houses"],
      icon: "DollarSign",
      isActive: true,
    },
    {
      id: 3,
      title: "Property Management",
      description: "Let us handle the day-to-day management of your investment properties while you enjoy passive income.",
      features: ["Tenant Screening", "Rent Collection", "Maintenance", "Financial Reporting"],
      icon: "Building",
      isActive: true,
    },
    {
      id: 4,
      title: "Investment Consulting",
      description: "Make informed investment decisions with our expert market insights and portfolio strategies.",
      features: ["Market Analysis", "ROI Projections", "Portfolio Review", "Investment Strategy"],
      icon: "TrendingUp",
      isActive: true,
    },
    {
      id: 5,
      title: "Relocation Services",
      description: "Moving to a new city? We make the transition smooth with comprehensive relocation support.",
      features: ["Area Tours", "School Research", "Moving Coordination", "Settling-In Support"],
      icon: "MapPin",
      isActive: false,
    },
  ])

  const addFeature = (serviceIndex: number) => {
    const newServices = [...services]
    newServices[serviceIndex].features.push("New Feature")
    setServices(newServices)
  }

  const removeFeature = (serviceIndex: number, featureIndex: number) => {
    const newServices = [...services]
    newServices[serviceIndex].features.splice(featureIndex, 1)
    setServices(newServices)
  }

  const updateFeature = (serviceIndex: number, featureIndex: number, value: string) => {
    const newServices = [...services]
    newServices[serviceIndex].features[featureIndex] = value
    setServices(newServices)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services Page</h1>
          <p className="text-muted-foreground mt-1">
            Manage the services you offer to your clients
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

      {/* Page Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Page Settings</CardTitle>
          <CardDescription>
            Configure the header and introduction for your services page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pageTitle">Page Title</Label>
            <Input
              id="pageTitle"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
              placeholder="Enter page title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pageDescription">Page Description</Label>
            <Textarea
              id="pageDescription"
              value={pageDescription}
              onChange={(e) => setPageDescription(e.target.value)}
              placeholder="Enter page description"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Services List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Services</CardTitle>
              <CardDescription>
                Add, edit, or remove services from your offerings
              </CardDescription>
            </div>
            <Button>
              <Plus className="mr-2 size-4" />
              Add Service
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {services.map((service, serviceIndex) => (
            <div 
              key={service.id} 
              className={`p-6 rounded-lg border ${!service.isActive ? "opacity-60" : ""}`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 cursor-move text-muted-foreground">
                  <GripVertical className="size-5" />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <Input
                          value={service.title}
                          onChange={(e) => {
                            const newServices = [...services]
                            newServices[serviceIndex].title = e.target.value
                            setServices(newServices)
                          }}
                          className="text-lg font-semibold max-w-xs"
                        />
                        {!service.isActive && (
                          <Badge variant="secondary">Hidden</Badge>
                        )}
                      </div>
                      <Textarea
                        value={service.description}
                        onChange={(e) => {
                          const newServices = [...services]
                          newServices[serviceIndex].description = e.target.value
                          setServices(newServices)
                        }}
                        rows={2}
                        className="resize-none"
                      />
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`active-${service.id}`} className="text-sm">
                          Active
                        </Label>
                        <Switch
                          id={`active-${service.id}`}
                          checked={service.isActive}
                          onCheckedChange={(checked) => {
                            const newServices = [...services]
                            newServices[serviceIndex].isActive = checked
                            setServices(newServices)
                          }}
                        />
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Features / Key Points</Label>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => addFeature(serviceIndex)}
                      >
                        <Plus className="mr-1 size-3" />
                        Add
                      </Button>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <Input
                            value={feature}
                            onChange={(e) => updateFeature(serviceIndex, featureIndex, e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0 text-muted-foreground hover:text-destructive"
                            onClick={() => removeFeature(serviceIndex, featureIndex)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <Button variant="outline" size="sm">
                      <Image className="mr-2 size-4" />
                      Upload Icon
                    </Button>
                    <Button variant="outline" size="sm">
                      <Image className="mr-2 size-4" />
                      Upload Image
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card>
        <CardHeader>
          <CardTitle>Call to Action</CardTitle>
          <CardDescription>
            Add a call to action at the bottom of your services page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>CTA Title</Label>
            <Input defaultValue="Ready to Get Started?" />
          </div>
          <div className="space-y-2">
            <Label>CTA Description</Label>
            <Textarea 
              defaultValue="Contact us today to discuss how we can help you with your real estate needs."
              rows={2}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Button Text</Label>
              <Input defaultValue="Contact Us" />
            </div>
            <div className="space-y-2">
              <Label>Button Link</Label>
              <Input defaultValue="/contact" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
