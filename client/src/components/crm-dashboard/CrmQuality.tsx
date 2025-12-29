import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Star, ThumbsUp, ThumbsDown, MessageSquareWarning } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const CrmQuality = () => {
    return (
        <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Satisfação do Cliente</CardTitle>
                    <CardDescription>Média de avaliações (NPS/CSAT)</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center space-y-4">
                    <div className="text-5xl font-bold text-yellow-500 flex items-center gap-2">
                        4.8 <Star className="h-8 w-8 fill-yellow-500" />
                    </div>
                    <div className="text-sm text-muted-foreground">Baseado em 124 avaliações este mês</div>

                    <div className="w-full space-y-2 mt-4">
                        <div className="flex items-center gap-2 text-xs">
                            <span className="w-8 font-medium">5 ★</span>
                            <Progress value={85} className="h-2 bg-yellow-100 dark:bg-yellow-900/20 [&>div]:bg-yellow-500" />
                            <span className="w-8 text-right text-muted-foreground">85%</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="w-8 font-medium">4 ★</span>
                            <Progress value={10} className="h-2 bg-yellow-100 dark:bg-yellow-900/20 [&>div]:bg-yellow-500" />
                            <span className="w-8 text-right text-muted-foreground">10%</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="w-8 font-medium">3 ★</span>
                            <Progress value={3} className="h-2 bg-yellow-100 dark:bg-yellow-900/20 [&>div]:bg-yellow-500" />
                            <span className="w-8 text-right text-muted-foreground">3%</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="w-8 font-medium">2 ★</span>
                            <Progress value={1} className="h-2 bg-yellow-100 dark:bg-yellow-900/20 [&>div]:bg-yellow-500" />
                            <span className="w-8 text-right text-muted-foreground">1%</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="w-8 font-medium">1 ★</span>
                            <Progress value={1} className="h-2 bg-yellow-100 dark:bg-yellow-900/20 [&>div]:bg-yellow-500" />
                            <span className="w-8 text-right text-muted-foreground">1%</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <ThumbsUp className="h-4 w-4 text-green-500" /> Feedbacks Positivos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            <li className="text-xs bg-muted/30 p-2 rounded italic text-muted-foreground">"Atendimento muito rápido, a Ana foi super atenciosa!"</li>
                            <li className="text-xs bg-muted/30 p-2 rounded italic text-muted-foreground">"Resolvi meu problema em 5 minutos."</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <ThumbsDown className="h-4 w-4 text-red-500" /> Pontos de Atenção
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            <li className="text-xs bg-red-50 dark:bg-red-900/10 p-2 rounded italic text-red-600/80">"Demora para responder no Whatsapp durante o almoço."</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
