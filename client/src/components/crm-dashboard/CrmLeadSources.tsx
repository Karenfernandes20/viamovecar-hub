import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export const CrmLeadSources = () => {
    const data = [
        { name: 'Instagram', value: 400, color: '#E1306C' },
        { name: 'Google Ads', value: 300, color: '#4285F4' },
        { name: 'Site', value: 300, color: '#0F9D58' },
        { name: 'Indicação', value: 200, color: '#F4B400' },
    ];

    return (
        <Card className="h-full border-none shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Origem dos Leads</CardTitle>
                <CardDescription>Onde seus clientes estão</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            itemStyle={{ fontSize: '12px' }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
