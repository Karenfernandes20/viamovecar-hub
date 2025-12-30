import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { User, Lock, Loader2, X } from "lucide-react";

const SuperAdminLoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            let data: any = {};
            try {
                const text = await res.text();
                data = text ? JSON.parse(text) : {};
            } catch {
                data = {};
            }

            if (!res.ok) {
                if (res.status === 401) {
                    throw new Error(data.error || "E-mail ou senha incorretos.");
                }
                throw new Error(data.error || "Falha no login. Tente novamente em alguns instantes.");
            }

            if (!data.token || !data.user) {
                throw new Error("Resposta inesperada do servidor. Tente novamente.");
            }

            // Check if user is actually SuperAdmin
            if (data.user.role !== 'SUPERADMIN') {
                throw new Error("Acesso negado. Esta área é restrita para SuperAdmins.");
            }

            login(data.token, data.user);
            navigate("/app/empresas");
        } catch (err: any) {
            setError(err.message || "Erro ao tentar entrar. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 relative">
            <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 hover:bg-zinc-800 rounded-full text-zinc-400"
                onClick={() => navigate("/")}
                title="Voltar ao início"
            >
                <X className="h-6 w-6" />
            </Button>
            <Card className="w-full max-w-md border-amber-500/30 bg-zinc-900/50 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4 pt-6">
                    <img src="/logo-integrai.jpg" alt="Logo Integrai" className="h-20 w-20 rounded-2xl shadow-lg border-2 border-amber-500/20 bg-white p-1" />
                    <CardHeader className="text-center p-0">
                        <CardTitle className="text-2xl text-amber-500 font-bold tracking-wide">SuperAdmin Integrai</CardTitle>
                        <CardDescription className="text-amber-500/60">Acesso restrito administrativo</CardDescription>
                    </CardHeader>
                </div>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-amber-500" />
                                <Input
                                    className="pl-9 bg-zinc-950 border-amber-500/20 text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-amber-500 focus-visible:border-amber-500"
                                    type="email"
                                    placeholder="Email administrativo"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-amber-500" />
                                <Input
                                    className="pl-9 bg-zinc-950 border-amber-500/20 text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-amber-500 focus-visible:border-amber-500"
                                    type="password"
                                    placeholder="Senha"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        {error && <div className="text-sm text-red-500 text-center bg-red-500/10 p-2 rounded border border-red-500/20">{error}</div>}
                        <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white border-none font-semibold transition-colors" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Acessar Painel"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default SuperAdminLoginPage;
