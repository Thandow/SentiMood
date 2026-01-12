import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SentimentResult, Analysis, AnalysisWithItems } from "@/types/sentiment";
import { toast } from "sonner";
import { useAuth } from "./useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useAnalysisHistory() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: analyses = [], isLoading } = useQuery({
    queryKey: ["analyses", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("analyses")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Analysis[];
    },
    enabled: !!user,
  });

  const saveAnalysisMutation = useMutation({
    mutationFn: async ({ 
      title, 
      sourceType, 
      results 
    }: { 
      title: string; 
      sourceType: string; 
      results: SentimentResult[] 
    }) => {
      if (!user) throw new Error("Must be logged in to save");

      const positive = results.filter(r => r.sentiment === "positive").length;
      const negative = results.filter(r => r.sentiment === "negative").length;
      const neutral = results.filter(r => r.sentiment === "neutral").length;

      // Create analysis record
      const { data: analysis, error: analysisError } = await supabase
        .from("analyses")
        .insert({
          user_id: user.id,
          title,
          source_type: sourceType,
          total_texts: results.length,
          positive_count: positive,
          negative_count: negative,
          neutral_count: neutral,
        })
        .select()
        .single();

      if (analysisError) throw analysisError;

      // Create analysis items
      const items = results.map(r => ({
        analysis_id: analysis.id,
        text_content: r.text,
        sentiment: r.sentiment,
        confidence: r.confidence,
        keywords: r.keywords,
        explanation: r.explanation,
      }));

      const { error: itemsError } = await supabase
        .from("analysis_items")
        .insert(items);

      if (itemsError) throw itemsError;

      return analysis;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analyses"] });
      toast.success("Analysis saved to history!");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to save");
    },
  });

  const loadAnalysisMutation = useMutation({
    mutationFn: async (analysisId: string) => {
      const { data: analysis, error: analysisError } = await supabase
        .from("analyses")
        .select("*")
        .eq("id", analysisId)
        .single();

      if (analysisError) throw analysisError;

      const { data: items, error: itemsError } = await supabase
        .from("analysis_items")
        .select("*")
        .eq("analysis_id", analysisId);

      if (itemsError) throw itemsError;

      return { ...analysis, items } as AnalysisWithItems;
    },
  });

  const deleteAnalysisMutation = useMutation({
    mutationFn: async (analysisId: string) => {
      const { error } = await supabase
        .from("analyses")
        .delete()
        .eq("id", analysisId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analyses"] });
      toast.success("Analysis deleted");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete");
    },
  });

  return {
    analyses,
    isLoading,
    saveAnalysis: saveAnalysisMutation.mutateAsync,
    isSaving: saveAnalysisMutation.isPending,
    loadAnalysis: loadAnalysisMutation.mutateAsync,
    deleteAnalysis: deleteAnalysisMutation.mutateAsync,
  };
}
