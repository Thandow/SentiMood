import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, ArrowLeft, FileText, Upload, Brain, BarChart3, 
  Download, Lightbulb, Zap, CheckCircle2, AlertCircle, 
  Target, Wand2, AlertTriangle, BookOpen, Code2
} from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    number: "01",
    title: "Enter Your Text",
    description: "Paste social media posts, tweets, comments, or any text you want to analyze. You can enter multiple texts by separating them with new lines.",
    icon: FileText,
    tips: ["Paste up to 50 texts at once", "Each line is treated as a separate item", "Works with any language content"],
  },
  {
    number: "02",
    title: "Upload Files (Optional)",
    description: "For batch analysis, upload CSV, TXT, or JSON files containing your data. The AI will process each entry automatically.",
    icon: Upload,
    tips: ["CSV: One text per row in first column", "TXT: One text per line", "JSON: Array of strings or objects with 'text' field"],
  },
  {
    number: "03",
    title: "AI Analysis",
    description: "Our AI (powered by Google Gemini) analyzes each text to determine sentiment, confidence level, and key emotional drivers.",
    icon: Brain,
    tips: ["Analysis typically takes 2-5 seconds", "Each text gets its own detailed breakdown", "Keywords highlight emotional triggers"],
  },
  {
    number: "04",
    title: "View Results",
    description: "See your results in interactive charts and a detailed table. Each result includes sentiment, confidence score, keywords, and an explanation.",
    icon: BarChart3,
    tips: ["Click results for detailed explanations", "Charts update in real-time", "Filter by sentiment type"],
  },
  {
    number: "05",
    title: "Export Results",
    description: "Download your results as CSV, JSON, or PDF for further analysis and sharing with your team.",
    icon: Download,
    tips: ["PDF includes all charts", "CSV for spreadsheet analysis", "JSON for programmatic use"],
  },
];

const promptMethodology = {
  principles: [
    {
      title: "Clarity Over Complexity",
      description: "Clean, well-structured text yields better sentiment detection. Remove noise that doesn't contribute to the emotional content.",
      icon: Target,
    },
    {
      title: "Context Preservation",
      description: "Include relevant context when meaning depends on it. Sarcasm and irony are easier to detect with full context.",
      icon: Lightbulb,
    },
    {
      title: "Consistent Formatting",
      description: "Batch similar content types together. Analyzing all product reviews separately from tweets improves consistency.",
      icon: Code2,
    },
  ],
  techniques: [
    {
      title: "Text Preprocessing",
      items: [
        "Remove excessive URLs that don't add sentiment value",
        "Keep emojis - they're strong sentiment indicators",
        "Preserve hashtags - they often convey emotion",
        "Replace @mentions with [USER] for privacy",
        "Fix obvious typos that might confuse analysis",
      ],
    },
    {
      title: "Optimal Text Length",
      items: [
        "Short texts (1-50 words): Best for quick classification",
        "Medium texts (50-200 words): Good balance of context and precision",
        "Long texts (200+ words): May contain mixed sentiments",
        "Consider splitting long texts into paragraphs",
        "Each sentence can have its own sentiment",
      ],
    },
    {
      title: "Handling Edge Cases",
      items: [
        "Sarcasm: Add context if the sarcasm is subtle",
        "Questions: May appear neutral even if emotionally loaded",
        "Comparative statements: 'Better than X' carries sentiment",
        "Negations: 'Not bad' is different from 'bad'",
        "Mixed emotions: 'Great product, terrible service'",
      ],
    },
  ],
  examples: [
    {
      bad: "Check out this link: http://... RT @user",
      good: "This product is amazing! Best purchase I've made all year 🎉",
      reason: "Remove URLs and RT prefixes that add noise. Keep emojis that convey emotion.",
    },
    {
      bad: "meh its ok i guess whatever",
      good: "It's okay, I guess. Not particularly impressed but not disappointed either.",
      reason: "Proper punctuation and complete sentences help the AI understand nuance.",
    },
    {
      bad: "The meeting at 3pm got moved to 4pm",
      good: "Frustrated that the meeting got moved again. This is the third time this week.",
      reason: "Add emotional context when the original text is purely factual but carries hidden sentiment.",
    },
  ],
};

