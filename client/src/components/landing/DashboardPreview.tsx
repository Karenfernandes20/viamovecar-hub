import { useState } from "react";
import {
    Activity,
    BarChart3,
    Calendar,
    ChevronDown,
    LayoutDashboard,
    MessageCircle,
    MessageSquare,
    MoreVertical,
    PieChart,
    Search,
    Settings,
    Users,
    DollarSign,
    Filter,
    ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

export const DashboardPreview = () => {
    return (
        <div className="w-full rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden ring-1 ring-slate-900/5">
            {/* Fake Browser Toolbar */}
            <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-amber-400" />
                    <div className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <div className="ml-4 flex flex-1 items-center justify-center">
                    <div className="flex w-full max-w-sm items-center gap-2 rounded-md bg-white px-3 py-1.5 text-xs text-slate-500 border border-slate-200 shadow-sm">
                        <span className="text-slate-600">app.integrai.com/dashboard</span>
                    </div>
                </div>
            </div>

            {/* App Layout */}
            <div className="flex h-[600px] w-full bg-slate-50 text-slate-900">
                {/* Sidebar Mockup */}
                <div className="hidden w-16 flex-col items-center gap-4 border-r border-slate-200 bg-white py-4 sm:flex lg:w-64 lg:items-start lg:px-4">
                    <div className="flex items-center gap-2 px-2 pb-4">
                        <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
                            <Activity className="h-5 w-5" />
                        </div>
                        <span className="hidden text-lg font-bold lg:block text-slate-900">Integrai</span>
                    </div>

                    <div className="w-full space-y-1">
                        <Button variant="secondary" className="w-full justify-start gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium">
                            <LayoutDashboard className="h-4 w-4" />
                            <span className="hidden lg:block">Dashboard</span>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start gap-2 hover:bg-slate-100 text-slate-600">
                            <MessageCircle className="h-4 w-4" />
                            <span className="hidden lg:block">Atendimentos</span>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start gap-2 hover:bg-slate-100 text-slate-600">
                            <BarChart3 className="h-4 w-4" />
                            <span className="hidden lg:block">CRM & Vendas</span>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start gap-2 hover:bg-slate-100 text-slate-600">
                            <Users className="h-4 w-4" />
                            <span className="hidden lg:block">Contatos</span>
                        </Button>
                    </div>

                    <div className="mt-auto w-full pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2 px-2">
                            <Avatar className="h-8 w-8 border border-slate-200">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <div className="hidden flex-col lg:flex overflow-hidden">
                                <span className="text-sm font-medium truncate text-slate-700">Empresa Demo</span>
                                <span className="text-xs text-slate-500">Admin</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-auto bg-slate-50/50 p-4 sm:p-6">
                    <Tabs defaultValue="dashboard" className="w-full space-y-6">
                        <div className="flex items-center justify-between">
                            <TabsList className="bg-white border border-slate-200 p-1 shadow-sm">
                                <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Visão Geral</TabsTrigger>
                                <TabsTrigger value="chats" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Atendimentos</TabsTrigger>
                                <TabsTrigger value="crm" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Funnel CRM</TabsTrigger>
                                <TabsTrigger value="marketing" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Marketing</TabsTrigger>
                            </TabsList>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm">
                                    <Calendar className="mr-2 h-4 w-4 text-slate-500" />
                                    Hoje
                                </Button>
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                                    <Filter className="mr-2 h-4 w-4" />
                                    Filtrar
                                </Button>
                            </div>
                        </div>

                        {/* TAB: DASHBOARD */}
                        <TabsContent value="dashboard" className="space-y-4 m-0">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-slate-500">Receita Total</CardTitle>
                                        <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center">
                                            <DollarSign className="h-4 w-4 text-emerald-600" />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-slate-900">R$ 45.231,89</div>
                                        <p className="text-xs text-emerald-600 flex items-center mt-1 font-medium">
                                            +20.1% <span className="text-slate-500 ml-1 font-normal">vs mês anterior</span>
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-slate-500">Atendimentos</CardTitle>
                                        <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                                            <MessageSquare className="h-4 w-4 text-blue-600" />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-slate-900">1,324</div>
                                        <p className="text-xs text-slate-500 mt-1">
                                            +180 novos hoje
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-slate-500">Vendas Fechadas</CardTitle>
                                        <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center">
                                            <BarChart3 className="h-4 w-4 text-amber-600" />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-slate-900">89</div>
                                        <p className="text-xs text-amber-600 flex items-center mt-1 font-medium">
                                            +12% <span className="text-slate-500 ml-1 font-normal">conversão</span>
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-slate-500">Ativos Agora</CardTitle>
                                        <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center">
                                            <Activity className="h-4 w-4 text-indigo-600" />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-slate-900">12</div>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Atendentes online
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                                <Card className="col-span-4 bg-white border-slate-200 shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="text-slate-800">Performance de Vendas</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pl-2">
                                        {/* Mock Chart Area */}
                                        <div className="h-[200px] w-full flex items-end justify-between gap-2 px-4 pb-2 border-b border-slate-100">
                                            {[40, 25, 55, 45, 60, 80, 70, 90, 65, 55, 85, 95].map((h, i) => (
                                                <div key={i} className="w-full bg-blue-100 hover:bg-blue-200 rounded-t-sm transition-all relative group h-full flex items-end">
                                                    <div style={{ height: `${h}%` }} className="w-full bg-blue-500 rounded-t-sm shadow-sm" />
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="col-span-3 bg-white border-slate-200 shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="text-slate-800">Atividades Recentes</CardTitle>
                                        <CardDescription className="text-slate-500">
                                            265 atendimentos hoje
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {[
                                                { name: "João Silva", act: "Iniciou nova conversa", time: "2m atrás", icon: MessageCircle, color: "text-blue-600 bg-blue-100" },
                                                { name: "Maria Santos", act: "Fechou venda R$ 1.2k", time: "15m atrás", icon: DollarSign, color: "text-emerald-600 bg-emerald-100" },
                                                { name: "Pedro Costa", act: "Novo Lead Cadastrado", time: "32m atrás", icon: Users, color: "text-indigo-600 bg-indigo-100" },
                                                { name: "Sistema", act: "Backup automático", time: "1h atrás", icon: Settings, color: "text-slate-600 bg-slate-100" },
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center">
                                                    <div className={`mr-3 rounded-full p-1.5 ${item.color}`}>
                                                        <item.icon className="h-4 w-4" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium leading-none text-slate-800">{item.name}</p>
                                                        <p className="text-xs text-slate-500">{item.act}</p>
                                                    </div>
                                                    <div className="ml-auto font-medium text-xs text-slate-400">{item.time}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* TAB: CHATS */}
                        <TabsContent value="chats" className="h-[450px] m-0 rounded-lg border border-slate-200 overflow-hidden flex bg-white shadow-sm">
                            <div className="relative h-full w-full group">
                                <img src="/real_atendimento.png" alt="Atendimento WhatsApp Real" className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                    <p className="text-white text-sm font-medium">Interface real do sistema: gestão de conversas com abertas/pendentes/fechadas e chat intuitivo.</p>
                                </div>
                            </div>
                        </TabsContent>

                        {/* TAB: CRM FUNNEL */}
                        <TabsContent value="crm" className="m-0 h-[450px] overflow-hidden rounded-lg border border-slate-200 bg-white">
                            <div className="relative h-full w-full group">
                                <img src="/real_crm.png" alt="CRM Kanban Real" className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                    <p className="text-white text-sm font-medium">Controle visual de leads em estilo Kanban, idêntico ao que você usará no dia a dia.</p>
                                </div>
                            </div>
                        </TabsContent>

                        {/* TAB: MARKETING PRINT */}
                        <TabsContent value="marketing" className="m-0 h-[450px] overflow-hidden rounded-lg border border-slate-200 bg-white">
                            <div className="relative h-full w-full group">
                                <img src="/real_campaigns.png" alt="Marketing Module" className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                    <p className="text-white text-sm font-medium">Interface real de gestão de campanhas com tabela de status e progresso.</p>
                                </div>
                            </div>
                        </TabsContent>

                        {/* TAB: FINANCEIRO PRINT */}
                        <TabsContent value="financeiro" className="m-0 h-[450px] overflow-hidden rounded-lg border border-slate-200 bg-white">
                            <div className="relative h-full w-full group">
                                <img src="/print-financeiro.png" alt="Financeiro Module" className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                    <p className="text-white text-sm font-medium">Controle total de contas a pagar, gráficos de desempenho e exportação profissional.</p>
                                </div>
                            </div>
                        </TabsContent>

                        {/* TAB: USUARIOS PRINT */}
                        <TabsContent value="usuarios" className="m-0 h-[450px] overflow-hidden rounded-lg border border-slate-200 bg-white">
                            <div className="relative h-full w-full group">
                                <img src="/print-usuarios.png" alt="Users Module" className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                    <p className="text-white text-sm font-medium">Gestão simplificada de motoristas, passageiros e equipe administrativa com níveis de acesso.</p>
                                </div>
                            </div>
                        </TabsContent>

                    </Tabs>
                </div>
            </div>
        </div>
    );
};
