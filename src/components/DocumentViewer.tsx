import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, GitCompare, Layers, FolderTree, FileDown, TrendingUp, ArrowLeft } from "lucide-react";

type ViewMode = "hierarchy" | "base" | "amendments" | "integrated" | "kpis";

interface Amendment {
  id: string;
  section: string;
  type: "modification" | "addition" | "deletion";
  originalText?: string;
  newText?: string;
}

interface ContractData {
  title: string;
  baseContract: {
    sections: { id: string; title: string; content: string }[];
  };
  amendments: Amendment[];
}

const mockContract: ContractData = {
  title: "Master Service Agreement - Client ABC",
  baseContract: {
    sections: [
      {
        id: "1",
        title: "1. Services and Scope",
        content:
          "The Service Provider agrees to provide consulting services as outlined in Statement of Work documents. Services will be delivered during standard business hours (9 AM - 5 PM EST) on weekdays.",
      },
      {
        id: "2",
        title: "2. Payment Terms",
        content:
          "Payment shall be made within 30 days of invoice receipt. Late payments will incur a 5% penalty fee. All fees are stated in USD and are non-refundable.",
      },
      {
        id: "3",
        title: "3. Term and Termination",
        content:
          "This agreement shall commence on the effective date and continue for a period of 12 months. Either party may terminate with 30 days written notice.",
      },
      {
        id: "4",
        title: "4. Confidentiality",
        content:
          "Both parties agree to maintain confidentiality of proprietary information shared during the term of this agreement. This obligation survives termination.",
      },
    ],
  },
  amendments: [
    {
      id: "a1",
      section: "2",
      type: "modification",
      originalText: "Payment shall be made within 30 days of invoice receipt.",
      newText: "Payment shall be made within 45 days of invoice receipt.",
    },
    {
      id: "a2",
      section: "2",
      type: "addition",
      newText: "For projects exceeding $50,000, payment may be made in installments as agreed upon in the Statement of Work.",
    },
    {
      id: "a3",
      section: "1",
      type: "modification",
      originalText: "Services will be delivered during standard business hours (9 AM - 5 PM EST) on weekdays.",
      newText:
        "Services will be delivered during standard business hours (9 AM - 5 PM EST) on weekdays, with 24/7 emergency support available for critical issues.",
    },
    {
      id: "a4",
      section: "3",
      type: "deletion",
      originalText: "Either party may terminate with 30 days written notice.",
    },
  ],
};

interface DocumentViewerProps {
  onBack?: () => void;
}

