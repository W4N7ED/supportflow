
import { Card } from "@/components/ui/card";

const Reports = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Rapports</h1>
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <p className="text-muted-foreground">
            La page de rapports sera bientôt disponible.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
