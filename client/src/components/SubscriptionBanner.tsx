
import { AlertTriangle, Stars, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { useSubscriptionBanner } from "../hooks/useSubscriptionBanner";
import { useState } from "react";
import { UpgradeModal } from "./UpgradeModal";

export function SubscriptionBanner() {
    const { status, loading } = useSubscriptionBanner();
    const [showUpgrade, setShowUpgrade] = useState(false);

    if (loading || !status) return null;

    // 1. Verify Plan Name (Must be 'Teste')
    const planName = status.plan?.name;
    const isTestPlan = planName?.toLowerCase() === 'teste';

    if (!isTestPlan) return null;

    // 2. Calculate Days Remaining
    let daysMessage = "";
    if (status.due_date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(status.due_date);
        due.setHours(0, 0, 0, 0);

        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays >= 0) {
            daysMessage = ` (${diffDays} dias restantes)`;
        } else {
            daysMessage = " (Expirado)";
        }
    }

    // 3. Define Content using requested visual style
    const message = `Sua empresa está no plano teste. Faça o upgrade para liberar todos os recursos.${daysMessage}`;

    // Using a soft blue/indigo scheme for "professional and non-invasive"
    // or Amber for Teste/Warning? Prompt says "suaves".
    // "Teste" often implies a trial, so keeping it noticeable but not "Danger" red unless expired.

    return (
        <>
            <div className="w-full px-4 py-2 text-sm font-medium flex items-center justify-between shadow-sm z-30 transition-all bg-indigo-50 border-b border-indigo-100 text-indigo-900">
                <div className="flex items-center gap-2">
                    <Stars className="h-4 w-4 text-indigo-600" />
                    <span>{message}</span>
                </div>
                <Button
                    size="sm"
                    className="h-7 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white border-0 transition-colors shadow-none"
                    onClick={() => {
                        console.log("Analytics: Upgrade Banner Clicked");
                        setShowUpgrade(true);
                    }}
                >
                    Fazer upgrade
                </Button>
            </div>
            <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} />
        </>
    )
}
