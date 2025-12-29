import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Zap, ArrowRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CrmAiInsights = () => {
    return (
        <Card className="border border-purple-200 bg-purple-50/50 dark:bg-purple-900/10 mb-6 shadow-sm">
            <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mt-1">
                        <Sparkles className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm text-purple-900 dark:text-purple-300 flex items-center gap-2">
                            Integrai AI Insights
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-200 text-purple-700 font-bold">BETA</span>
                        </h3>
                        <div className="flex flex-col gap-1 mt-1">
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                <Zap className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                <strong>Oportunidade:</strong> 3 leads recentes do Instagram têm alta probabilidade de conversão (+80%).
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                <AlertTriangle className="h-3 w-3 text-red-500" />
                                <strong>Atenção:</strong> O tempo de resposta aumentou 15% na última hora.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="text-purple-700 border-purple-200 hover:bg-purple-100 text-xs h-8">
                        Ver detalhes
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
