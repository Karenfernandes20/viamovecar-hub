import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "../components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../components/ui/dropdown-menu";
import { ScrollArea } from "../components/ui/scroll-area";
import { cn } from "../lib/utils";
import {
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Filter,
  Download,
  Plus,
  Search,
  X,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  PieChart as PieChartIcon,
  Table as TableIcon,
  MoreVertical,
  Pencil,
  Trash2,
  FileText,
  FileDown
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { format, isAfter, isBefore, addDays, startOfDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Transaction {
  id: number;
  description: string;
  amount: number;
  status: "pending" | "paid" | "cancelled";
  type: "payable" | "receivable";
  due_date: string | null;
  issue_date: string | null;
  paid_at: string | null;
  category: string | null;
  city_name?: string | null;
  city_state?: string | null;
}

const CATEGORIES = [
  "Luz", "Internet", "Aluguel", "Combustível", "Manutenção",
  "Impostos", "Salários", "Marketing", "Limpeza", "Outros"
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658", "#8dd1e1", "#a4de65", "#d0ed57"];

const FinanceiroPage = () => {
  // State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("table");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Form State
  const [formData, setFormData] = useState<Partial<Transaction>>({
    description: "",
    amount: 0,
    due_date: format(new Date(), "yyyy-MM-dd"),
    issue_date: format(new Date(), "yyyy-MM-dd"),
    category: "Outros",
    status: "pending",
    type: "payable"
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (categoryFilter !== "all") params.append("category", categoryFilter);
      if (searchTerm) params.append("search", searchTerm);

      const res = await fetch(`/api/financial/payables?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error("Erro ao carregar dados financeiros", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, statusFilter, categoryFilter]);

  const handleSave = async () => {
    if (!formData.description || !formData.amount) {
      alert("Preencha os campos obrigatórios.");
      return;
    }

    try {
      const method = formData.id ? "PUT" : "POST";
      const url = formData.id ? `/api/financial/transactions/${formData.id}` : "/api/financial/transactions";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsDialogOpen(false);
        setFormData({
          description: "",
          amount: 0,
          due_date: format(new Date(), "yyyy-MM-dd"),
          issue_date: format(new Date(), "yyyy-MM-dd"),
          category: "Outros",
          status: "pending",
          type: "payable"
        });
        await fetchData();
      }
    } catch (error) {
      console.error("Erro ao salvar", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta conta?")) return;
    try {
      const res = await fetch(`/api/financial/transactions/${id}`, { method: "DELETE" });
      if (res.ok) await fetchData();
    } catch (error) {
      console.error("Erro ao excluir", error);
    }
  };

  const handleMarkAsPaid = async (id: number) => {
    try {
      const res = await fetch(`/api/financial/transactions/${id}/pay`, { method: "POST" });
      if (res.ok) await fetchData();
    } catch (error) {
      console.error("Erro ao marcar como pago", error);
    }
  };

  // Calculations
  const safeFormat = (dateStr: string | null | undefined, formatStr: string) => {
    if (!dateStr) return "--";
    try {
      const date = parseISO(dateStr);
      if (isNaN(date.getTime())) return "--";
      return format(date, formatStr, { locale: ptBR });
    } catch (e) {
      return "--";
    }
  };

  const isDueToday = (dateStr: string | null | undefined) => {
    if (!dateStr) return false;
    try {
      const date = parseISO(dateStr);
      if (isNaN(date.getTime())) return false;
      const now = startOfDay(new Date());
      return format(date, "yyyy-MM-dd") === format(now, "yyyy-MM-dd");
    } catch (e) {
      return false;
    }
  };

  const isOverdue = (dateStr: string | null | undefined) => {
    if (!dateStr) return false;
    try {
      const date = parseISO(dateStr);
      if (isNaN(date.getTime())) return false;
      const now = startOfDay(new Date());
      return isBefore(date, now) && format(date, "yyyy-MM-dd") !== format(now, "yyyy-MM-dd");
    } catch (e) {
      return false;
    }
  };

  const isNext7Days = (dateStr: string | null | undefined) => {
    if (!dateStr) return false;
    try {
      const date = parseISO(dateStr);
      if (isNaN(date.getTime())) return false;
      const now = startOfDay(new Date());
      const next7 = addDays(now, 7);
      return isAfter(date, now) && isBefore(date, next7);
    } catch (e) {
      return false;
    }
  };

  const stats = useMemo(() => {
    const totalPayableToday = transactions
      .filter(t => t.status !== "paid" && isDueToday(t.due_date))
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const next7DaysTotal = transactions
      .filter(t => t.status !== "paid" && isNext7Days(t.due_date))
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const overdueTotal = transactions
      .filter(t => t.status !== "paid" && isOverdue(t.due_date))
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    return {
      totalToPayToday: totalPayableToday,
      next7Days: next7DaysTotal,
      overdue: overdueTotal,
      count: transactions.length,
      average: transactions.length > 0 ? (transactions.reduce((sum, t) => sum + Number(t.amount || 0), 0) / transactions.length) : 0
    };
  }, [transactions]);

  const filteredData = useMemo(() => {
    if (!Array.isArray(transactions)) return [];
    return transactions.filter(t => {
      const descLower = (t.description || "").toLowerCase();
      const catLower = (t.category || "").toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      return descLower.includes(searchLower) || catLower.includes(searchLower);
    });
  }, [transactions, searchTerm]);

  const totals = useMemo(() => {
    if (!Array.isArray(filteredData)) return { pending: 0, overdue: 0, total: 0 };
    return {
      pending: filteredData.filter(t => t.status === "pending").reduce((sum, t) => sum + Number(t.amount || 0), 0),
      overdue: filteredData.filter(t => t.status !== "paid" && isOverdue(t.due_date)).reduce((sum, t) => sum + Number(t.amount || 0), 0),
      total: filteredData.reduce((sum, t) => sum + Number(t.amount || 0), 0)
    };
  }, [filteredData]);

  // Chart Data
  const lineChartData = useMemo(() => {
    const grouped = filteredData.reduce((acc: any, t) => {
      const date = safeFormat(t.due_date, "dd/MM");
      if (!acc[date]) acc[date] = { date, pendente: 0, pago: 0 };
      if (t.status === "paid") acc[date].pago += Number(t.amount || 0);
      else acc[date].pendente += Number(t.amount || 0);
      return acc;
    }, {});
    return Object.values(grouped).sort((a: any, b: any) => {
      // Safely sort by date if possible
      return a.date.localeCompare(b.date);
    });
  }, [filteredData]);

  const pieChartData = useMemo(() => {
    if (!Array.isArray(transactions)) return [];
    const grouped = filteredData.reduce((acc: any, t) => {
      const cat = t.category || "Outros";
      if (!acc[cat]) acc[cat] = 0;
      acc[cat] += Number(t.amount);
      return acc;
    }, {});
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  // Exports
  const exportCSV = () => {
    const headers = ["Descrição", "Categoria", "Emissão", "Vencimento", "Valor", "Status"];
    const rows = filteredData.map(t => [
      t.description,
      t.category || "",
      t.issue_date ? format(parseISO(t.issue_date), "yyyy-MM-dd") : "",
      t.due_date ? format(parseISO(t.due_date), "yyyy-MM-dd") : "",
      t.amount,
      t.status
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `financeiro_${format(new Date(), "yyyyMMdd")}.csv`);
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Financeiro");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
    saveAs(data, `financeiro_${format(new Date(), "yyyyMMdd")}.xlsx`);
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    const tableColumn = ["Descrição", "Categoria", "Vencimento", "Valor", "Status"];
    const tableRows = filteredData.map(t => [
      t.description,
      t.category || "Sem categoria",
      safeFormat(t.due_date, "dd/MM/yyyy"),
      `R$ ${Number(t.amount || 0).toFixed(2)}`,
      t.status.toUpperCase()
    ]);

    const logoUrl = '/logo-integrai.jpg';
    const img = new Image();
    img.src = logoUrl;

    img.onload = () => {
      // Adicionar Logo
      doc.addImage(img, 'JPEG', 14, 5, 20, 20);

      // Cabeçalho
      doc.setFontSize(16);
      doc.setTextColor(0, 128, 105); // Verde Integrai
      doc.text("INTEGRAI - Soluções Conectadas", 40, 12);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("Relatório de Contas a Pagar & Despesas", 40, 18);
      doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy HH:mm")}`, 40, 23);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [0, 128, 105] }, // Match Integrai Green
        margin: { top: 30 }
      });

      doc.save(`financeiro_${format(new Date(), "yyyyMMdd")}.pdf`);
    };

    img.onerror = () => {
      // Fallback sem logo se falhar
      doc.setFontSize(16);
      doc.text("Relatório de Contas a Pagar", 14, 15);
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20
      });
      doc.save(`financeiro_${format(new Date(), "yyyyMMdd")}.pdf`);
    };
  };

  const getStatusBadge = (t: Transaction) => {
    const now = startOfDay(new Date());
    const dueDate = t.due_date ? parseISO(t.due_date) : null;
    const itemStatus = t.status;

    if (itemStatus === "paid") return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none text-[10px] font-bold">PAGO</Badge>;
    if (dueDate && isBefore(dueDate, now)) return (
      <Badge variant="destructive" className="animate-pulse shadow-sm flex items-center gap-1 text-[10px] font-bold">
        <AlertCircle className="h-2.5 w-2.5" /> VENCIDO
      </Badge>
    );
    return <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none text-[10px] font-bold">PENDENTE</Badge>;
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">

      {/* Header & New Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Contas a Pagar & Despesas</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            Gestão financeira completa com sincronização em tempo real <Badge variant="outline" className="text-[10px] h-5">v2.0 Beta</Badge>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV} className="gap-2 h-9 text-xs font-semibold">
            <FileDown className="h-4 w-4 text-zinc-600" /> CSV
          </Button>
          <Button variant="outline" size="sm" onClick={exportExcel} className="gap-2 h-9 text-xs font-semibold">
            <FileDown className="h-4 w-4 text-emerald-600" /> Excel
          </Button>
          <Button variant="outline" size="sm" onClick={exportPDF} className="gap-2 h-9 text-xs font-semibold">
            <FileText className="h-4 w-4 text-red-600" /> PDF
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2 h-9 text-xs font-bold bg-[#008069] hover:bg-[#006d59] shadow-md">
                <Plus className="h-4 w-4" /> INCLUIR CONTA
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{formData.id ? "Editar Conta" : "Cadastrar Nova Conta"}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Fornecedor / Descrição</label>
                  <Input
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Vivo Empresas, Aluguel Sede..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Valor (R$)</label>
                    <Input
                      type="number"
                      value={formData.amount}
                      onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Categoria</label>
                    <Select value={formData.category || "Outros"} onValueChange={v => setFormData({ ...formData, category: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Emissão</label>
                    <Input
                      type="date"
                      value={formData.issue_date && typeof formData.issue_date === 'string' ? formData.issue_date.split('T')[0] : ""}
                      onChange={e => setFormData({ ...formData, issue_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Vencimento</label>
                    <Input
                      type="date"
                      value={formData.due_date && typeof formData.due_date === 'string' ? formData.due_date.split('T')[0] : ""}
                      onChange={e => setFormData({ ...formData, due_date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Status Inicial</label>
                  <Select value={formData.status} onValueChange={(v: any) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="paid">Pago</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleSave} className="bg-[#008069] hover:bg-[#006d59]">Salvar Lançamento</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* DASHBOARD CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-none shadow-sm bg-background">
          <CardHeader className="pb-2 space-y-0 px-4 pt-4">
            <CardDescription className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3 text-blue-500" /> A Pagar (Hoje)
            </CardDescription>
            <CardTitle className="text-xl font-extrabold text-[#008069]">
              R$ {stats.totalToPayToday.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-[10px] text-muted-foreground">Prioridade máxima</div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-background">
          <CardHeader className="pb-2 space-y-0 px-4 pt-4">
            <CardDescription className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3 text-indigo-500" /> Próximos 7 dias
            </CardDescription>
            <CardTitle className="text-xl font-extrabold">
              R$ {stats.next7Days.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-[10px] text-muted-foreground">Previsão semanal</div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-red-50 dark:bg-red-950/20">
          <CardHeader className="pb-2 space-y-0 px-4 pt-4">
            <CardDescription className="text-[10px] font-bold uppercase tracking-wider text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3 animate-bounce" /> Total Vencido
            </CardDescription>
            <CardTitle className="text-xl font-extrabold text-red-600">
              R$ {stats.overdue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-[10px] text-red-600/70 font-semibold px-2 bg-red-100 dark:bg-red-900/30 rounded inline-block">ATENÇÃO</div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-background">
          <CardHeader className="pb-2 space-y-0 px-4 pt-4">
            <CardDescription className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Quantidade</CardDescription>
            <CardTitle className="text-xl font-extrabold">{stats.count}</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-[10px] text-muted-foreground">Títulos registrados</div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-background">
          <CardHeader className="pb-2 space-y-0 px-4 pt-4">
            <CardDescription className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Média Mensal</CardDescription>
            <CardTitle className="text-xl font-extrabold">
              R$ {stats.average.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-[10px] text-muted-foreground">Baseado nos filtros</div>
          </CardContent>
        </Card>
      </div>

      {/* FILTERS AREA */}
      <Card className="border-none shadow-sm bg-zinc-50 dark:bg-zinc-900/50">
        <CardContent className="p-4 flex flex-wrap items-end gap-4">
          <div className="space-y-1.5 flex-none w-[180px]">
            <label className="text-[10px] font-bold uppercase text-muted-foreground">Busca rápida</label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Fornecedor / Categoria"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8 h-9 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5 flex-none w-[130px]">
            <label className="text-[10px] font-bold uppercase text-muted-foreground">Início</label>
            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="h-9 text-xs" />
          </div>

          <div className="space-y-1.5 flex-none w-[130px]">
            <label className="text-[10px] font-bold uppercase text-muted-foreground">Fim</label>
            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="h-9 text-xs" />
          </div>

          <div className="space-y-1.5 flex-none w-[120px]">
            <label className="text-[10px] font-bold uppercase text-muted-foreground">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 text-xs font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="paid">Pagos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 flex-none w-[150px]">
            <label className="text-[10px] font-bold uppercase text-muted-foreground">Categoria</label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-9 text-xs font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setStartDate(""); setEndDate(""); setStatusFilter("all"); setCategoryFilter("all"); setSearchTerm(""); }}
            className="h-9 text-xs font-semibold text-muted-foreground hover:text-red-500"
          >
            <X className="h-4 w-4 mr-1" /> Limpar filtros
          </Button>

          <div className="flex-1"></div>

          <div className="bg-white dark:bg-zinc-800 p-1 rounded-lg border flex items-center gap-1 shrink-0">
            <Button
              variant={activeTab === 'table' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 text-[10px] font-bold uppercase px-3"
              onClick={() => setActiveTab('table')}
            >
              <TableIcon className="h-3 w-3 mr-1.5" /> Tabela
            </Button>
            <Button
              variant={activeTab === 'charts' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 text-[10px] font-bold uppercase px-3"
              onClick={() => setActiveTab('charts')}
            >
              <TrendingUp className="h-3 w-3 mr-1.5" /> Gráficos
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* MAIN CONTENT AREA */}
      <Tabs value={activeTab} className="w-full">
        <TabsContent value="table" className="mt-0 border-none">
          <div className="rounded-xl border shadow-sm bg-background overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[300px] text-xs font-bold uppercase">Fornecedor / Descrição</TableHead>
                  <TableHead className="text-xs font-bold uppercase">Categoria</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-center">Emissão</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-center">Vencimento</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-right">Valor</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-center">Status</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-center w-[120px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">Carregando dados financeiros...</TableCell>
                  </TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">Nenhum registro encontrado para os filtros selecionados.</TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((t) => (
                    <TableRow key={t.id} className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 group" onClick={() => { setSelectedTransaction(t); setIsSheetOpen(true); }}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={cn("p-2 rounded-lg", t.status === 'paid' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600")}>
                            <DollarSign className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm">{t.description}</span>
                            <span className="text-[10px] text-muted-foreground">ID: {t.id}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] font-medium border-zinc-200 dark:border-zinc-800">{t.category || "Outros"}</Badge>
                      </TableCell>
                      <TableCell className="text-center font-mono text-[11px] font-medium">
                        {safeFormat(t.issue_date, "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell className="text-center font-mono text-[11px] font-bold">
                        {safeFormat(t.due_date, "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell className="text-right font-bold text-sm">
                        R$ {Number(t.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(t)}
                      </TableCell>
                      <TableCell className="text-center" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {t.status !== 'paid' && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                              onClick={() => handleMarkAsPaid(t.id)}
                              title="Marcar como pago"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => { setFormData(t); setIsDialogOpen(true); }}
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(t.id)}
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild className="group-hover:hidden">
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleMarkAsPaid(t.id)}>Marcar como pago</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setFormData(t); setIsDialogOpen(true); }}>Editar</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(t.id)} className="text-red-600">Excluir</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              <TableFooter className="bg-zinc-50 dark:bg-zinc-900 border-t">
                <TableRow>
                  <TableCell colSpan={4} className="text-xs font-bold py-4">
                    <div className="flex gap-4">
                      <span className="text-amber-600">Pendentes: R$ {totals.pending.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                      <span className="text-red-600">Vencidos: R$ {totals.overdue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-base font-extrabold" colSpan={2}>
                    TOTAL GERAL: R$ {totals.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm h-[400px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center justify-between">
                  Tendência de Pagamentos
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                </CardTitle>
                <CardDescription>Fluxo de caixa previsto por data de vencimento</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `R$ ${v}`} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      formatter={(value: any) => `R$ ${value.toLocaleString("pt-BR")}`}
                    />
                    <Legend iconType="circle" />
                    <Line type="monotone" dataKey="pendente" stroke="#FFBB28" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="pago" stroke="#00C49F" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm h-[400px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center justify-between">
                  Distribuição por Categoria
                  <PieChartIcon className="h-4 w-4 text-blue-500" />
                </CardTitle>
                <CardDescription>Concentração de despesas por tipo</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => `R$ ${value.toLocaleString("pt-BR")}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* DETAIL SHEET */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-[#008069]">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <SheetTitle className="text-lg leading-none">Detalhes do Lançamento</SheetTitle>
                <SheetDescription className="text-xs">Visualização detalhada da transação bancária</SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {selectedTransaction && (
            <ScrollArea className="h-[calc(100vh-150px)] pr-4">
              <div className="space-y-6 pb-10">
                <section className="space-y-3">
                  <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground border-b pb-1">Identificação</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase">Fornecedor</p>
                      <p className="text-sm font-bold">{selectedTransaction.description}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase">ID Interno</p>
                      <p className="text-sm font-bold">#{selectedTransaction.id}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase">Categoria</p>
                      <Badge variant="outline" className="font-bold">{selectedTransaction.category || "Outros"}</Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase">Status Atual</p>
                      {getStatusBadge(selectedTransaction)}
                    </div>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground border-b pb-1">Valores e Datas</h3>
                  <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    <p className="text-[10px] text-muted-foreground uppercase mb-1">Montante do Título</p>
                    <p className="text-3xl font-black text-[#008069]">R$ {Number(selectedTransaction.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase">Emissão</p>
                      <p className="text-sm font-semibold">{safeFormat(selectedTransaction.issue_date, "dd/MM/yyyy")}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase">Vencimento</p>
                      <p className="text-sm font-extrabold text-red-500">{safeFormat(selectedTransaction.due_date, "dd/MM/yyyy")}</p>
                    </div>
                    {selectedTransaction.paid_at && (
                      <div className="space-y-1 col-span-2">
                        <p className="text-[10px] text-muted-foreground uppercase">Pagamento Realizado em</p>
                        <p className="text-sm font-semibold flex items-center gap-2 text-emerald-600">
                          <CheckCircle2 className="h-4 w-4" /> {safeFormat(selectedTransaction.paid_at, "dd/MM/yyyy 'às' HH:mm")}
                        </p>
                      </div>
                    )}
                  </div>
                </section>

                <section className="space-y-2">
                  <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground border-b pb-1">Notas Internas</h3>
                  <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg flex items-start gap-2">
                    <FileText className="h-4 w-4 shrink-0" />
                    <p>Este lançamento é fixo e recorrente. Todas as alterações refletem no fluxo de caixa projetado.</p>
                  </div>
                </section>

                <div className="pt-6 grid grid-cols-2 gap-3">
                  <Button className="w-full gap-2 h-10 font-bold" onClick={() => { setFormData(selectedTransaction); setIsDialogOpen(true); setIsSheetOpen(false); }}>
                    <Pencil className="h-4 w-4" /> EDITAR
                  </Button>
                  {selectedTransaction.status !== 'paid' ? (
                    <Button className="w-full gap-2 h-10 font-bold bg-emerald-600 hover:bg-emerald-700" onClick={() => handleMarkAsPaid(selectedTransaction.id)}>
                      <CheckCircle2 className="h-4 w-4" /> PAGAR AGORA
                    </Button>
                  ) : (
                    <Button className="w-full gap-2 h-10 font-bold" variant="outline" onClick={() => alert("Comprovante em desenvolvimento")}>
                      <FileDown className="h-4 w-4" /> RECIBO
                    </Button>
                  )}
                  <Button className="w-full gap-2 h-10 font-bold col-span-2" variant="destructive" onClick={() => { handleDelete(selectedTransaction.id); setIsSheetOpen(false); }}>
                    <Trash2 className="h-4 w-4" /> EXCLUIR REGISTRO
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>

    </div>
  );
};

export default FinanceiroPage;
