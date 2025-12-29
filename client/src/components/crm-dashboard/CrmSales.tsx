import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Percent, TrendingUp, CreditCard } from "lucide-react";

export const CrmSales = () => {
    const data = [
        { name: 'Seg', vendas: 4000 },
        { name: 'Ter', vendas: 3000 },
        { name: 'Qua', vendas: 2000 },
        { name: 'Qui', vendas: 2780 },
        { name: 'Sex', vendas: 1890 },
        { name: 'Sab', vendas: 2390 },
        { name: 'Dom', vendas: 3490 },
    ];

    const stats = [
        { label: "Total Vendas", value: "R$ 19.5k", sub: "+12% vs mês anterior", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50" },
        { label: "Ticket Médio", value: "R$ 450", sub: "+5%", icon: CreditCard, color: "text-blue-500", bg: "bg-blue-50" },
        { label: "Conversão", value: "3.2%", sub: "-0.4%", icon: Percent, color: "text-purple-500", bg: "bg-purple-50" },
        { label: "Metas", value: "85%", sub: "Batida", icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-50" },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm">
                        <CardContent className="p-4 flex flex-col justify-between h-full">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
                                <div className={`p-1.5 rounded-full ${stat.bg}`}>
                                    <stat.icon className={`h-3 w-3 ${stat.color}`} />
                                </div>
                            </div>
                            <div>
                                <span className="text-xl font-bold">{stat.value}</span>
                                <p className="text-[10px] text-muted-foreground mt-1">{stat.sub}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Desempenho de Vendas Semanal</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                cursor={{ fill: 'transparent' }}
                            />
                            <Bar dataKey="vendas" fill="#008069" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};
