"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Campaign, Stage, Priority, LeadSource } from "@/lib/types";

interface CampaignTargetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: Campaign;
  onSave: (targeting: Campaign['targeting']) => void;
}

const stages: Stage[] = [
  "New Lead",
  "Qualified",
  "Proposal Sent",
  "Negotiation",
  "Closed-Won",
  "Closed-Lost",
];

const priorities: Priority[] = ["Low", "Medium", "High"];

const sources: LeadSource[] = [
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

export default function CampaignTargetingDialog({
  open,
  onOpenChange,
  campaign,
  onSave,
}: CampaignTargetingDialogProps) {
  const [selectedStages, setSelectedStages] = useState<Stage[]>(
    campaign.targeting?.stages || []
  );
  const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>(
    campaign.targeting?.priorities || []
  );
  const [selectedSources, setSelectedSources] = useState<LeadSource[]>(
    campaign.targeting?.sources || []
  );
  const [includeCustomers, setIncludeCustomers] = useState(
    campaign.targeting?.includeCustomers || false
  );

  const handleStageToggle = (stage: Stage) => {
    setSelectedStages(prev =>
      prev.includes(stage)
        ? prev.filter(s => s !== stage)
        : [...prev, stage]
    );
  };

  const handlePriorityToggle = (priority: Priority) => {
    setSelectedPriorities(prev =>
      prev.includes(priority)
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    );
  };

  const handleSourceToggle = (source: LeadSource) => {
    setSelectedSources(prev =>
      prev.includes(source)
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
  };

  const handleSave = () => {
    onSave({
      stages: selectedStages,
      priorities: selectedPriorities,
      sources: selectedSources,
      includeCustomers,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Campaign Targeting - {campaign.name}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium">Lead Stages</h4>
              <div className="grid grid-cols-2 gap-4">
                {stages.map((stage) => (
                  <div key={stage} className="flex items-center space-x-2">
                    <Checkbox
                      id={`stage-${stage}`}
                      checked={selectedStages.includes(stage)}
                      onCheckedChange={() => handleStageToggle(stage)}
                    />
                    <Label htmlFor={`stage-${stage}`}>{stage}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Lead Priorities</h4>
              <div className="grid grid-cols-2 gap-4">
                {priorities.map((priority) => (
                  <div key={priority} className="flex items-center space-x-2">
                    <Checkbox
                      id={`priority-${priority}`}
                      checked={selectedPriorities.includes(priority)}
                      onCheckedChange={() => handlePriorityToggle(priority)}
                    />
                    <Label htmlFor={`priority-${priority}`}>{priority}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Lead Sources</h4>
              <div className="grid grid-cols-2 gap-4">
                {sources.map((source) => (
                  <div key={source} className="flex items-center space-x-2">
                    <Checkbox
                      id={`source-${source}`}
                      checked={selectedSources.includes(source)}
                      onCheckedChange={() => handleSourceToggle(source)}
                    />
                    <Label htmlFor={`source-${source}`}>{source}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Additional Options</h4>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-customers"
                  checked={includeCustomers}
                  onCheckedChange={(checked) => 
                    setIncludeCustomers(checked as boolean)
                  }
                />
                <Label htmlFor="include-customers">
                  Include converted customers
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Targeting Summary</h4>
              <div className="text-sm text-muted-foreground">
                <ul className="list-disc list-inside space-y-1">
                  {selectedStages.length > 0 && (
                    <li>Leads in stages: {selectedStages.join(", ")}</li>
                  )}
                  {selectedPriorities.length > 0 && (
                    <li>Leads with priorities: {selectedPriorities.join(", ")}</li>
                  )}
                  {selectedSources.length > 0 && (
                    <li>Leads from sources: {selectedSources.join(", ")}</li>
                  )}
                  {includeCustomers && (
                    <li>Converted customers</li>
                  )}
                  {selectedStages.length === 0 &&
                   selectedPriorities.length === 0 &&
                   selectedSources.length === 0 &&
                   !includeCustomers && (
                    <li>All leads (no filters applied)</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Targeting</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}