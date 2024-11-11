"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Minus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { LeadSource } from "@/lib/types";

const jobTitles = [
  "Window Washing",
  "Pressure Washing",
  "Gutter Cleaning",
  "Holiday Lights",
  "Multiple Services",
] as const;

const jobTypes = [
  "One-off Job",
  "Semi-Annual",
  "Seasonal",
  "Quarterly",
  "Bi-Monthly",
  "Monthly",
  "Custom Schedule",
] as const;

const leadSources: LeadSource[] = [
  "Website",
  "Referral",
  "Google Ads",
  "Social Media",
  "Door Hanger",
  "Yard Sign",
  "Home Show",
  "Nextdoor",
  "Direct Mail",
  "Other"
];

interface ConvertToCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: any;
  onConvert: (customerData: any) => void;
  isDirectCustomer?: boolean;
}

export default function ConvertToCustomerDialog({
  open,
  onOpenChange,
  lead,
  onConvert,
  isDirectCustomer = false
}: ConvertToCustomerDialogProps) {
  const [activeTab, setActiveTab] = useState("client-info");
  const [jobTitle, setJobTitle] = useState<typeof jobTitles[number]>(
    lead.customerData?.jobTitle || "Window Washing"
  );
  const [jobType, setJobType] = useState<typeof jobTypes[number]>(
    lead.customerData?.jobType || "One-off Job"
  );
  const [measurementValue, setMeasurementValue] = useState(
    lead.customerData?.measurementValue || ""
  );
  const [lineItems, setLineItems] = useState(
    lead.customerData?.lineItems || [{ description: "", price: "" }]
  );
  const [billingAddressSame, setBillingAddressSame] = useState(
    lead.customerData?.billingAddressSame ?? true
  );

  // Initialize notes with lead's notes and projected value if converting from lead
  const initialNotes = !isDirectCustomer 
    ? [
        // Only add existing notes if they exist
        lead.notes && `Lead Notes: ${lead.notes}`,
        // Only add projected value if it exists
        lead.projectedValue && `Projected Contract Value: $${lead.projectedValue.toLocaleString()}`
      ]
        .filter(Boolean) // Remove falsy values
        .join('\n\n') // Join with double newline for spacing
    : lead.customerData?.notes || "";

  const [notes, setNotes] = useState(initialNotes);
  const [source, setSource] = useState<LeadSource>(
    lead.source || lead.customerData?.source || "Website"
  );

  const [formData, setFormData] = useState({
    firstName: lead.customerData?.firstName || lead.name?.split(" ")[0] || "",
    lastName: lead.customerData?.lastName || lead.name?.split(" ").slice(1).join(" ") || "",
    companyName: lead.customerData?.companyName || "",
    email: lead.customerData?.email || lead.email || "",
    phone: lead.customerData?.phone || lead.phone || "",
    street1: lead.customerData?.propertyAddress?.street1 || lead.address || "",
    street2: lead.customerData?.propertyAddress?.street2 || "",
    city: lead.customerData?.propertyAddress?.city || "",
    state: lead.customerData?.propertyAddress?.state || "",
    zipCode: lead.customerData?.propertyAddress?.zipCode || "",
    country: lead.customerData?.propertyAddress?.country || "United States",
    billingStreet1: lead.customerData?.billingAddress?.street1 || "",
    billingStreet2: lead.customerData?.billingAddress?.street2 || "",
    billingCity: lead.customerData?.billingAddress?.city || "",
    billingState: lead.customerData?.billingAddress?.state || "",
    billingZipCode: lead.customerData?.billingAddress?.zipCode || "",
    billingCountry: lead.customerData?.billingAddress?.country || "United States",
  });

  const addLineItem = () => {
    setLineItems([...lineItems, { description: "", price: "" }]);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, field: "description" | "price", value: string) => {
    const newLineItems = [...lineItems];
    newLineItems[index] = { ...newLineItems[index], [field]: value };
    setLineItems(newLineItems);
  };

  const getDialogTitle = () => {
    if (isDirectCustomer) {
      return lead.customerData ? "Edit Customer" : "Add Customer";
    }
    return "Convert Lead to Customer";
  };

  const getSubmitButtonText = () => {
    if (isDirectCustomer) {
      return lead.customerData ? "Update Customer" : "Add Customer";
    }
    return "Convert to Customer";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConvert({
      ...formData,
      jobTitle,
      jobType,
      measurementValue,
      lineItems,
      billingAddressSame,
      source,
      propertyAddress: {
        street1: formData.street1,
        street2: formData.street2,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      },
      billingAddress: billingAddressSame ? null : {
        street1: formData.billingStreet1,
        street2: formData.billingStreet2,
        city: formData.billingCity,
        state: formData.billingState,
        zipCode: formData.billingZipCode,
        country: formData.billingCountry,
      },
      notes,
      convertedAt: lead.convertedAt || new Date().toISOString()
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] h-[90vh]">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <ScrollArea className="h-[calc(90vh-180px)] px-4">
            <div className="px-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="client-info">Client Info</TabsTrigger>
                  <TabsTrigger value="job-details">Job Details</TabsTrigger>
                </TabsList>

                <TabsContent value="client-info" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({ ...formData, firstName: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) =>
                          setFormData({ ...formData, companyName: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="source">Source</Label>
                      <Select value={source} onValueChange={setSource}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                          {leadSources.map((source) => (
                            <SelectItem key={source} value={source}>
                              {source}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Property Address</Label>
                    <Input
                      placeholder="Street 1"
                      value={formData.street1}
                      onChange={(e) =>
                        setFormData({ ...formData, street1: e.target.value })
                      }
                      required
                    />
                    <Input
                      placeholder="Street 2 (Optional)"
                      value={formData.street2}
                      onChange={(e) =>
                        setFormData({ ...formData, street2: e.target.value })
                      }
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="City"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        required
                      />
                      <Input
                        placeholder="State"
                        value={formData.state}
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="ZIP Code"
                        value={formData.zipCode}
                        onChange={(e) =>
                          setFormData({ ...formData, zipCode: e.target.value })
                        }
                        required
                      />
                      <Select
                        value={formData.country}
                        onValueChange={(value) =>
                          setFormData({ ...formData, country: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="United States">United States</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="billingAddressSame"
                        checked={billingAddressSame}
                        onChange={(e) => setBillingAddressSame(e.target.checked)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="billingAddressSame">
                        Billing address is the same as property address
                      </Label>
                    </div>

                    {!billingAddressSame && (
                      <div className="space-y-2">
                        <Label>Billing Address</Label>
                        <Input
                          placeholder="Street 1"
                          value={formData.billingStreet1}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              billingStreet1: e.target.value,
                            })
                          }
                          required
                        />
                        <Input
                          placeholder="Street 2 (Optional)"
                          value={formData.billingStreet2}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              billingStreet2: e.target.value,
                            })
                          }
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            placeholder="City"
                            value={formData.billingCity}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                billingCity: e.target.value,
                              })
                            }
                            required
                          />
                          <Input
                            placeholder="State"
                            value={formData.billingState}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                billingState: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            placeholder="ZIP Code"
                            value={formData.billingZipCode}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                billingZipCode: e.target.value,
                              })
                            }
                            required
                          />
                          <Select
                            value={formData.billingCountry}
                            onValueChange={(value) =>
                              setFormData({ ...formData, billingCountry: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="United States">
                                United States
                              </SelectItem>
                              <SelectItem value="Canada">Canada</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="job-details" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Select value={jobTitle} onValueChange={setJobTitle}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select job title" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobTitles.map((title) => (
                          <SelectItem key={title} value={title}>
                            {title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jobType">Job Type</Label>
                    <Select value={jobType} onValueChange={setJobType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="measurementValue">
                      {jobTitle === "Window Washing"
                        ? "Window Pane Count"
                        : "Square Footage"}
                    </Label>
                    <Input
                      id="measurementValue"
                      type="number"
                      value={measurementValue}
                      onChange={(e) => setMeasurementValue(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Line Items</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addLineItem}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                      </Button>
                    </div>
                    {lineItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) =>
                            updateLineItem(index, "description", e.target.value)
                          }
                          required
                        />
                        <Input
                          type="number"
                          placeholder="Price"
                          value={item.price}
                          onChange={(e) =>
                            updateLineItem(index, "price", e.target.value)
                          }
                          required
                          className="w-32"
                        />
                        {lineItems.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLineItem(index)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-[100px]"
                      placeholder="Add any additional notes here..."
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>

          <div className="flex justify-end gap-2 p-6 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{getSubmitButtonText()}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}