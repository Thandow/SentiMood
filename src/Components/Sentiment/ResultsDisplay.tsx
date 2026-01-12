import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Trash2, Calendar } from "lucide-react";
import { Analysis } from "@/types/sentiment";
import { format } from "date-fns";

interface HistorySidebarProps {
  analyses: Analysis[];
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function HistorySidebar({ analyses, onLoad, onDelete, onClose }: HistorySidebarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="w-80 shrink-0"
    >
      <Card className="h-fit sticky top-24">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg">Analysis History</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[60vh]">
            {analyses.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <p>No saved analyses yet</p>
                <p className="text-sm mt-1">Run an analysis and save it to see it here</p>
              </div>
            ) : (
              <div className="divide-y">
                {analyses.map((analysis) => (
                  <div key={analysis.id} className="p-4 hover:bg-muted/50 transition-colors group">
                    <div className="flex items-start justify-between gap-2">
                      <button 
                        onClick={() => onLoad(analysis.id)}
                        className="flex-1 text-left"
                      >
                        <p className="font-medium line-clamp-1">{analysis.title}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(analysis.created_at), "MMM d, yyyy")}
                        </div>
                        <div className="flex gap-2 mt-2 text-xs">
                          <span className="text-positive">+{analysis.positive_count}</span>
                          <span className="text-negative">-{analysis.negative_count}</span>
                          <span className="text-neutral">~{analysis.neutral_count}</span>
                        </div>
                      </button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => onDelete(analysis.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
}
