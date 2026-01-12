import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TextItem {
  text: string;
  id?: string;
}

interface SentimentResult {
  text: string;
  id: string;
  sentiment: "positive" | "negative" | "neutral";
  confidence: number;
  keywords: string[];
  explanation: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { texts } = await req.json() as { texts: TextItem[] };
    
    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return new Response(
        JSON.stringify({ error: "Please provide an array of texts to analyze" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (texts.length > 50) {
      return new Response(
        JSON.stringify({ error: "Maximum 50 texts can be analyzed at once" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are a sentiment analysis expert specializing in social media content. Analyze the sentiment of each text and provide structured results.

For each text, determine:
1. sentiment: "positive", "negative", or "neutral"
2. confidence: A number between 0.5 and 1.0 representing how confident you are
3. keywords: 2-5 key words or phrases that drive the sentiment
4. explanation: A brief (1-2 sentence) explanation of why this sentiment was assigned

Consider context, sarcasm, emojis, and social media language patterns.`;

    const userPrompt = `Analyze the sentiment of these ${texts.length} social media texts:

${texts.map((item, i) => `[${i + 1}] "${item.text}"`).join("\n\n")}

Respond with a JSON array of results in this exact format:
[
  {
    "index": 1,
    "sentiment": "positive",
    "confidence": 0.92,
    "keywords": ["amazing", "love", "excited"],
    "explanation": "Strong positive language with excitement indicators."
  }
]`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", status, errorText);
      return new Response(
        JSON.stringify({ error: "AI analysis failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      console.error("No content in AI response:", aiResponse);
      return new Response(
        JSON.stringify({ error: "Invalid AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the JSON from the response
    let parsedResults;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("No JSON array found in response");
      }
      parsedResults = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content, parseError);
      return new Response(
        JSON.stringify({ error: "Failed to parse sentiment analysis" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Map results back to original texts
    const results: SentimentResult[] = texts.map((item, index) => {
      const aiResult = parsedResults.find((r: any) => r.index === index + 1) || parsedResults[index];
      
      return {
        text: item.text,
        id: item.id || crypto.randomUUID(),
        sentiment: aiResult?.sentiment || "neutral",
        confidence: Math.min(1, Math.max(0.5, aiResult?.confidence || 0.5)),
        keywords: aiResult?.keywords || [],
        explanation: aiResult?.explanation || "Unable to determine sentiment.",
      };
    });

    console.log(`Successfully analyzed ${results.length} texts`);

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Sentiment analysis error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
