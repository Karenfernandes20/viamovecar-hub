import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppSidebar } from "../components/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { cn } from "../lib/utils";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { ShieldAlert, LogOut } from "lucide-react";

const SECTION_TITLES: Record<string, string> = {
  "/app/dashboard": "Dashboard",
  "/app/atendimento": "Atendimento (WhatsApp)",
  "/app/crm": "CRM",
  "/app/financeiro": "Financeiro",
  "/app/usuarios": "Usuários",
  "/app/cidades": "Cidades",
  "/app/qr-code": "QR Code",
  "/app/configuracoes": "Configurações",
};

function getSectionTitle(pathname: string) {
  const match = Object.keys(SECTION_TITLES).find((key) => pathname.startsWith(key));
  return SECTION_TITLES[match ?? "/app/dashboard"];
}

export const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const title = getSectionTitle(location.pathname);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-background">
        <div className="flex min-h-screen w-full">
          <AppSidebar />

          <SidebarInset>
            <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="mr-1" />
                <div>
                  <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
                  <p className="text-xs text-muted-foreground">Central de controle da operação ViaMoveCar</p>
                </div>
              </div>
              <div className="relative flex items-center gap-3 text-xs">
                {user?.role === 'SUPERADMIN' && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-2 mr-2 hidden md:flex"
                    onClick={() => navigate('/superadmin')}
                  >
                    <ShieldAlert className="h-4 w-4" />
                    SuperAdmin
                  </Button>
                )}

                <div className="hidden text-right md:block">
                  <p className="font-medium">{user?.full_name || 'Usuário'}</p>
                  <p className="text-[11px] text-muted-foreground">{user?.role || 'Acesso interno'} · ViaMoveCar</p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary-soft-foreground" title={user?.full_name}>
                  {user?.full_name?.substring(0, 2).toUpperCase() || 'US'}
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout} title="Sair">
                  <LogOut className="h-4 w-4" />
                </Button>
                {/* <div className="pointer-events-none absolute -right-10 top-1/2 hidden h-16 w-16 -translate-y-1/2 rounded-full bg-accent/40 blur-2xl md:block" /> */}
              </div>
            </header>

            <main className={cn("flex-1 bg-gradient-to-b from-background via-background to-primary-soft/10 px-4 pb-8 pt-4")}
            >
              <div className="mx-auto flex max-w-6xl flex-col gap-6">
                <Outlet />
              </div>
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
};
