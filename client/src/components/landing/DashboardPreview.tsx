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
                            {/* Chat List */}
                            <div className="w-72 border-r border-slate-200 flex flex-col bg-white">
                                <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                                    <div className="relative">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input placeholder="Buscar..." className="pl-8 h-9 bg-white border-slate-200 text-xs focus-visible:ring-blue-500" />
                                    </div>
                                </div>
                                <div className="flex-1 overflow-auto">
                                    {[
                                        { name: "Ana Beatriz", msg: "Gostaria de saber mais sobre...", time: "10:42", unread: 2 },
                                        { name: "Carlos Oliveira", msg: "Ok, fico no aguardo.", time: "10:30", unread: 0 },
                                        { name: "Fernanda Lima", msg: "Pode me enviar o orçamento?", time: "09:15", unread: 1 },
                                        { name: "Grupo Vendas", msg: "Meta batida pessoal! 🚀", time: "Ontem", unread: 5 },
                                    ].map((chat, i) => (
                                        <div key={i} className={`p-3 border-b border-slate-100 flex gap-3 hover:bg-slate-50 cursor-pointer ${i === 0 ? 'bg-blue-50/60 border-l-2 border-l-blue-500' : ''}`}>
                                            <Avatar className="h-10 w-10 border border-slate-200">
                                                <AvatarFallback className="bg-slate-100 text-slate-600 text-xs font-medium">{chat.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 overflow-hidden">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className={`text-sm font-medium ${i === 0 ? 'text-blue-700' : 'text-slate-800'}`}>{chat.name}</span>
                                                    <span className="text-[10px] text-slate-500">{chat.time}</span>
                                                </div>
                                                <p className="text-xs text-slate-500 truncate">{chat.msg}</p>
                                            </div>
                                            {chat.unread > 0 && (
                                                <div className="flex flex-col justify-center">
                                                    <span className="h-5 w-5 flex items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-sm shadow-blue-200">
                                                        {chat.unread}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Chat View */}
                            <div className="flex-1 flex flex-col bg-slate-50/30">
                                <div className="h-16 border-b border-slate-200 flex items-center justify-between px-4 bg-white shadow-sm z-10">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9 border border-slate-200">
                                            <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">AB</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="text-sm font-semibold text-slate-800">Ana Beatriz</div>
                                            <div className="text-[10px] text-emerald-600 flex items-center gap-1 font-medium">
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                Online no WhatsApp
                                            </div>
                                        </div>
                                    </div>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex-1 p-4 space-y-4 overflow-auto bg-[#e5ddd5]/30 custom-scrollbar"> {/* Light WhatsApp-ish bg hint */}
                                    <div className="flex justify-center">
                                        <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-1 rounded-full shadow-sm font-medium">Hoje</span>
                                    </div>
                                    <div className="flex justify-start max-w-[80%]">
                                        <div className="bg-white text-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-200 text-sm shadow-sm">
                                            Olá, bom dia! Gostaria de saber mais sobre os planos.
                                            <span className="block text-[10px] text-slate-400 mt-1 text-right">10:40</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-end max-w-[80%] ml-auto">
                                        <div className="bg-[#dcf8c6] text-slate-900 p-3 rounded-2xl rounded-tr-none text-sm shadow-sm border border-emerald-100">
                                            Bom dia Ana, tudo bem?
                                            Claro! Temos planos a partir de R$ 99,00. Qual seria o seu maior interesse hoje?
                                            <span className="block text-[10px] text-slate-500/80 mt-1 text-right">10:41</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-start max-w-[80%]">
                                        <div className="bg-white text-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-200 text-sm shadow-sm">
                                            Preciso principalmente da parte de automação de WhatsApp.
                                            <span className="block text-[10px] text-slate-400 mt-1 text-right">10:42</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 border-t border-slate-200 bg-slate-100">
                                    <div className="relative">
                                        <Input placeholder="Digite sua mensagem..." className="bg-white border-slate-200 pr-12 text-slate-800 shadow-sm focus-visible:ring-blue-500" />
                                        <Button size="icon" className="absolute right-1 top-1 h-8 w-8 bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* TAB: CRM FUNNEL */}
                        <TabsContent value="crm" className="m-0 h-[450px] overflow-x-auto bg-slate-50/50 rounded-lg border border-slate-200">
                            <div className="flex gap-4 h-full min-w-[800px] p-4">
                                {/* Stage 1 */}
                                <div className="w-64 flex-shrink-0 flex flex-col gap-3">
                                    <div className="flex items-center justify-between px-1">
                                        <div className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-slate-400" />
                                            <h4 className="font-semibold text-sm text-slate-700">Novos Leads</h4>
                                        </div>
                                        <Badge variant="outline" className="text-slate-500 border-slate-300 bg-white">4</Badge>
                                    </div>
                                    <div className="flex-1 bg-slate-100/50 rounded-lg p-2 space-y-2 border border-slate-200/60">
                                        {[
                                            { title: "Empresa Solar", val: "R$ 15k", tag: "Quente", badgeColor: "bg-red-100 text-red-700" },
                                            { title: "Tech Solutions", val: "R$ 8.5k", tag: "Morno", badgeColor: "bg-amber-100 text-amber-700" },
                                            { title: "Padaria Central", val: "R$ 12k", tag: "Frio", badgeColor: "bg-blue-100 text-blue-700" },
                                            { title: "Dr. Consultório", val: "R$ 22k", tag: "Indicação", badgeColor: "bg-indigo-100 text-indigo-700" }
                                        ].map((card, i) => (
                                            <div key={i} className="bg-white border border-slate-200 p-3 rounded-md shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing transition-all group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">{card.title}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <Badge variant="secondary" className={`${card.badgeColor} h-5 px-1.5 border-transparent`}>{card.tag}</Badge>
                                                    <span className="font-semibold text-slate-600">{card.val}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Stage 2 */}
                                <div className="w-64 flex-shrink-0 flex flex-col gap-3">
                                    <div className="flex items-center justify-between px-1">
                                        <div className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-blue-400" />
                                            <h4 className="font-semibold text-sm text-slate-700">Em Atendimento</h4>
                                        </div>
                                        <Badge variant="outline" className="text-slate-500 border-slate-300 bg-white">2</Badge>
                                    </div>
                                    <div className="flex-1 bg-slate-100/50 rounded-lg p-2 space-y-2 border border-slate-200/60">
                                        {[
                                            { title: "Logística Express", val: "R$ 45k", tag: "Negociando" },
                                            { title: "Click Entregas", val: "R$ 3.2k", tag: "Demo Agendada" },
                                        ].map((card, i) => (
                                            <div key={i} className="bg-white border border-slate-200 p-3 rounded-md shadow-sm hover:shadow-md cursor-grab group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">{card.title}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 h-5 px-1.5">{card.tag}</Badge>
                                                    <span className="font-semibold text-slate-600">{card.val}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Stage 3 */}
                                <div className="w-64 flex-shrink-0 flex flex-col gap-3">
                                    <div className="flex items-center justify-between px-1">
                                        <div className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-amber-400" />
                                            <h4 className="font-semibold text-sm text-slate-700">Proposta</h4>
                                        </div>
                                        <Badge variant="outline" className="text-slate-500 border-slate-300 bg-white">1</Badge>
                                    </div>
                                    <div className="flex-1 bg-slate-100/50 rounded-lg p-2 space-y-2 border border-slate-200/60">
                                        {[
                                            { title: "Construtora Silva", val: "R$ 120k", tag: "Aguardando Assinatura" },
                                        ].map((card, i) => (
                                            <div key={i} className="bg-white border border-slate-200 p-3 rounded-md shadow-sm hover:shadow-md cursor-grab group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">{card.title}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <Badge variant="secondary" className="bg-amber-50 text-amber-700 h-5 px-1.5">{card.tag}</Badge>
                                                    <span className="font-semibold text-slate-600">{card.val}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Stage 4 */}
                                <div className="w-64 flex-shrink-0 flex flex-col gap-3">
                                    <div className="flex items-center justify-between px-1">
                                        <div className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                            <h4 className="font-semibold text-sm text-slate-700">Fechado</h4>
                                        </div>
                                        <Badge variant="outline" className="text-slate-500 border-slate-300 bg-white">5</Badge>
                                    </div>
                                    <div className="flex-1 bg-slate-100/50 rounded-lg p-2 space-y-2 border border-slate-200/60 opacity-80">
                                        {[
                                            { title: "Cliente VIP 01", val: "R$ 10k", tag: "Pago" },
                                            { title: "StartUp X", val: "R$ 15k", tag: "Pago" },
                                            { title: "Loja Y", val: "R$ 5k", tag: "Pago" },
                                        ].map((card, i) => (
                                            <div key={i} className="bg-emerald-50 border border-emerald-200 p-3 rounded-md shadow-sm">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-sm font-medium text-slate-800">{card.title}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 h-5 px-1.5">{card.tag}</Badge>
                                                    <span className="font-semibold text-emerald-600">{card.val}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                    </Tabs>
                </div>
            </div>
        </div>
    );
};