const promptTips = [
  {
    title: "Be Specific About Context",
    description: "When preparing texts for analysis, include relevant context. 'Great product!' may be sarcastic without context.",
    example: "Include the full comment with any relevant hashtags or @mentions",
  },
  {
    title: "Clean Your Data",
    description: "Remove excessive URLs, special characters, or formatting that might confuse the analysis.",
    example: "Replace @username mentions with [USER] if privacy is a concern",
  },
  {
    title: "Consider Language Nuances",
    description: "Slang, abbreviations, and emojis can affect analysis. The AI handles most cases, but clear text works best.",
    example: "'This is fire 🔥' = positive, 'This is a fire hazard' = negative",
  },
  {
    title: "Batch Similar Content",
    description: "Group similar types of content (all tweets, all reviews) for more consistent analysis.",
    example: "Analyze all Twitter mentions separately from product reviews",
  },
];

const faqs = [
  {
    question: "How accurate is the sentiment analysis?",
    answer: "Our AI achieves approximately 85-90% accuracy on standard social media content. Accuracy may vary with sarcasm, cultural references, or domain-specific language. The confidence score helps indicate how certain the AI is about each result.",
  },
  {
    question: "What's the difference between sentiment and emotion?",
    answer: "Sentiment refers to the overall polarity (positive/negative/neutral), while emotion is more specific (happy, angry, sad). Our tool focuses on sentiment but identifies emotional keywords that drive the sentiment.",
  },
  {
    question: "Can I analyze content in other languages?",
    answer: "Yes! The AI supports multiple languages. However, English content typically yields the highest accuracy. For best results with other languages, ensure the text is clearly written.",
  },
  {
    question: "What does the confidence score mean?",
    answer: "The confidence score (0-100%) indicates how certain the AI is about its classification. High scores (>80%) mean clear sentiment indicators. Lower scores suggest mixed or ambiguous content.",
  },
  {
    question: "How are keywords selected?",
    answer: "Keywords are words or phrases that most strongly influenced the sentiment classification. These are the emotional drivers—words that made the text positive, negative, or neutral.",
  },
  {
    question: "Is my data private?",
    answer: "Your analyzed texts are processed securely and not stored permanently. We never share your data with third parties. Each analysis session is independent.",
  },
  {
    question: "Why does sarcasm sometimes get misclassified?",
    answer: "Sarcasm is one of the hardest challenges in NLP. The AI looks for linguistic markers, but without voice tone or visual cues, some sarcasm may be missed. Adding context helps improve detection.",
  },
  {
    question: "What's the maximum number of texts I can analyze?",
    answer: "You can analyze up to 50 texts at once. For larger datasets, split them into batches and analyze sequentially.",
  },
];

const modelLimitations = [
  {
    limitation: "Sarcasm & Irony",
    description: "Subtle sarcasm without clear markers may be misinterpreted as genuine sentiment.",
    mitigation: "Add context or explicit markers when sarcasm is intended.",
  },
  {
    limitation: "Cultural Context",
    description: "Expressions that are positive in one culture may be neutral or negative in another.",
    mitigation: "Be aware of cultural nuances in your dataset.",
  },
  {
    limitation: "Domain-Specific Language",
    description: "Technical jargon or industry-specific terms may not carry expected sentiment.",
    mitigation: "Use common language equivalents when possible.",
  },
  {
    limitation: "Mixed Sentiments",
    description: "Texts containing both positive and negative statements may receive averaged scores.",
    mitigation: "Split complex texts into separate sentences for granular analysis.",
  },
  {
    limitation: "Implicit Sentiment",
    description: "Statements like 'I expected better' carry negative sentiment implicitly.",
    mitigation: "The AI handles many implicit cases, but confidence may be lower.",
  },
];

