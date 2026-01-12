import { useState, useCallback } from "react";
import { SentimentResult } from "@/types/sentiment";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TextItem {
  text: string;
  id?: string;
}

export function useSentimentAnalysis() {
  const [results, setResults] = useState<SentimentResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (texts: TextItem[]) => {
    if (texts.length === 0) {
      toast.error("Please provide at least one text to analyze");
      return [];
    }

    if (texts.length > 50) {
      toast.error("Maximum 50 texts can be analyzed at once");
      return [];
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const { data, error: funcError } = await supabase.functions.invoke("analyze-sentiment", {
        body: { texts },
      });

      if (funcError) {
        throw new Error(funcError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const analysisResults: SentimentResult[] = data.results;
      setResults(analysisResults);
      toast.success(`Successfully analyzed ${analysisResults.length} text${analysisResults.length > 1 ? "s" : ""}!`);
      return analysisResults;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Analysis failed";
      setError(message);
      toast.error(message);
      return [];
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  const getStats = useCallback(() => {
    const positive = results.filter(r => r.sentiment === "positive").length;
    const negative = results.filter(r => r.sentiment === "negative").length;
    const neutral = results.filter(r => r.sentiment === "neutral").length;
    const avgConfidence = results.length > 0 
      ? results.reduce((sum, r) => sum + r.confidence, 0) / results.length 
      : 0;

    return {
      total: results.length,
      positive,
      negative,
      neutral,
      avgConfidence,
    };
  }, [results]);

  return {
    results,
    setResults,
    isAnalyzing,
    error,
    analyze,
    clearResults,
    getStats,
  };
}
