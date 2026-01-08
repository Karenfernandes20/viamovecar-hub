
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface PlanStatus {
    plan: {
        name: string;
        features: {
            campaigns: boolean;
            schedules: boolean;
            internal_chat: boolean;
            sub_accounts: boolean;
        };
    };
    usage: {
        users: { current: number; max: number };
        ai_agents: { current: number; max: number };
        automations: { current: number; max: number };
        messages: { current: number; max: number; period: string };
    };
    overdue: boolean;
    due_date: string | null;
}

export function useSubscriptionBanner() {
    const { user } = useAuth();
    const [status, setStatus] = useState<PlanStatus | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.company_id) {
            setLoading(false);
            return;
        }

        const fetchSub = async () => {
            try {
                const res = await fetch('/api/subscription', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setStatus(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSub();
    }, [user?.company_id]);

    return { status, loading };
}