export default function Documentation() {
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
            <Button variant="ghost" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button asChild className="gradient-bg border-0 hover:opacity-90">
              <Link to="/dashboard">Try It Now</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How to Use <span className="gradient-text">SentiMood</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A complete guide to analyzing sentiment in social media content with our AI-powered dashboard.
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="getting-started" className="mb-20">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="prompt-methodology">Prompt Methodology</TabsTrigger>
            <TabsTrigger value="understanding">Understanding Results</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          {/* Getting Started Tab */}
          <TabsContent value="getting-started">
            <section className="mb-12">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-3xl font-bold mb-8 flex items-center gap-3"
              >
                <Zap className="w-8 h-8 text-primary" />
                Step-by-Step Guide
              </motion.h2>

              <div className="space-y-6">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-6 md:w-48 flex flex-col items-center justify-center">
                          <span className="text-4xl font-bold gradient-text mb-2">{step.number}</span>
                          <step.icon className="w-10 h-10 text-primary" />
                        </div>
                        <div className="flex-1 p-6">
                          <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                          <p className="text-muted-foreground mb-4">{step.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {step.tips.map((tip, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                {tip}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>
          </TabsContent>

          {/* Prompt Methodology Tab */}
          <TabsContent value="prompt-methodology">
            <section className="space-y-12">
              {/* Core Principles */}
              <div>
                <motion.h2
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-3xl font-bold mb-8 flex items-center gap-3"
                >
                  <Wand2 className="w-8 h-8 text-primary" />
                  Prompt Engineering Principles
                </motion.h2>

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                  {promptMethodology.principles.map((principle, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-full">
                        <CardHeader className="text-center pb-2">
                          <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center mx-auto mb-3">
                            <principle.icon className="w-7 h-7 text-primary-foreground" />
                          </div>
                          <CardTitle className="text-lg">{principle.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground text-center">{principle.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Techniques */}
              <div>
                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-2xl font-bold mb-6 flex items-center gap-3"
                >
                  <BookOpen className="w-6 h-6 text-primary" />
                  Optimization Techniques
                </motion.h3>

                <div className="grid md:grid-cols-3 gap-6">
                  {promptMethodology.techniques.map((technique, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-full">
                        <CardHeader>
                          <CardTitle className="text-lg">{technique.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {technique.items.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Before/After Examples */}
              <div>
                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-2xl font-bold mb-6 flex items-center gap-3"
                >
                  <Target className="w-6 h-6 text-primary" />
                  Before & After Examples
                </motion.h3>

                <div className="space-y-4">
                  {promptMethodology.examples.map((example, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card>
                        <CardContent className="p-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="w-4 h-4 text-destructive" />
                                <span className="font-medium text-destructive">Before</span>
                              </div>
                              <div className="bg-destructive/10 rounded-lg p-3 text-sm font-mono">
                                {example.bad}
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 className="w-4 h-4 text-positive" />
                                <span className="font-medium text-positive">After</span>
                              </div>
                              <div className="bg-positive/10 rounded-lg p-3 text-sm font-mono">
                                {example.good}
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Why it matters:</span> {example.reason}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Model Limitations */}
              <div>
                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-2xl font-bold mb-6 flex items-center gap-3"
                >
                  <AlertCircle className="w-6 h-6 text-yellow-500" />
                  Known Limitations
                </motion.h3>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {modelLimitations.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="h-full bg-muted/30">
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2">{item.limitation}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                          <div className="text-sm bg-primary/10 rounded-lg p-2">
                            <span className="font-medium">💡 Tip:</span> {item.mitigation}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Tips */}
              <div>
                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-2xl font-bold mb-6 flex items-center gap-3"
                >
                  <Lightbulb className="w-6 h-6 text-yellow-500" />
                  Quick Tips for Better Results
                </motion.h3>

                <div className="grid md:grid-cols-2 gap-6">
                  {promptTips.map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-full">
                        <CardHeader>
                          <CardTitle className="text-lg">{tip.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-4">{tip.description}</p>
                          <div className="bg-muted rounded-lg p-3">
                            <p className="text-sm">
                              <span className="font-medium">💡 Example:</span> {tip.example}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </TabsContent>

          {/* Understanding Results Tab */}
          <TabsContent value="understanding">
            <section className="space-y-12">
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-3xl font-bold mb-8 flex items-center gap-3"
              >
                <BarChart3 className="w-8 h-8 text-primary" />
                Understanding Your Results
              </motion.h2>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-sentiment-positive/10 border-sentiment-positive/30">
                  <CardHeader className="text-center">
                    <span className="text-4xl mb-2">😊</span>
                    <CardTitle className="text-sentiment-positive">Positive</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Content expressing happiness, satisfaction, approval, or enthusiasm. 
                      Keywords: love, great, amazing, happy, excellent, thank you
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-sentiment-negative/10 border-sentiment-negative/30">
                  <CardHeader className="text-center">
                    <span className="text-4xl mb-2">😠</span>
                    <CardTitle className="text-sentiment-negative">Negative</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Content expressing anger, disappointment, frustration, or criticism.
                      Keywords: hate, terrible, awful, disappointed, worst, angry
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-sentiment-neutral/10 border-sentiment-neutral/30">
                  <CardHeader className="text-center">
                    <span className="text-4xl mb-2">😐</span>
                    <CardTitle className="text-sentiment-neutral">Neutral</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Content that's factual, objective, or doesn't express clear emotion.
                      Examples: news updates, questions, informational statements
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Confidence Scores */}
              <Card>
                <CardHeader>
                  <CardTitle>Understanding Confidence Scores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-4 rounded-lg bg-positive/10">
                      <div className="text-3xl font-bold text-positive mb-2">80-100%</div>
                      <p className="font-medium mb-1">High Confidence</p>
                      <p className="text-sm text-muted-foreground">Clear sentiment indicators. Result is very reliable.</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-yellow-500/10">
                      <div className="text-3xl font-bold text-yellow-600 mb-2">50-79%</div>
                      <p className="font-medium mb-1">Medium Confidence</p>
                      <p className="text-sm text-muted-foreground">Mixed signals present. Review the text manually.</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-negative/10">
                      <div className="text-3xl font-bold text-negative mb-2">0-49%</div>
                      <p className="font-medium mb-1">Low Confidence</p>
                      <p className="text-sm text-muted-foreground">Ambiguous content. May require more context.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Keywords Explanation */}
              <Card>
                <CardHeader>
                  <CardTitle>How Keywords Work</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Keywords are the words and phrases that most strongly influenced the sentiment classification. 
                    They represent the emotional drivers in your text.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="font-medium mb-2">Example Text:</p>
                      <p className="text-sm italic">"This product is absolutely amazing! Best purchase ever!"</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="font-medium mb-2">Extracted Keywords:</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-positive/20 text-positive rounded text-sm">amazing</span>
                        <span className="px-2 py-1 bg-positive/20 text-positive rounded text-sm">best</span>
                        <span className="px-2 py-1 bg-positive/20 text-positive rounded text-sm">absolutely</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq">
            <section>
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-3xl font-bold mb-8 flex items-center gap-3"
              >
                <AlertCircle className="w-8 h-8 text-primary" />
                Frequently Asked Questions
              </motion.h2>

              <Card>
                <CardContent className="pt-6">
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </section>
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="gradient-bg rounded-3xl p-12 text-center text-primary-foreground"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to start analyzing?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
            Put your newfound knowledge to use. Start analyzing sentiment now!
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border mt-12">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">SentiMood</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Powered by AI. Built for understanding emotions.
          </p>
        </div>
      </footer>
    </div>
  );
}
