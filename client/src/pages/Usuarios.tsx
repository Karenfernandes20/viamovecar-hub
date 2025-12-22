import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/userService";
import { Loader2 } from "lucide-react";

const UsuariosPage = () => {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: userService.getUsers,
  });

  const passengers = users?.filter((u) => u.user_type === "passenger") || [];
  const drivers = users?.filter((u) => u.user_type === "driver") || [];
  const admins = []; // Assuming admins are in a different table or identified differently for now

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Erro ao carregar usuários. Verifique se o backend está rodando.</div>;
  }

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Gestão de usuários</h2>
          <p className="text-xs text-muted-foreground">
            Passageiros, motoristas e administradores com filtros por cidade, estado e status.
          </p>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-3">
        <Card className="border-dashed bg-background/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Passageiros ({passengers.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <p className="text-muted-foreground">
              Lista de passageiros com filtros por cidade/estado e histórico de corridas.
            </p>
            <Badge variant="outline" className="badge-pill text-[11px]">
              Filtros por cidade e estado
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-dashed bg-background/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Motoristas ({drivers.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <p className="text-muted-foreground">
              Gestão completa dos cadastros, documentos, status (ativo, pendente, bloqueado) e repasses.
            </p>
            <Badge variant="outline" className="badge-pill text-[11px]">
              Status: ativo, pendente, bloqueado
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-dashed bg-background/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Administradores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <p className="text-muted-foreground">
              Controle de acessos internos, permissões por módulo e cidades liberadas para cada admin.
            </p>
            <Badge variant="outline" className="badge-pill text-[11px]">
              Permissões por módulo
            </Badge>
          </CardContent>
        </Card>
      </section>

      <div className="rounded-md border p-4">
        <h3 className="mb-4 text-sm font-medium">Lista de Usuários Recentes</h3>
        <div className="space-y-2">
          {users?.slice(0, 5).map(user => (
            <div key={user.id} className="flex justify-between border-b pb-2 text-xs">
              <div>
                <p className="font-semibold">{user.full_name}</p>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <div className="text-right">
                <Badge variant={user.user_type === 'driver' ? 'default' : 'secondary'}>
                  {user.user_type}
                </Badge>
                <p className="mt-1 text-muted-foreground">{user.city_id ? `City ID: ${user.city_id}` : 'Sem cidade'}</p>
              </div>
            </div>
          ))}
          {users?.length === 0 && <p className="text-xs text-muted-foreground">Nenhum usuário encontrado.</p>}
        </div>
      </div>
    </div>
  );
};

export default UsuariosPage;
