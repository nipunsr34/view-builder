import { useState } from "react";
import { DocumentViewer } from "@/components/DocumentViewer";
import { ContractsTable } from "@/components/ContractsTable";

const Index = () => {
  const [selectedContract, setSelectedContract] = useState<string | null>(null);

  if (selectedContract) {
    return <DocumentViewer onBack={() => setSelectedContract(null)} />;
  }

  return <ContractsTable onOpenContract={(id) => setSelectedContract(id)} />;
};

export default Index;
