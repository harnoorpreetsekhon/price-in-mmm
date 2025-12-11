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
import { Sparkles, Loader2 } from "lucide-react";
import { generateAutomatedInsights } from "@/ai/flows/generate-automated-insights";
import { mmmData } from "@/lib/data";
import { calculateKpis } from "@/lib/calculations";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export default function AutomatedInsights() {
  const [isOpen, setIsOpen] = useState(false);
  const [insights, setInsights] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleGenerateInsights = async () => {
    setError("");
    setInsights("");
    startTransition(async () => {
      try {
        const kpis = calculateKpis(mmmData);
        const dataToAnalyze = {
          kpis,
          sampleData: mmmData.slice(0, 5), // Pass a sample to avoid large payload
        };

        const result = await generateAutomatedInsights({
          dashboardData: JSON.stringify(dataToAnalyze, null, 2),
        });

        if (result.insights) {
          setInsights(result.insights);
        } else {
            setError("The AI returned an empty response. Please try again.");
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
          <span>Automated Insights</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="text-primary" />
            Automated Marketing Insights
          </DialogTitle>
          <DialogDescription>
            AI-powered analysis of your dashboard data. Click generate to get
            key trends and actionable recommendations.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {isPending ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4">Generating insights...</p>
            </div>
          ) : insights ? (
             <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap rounded-md border bg-secondary/50 p-4 max-h-[50vh] overflow-y-auto">
                {insights}
            </div>
          ) : error ? (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="text-center text-muted-foreground py-10">
                Click the button below to generate insights.
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
                Generate Insights
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
