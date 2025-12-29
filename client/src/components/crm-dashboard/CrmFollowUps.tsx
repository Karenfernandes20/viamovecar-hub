import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock, AlertCircle, CalendarCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CrmFollowUps = () => {
    const followups = [
        { client: "Mariana Silva", type: "Retorno Proposta", time: "14:00 (Hoje)", status: "pending", urgency: "high" },
        { client: "Construtora Ideal", type: "Cobrar Contrato", time: "15:30 (Hoje)", status: "pending", urgency: "medium" },
        { client: "João Pedro", type: "Enviar Catálogo", time: "Ontem", status: "late", urgency: "high" },
        { client: "Clínica Saúde", type: "Agendar Demo", time: "Amanhã 09:00", status: "future", urgency: "low" },
    ];

    return (
        <Card className="border-none shadow-sm">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-primary" /> Agenda de Follow-ups
                </CardTitle>
                <Button variant="outline" size="sm" className="h-7 text-xs">Ver calendário completo</Button>
            </CardHeader>
            <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {followups.map((item, i) => (
                        <div key={i} className={`p-3 rounded-lg border flex flex-col justify-between h-auto ${item.status === 'late' ? 'bg-red-50 border-red-200' : 'bg-card'}`}>
                            <div>
                                <div className="flex items-start justify-between mb-2">
                                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${item.status === 'late' ? 'bg-red-200 text-red-700' : 'bg-primary/10 text-primary'}`}>
                                        {item.status === 'late' ? 'Atrasado' : 'Agendado'}
                                    </span>
                                    {item.status === 'late' && <AlertCircle className="h-3 w-3 text-red-500" />}
                                </div>
                                <h4 className="text-sm font-semibold truncate">{item.client}</h4>
                                <p className="text-xs text-muted-foreground">{item.type}</p>
                            </div>
                            <div className="mt-3 flex items-end justify-between">
                                <span className={`text-xs font-medium ${item.status === 'late' ? 'text-red-700' : 'text-muted-foreground'}`}>{item.time}</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6"><ArrowRight className="h-3 w-3" /></Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
