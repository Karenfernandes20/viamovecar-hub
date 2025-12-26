import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { QrCode as QrIcon, RefreshCcw } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const QrCodePage = () => {
  const { token } = useAuth();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [debugData, setDebugData] = useState<any>(null);
  const [instanceName, setInstanceName] = useState<string>("Carregando...");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQrCode = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/evolution/qrcode", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const body = await response.text().catch(() => "");
        throw new Error(body || `Erro ${response.status} ao buscar QR Code`);
      }

      const text = await response.text();
      const isHtmlResponse = /^;?\s*<!doctype/i.test(text) || /^;?\s*<html/i.test(text);
      if (isHtmlResponse) {
        throw new Error(
          "Resposta do servidor não é JSON (HTML). Verifique se o serviço backend está respondendo corretamente."
        );
      }

      const data = JSON.parse(text);
      setQrCode(data.qrcode || null);
      setDebugData(data.raw || data);
      if (data.instance) setInstanceName(data.instance);

    } catch (err: any) {
      setError(err?.message || "Erro ao buscar QR Code");
      setQrCode(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      if (!confirm(`Tem certeza que deseja desconectar o WhatsApp da instância ${instanceName}?`)) return;

      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/evolution/disconnect", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const body = await response.text().catch(() => "");
        throw new Error(body || `Erro ${response.status} ao desconectar`);
      }

      setQrCode(null);
      setDebugData(null);
      fetchQrCode();

    } catch (err: any) {
      setError(err?.message || "Erro ao desconectar");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchQrCode();
      const interval = setInterval(() => {
        fetchQrCode();
      }, 5000); // Polling slower (5s) to avoid spamming
      return () => clearInterval(interval);
    }
  }, [token]);

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Conexão da Instância: {instanceName}</h2>
          <p className="text-xs text-muted-foreground">
            Use este QR Code para conectar a instância <strong>{instanceName}</strong> ao WhatsApp.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="inline-flex items-center gap-1.5 text-[11px]"
          onClick={fetchQrCode}
          disabled={isLoading}
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          {isLoading ? "Gerando QR..." : "Gerar QR Code"}
        </Button>
      </header>

      <section className="grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
        <Card className="border-dashed bg-background/70">
          <CardHeader className="pb-2 flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-sm">QR Code: {instanceName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-dashed bg-muted/40 p-4">
              {isLoading && (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <QrIcon className="h-10 w-10 animate-pulse" />
                  <p className="max-w-xs text-center text-[11px]">
                    Gerando QR Code com a Evolution API. Aguarde...
                  </p>
                </div>
              )}

              {!isLoading && error && (
                <div className="flex flex-col items-center gap-2 text-red-500">
                  <p className="text-[11px] font-medium">Erro ao carregar QR Code</p>
                  <p className="max-w-xs text-center text-[11px] text-muted-foreground">
                    {error}
                  </p>
                </div>
              )}

              {!isLoading && !error && qrCode && (
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={qrCode}
                    alt="QR Code"
                    className="w-full max-w-[260px] rounded-lg border bg-white p-2"
                  />
                  <p className="max-w-xs text-center text-[11px] text-muted-foreground">
                    Aponte a câmera do WhatsApp para este código para conectar a instância <strong>{instanceName}</strong>.
                  </p>
                </div>
              )}

              {!isLoading && !error && !qrCode && debugData?.instance?.state === 'open' && (
                <div className="flex flex-col items-center gap-2 text-green-600">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <QrIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="font-semibold text-sm">WhatsApp Conectado!</p>
                  <p className="max-w-xs text-center text-[11px] text-muted-foreground">
                    A instância <strong>{debugData.instance.instanceName}</strong> já está ativa.
                  </p>
                  <Button
                    onClick={handleDisconnect}
                    variant="destructive"
                    size="sm"
                    className="mt-2 text-xs"
                    disabled={isLoading}
                  >
                    Desconectar
                  </Button>
                </div>
              )}

              {!isLoading && !error && !qrCode && debugData?.instance?.state !== 'open' && (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <QrIcon className="h-10 w-10" />
                  <p className="max-w-xs text-center text-[11px]">
                    Nenhum QR Code disponível (Status: {debugData?.instance?.state || 'Desconhecido'}).
                    Tente gerar novamente.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed bg-background/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Sobre essa conexão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <p className="text-muted-foreground">
              Esta página conecta seu usuário à instância da Evolution API definida para sua empresa (ou instância global se for SuperAdmin).
            </p>
            <ul className="list-disc space-y-1 pl-4 text-[11px] text-muted-foreground">
              <li>Instância Atual: <span className="font-medium">{instanceName}</span></li>
              <li>As mensagens enviadas por este usuário usarão esta instância.</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default QrCodePage;
