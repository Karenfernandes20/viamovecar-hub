import { ArrowUpRight, MapPin, Users, Wallet2, LayoutDashboard, AlertCircle, TrendingUp, Globe, ShieldCheck, Map, ArrowDownRight, Clock, Ban, Calendar, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, Bar, BarChart, ResponsiveContainer, YAxis, Tooltip } from "recharts";
import { CompanySummary } from "@/pages/Dashboard";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

// Tipagem para os dados reais (quando integrados)
const chartData: Array<{ name: string; corridas: number; receita: number }> = [];

const chartConfig = {
    corridas: {
        label: "Corridas",
        color: "hsl(var(--primary))",
    },
    receita: {
        label: "Receita",
        color: "hsl(var(--accent))",
    },
} satisfies ChartConfig;

interface TransportDashboardProps {
    company: CompanySummary | null;
    isLoadingCompany: boolean;
    companyError: string | null;
}

export const TransportDashboard = ({ company, isLoadingCompany, companyError }: TransportDashboardProps) => {

    // Fallback labels helpers
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'stable': return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">🟢 Estável</Badge>;
            case 'attention': return <Badge className="bg-amber-500/10 text-amber-600 border-amber-200">🟡 Atenção</Badge>;
            case 'critical': return <Badge className="bg-red-500/10 text-red-600 border-red-200">🔴 Crítica</Badge>;
            default: return <Badge variant="outline">—</Badge>;
        }
    };

    return (
        <div className="space-y-6 pb-10 animate-in fade-in duration-700">
            {/* 9️⃣ Filtros Globais */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/50 p-4 rounded-xl border border-border/50 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <LayoutDashboard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold tracking-tight">Torre de Controle</h2>
                        <p className="text-xs text-muted-foreground font-medium">Gestão Estratégica Nacional</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <Select defaultValue="30d">
                            <SelectTrigger className="w-[140px] h-9 text-xs bg-background">
                                <SelectValue placeholder="Período" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                                <SelectItem value="90d">Últimos 90 dias</SelectItem>
                                <SelectItem value="year">Este ano</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Select defaultValue="all">
                        <SelectTrigger className="w-[140px] h-9 text-xs bg-background">
                            <SelectValue placeholder="Estado/Região" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Brasil (Geral)</SelectItem>
                            <SelectItem value="sp">São Paulo</SelectItem>
                            <SelectItem value="rj">Rio de Janeiro</SelectItem>
                            <SelectItem value="mg">Minas Gerais</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select defaultValue="active">
                        <SelectTrigger className="w-[140px] h-9 text-xs bg-background">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os Status</SelectItem>
                            <SelectItem value="active">Operação Ativa</SelectItem>
                            <SelectItem value="critical">Em Alerta</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* 1️⃣ Topo – Visão Geral Nacional (Status Macro) */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="relative overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                        <Globe className="h-12 w-12" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status da Plataforma</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold">—</span>
                            {getStatusBadge('none')}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-2 leading-tight">
                            Este indicador será ativado após integração com os dados de todas as cidades.
                        </p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                        <MapPin className="h-12 w-12" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cidades em Operação</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">—</div>
                        <p className="text-[10px] text-muted-foreground mt-2 leading-tight">
                            Total de municípios com operação ativa na plataforma.
                        </p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                        <AlertCircle className="h-12 w-12" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cidades em Alerta</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-600">—</div>
                        <p className="text-[10px] text-muted-foreground mt-2 leading-tight">
                            Quantidade de cidades com status crítico ou atenção.
                        </p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                        <TrendingUp className="h-12 w-12" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Oferta x Demanda Global</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">—</div>
                        <p className="text-[10px] text-muted-foreground mt-2 leading-tight">
                            Equilíbrio entre passageiros e motoristas disponíveis.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* 2️⃣ Mapa Nacional + 4️⃣ Painel de Alertas Estratégicos */}
            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden min-h-[400px] flex flex-col">
                    <CardHeader className="bg-muted/30 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-sm">Mapa Estratégico Regional</CardTitle>
                                <CardDescription className="text-[10px]">Distribuição e status da operação nacional</CardDescription>
                            </div>
                            <Map className="h-4 w-4 text-primary opacity-50" />
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-transparent to-primary/5">
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            < Globe className="h-10 w-10 text-primary/40 animate-pulse" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground/80">Mapa estratégico em integração</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
                            O mapa visual de calor e status será ativado após integração com os dados geográficos da operação.
                        </p>
                        <div className="mt-6 flex gap-3">
                            <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Estável
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Atenção
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span> Crítico
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm flex flex-col">
                    <CardHeader className="bg-red-500/5 border-b border-red-500/10">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <CardTitle className="text-sm">Alertas Estratégicos</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 p-0">
                        <div className="flex flex-col h-full items-center justify-center p-8 text-center bg-muted/10">
                            <p className="text-xs text-muted-foreground font-medium italic">
                                "Nenhum alerta estratégico ativo no momento."
                            </p>
                            <div className="mt-4 p-4 border border-dashed rounded-lg bg-background/50 max-w-[200px]">
                                <p className="text-[10px] text-muted-foreground leading-relaxed">
                                    Alertas de queda de faturamento, falta de motoristas ou problemas de SLA aparecerão aqui.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 5️⃣ Financeiro Consolidado */}
            <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-primary/5 border-b border-primary/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Wallet2 className="h-4 w-4 text-primary" />
                            <CardTitle className="text-sm">Visualização Financeira Consolidada</CardTitle>
                        </div>
                        <Badge variant="outline" className="text-[10px] bg-background">Nacional</Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-y md:divide-y-0 border-b">
                        <div className="p-4 space-y-1">
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase">Faturamento Total</p>
                            <p className="text-xl font-bold">R$ —</p>
                            <p className="text-[9px] text-muted-foreground italic leading-tight">Receita bruta gerada pela plataforma no período.</p>
                        </div>
                        <div className="p-4 space-y-1">
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase">Comissão Plataforma</p>
                            <p className="text-xl font-bold text-primary">R$ —</p>
                            <p className="text-[9px] text-muted-foreground italic leading-tight">Taxa de intermediação (Net Revenue).</p>
                        </div>
                        <div className="p-4 space-y-1">
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase">Repasse Motoristas</p>
                            <p className="text-xl font-bold">R$ —</p>
                            <p className="text-[9px] text-muted-foreground italic leading-tight">Valores destinados à base de condutores.</p>
                        </div>
                        <div className="p-4 space-y-1">
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase">Parceiros Locais</p>
                            <p className="text-xl font-bold">R$ —</p>
                            <p className="text-[9px] text-muted-foreground italic leading-tight">Comissões de franquias e donos de cidade.</p>
                        </div>
                        <div className="p-4 space-y-1">
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase">Ticket Médio</p>
                            <p className="text-xl font-bold">R$ —</p>
                            <p className="text-[9px] text-muted-foreground italic leading-tight">Valor médio nacional por corrida finalizada.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 3️⃣ Ranking de Cidades + 6️⃣ Distribuição Operacional */}
            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            Ranking de Performance de Cidades
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="w-[50px] text-[10px] uppercase font-bold">Pos</TableHead>
                                        <TableHead className="text-[10px] uppercase font-bold">Cidade</TableHead>
                                        <TableHead className="text-right text-[10px] uppercase font-bold">Corridas</TableHead>
                                        <TableHead className="text-right text-[10px] uppercase font-bold">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="text-center font-bold text-muted-foreground">#1</TableCell>
                                        <TableCell className="text-xs font-medium">—</TableCell>
                                        <TableCell className="text-right text-xs">—</TableCell>
                                        <TableCell className="text-right">{getStatusBadge('none')}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="text-center font-bold text-muted-foreground">#2</TableCell>
                                        <TableCell className="text-xs font-medium">—</TableCell>
                                        <TableCell className="text-right text-xs">—</TableCell>
                                        <TableCell className="text-right">{getStatusBadge('none')}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="text-center font-bold text-muted-foreground">#3</TableCell>
                                        <TableCell className="text-xs font-medium">—</TableCell>
                                        <TableCell className="text-right text-xs">—</TableCell>
                                        <TableCell className="text-right">{getStatusBadge('none')}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                        <p className="mt-4 text-[11px] text-muted-foreground italic text-center">
                            Os dados de ranking serão preenchidos automaticamente.
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm">Distribuição por Região</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[280px] flex items-center justify-center bg-muted/5 rounded-lg border border-dashed m-4 mt-0">
                        <div className="text-center">
                            <div className="flex justify-center mb-2">
                                <div className="flex gap-1 items-end h-8">
                                    <div className="w-2 bg-primary/20 h-4"></div>
                                    <div className="w-2 bg-primary/20 h-8"></div>
                                    <div className="w-2 bg-primary/20 h-5"></div>
                                    <div className="w-2 bg-primary/20 h-7"></div>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">Gráficos analíticos de corridas por região aparecerão aqui após integração.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 7️⃣ Expansão e Qualidade + 8️⃣ Governança & Compliance */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                            <CardTitle className="text-sm">Gestão de Expansão e Qualidade</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-muted/40 rounded-lg">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold">Novas Cidades</p>
                                <p className="text-lg font-bold">—</p>
                            </div>
                            <div className="p-3 bg-muted/40 rounded-lg">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold">Avaliação Média</p>
                                <p className="text-lg font-bold">—</p>
                            </div>
                        </div>
                        <div className="p-3 border border-dashed rounded-lg bg-background/50">
                            <p className="text-[10px] text-muted-foreground leading-relaxed">
                                Acompanhamento de onboarding de novas praças e KPI de satisfação global.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                            <CardTitle className="text-sm">Governança & Compliance</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-xs p-2 rounded bg-muted/30">
                            <div className="flex items-center gap-2">
                                <Ban className="h-3.5 w-3.5 text-red-500" />
                                <span>Motoristas bloqueados (Global)</span>
                            </div>
                            <span className="font-bold">—</span>
                        </div>
                        <div className="flex items-center justify-between text-xs p-2 rounded bg-muted/30">
                            <div className="flex items-center gap-2">
                                <Clock className="h-3.5 w-3.5 text-amber-500" />
                                <span>Documentos pendentes</span>
                            </div>
                            <span className="font-bold">—</span>
                        </div>
                        <div className="flex items-center justify-between text-xs p-2 rounded bg-muted/30">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-3.5 w-3.5 text-blue-500" />
                                <span>SLA fora do padrão</span>
                            </div>
                            <span className="font-bold">—</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
