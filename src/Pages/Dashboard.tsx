import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, LogOut, History, PlusCircle, BookOpen, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useSentimentAnalysis } from "@/hooks/useSentimentAnalysis";
import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";
import { TextInput } from "@/components/sentiment/TextInput";
import { ResultsDisplay } from "@/components/sentiment/ResultsDisplay";
import { HistorySidebar } from "@/components/sentiment/HistorySidebar";
import { Link, useNavigate } from "react-router-dom";
import { SentimentResult } from "@/types/sentiment";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut, isAuthenticated } = useAuth();
  const { results, isAnalyzing, analyze, clearResults, getStats, setResults } = useSentimentAnalysis();
  const { analyses, saveAnalysis, isSaving, loadAnalysis, deleteAnalysis } = useAnalysisHistory();
  
  const [showHistory, setShowHistory] = useState(false);
  const [sourceType, setSourceType] = useState("text");

  const handleAnalyze = async (texts: string[]) => {
    const textItems = texts.map(text => ({ text }));
    await analyze(textItems);
  };

  const handleSave = async (title: string) => {
    if (results.length === 0) return;
    await saveAnalysis({ title, sourceType, results });
  };

  const handleLoadHistory = async (id: string) => {
    const data = await loadAnalysis(id);
    if (data?.items) {
      const loaded: SentimentResult[] = data.items.map(item => ({
        id: item.id,
        text: item.text_content,
        sentiment: item.sentiment as "positive" | "negative" | "neutral",
        confidence: Number(item.confidence),
        keywords: item.keywords || [],
        explanation: item.explanation || "",
      }));
      setResults(loaded);
    }
    setShowHistory(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl gradient-text">SentiMood</span>
          </Link>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/docs">
                <BookOpen className="w-4 h-4 mr-2" />
                Docs
              </Link>
            </Button>
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => setShowHistory(!showHistory)}>
                  <History className="w-4 h-4 mr-2" />
                  History
                </Button>
                <span className="text-sm text-muted-foreground hidden md:block">
                  {user?.email}
                </span>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button asChild variant="outline" size="sm">
                <Link to="/auth">
                  <User className="w-4 h-4 mr-2" />
                  Sign in to save
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Main Content */}
          <motion.div 
            className="flex-1 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Sentiment Analysis</h1>
                <p className="text-muted-foreground">Analyze social media content with AI</p>
              </div>
              {results.length > 0 && (
                <Button variant="outline" onClick={clearResults}>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  New Analysis
                </Button>
              )}
            </div>

            {results.length === 0 ? (
              <TextInput 
                onAnalyze={handleAnalyze} 
                isAnalyzing={isAnalyzing}
                onSourceTypeChange={setSourceType}
              />
            ) : (
              <ResultsDisplay 
                results={results}
                stats={getStats()}
                onSave={isAuthenticated ? handleSave : undefined}
                isSaving={isSaving}
              />
            )}
          </motion.div>

          {/* History Sidebar */}
          {showHistory && isAuthenticated && (
            <HistorySidebar
              analyses={analyses}
              onLoad={handleLoadHistory}
              onDelete={deleteAnalysis}
              onClose={() => setShowHistory(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
