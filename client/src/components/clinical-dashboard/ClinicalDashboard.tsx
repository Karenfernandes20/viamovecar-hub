import { CompanySummary } from "@/pages/Dashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Calendar, Activity, Clock, UserCheck, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ClinicalDashboardProps {
    company: CompanySummary;
}

export const ClinicalDashboard = ({ company }: ClinicalDashboardProps) => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Dashboard Clínica</h1>
                    <p className="text-muted-foreground text-sm">
                        Gestão de pacientes e agenda para <span className="font-semibold text-primary">{company.name}</span>
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        Ver Agenda
                    </Button>
                    <Button size="sm">
                        <UserCheck className="mr-2 h-4 w-4" />
                        Novo Paciente
                    </Button>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                <Card className="shadow-sm">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Em Atendimento</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold text-primary">0</div>
                        <p className="text-xs text-muted-foreground">Pacientes agora</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Aguardando</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold text-orange-600">0</div>
                        <p className="text-xs text-muted-foreground">Na recepção</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Hoje</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">Consultas agendadas</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Profissionais</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold text-green-600">0</div>
                        <p className="text-xs text-muted-foreground">Atendendo agora</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Pacientes</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">Cadastrados</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Cancelamentos</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold text-red-500">0</div>
                        <p className="text-xs text-muted-foreground">Hoje</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">

                {/* Agenda / Status */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Activity className="h-4 w-4 text-primary" />
                                Status de Atendimento (Tempo Real)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                                <Activity className="h-10 w-10 text-muted-foreground/30" />
                                <p className="text-sm text-muted-foreground">Nenhum atendimento em andamento no momento.</p>
                                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/90">Iniciar triagem</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-primary" />
                                Próximas Consultas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-6">
                                <p className="text-sm text-muted-foreground">A agenda de hoje está livre ou os dados ainda não foram carregados.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Alerts & Professionals */}
                <div className="space-y-6">
                    <Card className="border-l-4 border-l-orange-500 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-orange-500" />
                                Alertas Operacionais
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <p>• Sala 03 ociosa há 45 min.</p>
                                <p>• Dr. Silva tem 2 encaixes pendentes.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Users className="h-4 w-4 text-primary" />
                                Profissionais Disponíveis
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-4">
                                <p className="text-xs text-muted-foreground">Nenhum profissional online.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
