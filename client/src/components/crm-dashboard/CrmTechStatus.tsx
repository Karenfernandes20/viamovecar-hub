import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Server, Wifi, QrCode, AlertTriangle, CheckCircle, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CrmTechStatus = () => {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* WhatsApp Status - MAIN */}
            <Card className="col-span-2 border-none shadow-sm bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-card">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-green-600" /> Conexão WhatsApp
                    </CardTitle>
                    <CardDescription>Status da API Evolution</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                            <Wifi className="h-8 w-8 text-green-600" />
                            <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <p className="font-medium text-lg text-green-700 dark:text-green-400">Conectado</p>
                            <p className="text-xs text-muted-foreground">Instância "Principal" operando normalmente.</p>
                            <p className="text-xs text-muted-foreground">Último ping: há 3s</p>
                        </div>
                        <Button variant="outline" size="sm" className="text-xs h-8">Gerenciar</Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Server className="h-4 w-4 text-blue-500" /> Webhooks
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">n8n Automation</span>
                            <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle className="h-3 w-3" /> OK</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Typebot</span>
                            <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle className="h-3 w-3" /> OK</span>
                        </div>
                        <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[98%]" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-red-50/50 dark:bg-red-950/10">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2 text-red-700 dark:text-red-400">
                        <AlertTriangle className="h-4 w-4" /> Alertas Críticos
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">0 erros críticos nas últimas 24h.</p>
                        <ul className="text-[10px] space-y-1 text-red-600/80">
                            <li>• Falha de envio (12:30) - Retentativa OK</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
