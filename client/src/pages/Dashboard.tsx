import { useEffect, useState } from "react";
import { ArrowUpRight, MapPin, Users, Wallet2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
// import { supabase } from "@/integrations/supabase/client"; // Removed direct access
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

// Dados reais serão preenchidos pela API futuramente
const chartData: Array<{ name: string; corridas: number }> = [];

const chartConfig = {
  corridas: {
    label: "Corridas",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

interface CompanySummary {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  logo_url: string | null;
  operation_type?: 'motoristas' | 'clientes' | 'pacientes';
}

const getOperationTypeLabel = (type: string | undefined, plural = true) => {
  switch (type) {
    case 'motoristas':
      return plural ? 'Motoristas' : 'Motorista';
    case 'pacientes':
      return plural ? 'Pacientes' : 'Paciente';
    case 'clientes':
    default:
      return plural ? 'Clientes' : 'Cliente';
  }
};

const getSecondaryTypeLabel = (type: string | undefined, plural = true) => {
  switch (type) {
    case 'motoristas':
      return plural ? 'Passageiros' : 'Passageiro'; // If main is Drivers, secondary is Passengers
    case 'pacientes':
      return plural ? 'Atendimentos' : 'Atendimento';
    case 'clientes':
    default:
      return plural ? 'Usuários' : 'Usuário';
  }
}


const DashboardPage = () => {
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get("companyId");

  const [company, setCompany] = useState<CompanySummary | null>(null);
  const [isLoadingCompany, setIsLoadingCompany] = useState(false);
  const [companyError, setCompanyError] = useState<string | null>(null);

  useEffect(() => {
    const loadCompany = async () => {
      if (!companyId) {
        setCompany(null);
        setCompanyError(null);
        return;
      }

      setIsLoadingCompany(true);
      setCompanyError(null);

      try {
        const response = await fetch(`/api/companies/${companyId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Failed to fetch company');
        }

        const data: CompanySummary = await response.json();
        setCompany(data);

      } catch (error: any) {
        console.error("Erro ao buscar empresa no Dashboard", error);
        setCompany(null);
        setCompanyError(error.message || "Não foi possível carregar os dados da empresa.");
      }

      setIsLoadingCompany(false);
    };

    void loadCompany();
  }, [companyId]);

  // --- CRM / CLIENTES DASHBOARD ---
  if (company?.operation_type === 'clientes') {
    return (
      <div className="space-y-6">
        {/* Company Header */}
        <section className="rounded-lg border border-[#008069]/20 bg-[#008069]/5 px-4 py-3 text-xs">
          <div className="flex items-center gap-3">
            {company.logo_url && (
              <img src={company.logo_url} alt={company.name} className="h-10 w-10 rounded-full object-cover border" />
            )}
            <div>
              <h2 className="text-sm font-bold text-[#008069] flex items-center gap-2">
                {company.name}
                <span className="text-[10px] bg-white border px-1.5 py-0.5 rounded text-gray-500 font-normal uppercase">
                  CRM & VENDAS
                </span>
              </h2>
              <p className="text-muted-foreground">Painel exclusivo de Atendimento e Relacionamento</p>
            </div>
          </div>
        </section>

        {/* 1. VISÃO GERAL (Top Cards) */}
        <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {[
            { label: "Conversas Ativas", icon: "💬", value: "—", sub: "No momento" },
            { label: "Mensagens Hoje", icon: "📩", value: "—", sub: "Recebidas" },
            { label: "Novos Leads", icon: "⭐", value: "—", sub: "Hoje" },
            { label: "Clientes Atendidos", icon: "✅", value: "—", sub: "Hoje" },
            { label: "Tempo 1ª Resposta", icon: "⚡", value: "—", sub: "Médio" },
            { label: "Tempo Atendimento", icon: "⏱️", value: "—", sub: "Médio" },
            { label: "Atendentes Online", icon: "🎧", value: "—", sub: "Agora" },
            { label: "Conexão WhatsApp", icon: "🟢", value: "—", sub: "Status" },
            { label: "Vendas Hoje", icon: "💰", value: "—", sub: "Confirmadas" },
            { label: "Ticket Médio", icon: "🏷️", value: "—", sub: "Mensal" }
          ].map((card, i) => (
            <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow bg-card">
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-medium text-muted-foreground">{card.label}</span>
                  <span className="text-base">{card.icon}</span>
                </div>
                <div>
                  <span className="text-xl font-bold block">{card.value}</span>
                  <span className="text-[10px] text-muted-foreground">{card.sub}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* 2. FUNIL & 3. PERFORMANCE */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Funil Visual */}
          <Card className="lg:col-span-2 border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#008069]" /> Funil de Vendas (Kanban)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-2 overflow-x-auto pb-4">
                {["Novo Contato", "Em Atendimento", "Proposta", "Negociação", "Fechado"].map((step, idx) => (
                  <div key={idx} className="flex-1 min-w-[100px] bg-muted/30 rounded-lg p-3 text-center border border-transparent hover:border-[#008069]/30 transition-colors">
                    <div className="text-xs font-medium text-muted-foreground uppercase mb-2">{step}</div>
                    <div className="text-lg font-bold text-[#008069]">—</div>
                    <div className="text-[10px] text-muted-foreground mt-1">0% conv.</div>
                  </div>
                ))}
              </div>
              <div className="h-[200px] w-full bg-muted/10 rounded border border-dashed flex items-center justify-center text-xs text-muted-foreground">
                Gráfico do Funil será exibido aqui (Recharts)
              </div>
            </CardContent>
          </Card>

          {/* Ranking Atendentes */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" /> Top Atendentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                    #{i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="h-2 w-16 bg-gray-100 rounded animate-pulse"></div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-green-600">—</div>
                  </div>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t text-center">
                <p className="text-[10px] text-muted-foreground">Ranking baseado em volume e satisfação</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 5. ATIVIDADE EM TEMPO REAL & 6. ORIGEM */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4 text-orange-500" /> Atividade em Tempo Real
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((_, i) => (
                  <div key={i} className="flex items-start gap-3 p-2 hover:bg-muted/20 rounded transition-colors">
                    <div className={`h-2 w-2 rounded-full mt-1.5 ${i % 2 === 0 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <div className="flex-1">
                      <p className="text-xs font-medium">Conversa #{1000 + i}</p>
                      <p className="text-[11px] text-muted-foreground truncate">Aguardando resposta do atendente...</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">há {i * 5} min</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-purple-500" /> Origem dos Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Instagram Ads", color: "bg-pink-500" },
                  { name: "Google Search", color: "bg-blue-500" },
                  { name: "Site Oficial", color: "bg-green-500" },
                  { name: "Indicação", color: "bg-yellow-500" }
                ].map((origin, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${origin.color}`}></div>
                      <span>{origin.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${origin.color} opacity-70`} style={{ width: '0%' }}></div>
                      </div>
                      <span className="text-muted-foreground w-6 text-right">—</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    );
  }

  // --- STANDARD DASHBOARD (MOTORISTAS/PACIENTES) ---
  return (
    <div className="space-y-5 sm:space-y-6">
      {/* ... Existing Dashboard Code ... */}
      {companyId && (
        <section className="mb-2 rounded-lg border border-primary-soft bg-primary-soft/20 px-3 py-2 text-xs sm:mb-3">
          {isLoadingCompany ? (
            <p className="text-muted-foreground">Carregando dados da empresa selecionada...</p>
          ) : company ? (
            <div className="flex items-center gap-3">
              {company.logo_url && (
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border bg-background">
                  <img
                    src={company.logo_url}
                    alt={`Logo da empresa ${company.name}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-foreground">
                  Visão atual: <span className="font-semibold text-primary">{company.name}</span>
                  <span className="ml-2 text-[10px] uppercase text-muted-foreground border px-1 rounded bg-background/50">
                    {company.operation_type || 'CLIENTES'}
                  </span>
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {company.city || company.state
                    ? [company.city, company.state].filter(Boolean).join("/")
                    : "Cidade/UF não informados"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              {companyError ?? "Empresa não encontrada ou você não tem acesso a ela."}
            </p>
          )}
        </section>
      )}

      {/* Indicadores principais sem números fictícios */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="elevated-card animate-card-fade-up border-none bg-card/90">
          <CardHeader className="flex flex-row items-center justify-between pb-1.5 sm:pb-2">
            <CardTitle className="text-[11px] font-medium text-muted-foreground sm:text-xs">
              {getSecondaryTypeLabel(company?.operation_type)} cadastrados
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="pb-3 sm:pb-4">
            <p className="text-xl font-semibold sm:text-2xl">—</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Os dados reais serão exibidos aqui assim que a integração estiver ativa.
            </p>
          </CardContent>
        </Card>

        <Card className="elevated-card animate-card-fade-up border-none bg-card/90">
          <CardHeader className="flex flex-row items-center justify-between pb-1.5 sm:pb-2">
            <CardTitle className="text-[11px] font-medium text-muted-foreground sm:text-xs">
              {getOperationTypeLabel(company?.operation_type)} cadastrados
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="pb-3 sm:pb-4">
            <p className="text-xl font-semibold sm:text-2xl">—</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Os dados serão carregados automaticamente a partir do backend.
            </p>
          </CardContent>
        </Card>

        <Card className="elevated-card animate-card-fade-up border-none bg-card/90">
          <CardHeader className="flex flex-row items-center justify-between pb-1.5 sm:pb-2">
            <CardTitle className="text-[11px] font-medium text-muted-foreground sm:text-xs">
              {company?.operation_type === 'pacientes' ? 'Consultas' : 'Corridas'} em andamento
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent className="pb-3 sm:pb-4">
            <p className="text-xl font-semibold sm:text-2xl">—</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Este indicador será alimentado em tempo real quando a integração estiver pronta.
            </p>
          </CardContent>
        </Card>

        <Card className="elevated-card animate-card-fade-up border-none bg-card/90">
          <CardHeader className="flex flex-row items-center justify-between pb-1.5 sm:pb-2">
            <CardTitle className="text-[11px] font-medium text-muted-foreground sm:text-xs">
              Cidades ativas
            </CardTitle>
            <MapPin className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="pb-3 sm:pb-4">
            <p className="text-xl font-semibold sm:text-2xl">—</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Em breve serão exibidas aqui apenas informações reais da operação.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Área reservada para gráficos com dados reais */}
      <section className="grid gap-4 lg:grid-cols-[2fr,1.3fr]">
        <Card className="elevated-card border-none bg-card/95">
          <CardHeader className="flex flex-row items-center justify-between pb-2 sm:pb-3">
            <div>
              <CardTitle className="text-sm">
                {company?.operation_type === 'pacientes' ? 'Consultas' : 'Corridas'} por estado
              </CardTitle>
              <p className="text-[11px] text-muted-foreground sm:text-xs">
                Assim que os dados forem integrados, este gráfico mostrará os dados reais por estado.
              </p>
            </div>
          </CardHeader>
          <CardContent className="pt-1 sm:pt-0">
            <ChartContainer config={chartConfig} className="mt-1 h-52 sm:mt-2 sm:h-64">
              <AreaChart data={chartData} margin={{ left: -24, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="corridas"
                  stroke="hsl(var(--primary))"
                  fill="url(#area-fill)"
                  strokeWidth={2}
                  dot={false}
                />
                <defs>
                  <linearGradient id="area-fill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="elevated-card border-none bg-card/95">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm">Resumo financeiro</CardTitle>
              <p className="text-xs text-muted-foreground">
                Os valores serão alimentados automaticamente a partir dos dados reais.
              </p>
            </div>
            <Wallet2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="space-y-3 pt-1 text-xs">
            <div className="flex items-center justify-between rounded-lg bg-primary-soft/60 px-3 py-2">
              <span className="text-muted-foreground">Faturamento total</span>
              <span className="font-semibold text-foreground">—</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
              <span className="text-muted-foreground">Faturamento mensal</span>
              <span className="font-semibold text-foreground">—</span>
            </div>
            <div className="grid gap-2 rounded-lg bg-background px-3 py-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{getOperationTypeLabel(company?.operation_type)}</span>
                <span className="font-medium text-foreground">—</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Parceiros locais</span>
                <span className="font-medium text-foreground">—</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Plataforma</span>
                <span className="font-medium text-foreground">—</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Nenhum número exibido aqui é fictício: os dados só aparecerão quando vierem do backend.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Seção informativa, sem números falsos */}
      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border-dashed bg-background/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Indicadores por cidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <p className="text-[11px] text-muted-foreground">
              Aqui você poderá acompanhar indicadores reais de cada cidade assim que a integração de dados for
              concluída.
            </p>
          </CardContent>
        </Card>

        <Card className="border-dashed bg-background/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Atendimento em destaque</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <p className="text-muted-foreground">
              A aba Atendimento será integrada ao Evolution API para exibir conversas reais organizadas por cidade e
              estado.
            </p>
            <p className="text-[11px] text-muted-foreground">
              No momento nenhum número é simulado: os dados serão carregados diretamente da sua operação.
            </p>
          </CardContent>
        </Card>

        <Card className="border-dashed bg-background/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pronto para escalar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <p className="text-muted-foreground">
              A estrutura do painel está pronta para receber dados reais, novos módulos, relatórios e permissões
              avançadas.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default DashboardPage;
