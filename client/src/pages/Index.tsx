import { ArrowRight, BarChart3, MessageCircle, ShieldCheck, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";

const Index = () => {
  const navigate = useNavigate();
<<<<<<< HEAD
  const { toast } = useToast();
  const { login, logout, user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();

    if (!email || !password) {
      toast({
        title: "Preencha os dados",
        description: "Informe e-mail e senha administrativos para acessar o painel.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Falha no login");
      }

      login(data.token, data.user);

      toast({
        title: "Bem-vindo(a)!",
        description: `Login realizado com sucesso.`,
      });

      navigate("/app/dashboard");
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message || "Verifique suas credenciais.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };
=======
>>>>>>> 94a6751107910dc1a69c18894022e2425270452e

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-soft via-background to-background">
      {/* Top navigation */}
      <header className="border-b border-primary-soft/40 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight">ViaMoveCar Admin</span>
              <span className="text-[11px] text-muted-foreground">Painel de gestão para operações de mobilidade</span>
            </div>
          </div>

          <nav className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button
              size="sm"
              onClick={() => navigate("/cadastro")}
              className="gap-2"
            >
              Cadastre-se
              <ArrowRight className="h-3 w-3" />
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero section */}
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-12 pt-10 sm:pt-16 md:flex-row md:items-stretch md:gap-12 md:pb-16">
        <section className="flex flex-1 flex-col justify-center space-y-6">
          <span className="inline-flex max-w-[280px] items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-[11px] font-medium text-primary-soft-foreground">
            Novo CRM + Atendimento
            <span className="h-1 w-1 rounded-full bg-accent" />
            Focado em mobilidade urbana
          </span>

          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Centralize CRM, WhatsApp, financeiro e operação em um só lugar.
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
              O ViaMoveCar Admin foi criado para empresas de transporte que precisam enxergar em tempo real
              leads, atendimentos, cidades atendidas, fluxo de caixa e desempenho da operação.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" className="gap-2" onClick={() => navigate("/cadastro")}>
              Falar com time comercial
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/login")}
              className="border-primary-soft/60"
            >
              Já sou cliente
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3 text-xs text-muted-foreground sm:grid-cols-2 md:max-w-xl">
            <div className="rounded-xl bg-card/80 p-4 shadow-soft">
              <p className="font-medium text-foreground flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Visão 360º da operação
              </p>
              <p className="mt-2 text-[11px]">
                Acompanhe indicadores por cidade, estado, canal de atendimento e status dos leads.
              </p>
            </div>
            <div className="rounded-xl bg-card/80 p-4 shadow-soft">
              <p className="font-medium text-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Times integrados
              </p>
              <p className="mt-2 text-[11px]">
                CRM, financeiro, atendimento via WhatsApp e gestão de usuários em um único painel.
              </p>
            </div>
          </div>
        </section>

        {/* Right side highlight card */}
        <section className="flex flex-1 items-center justify-center md:justify-end">
          <Card className="w-full max-w-md border border-primary-soft/70 bg-card/95 shadow-strong">
            <CardHeader className="space-y-1 pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">
                Como funciona o ViaMoveCar Admin?
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Uma camada administrativa conectada ao seu app de mobilidade e à API de WhatsApp para
                organizar toda a operação em funis personalizados.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs text-muted-foreground sm:text-sm">
              <ul className="space-y-2">
                <li>
                  • CRM com funis por cidade e possibilidade de arrastar leads entre etapas.
                </li>
                <li>
                  • Módulo financeiro com visão de contas a pagar, receber e fluxo de caixa.
                </li>
                <li>
                  • Central de atendimento WhatsApp integrada ao número da sua operação.
                </li>
                <li>
                  • Gestão de usuários, cidades atendidas e painel geral com indicadores.
                </li>
              </ul>
              <p className="text-[11px] text-muted-foreground/90">
                Preencha o cadastro e nosso time entra em contato pelo WhatsApp para ativar o painel da sua
                empresa.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Index;
