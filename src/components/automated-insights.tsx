"use client";

import React, { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, TrendingUp, Lightbulb, ShieldAlert, ListChecks } from "lucide-react";
import {
  generateAutomatedInsights,
  GenerateAutomatedInsightsOutput,
} from "@/ai/flows/generate-automated-insights";
import { mmmData } from "@/lib/data";
import { calculateKpis } from "@/lib/calculations";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export default function AutomatedInsights() {
  const [isOpen, setIsOpen] = useState(false);
  const [insights, setInsights] = useState<GenerateAutomatedInsightsOutput | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleGenerateInsights = async () => {
    setError("");
    setInsights(null);
    startTransition(async () => {
      try {
        const kpis = calculateKpis(mmmData);
        const dataToAnalyze = {
          kpis,
          sampleData: mmmData.slice(0, 10), // Pass a sample to avoid large payload
        };

        const result = await generateAutomatedInsights({
          dashboardData: JSON.stringify(dataToAnalyze, null, 2),
        });

        if (result && result.recommendations) {
          setInsights(result);
        } else {
          setError("The AI returned an empty or invalid response. Please try again.");
        }
      } catch (e) {
        console.error(e);
        setError("Failed to generate insights. Please check the console for more details.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
        >
          <Sparkles className="size-4 text-primary" />
          <span>Decision Cockpit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="text-primary" />
            AI Decision Cockpit
          </DialogTitle>
          <DialogDescription>
            AI-powered recommendations based on your dashboard data. Click generate to get a summary of actions, uplift, assumptions, and risks.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {isPending ? (
            <div className="flex items-center justify-center h-60">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4">Generating recommendations...</p>
            </div>
          ) : insights ? (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-secondary/50">
                  <h3 className="font-semibold flex items-center gap-2 mb-2"><ListChecks className="text-primary"/>Recommended Actions</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {insights.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                  </ul>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold flex items-center gap-2 mb-2"><TrendingUp className="text-primary"/>Expected Profit Uplift</h3>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{insights.expectedUplift}</p>
                </div>
                <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold flex items-center gap-2 mb-2"><Lightbulb className="text-primary"/>Key Assumptions</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {insights.assumptions.map((ass, i) => <li key={i}>{ass}</li>)}
                    </ul>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold flex items-center gap-2 mb-2"><ShieldAlert className="text-primary"/>Potential Risks</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {insights.risks.map((risk, i) => <li key={i}>{risk}</li>)}
                  </ul>
              </div>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="text-center text-muted-foreground py-20">
              Click the button below to generate your decision cockpit.
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={handleGenerateInsights}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
