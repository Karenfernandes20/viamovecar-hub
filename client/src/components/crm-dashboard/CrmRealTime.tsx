import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Clock, CheckCircle2 } from "lucide-react";

export const CrmRealTime = () => {
    const activities = [
        { type: "msg_in", user: "Cliente #9921", text: "Olá, gostaria de saber o preço...", time: "Agora", status: "w_agent" },
        { type: "msg_out", user: "Ana Silva", text: "Claro! Temos planos a partir de...", time: "2 min", status: "w_client" },
        { type: "status", user: "Carlos Souza", text: "Finalizou atendimento #8821", time: "5 min", status: "done" },
        { type: "msg_in", user: "Lead Facebook", text: "Tenho interesse no plano...", time: "12 min", status: "w_agent" },
        { type: "alert", user: "Sistema", text: "Cliente esperando há 15min!", time: "16 min", status: "alert" },
    ];

    return (
        <Card className="h-full border-none shadow-sm">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">Atividade em Tempo Real</CardTitle>
                    <Badge variant="outline" className="text-[10px] animate-pulse text-green-600 bg-green-50 border-green-200"> ● Ao vivo</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activities.map((act, i) => (
                        <div key={i} className="flex gap-3 items-start pb-3 border-b last:border-0 last:pb-0">
                            <div className="mt-0.5">
                                {act.status === 'w_agent' && <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />}
                                {act.status === 'w_client' && <div className="h-2 w-2 rounded-full bg-yellow-500" />}
                                {act.status === 'done' && <div className="h-2 w-2 rounded-full bg-green-500" />}
                                {act.status === 'alert' && <div className="h-2 w-2 rounded-full bg-red-600 animate-ping" />}
                            </div>
                            <div className="flex-1 space-y-0.5">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-semibold">{act.user}</p>
                                    <span className="text-[10px] text-muted-foreground">{act.time}</span>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-1">{act.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
