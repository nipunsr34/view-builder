import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, GitCompare, Layers } from "lucide-react";

type ViewMode = "base" | "amendments" | "integrated";

interface Amendment {
  id: string;
  section: string;
  type: "modification" | "addition";
  originalText?: string;
  newText: string;
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
  ],
};

export const DocumentViewer = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("integrated");

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
          // Add text before the modification
          if (index > lastIndex) {
            elements.push(
              <span key={`text-${lastIndex}`}>{content.slice(lastIndex, index)}</span>
            );
          }
          // Add the modified text
          elements.push(
            <span key={amendment.id} className="bg-modification text-modification-foreground px-1 rounded">
              {amendment.newText}
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
            <div>
              <h1 className="text-2xl font-bold text-foreground">{mockContract.title}</h1>
              <p className="text-sm text-muted-foreground mt-1">Contract Management System</p>
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
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
            <TabsTrigger value="base" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Base Contract
            </TabsTrigger>
            <TabsTrigger value="amendments" className="flex items-center gap-2">
              <GitCompare className="h-4 w-4" />
              Amendments
            </TabsTrigger>
            <TabsTrigger value="integrated" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Integrated View
            </TabsTrigger>
          </TabsList>

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
            <Card>
              <CardHeader>
                <CardTitle>Contract Amendments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockContract.amendments.map((amendment) => (
                  <div
                    key={amendment.id}
                    className="border border-border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Section {amendment.section}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          amendment.type === "modification"
                            ? "bg-modification text-modification-foreground"
                            : "bg-addition text-addition-foreground"
                        }`}
                      >
                        {amendment.type}
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
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        {amendment.type === "modification" ? "Modified to:" : "Addition:"}
                      </p>
                      <p className="text-sm text-foreground font-medium">{amendment.newText}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrated" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Integrated Contract View</CardTitle>
                <div className="flex gap-4 text-sm mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-modification rounded"></div>
                    <span className="text-muted-foreground">Modified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-addition rounded"></div>
                    <span className="text-muted-foreground">Addition</span>
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
        </Tabs>
      </div>
    </div>
  );
};
