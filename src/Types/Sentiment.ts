export interface SentimentResult {
  id: string;
  text: string;
  sentiment: "positive" | "negative" | "neutral";
  confidence: number;
  keywords: string[];
  explanation: string;
}

export interface Analysis {
  id: string;
  user_id: string;
  title: string;
  source_type: string;
  total_texts: number;
  positive_count: number;
  negative_count: number;
  neutral_count: number;
  created_at: string;
}

export interface AnalysisItem {
  id: string;
  analysis_id: string;
  text_content: string;
  sentiment: string;
  confidence: number;
  keywords: string[];
  explanation: string;
  created_at: string;
}

export interface AnalysisWithItems extends Analysis {
  items: AnalysisItem[];
}
