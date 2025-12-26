
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Loader2, FileDown, TrendingUp, TrendingDown, DollarSign, Filter } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const RelatoriosPage = () => {
    const { token } = useAuth();
    const [activeTab, setActiveTab] = useState("dre");
    const [loading, setLoading] = useState(false);

    // Filters
    const [startDate, setStartDate] = useState(format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [selectedCity, setSelectedCity] = useState("0"); // 0 = all
    const [cities, setCities] = useState<any[]>([]);

    // Data States
    const [dreData, setDreData] = useState<any>(null);
    const [breakdownData, setBreakdownData] = useState<any>(null);
    const [indicatorsData, setIndicatorsData] = useState<any>(null);

    // Fetch initial data (cities)
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const res = await fetch("/api/cities", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setCities(data);
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchCities();
    }, [token]);

    // Fetch Report Data based on active tab
    const fetchData = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                startDate,
                endDate,
                ...(selectedCity !== "0" && { cityId: selectedCity })
            });

            if (activeTab === 'dre') {
                const res = await fetch(`/api/reports/dre?${query}`, { headers: { Authorization: `Bearer ${token}` } });
                if (res.ok) setDreData(await res.json());
            } else if (activeTab === 'breakdown') {
                const res = await fetch(`/api/reports/breakdown?${query}`, { headers: { Authorization: `Bearer ${token}` } });
                if (res.ok) setBreakdownData(await res.json());
            } else if (activeTab === 'indicators') {
                const res = await fetch(`/api/reports/indicators`, { headers: { Authorization: `Bearer ${token}` } });
                if (res.ok) setIndicatorsData(await res.json());
            }

        } catch (error) {
            console.error("Error fetching report data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab, startDate, endDate, selectedCity]); // Refetch on filter change

    // Exports
    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text(`Relatório - ${activeTab.toUpperCase()}`, 14, 16);
        doc.text(`Período: ${startDate} a ${endDate}`, 14, 22);

        if (activeTab === 'dre' && dreData) {
            autoTable(doc, {
                startY: 30,
                head: [['Item', 'Valor (R$)']],
                body: [
                    ['Receita Bruta', dreData.grossRevenue?.toFixed(2)],
                    ['Custos Operacionais', dreData.operationalCosts?.toFixed(2)],
                    ['Despesas', dreData.expenses?.toFixed(2)],
                    ['Lucro Bruto', dreData.grossProfit?.toFixed(2)],
                    ['Lucro Líquido', dreData.netProfit?.toFixed(2)]
                ]
            });
        }
        else if (activeTab === 'breakdown' && breakdownData) {
            doc.text("Por Cidade", 14, 30);
            autoTable(doc, {
                startY: 35,
                head: [['Cidade', 'Receita', 'Custo']],
                body: breakdownData.byCity.map((item: any) => [item.city_name, item.revenue, item.cost])
            });
        }

        doc.save(`relatorio_${activeTab}_${Date.now()}.pdf`);
    };

    const exportExcel = () => {
        let ws;
        if (activeTab === 'dre' && dreData) {
            ws = XLSX.utils.json_to_sheet([dreData]);
        } else if (activeTab === 'breakdown' && breakdownData) {
            ws = XLSX.utils.json_to_sheet(breakdownData.byCity);
        } else {
            return;
        }
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Dados");
        XLSX.writeFile(wb, `relatorio_${activeTab}.xlsx`);
    };

    // --- Components for Tabs ---
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Relatórios Gerenciais</h2>
                    <p className="text-muted-foreground">Acompanhe o desempenho financeiro e operacional.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={exportPDF}>
                        <FileDown className="mr-2 h-4 w-4" /> PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportExcel}>
                        <FileDown className="mr-2 h-4 w-4" /> Excel
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Filter className="h-4 w-4" /> Filtros
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-4">
                    <div>
                        <label className="text-xs font-medium">Início</label>
                        <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-xs font-medium">Fim</label>
                        <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-xs font-medium">Cidade</label>
                        <Select value={selectedCity} onValueChange={setSelectedCity}>
                            <SelectTrigger>
                                <SelectValue placeholder="Todas as Cidades" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">Todas as Cidades</SelectItem>
                                {cities.map((c: any) => (
                                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-end">
                        <Button className="w-full" onClick={fetchData} disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Atualizar"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="dre">DRE Simplificado</TabsTrigger>
                    <TabsTrigger value="breakdown">Por Cidade/Serviço</TabsTrigger>
                    <TabsTrigger value="indicators">Indicadores</TabsTrigger>
                </TabsList>

                <TabsContent value="dre" className="space-y-4">
                    {dreData ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Receita Bruta</CardTitle>
                                    <DollarSign className="h-4 w-4 text-green-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">R$ {dreData.grossRevenue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Custos/Despesas</CardTitle>
                                    <TrendingDown className="h-4 w-4 text-red-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">R$ {(Number(dreData.operationalCosts) + Number(dreData.expenses))?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                                    <p className="text-xs text-muted-foreground">Custos + Despesas</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-primary" />
                                </CardHeader>
                                <CardContent>
                                    <div className={`text-2xl font-bold ${dreData.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        R$ {dreData.netProfit?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : <div className="text-center p-10">Carregando dados...</div>}
                </TabsContent>

                <TabsContent value="breakdown" className="space-y-4">
                    {breakdownData ? (
                        <div className="grid gap-4 md:grid-cols-2">
                            <Card className="col-span-1">
                                <CardHeader><CardTitle>Receita por Cidade</CardTitle></CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={breakdownData.byCity}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="city_name" fontSize={10} />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="revenue" fill="#8884d8" name="Receita" />
                                            <Bar dataKey="cost" fill="#82ca9d" name="Custo" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                            <Card className="col-span-1">
                                <CardHeader><CardTitle>Receita por Serviço (Categoria)</CardTitle></CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={breakdownData.byService}
                                                dataKey="revenue"
                                                nameKey="service_name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                label
                                            >
                                                {breakdownData.byService.map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <div className="p-4 text-center">Carregando breakdown...</div>
                    )}
                </TabsContent>

                <TabsContent value="indicators" className="space-y-4">
                    {indicatorsData ? (
                        <div className="grid gap-4">
                            <div className="grid gap-4 md:grid-cols-3">
                                <Card>
                                    <CardHeader className="pb-2"><CardTitle className="text-sm">Margem de Lucro (Mês Atual)</CardTitle></CardHeader>
                                    <CardContent><div className="text-2xl font-bold">{indicatorsData.margin}%</div></CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2"><CardTitle className="text-sm">Crescimento (vs Mês Anterior)</CardTitle></CardHeader>
                                    <CardContent>
                                        <div className={`text-2xl font-bold flex items-center ${Number(indicatorsData.growth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {Number(indicatorsData.growth) >= 0 ? <TrendingUp className="mr-2 h-4 w-4" /> : <TrendingDown className="mr-2 h-4 w-4" />}
                                            {indicatorsData.growth}%
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            <Card>
                                <CardHeader><CardTitle>Evolução Financeira (6 meses)</CardTitle></CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={indicatorsData.evolution}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Receita" />
                                            <Line type="monotone" dataKey="cost" stroke="#82ca9d" name="Custo" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    ) : <div className="text-center p-4">Carregando indicadores...</div>}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default RelatoriosPage;
