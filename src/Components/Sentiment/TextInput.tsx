import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, Sparkles, Loader2 } from "lucide-react";
import { useFileParser } from "@/hooks/useFileParser";

interface TextInputProps {
  onAnalyze: (texts: string[]) => Promise<void>;
  isAnalyzing: boolean;
  onSourceTypeChange: (type: string) => void;
}

const SAMPLE_TEXTS = [
  "Just got my new iPhone and I'm absolutely loving it! Best purchase ever! 📱✨",
  "This customer service is terrible. Waited 2 hours and still no response. Never buying again.",
  "The weather today is pretty average, nothing special really.",
  "OMG just saw the new Marvel movie and it was AMAZING!!! 🎬🍿",
  "Another Monday, another boring meeting that could've been an email 😴",
];

export function TextInput({ onAnalyze, isAnalyzing, onSourceTypeChange }: TextInputProps) {
  const [text, setText] = useState("");
  const [uploadedTexts, setUploadedTexts] = useState<string[]>([]);
  const [uploadedFilename, setUploadedFilename] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { parseFile, isParsing } = useFileParser();

  const handleTextAnalyze = async () => {
    const lines = text.split("\n").filter(l => l.trim());
    if (lines.length === 0) return;
    onSourceTypeChange("text");
    await onAnalyze(lines);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const result = await parseFile(file);
    if (result) {
      setUploadedTexts(result.texts);
      setUploadedFilename(result.filename);
      onSourceTypeChange(result.type);
    }
  };

  const handleFileAnalyze = async () => {
    if (uploadedTexts.length === 0) return;
    await onAnalyze(uploadedTexts);
  };

  const handleSampleLoad = () => {
    setText(SAMPLE_TEXTS.join("\n"));
  };

  return (
    <Card className="border-2">
      <CardContent className="p-6">
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="text" className="gap-2">
              <FileText className="w-4 h-4" />
              Direct Input
            </TabsTrigger>
            <TabsTrigger value="file" className="gap-2">
              <Upload className="w-4 h-4" />
              File Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Enter text to analyze (one per line for batch)
                </p>
                <Button variant="link" size="sm" onClick={handleSampleLoad} className="text-primary">
                  Load sample data
                </Button>
              </div>
              <Textarea
                placeholder="Paste your tweets, posts, or reviews here...&#10;Each line will be analyzed separately."
                className="min-h-[200px] resize-none"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <Button 
              className="w-full gradient-bg border-0 hover:opacity-90 h-12 text-lg"
              onClick={handleTextAnalyze}
              disabled={isAnalyzing || !text.trim()}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Analyze Sentiment
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="file" className="space-y-4">
            <motion.div
              className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
              whileHover={{ scale: 1.01 }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt,.json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="font-medium mb-1">Drop your file here or click to browse</p>
              <p className="text-sm text-muted-foreground">Supports CSV, TXT, JSON (max 50 texts)</p>
            </motion.div>

            {uploadedTexts.length > 0 && (
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="font-medium">{uploadedFilename}</p>
                <p className="text-sm text-muted-foreground">{uploadedTexts.length} texts ready to analyze</p>
              </div>
            )}

            <Button 
              className="w-full gradient-bg border-0 hover:opacity-90 h-12 text-lg"
              onClick={handleFileAnalyze}
              disabled={isAnalyzing || isParsing || uploadedTexts.length === 0}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Analyze {uploadedTexts.length} Texts
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
