import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { Save, User, Phone, Lock } from "lucide-react";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
    const { user, token, login } = useAuth();
    const u = user as any;
    const [formData, setFormData] = useState({
        full_name: u?.full_name || "",
        phone: u?.phone || "",
        password: "",
        confirmPassword: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (formData.password && formData.password !== formData.confirmPassword) {
            toast.error("As senhas não coincidem");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("/api/auth/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    full_name: formData.full_name,
                    phone: formData.phone,
                    password: formData.password || undefined,
                }),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                // Update local auth state
                if (user && token) {
                    login(token, { ...user, ...updatedUser });
                }
                toast.success("Perfil atualizado com sucesso!");
                onClose();
            } else {
                const error = await response.json();
                toast.error(error.error || "Erro ao atualizar perfil");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Erro de conexão ao atualizar perfil");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-[#008069]" />
                        Editar Perfil
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="full_name">Nome Completo</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="full_name"
                                className="pl-9"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="phone"
                                className="pl-9"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-2 border-t mt-4">
                        <p className="text-xs font-medium text-muted-foreground mb-3">Alterar Senha (opcional)</p>
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <Label htmlFor="password">Nova Senha</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        className="pl-9"
                                        placeholder="Deixe em branco para manter a atual"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        className="pl-9"
                                        placeholder="Confirme a nova senha"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button className="bg-[#008069] hover:bg-[#006654]" onClick={handleSave} disabled={isLoading}>
                        {isLoading ? "Salvando..." : <><Save className="h-4 w-4 mr-2" /> Salvar Alterações</>}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
