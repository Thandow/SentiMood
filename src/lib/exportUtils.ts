import { SentimentResult } from "@/types/sentiment";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportToCSV(results: SentimentResult[], filename = "sentiment-analysis") {
  const headers = ["Text", "Sentiment", "Confidence", "Keywords", "Explanation"];
  const rows = results.map(r => [
    `"${r.text.replace(/"/g, '""')}"`,
    r.sentiment,
    (r.confidence * 100).toFixed(1) + "%",
    `"${r.keywords.join(", ")}"`,
    `"${r.explanation.replace(/"/g, '""')}"`,
  ]);

  const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  downloadFile(csv, `${filename}.csv`, "text/csv");
}

export function exportToJSON(results: SentimentResult[], filename = "sentiment-analysis") {
  const json = JSON.stringify(results, null, 2);
  downloadFile(json, `${filename}.json`, "application/json");
}

export function exportToPDF(
  results: SentimentResult[],
  stats: { positive: number; negative: number; neutral: number },
  filename = "sentiment-analysis"
) {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.setTextColor(139, 92, 246); // Purple
  doc.text("Sentiment Analysis Report", 20, 20);
  
  // Date
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 28);
  
  // Summary stats
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text("Summary", 20, 40);
  
  doc.setFontSize(11);
  doc.text(`Total Texts: ${results.length}`, 20, 50);
  doc.setTextColor(34, 197, 94); // Green
  doc.text(`Positive: ${stats.positive} (${((stats.positive / results.length) * 100).toFixed(1)}%)`, 20, 58);
  doc.setTextColor(239, 68, 68); // Red
  doc.text(`Negative: ${stats.negative} (${((stats.negative / results.length) * 100).toFixed(1)}%)`, 80, 58);
  doc.setTextColor(107, 114, 128); // Gray
  doc.text(`Neutral: ${stats.neutral} (${((stats.neutral / results.length) * 100).toFixed(1)}%)`, 140, 58);
  
  // Results table
  doc.setTextColor(0);
  autoTable(doc, {
    startY: 70,
    head: [["Text", "Sentiment", "Confidence", "Keywords"]],
    body: results.map(r => [
      r.text.length > 60 ? r.text.substring(0, 60) + "..." : r.text,
      r.sentiment.charAt(0).toUpperCase() + r.sentiment.slice(1),
      (r.confidence * 100).toFixed(1) + "%",
      r.keywords.slice(0, 3).join(", "),
    ]),
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [139, 92, 246] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 25 },
      2: { cellWidth: 25 },
      3: { cellWidth: 50 },
    },
  });
  
  doc.save(`${filename}.pdf`);
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