export const DocumentViewer = ({ onBack }: DocumentViewerProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("hierarchy");

  const getIntegratedContent = (section: { id: string; title: string; content: string }) => {
    const sectionAmendments = mockContract.amendments.filter((a) => a.section === section.id);
    
    if (sectionAmendments.length === 0) {
      return <p className="leading-relaxed text-foreground">{section.content}</p>;
    }

    let content = section.content;
    const elements: JSX.Element[] = [];
    let lastIndex = 0;

    sectionAmendments.forEach((amendment) => {
      if (amendment.type === "modification" && amendment.originalText) {
        const index = content.indexOf(amendment.originalText);
        if (index !== -1) {
          if (index > lastIndex) {
            elements.push(
              <span key={`text-${lastIndex}`}>{content.slice(lastIndex, index)}</span>
            );
          }
          elements.push(
            <span key={amendment.id} className="bg-modification text-modification-foreground px-1 rounded">
              {amendment.newText}
            </span>
          );
          lastIndex = index + amendment.originalText.length;
        }
      } else if (amendment.type === "deletion" && amendment.originalText) {
        const index = content.indexOf(amendment.originalText);
        if (index !== -1) {
          if (index > lastIndex) {
            elements.push(
              <span key={`text-${lastIndex}`}>{content.slice(lastIndex, index)}</span>
            );
          }
          elements.push(
            <span key={amendment.id} className="bg-deletion text-deletion-foreground px-1 rounded line-through">
              {amendment.originalText}
            </span>
          );
          lastIndex = index + amendment.originalText.length;
        }
      }
    });

    // Add remaining text
    if (lastIndex < content.length) {
      elements.push(<span key={`text-${lastIndex}`}>{content.slice(lastIndex)}</span>);
    }

    // Add additions at the end
    sectionAmendments
      .filter((a) => a.type === "addition")
      .forEach((amendment) => {
        elements.push(
          <span key={amendment.id} className="block mt-2 bg-addition text-addition-foreground px-2 py-1 rounded">
            {amendment.newText}
          </span>
        );
      });

    return <p className="leading-relaxed text-foreground">{elements}</p>;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button variant="ghost" size="sm" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-foreground">{mockContract.title}</h1>
                <p className="text-sm text-muted-foreground mt-1">Contract Management System</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Export PDF
              </Button>
              <Button size="sm">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)} className="w-full">
          <TabsList className="grid w-full max-w-3xl grid-cols-5 mb-8">
            <TabsTrigger value="hierarchy" className="flex items-center gap-2">
              <FolderTree className="h-4 w-4" />
              Hierarchy
            </TabsTrigger>
            <TabsTrigger value="base" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Base Contract
            </TabsTrigger>
            <TabsTrigger value="amendments" className="flex items-center gap-2">
              <GitCompare className="h-4 w-4" />
              Changes
            </TabsTrigger>
            <TabsTrigger value="integrated" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Integrated View
            </TabsTrigger>
            <TabsTrigger value="kpis" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              KPIs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hierarchy" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Document Hierarchy</CardTitle>
                  <Button variant="outline" size="sm">
                    <FileDown className="h-4 w-4 mr-2" />
                    View as PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Base Agreement
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {mockContract.title}
                    </p>
                    <div className="mt-3 ml-4 space-y-1">
                      {mockContract.baseContract.sections.map((section) => (
                        <div key={section.id} className="text-sm text-muted-foreground">
                          • {section.title}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-l-4 border-accent pl-4 py-2">
                    <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                      <GitCompare className="h-5 w-5" />
                      Amendments ({mockContract.amendments.length})
                    </h3>
                    <div className="mt-3 ml-4 space-y-2">
                      {mockContract.amendments.map((amendment) => (
                        <div key={amendment.id} className="text-sm">
                          <span className="text-muted-foreground">Amendment {amendment.id.toUpperCase()}</span>
                          {" - "}
                          <span className="text-foreground">Section {amendment.section}</span>
                          {" "}
                          <span
                            className={`text-xs px-2 py-0.5 rounded ml-2 ${
                              amendment.type === "modification"
                                ? "bg-modification text-modification-foreground"
                                : amendment.type === "addition"
                                ? "bg-addition text-addition-foreground"
                                : "bg-deletion text-deletion-foreground"
                            }`}
                          >
                            {amendment.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="base" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Original Base Contract</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {mockContract.baseContract.sections.map((section) => (
                  <div key={section.id} className="space-y-2">
                    <h3 className="font-semibold text-lg text-foreground">{section.title}</h3>
                    <p className="leading-relaxed text-foreground">{section.content}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="amendments" className="space-y-6">
            <div className="grid gap-6">
              {["deletion", "addition", "modification"].map((type) => {
                const typeAmendments = mockContract.amendments.filter((a) => a.type === type);
                if (typeAmendments.length === 0) return null;
                
                return (
                  <Card key={type}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded text-sm ${
                            type === "modification"
                              ? "bg-modification text-modification-foreground"
                              : type === "addition"
                              ? "bg-addition text-addition-foreground"
                              : "bg-deletion text-deletion-foreground"
                          }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}s
                        </span>
                        <span className="text-muted-foreground text-sm">
                          ({typeAmendments.length})
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {typeAmendments.map((amendment) => (
                        <div
                          key={amendment.id}
                          className="border border-border rounded-lg p-4 space-y-2"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">
                              Section {amendment.section}
                            </span>
                          </div>
                          {amendment.originalText && (
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Original:</p>
                              <p className="text-sm text-foreground line-through opacity-60">
                                {amendment.originalText}
                              </p>
                            </div>
                          )}
                          {amendment.newText && (
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">
                                {type === "modification" ? "Modified to:" : type === "addition" ? "Addition:" : "Removed"}
                              </p>
                              <p className="text-sm text-foreground font-medium">{amendment.newText}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="integrated" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Integrated Contract View</CardTitle>
                <div className="flex gap-4 text-sm mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-addition rounded"></div>
                    <span className="text-muted-foreground">Addition</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-modification rounded"></div>
                    <span className="text-muted-foreground">Modification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-deletion rounded"></div>
                    <span className="text-muted-foreground">Deletion</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {mockContract.baseContract.sections.map((section) => (
                  <div key={section.id} className="space-y-2">
                    <h3 className="font-semibold text-lg text-foreground">{section.title}</h3>
                    {getIntegratedContent(section)}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kpis" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contract Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">$2.5M</p>
                  <p className="text-sm text-muted-foreground mt-1">Annual value</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment Terms</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-foreground">45 Days</p>
                  <p className="text-sm text-muted-foreground mt-1">From invoice receipt</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contract Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-foreground">12 Months</p>
                  <p className="text-sm text-muted-foreground mt-1">Renewable annually</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Amendments</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-accent">4</p>
                  <p className="text-sm text-muted-foreground mt-1">Active modifications</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Service Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-foreground">9 AM - 5 PM EST</p>
                  <p className="text-sm text-muted-foreground mt-1">24/7 emergency support</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Late Payment Fee</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-deletion">5%</p>
                  <p className="text-sm text-muted-foreground mt-1">Penalty on overdue amounts</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Key Terms Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Services Scope</h4>
                    <p className="text-sm text-muted-foreground">
                      Consulting services as outlined in Statement of Work documents with 24/7 emergency support for critical issues.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Payment Structure</h4>
                    <p className="text-sm text-muted-foreground">
                      45-day payment terms with installment options for projects exceeding $50,000.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Confidentiality</h4>
                    <p className="text-sm text-muted-foreground">
                      Both parties must maintain confidentiality of proprietary information. Obligation survives termination.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Termination</h4>
                    <p className="text-sm text-muted-foreground">
                      Modified termination clause - refer to current amendments for active termination terms.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
