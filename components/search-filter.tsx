"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { Priority, Stage, LeadSource } from "@/lib/types";

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  priorityFilter: Priority | "all";
  onPriorityChange: (value: Priority | "all") => void;
  stageFilter: Stage | "all";
  onStageChange: (value: Stage | "all") => void;
  sourceFilter: LeadSource | "all";
  onSourceChange: (value: LeadSource | "all") => void;
  onReset: () => void;
}

const stages: Stage[] = [
  "New Lead",
  "Qualified",
  "Proposal Sent",
  "Negotiation",
  "Closed-Won",
  "Closed-Lost",
];

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

export default function SearchFilter({
  searchTerm,
  onSearchChange,
  priorityFilter,
  onPriorityChange,
  stageFilter,
  onStageChange,
  sourceFilter,
  onSourceChange,
  onReset,
}: SearchFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search leads..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      
      <Select
        value={priorityFilter}
        onValueChange={(value) => onPriorityChange(value as Priority | "all")}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectItem value="Low">Low</SelectItem>
          <SelectItem value="Medium">Medium</SelectItem>
          <SelectItem value="High">High</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={stageFilter}
        onValueChange={(value) => onStageChange(value as Stage | "all")}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Stage" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Stages</SelectItem>
          {stages.map((stage) => (
            <SelectItem key={stage} value={stage}>
              {stage}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={sourceFilter}
        onValueChange={(value) => onSourceChange(value as LeadSource | "all")}
      >
        <SelectTrigger className="w-[160px]">
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

      <Button
        variant="outline"
        size="icon"
        onClick={onReset}
        title="Reset filters"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}