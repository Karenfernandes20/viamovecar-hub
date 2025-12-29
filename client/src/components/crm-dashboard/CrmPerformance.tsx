import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const CrmPerformance = () => {
    const agents = [
        { name: "Ana Silva", avatar: "A", resolved: 45, time: "2m", rating: 4.8, status: "online" },
        { name: "Carlos Souza", avatar: "C", resolved: 38, time: "3m", rating: 4.6, status: "busy" },
        { name: "Mariana Costa", avatar: "M", resolved: 42, time: "1m", rating: 4.9, status: "online" },
    ];

    return (
        <Card className="h-full border-none shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Ranking de Atendentes</CardTitle>
                <CardDescription>Produtividade hoje</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {agents.map((agent, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Avatar className="h-9 w-9 border-2 border-background">
                                        <AvatarFallback>{agent.avatar}</AvatarFallback>
                                    </Avatar>
                                    <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background ${agent.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium leading-none">{agent.name}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{agent.resolved} atendimentos</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center justify-end gap-1 text-xs font-medium">
                                    <span className="text-amber-500">★ {agent.rating}</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-0.5">{agent.time} resp. média</p>
                            </div>
                        </div>
                    ))}
                    <div className="pt-2">
                        <div className="text-xs text-center text-muted-foreground bg-muted/20 p-2 rounded">
                            🏆 <strong>Mariana Costa</strong> é a destaque de hoje!
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
