"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Archive } from "lucide-react";
import { Lead, LeadSource } from "@/lib/types";
import { getLeads, saveLead } from "@/lib/storage";
import CustomerList from "@/components/customer-list";
import ConvertToCustomerDialog from "@/components/convert-to-customer-dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

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

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Lead[]>([]);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [jobTitleFilter, setJobTitleFilter] = useState<string>("all");
  const [jobTypeFilter, setJobTypeFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<LeadSource | "all">("all");
  const [filteredCustomers, setFilteredCustomers] = useState<Lead[]>([]);

  useEffect(() => {
    const allLeads = getLeads(true);
    const customerLeads = allLeads.filter(
      (lead) => lead.convertedToCustomer && !lead.customerArchived
    );
    setCustomers(customerLeads);
  }, []);

  useEffect(() => {
    let filtered = [...customers];

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (customer) =>
          customer.customerData?.firstName?.toLowerCase().includes(search) ||
          customer.customerData?.lastName?.toLowerCase().includes(search) ||
          customer.customerData?.email?.toLowerCase().includes(search) ||
          customer.customerData?.phone?.toLowerCase().includes(search)
      );
    }

    // Apply job title filter
    if (jobTitleFilter !== "all") {
      filtered = filtered.filter(
        (customer) => customer.customerData?.jobTitle === jobTitleFilter
      );
    }

    // Apply job type filter
    if (jobTypeFilter !== "all") {
      filtered = filtered.filter(
        (customer) => customer.customerData?.jobType === jobTypeFilter
      );
    }

    // Apply source filter
    if (sourceFilter !== "all") {
      filtered = filtered.filter(
        (customer) => customer.source === sourceFilter
      );
    }

    setFilteredCustomers(filtered);
  }, [customers, searchTerm, jobTitleFilter, jobTypeFilter, sourceFilter]);

  const handleAddCustomer = (customerData: any) => {
    const newCustomer: Lead = {
      id: crypto.randomUUID(),
      name: `${customerData.firstName} ${customerData.lastName}`,
      email: customerData.email,
      phone: customerData.phone,
      address: customerData.propertyAddress.street1,
      notes: "",
      priority: "Medium",
      stage: "Closed-Won",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      convertedToCustomer: true,
      convertedAt: new Date().toISOString(),
      customerData: customerData,
      isDirectCustomer: true,
      source: customerData.source
    };

    // Save the new customer
    saveLead(newCustomer, "created");
    
    // Update the local state
    setCustomers(prev => [...prev, newCustomer]);
    setIsAddCustomerOpen(false);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setJobTitleFilter("all");
    setJobTypeFilter("all");
    setSourceFilter("all");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/archived-customers">
              <Archive className="h-4 w-4 mr-2" />
              Archived Customers
            </Link>
          </Button>
          <Button onClick={() => setIsAddCustomerOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={jobTitleFilter} onValueChange={setJobTitleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Job Title" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Job Titles</SelectItem>
            {jobTitles.map((title) => (
              <SelectItem key={title} value={title}>
                {title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Job Types</SelectItem>
            {jobTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sourceFilter} onValueChange={(value) => setSourceFilter(value as LeadSource | "all")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {leadSources.map((source) => (
              <SelectItem key={source} value={source}>
                {source}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(searchTerm || jobTitleFilter !== "all" || jobTypeFilter !== "all" || sourceFilter !== "all") && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="px-3"
          >
            Reset Filters
          </Button>
        )}
      </div>

      <CustomerList customers={filteredCustomers} />

      <ConvertToCustomerDialog
        open={isAddCustomerOpen}
        onOpenChange={setIsAddCustomerOpen}
        lead={{} as Lead}
        onConvert={handleAddCustomer}
        isDirectCustomer={true}
      />
    </div>
  );
}