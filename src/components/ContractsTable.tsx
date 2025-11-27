import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, ChevronRight, FileText, GitCompare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Contract {
  id: string;
  manufacturerName: string;
  gpo: string;
  effectiveDate: string;
  modifications: number;
  baseAgreement: string;
  amendments: string[];
}

const mockContracts: Contract[] = [
  {
    id: "MSA-2024-001",
    manufacturerName: "PharmaCorp Industries",
    gpo: "Premier Inc.",
    effectiveDate: "2024-01-15",
    modifications: 4,
    baseAgreement: "Master Service Agreement - PharmaCorp",
    amendments: ["Amendment A1 - Payment Terms", "Amendment A2 - Service Hours", "Amendment A3 - Termination", "Amendment A4 - Pricing"],
  },
  {
    id: "MSA-2024-002",
    manufacturerName: "MediSupply Global",
    gpo: "Vizient",
    effectiveDate: "2024-02-20",
    modifications: 2,
    baseAgreement: "Master Service Agreement - MediSupply",
    amendments: ["Amendment A1 - Delivery Schedule", "Amendment A2 - Quality Standards"],
  },
  {
    id: "MSA-2024-003",
    manufacturerName: "HealthTech Solutions",
    gpo: "Intalere",
    effectiveDate: "2024-03-10",
    modifications: 5,
    baseAgreement: "Master Service Agreement - HealthTech",
    amendments: ["Amendment A1 - Pricing", "Amendment A2 - Territory", "Amendment A3 - Support Terms", "Amendment A4 - Compliance", "Amendment A5 - Data Security"],
  },
  {
    id: "MSA-2023-045",
    manufacturerName: "BioMed Pharmaceuticals",
    gpo: "Premier Inc.",
    effectiveDate: "2023-11-05",
    modifications: 3,
    baseAgreement: "Master Service Agreement - BioMed",
    amendments: ["Amendment A1 - Volume Discounts", "Amendment A2 - Payment Terms", "Amendment A3 - Warranty"],
  },
  {
    id: "MSA-2024-004",
    manufacturerName: "Surgical Equipment Ltd",
    gpo: "HealthTrust",
    effectiveDate: "2024-04-01",
    modifications: 1,
    baseAgreement: "Master Service Agreement - Surgical Equipment",
    amendments: ["Amendment A1 - Service Level Agreement"],
  },
];

interface ContractsTableProps {
  onOpenContract: (contractId: string) => void;
}

export const ContractsTable = ({ onOpenContract }: ContractsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filteredContracts = mockContracts.filter(
    (contract) =>
      contract.manufacturerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.gpo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Manufacturer Contracts</h1>
              <p className="text-sm text-muted-foreground mt-1">Contract Management System</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Contracts</CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by manufacturer, ID, or GPO..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Unique ID</TableHead>
                  <TableHead>Manufacturer Name</TableHead>
                  <TableHead>GPO</TableHead>
                  <TableHead>Effective Date</TableHead>
                  <TableHead className="text-center">Modifications</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContracts.map((contract) => (
                  <>
                    <TableRow
                      key={contract.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => toggleRow(contract.id)}
                    >
                      <TableCell>
                        {expandedRow === contract.id ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">{contract.id}</TableCell>
                      <TableCell className="text-foreground">{contract.manufacturerName}</TableCell>
                      <TableCell className="text-muted-foreground">{contract.gpo}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(contract.effectiveDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{contract.modifications}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenContract(contract.id);
                          }}
                        >
                          Open
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedRow === contract.id && (
                      <TableRow>
                        <TableCell colSpan={7} className="bg-muted/20">
                          <div className="py-4 space-y-4">
                            <div className="space-y-3">
                              <div className="border-l-4 border-primary pl-4 py-2">
                                <h4 className="font-semibold text-foreground flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  Base Agreement
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {contract.baseAgreement}
                                </p>
                              </div>

                              <div className="border-l-4 border-accent pl-4 py-2">
                                <h4 className="font-semibold text-foreground flex items-center gap-2">
                                  <GitCompare className="h-4 w-4" />
                                  Amendments ({contract.amendments.length})
                                </h4>
                                <div className="mt-2 space-y-1">
                                  {contract.amendments.map((amendment, idx) => (
                                    <div key={idx} className="text-sm text-muted-foreground">
                                      • {amendment}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
