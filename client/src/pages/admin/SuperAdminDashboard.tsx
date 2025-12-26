import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Plus, Trash2, Edit, Shield, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "../../components/ui/badge";

interface UserData {
    id: number;
    full_name: string;
    email: string;
    role: "SUPERADMIN" | "ADMIN" | "USUARIO";
    email_validated: boolean;
    is_active: boolean;
    created_at: string;
}

const SuperAdminDashboard = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Erro ao buscar usuários", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Tem certeza que deseja remover este usuário?")) return;
        try {
            await fetch(`/api/users/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchUsers();
        } catch (error) {
            console.error("Erro ao deletar", error);
        }
    };

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Painel SuperAdmin</h1>
                <p className="text-muted-foreground">Gerenciamento completo da plataforma e usuários.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Usuários</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.length}</div>
                    </CardContent>
                </Card>
                {/* Adicione mais kpis aqui */}
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Usuários</CardTitle>
                        <CardDescription>Lista de todos os usuários registrados no sistema e seus privilégios.</CardDescription>
                    </div>
                    <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Novo Usuário</Button>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div>Carregando...</div>
                    ) : (
                        <div className="rounded-md border">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="p-4 font-medium">Nome</th>
                                        <th className="p-4 font-medium">Email</th>
                                        <th className="p-4 font-medium">Role</th>
                                        <th className="p-4 font-medium">Validado</th>
                                        <th className="p-4 font-medium">Status</th>
                                        <th className="p-4 font-medium text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u) => (
                                        <tr key={u.id} className="border-t hover:bg-muted/50 transition-colors">
                                            <td className="p-4 font-medium">{u.full_name}</td>
                                            <td className="p-4">{u.email}</td>
                                            <td className="p-4">
                                                <Badge variant={u.role === 'SUPERADMIN' ? 'default' : u.role === 'ADMIN' ? 'secondary' : 'outline'}>
                                                    {u.role}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                {u.email_validated ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                                            </td>
                                            <td className="p-4">
                                                {u.is_active ? <span className="text-green-600">Ativo</span> : <span className="text-muted-foreground">Inativo</span>}
                                            </td>
                                            <td className="p-4 text-right space-x-2">
                                                <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(u.id)}><Trash2 className="h-4 w-4" /></Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default SuperAdminDashboard;
