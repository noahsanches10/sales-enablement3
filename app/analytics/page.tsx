"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLeads, getActivities } from "@/lib/storage";
import { Lead } from "@/lib/types";
import { Users, Target, TrendingUp, DollarSign } from "lucide-react";
import LeadsByStageChart from "@/components/analytics/leads-by-stage";
import ConversionRateChart from "@/components/analytics/conversion-rate";
import LeadSourceChart from "@/components/analytics/lead-source";
import ActivityTimeline from "@/components/analytics/activity-timeline";
import { calculateMetrics } from "@/lib/analytics";

export default function AnalyticsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    conversionRate: 0,
    avgDealSize: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const allLeads = getLeads(true);
    setLeads(allLeads);
    setMetrics(calculateMetrics(allLeads));
  }, []);

  const cards = [
    {
      title: "Total Leads",
      value: metrics.totalLeads,
      icon: Users,
      description: "Active leads in pipeline",
    },
    {
      title: "Conversion Rate",
      value: `${(metrics.conversionRate * 100).toFixed(1)}%`,
      icon: Target,
      description: "Lead to customer rate",
    },
    {
      title: "Avg. Deal Size",
      value: `$${metrics.avgDealSize.toFixed(2)}`,
      icon: TrendingUp,
      description: "Average revenue per deal",
    },
    {
      title: "Total Revenue",
      value: `$${metrics.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      description: "Total revenue from won deals",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Pipeline Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <LeadsByStageChart leads={leads} />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Conversion Rate Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ConversionRateChart leads={leads} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <LeadSourceChart leads={leads} />
          </CardContent>
        </Card>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityTimeline />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}