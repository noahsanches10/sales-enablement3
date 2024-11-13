"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Building2, DollarSign, Settings, Users } from "lucide-react";
import { toast } from "sonner";

const businessTypes = [
  "Window Cleaning",
  "Pressure Washing",
  "Gutter Services",
  "Holiday Lighting",
  "Multi-Service",
] as const;

interface BusinessProfile {
  name: string;
  type: typeof businessTypes[number];
  website: string;
  description: string;
  avgContractValue: string;
  minContractValue: string;
  maxContractValue: string;
  targetMarket: string;
  serviceArea: string;
  employeeCount: string;
  yearFounded: string;
  customJobTitles: string[];
}

const defaultProfile: BusinessProfile = {
  name: "",
  type: "Window Cleaning",
  website: "",
  description: "",
  avgContractValue: "",
  minContractValue: "",
  maxContractValue: "",
  targetMarket: "",
  serviceArea: "",
  employeeCount: "",
  yearFounded: "",
  customJobTitles: [],
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<BusinessProfile>(defaultProfile);
  const [newJobTitle, setNewJobTitle] = useState("");

  useEffect(() => {
    const savedProfile = localStorage.getItem("businessProfile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("businessProfile", JSON.stringify(profile));
    toast.success("Business profile saved successfully");
  };

  const addJobTitle = () => {
    if (newJobTitle && !profile.customJobTitles.includes(newJobTitle)) {
      setProfile({
        ...profile,
        customJobTitles: [...profile.customJobTitles, newJobTitle],
      });
      setNewJobTitle("");
    }
  };

  const removeJobTitle = (title: string) => {
    setProfile({
      ...profile,
      customJobTitles: profile.customJobTitles.filter((t) => t !== title),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Business Profile</h1>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Business Info
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Services & Pricing
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  General information about your business
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                      placeholder="Your Business Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type</Label>
                    <Select
                      value={profile.type}
                      onValueChange={(value: typeof businessTypes[number]) =>
                        setProfile({ ...profile, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {businessTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={profile.website}
                    onChange={(e) =>
                      setProfile({ ...profile, website: e.target.value })
                    }
                    placeholder="https://www.example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Business Description</Label>
                  <Textarea
                    id="description"
                    value={profile.description}
                    onChange={(e) =>
                      setProfile({ ...profile, description: e.target.value })
                    }
                    placeholder="Describe your business..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="yearFounded">Year Founded</Label>
                    <Input
                      id="yearFounded"
                      type="number"
                      value={profile.yearFounded}
                      onChange={(e) =>
                        setProfile({ ...profile, yearFounded: e.target.value })
                      }
                      placeholder="2024"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeCount">Number of Employees</Label>
                    <Input
                      id="employeeCount"
                      type="number"
                      value={profile.employeeCount}
                      onChange={(e) =>
                        setProfile({ ...profile, employeeCount: e.target.value })
                      }
                      placeholder="1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Area</CardTitle>
                <CardDescription>
                  Define your service area and target market
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="serviceArea">Service Area</Label>
                  <Textarea
                    id="serviceArea"
                    value={profile.serviceArea}
                    onChange={(e) =>
                      setProfile({ ...profile, serviceArea: e.target.value })
                    }
                    placeholder="List the cities, counties, or regions you serve..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetMarket">Target Market</Label>
                  <Textarea
                    id="targetMarket"
                    value={profile.targetMarket}
                    onChange={(e) =>
                      setProfile({ ...profile, targetMarket: e.target.value })
                    }
                    placeholder="Describe your ideal customers..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contract Values</CardTitle>
                <CardDescription>
                  Define your typical contract values to improve lead scoring
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="avgContractValue">
                      Average Contract Value
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="avgContractValue"
                        type="number"
                        value={profile.avgContractValue}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            avgContractValue: e.target.value,
                          })
                        }
                        className="pl-8"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minContractValue">
                      Minimum Contract Value
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="minContractValue"
                        type="number"
                        value={profile.minContractValue}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            minContractValue: e.target.value,
                          })
                        }
                        className="pl-8"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxContractValue">
                      Maximum Contract Value
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="maxContractValue"
                        type="number"
                        value={profile.maxContractValue}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            maxContractValue: e.target.value,
                          })
                        }
                        className="pl-8"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Custom Job Titles</CardTitle>
                <CardDescription>
                  Add custom job titles specific to your business
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    placeholder="Enter new job title..."
                  />
                  <Button onClick={addJobTitle}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.customJobTitles.map((title) => (
                    <div
                      key={title}
                      className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-md"
                    >
                      <span>{title}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-1"
                        onClick={() => removeJobTitle(title)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Lead Scoring Settings</CardTitle>
              <CardDescription>
                Configure how leads are scored based on your business needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Lead scoring is automatically adjusted based on your business
                    profile, contract values, and service preferences.
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}