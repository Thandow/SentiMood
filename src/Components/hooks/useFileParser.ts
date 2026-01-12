import { useState, useCallback } from "react";
import { toast } from "sonner";

interface ParsedFile {
  texts: string[];
  filename: string;
  type: string;
}

export function useFileParser() {
  const [isParsing, setIsParsing] = useState(false);

  const parseFile = useCallback(async (file: File): Promise<ParsedFile | null> => {
    setIsParsing(true);

    try {
      const filename = file.name;
      const extension = filename.split(".").pop()?.toLowerCase();

      if (!extension || !["csv", "txt", "json"].includes(extension)) {
        toast.error("Unsupported file type. Please use CSV, TXT, or JSON files.");
        return null;
      }

      const content = await file.text();
      let texts: string[] = [];

      if (extension === "csv") {
        // Parse CSV - assume first column or single column contains text
        const lines = content.split("\n").filter(line => line.trim());
        // Skip header if it looks like one
        const startIndex = lines[0]?.toLowerCase().includes("text") ? 1 : 0;
        texts = lines.slice(startIndex).map(line => {
          // Handle quoted CSV values
          const match = line.match(/^"(.*)"|^([^,]*)/);
          return (match?.[1] || match?.[2] || line.split(",")[0]).trim();
        }).filter(t => t.length > 0);
      } else if (extension === "txt") {
        // Each line is a separate text
        texts = content.split("\n").filter(line => line.trim().length > 0);
      } else if (extension === "json") {
        // Expect array of strings or objects with "text" field
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          texts = parsed.map(item => {
            if (typeof item === "string") return item;
            if (typeof item === "object" && item.text) return item.text;
            if (typeof item === "object" && item.content) return item.content;
            if (typeof item === "object" && item.message) return item.message;
            return String(item);
          }).filter(t => t.length > 0);
        } else if (parsed.texts && Array.isArray(parsed.texts)) {
          texts = parsed.texts;
        } else if (parsed.data && Array.isArray(parsed.data)) {
          texts = parsed.data.map((item: any) => item.text || item.content || String(item));
        }
      }

      if (texts.length === 0) {
        toast.error("No valid texts found in the file");
        return null;
      }

      if (texts.length > 50) {
        toast.warning(`File contains ${texts.length} texts. Only the first 50 will be analyzed.`);
        texts = texts.slice(0, 50);
      }

      toast.success(`Loaded ${texts.length} texts from ${filename}`);
      return { texts, filename, type: extension };
    } catch (err) {
      toast.error("Failed to parse file. Please check the format.");
      return null;
    } finally {
      setIsParsing(false);
    }
  }, []);

  return { parseFile, isParsing };
}
