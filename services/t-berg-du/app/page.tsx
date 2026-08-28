'use client';

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';

type View = 'Översikt' | 'Objektregister' | 'Arbetsorder' | 'Tekniker' | 'Felhistorik';
type Asset = { assetId: string; name: string; type: string; location: string; criticality: string; slaHours: number; requiredSkill: string; warrantyActive: boolean; serviceType: string; status: string };
type Technician = { technicianId: string; name: string; skills: string[]; area: string; availableFrom: string; status: string };
type WorkOrder = { workOrderId: string; assetId: string; title: string; description: string; priority: string; technicianId?: string; technicianName?: string; status: string; createdAt: string };
type HistoryEntry = { historyId: string; assetId: string; date: string; errorCode?: string; symptom: string; action: string; downtimeHours: number };
type AccessSession = { workspaceId: string; createdAt: string; expiresAt: string; requestsUsed: number; requestLimit: number; requestsRemaining: number; workOrderLimit: number };
type IssuedAccess = AccessSession & { key: string };
type RuntimeConfig = { apiBase: string; turnstileSiteKey: string };

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: Record<string, unknown>) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId?: string) => void;
    };
  }
}

const views: View[] = ['Översikt', 'Objektregister', 'Arbetsorder', 'Tekniker', 'Felhistorik'];

function apiError(body: unknown, fallback: string) {
  return typeof body === 'object' && body !== null && 'error' in body && typeof body.error === 'string' ? body.error : fallback;
}

function statusTone(status: string) {
  if (status === 'Pågår' || status === 'Tillsyn') return 'bg-amber-50 text-amber-800 ring-amber-200';
  if (status === 'Planerad' || status === 'Service') return 'bg-sky-50 text-sky-800 ring-sky-200';
  if (status === 'Tillgänglig' || status === 'Drift') return 'bg-emerald-50 text-emerald-800 ring-emerald-200';
  return 'bg-zinc-100 text-zinc-700 ring-zinc-200';
}

function Pill({ children, tone }: { children: React.ReactNode; tone?: string }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${tone || 'bg-zinc-100 text-zinc-700 ring-zinc-200'}`}>{children}</span>;
}

export default function Home() {
  const [runtimeConfig, setRuntimeConfig] = useState<RuntimeConfig | null>(null);
  const [view, setView] = useState<View>('Översikt');
  const [apiKey, setApiKey] = useState('');
  const [access, setAccess] = useState<AccessSession | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    void fetch('/api/runtime-config', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Konfigurationen kunde inte hämtas.');
        setRuntimeConfig(await response.json() as RuntimeConfig);
      })
      .catch((problem) => setError(problem instanceof Error ? problem.message : 'Konfigurationen kunde inte hämtas.'));
  }, []);

  const apiBase = runtimeConfig?.apiBase || '';

  useEffect(() => {
    if (!apiBase) return;
    const timer = window.setTimeout(() => {
      const storedKey = window.localStorage.getItem('tberg-access-key');
      if (!storedKey) { setCheckingAccess(false); return; }
      void fetch(`${apiBase}/access/session`, { headers: { 'x-workshop-key': storedKey } })
        .then(async (response) => {
          if (!response.ok) throw new Error('Nyckeln har löpt ut.');
          const session = await response.json() as AccessSession;
          setApiKey(storedKey);
          setAccess(session);
        })
        .catch(() => window.localStorage.removeItem('tberg-access-key'))
        .finally(() => setCheckingAccess(false));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [apiBase]);

  const request = useCallback(async <T,>(path: string, init?: RequestInit): Promise<T> => {
    const response = await fetch(`${apiBase}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', 'x-workshop-key': apiKey, ...(init?.headers || {}) },
    });
    const body = await response.json();
    if (response.status === 401 || response.status === 429) {
      window.localStorage.removeItem('tberg-access-key');
      setApiKey('');
      setAccess(null);
    }
    if (!response.ok) throw new Error(apiError(body, 'Anropet misslyckades.'));
    return body as T;
  }, [apiBase, apiKey]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [assetData, technicianData, orderData] = await Promise.all([
        request<{ items: Asset[] }>('/api/assets'), request<{ items: Technician[] }>('/api/technicians'), request<{ items: WorkOrder[] }>('/api/work-orders'),
      ]);
      setAssets(assetData.items);
      setTechnicians(technicianData.items);
      setOrders(orderData.items);
      const historyResponses = await Promise.all(assetData.items.map((asset) => request<{ items: HistoryEntry[] }>(`/api/assets/${asset.assetId}/history`)));
      setHistory(historyResponses.flatMap((item) => item.items));
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : 'Kunde inte ansluta till API:t.');
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    if (!apiKey) return;
    const timer = window.setTimeout(() => void loadData(), 0);
    return () => window.clearTimeout(timer);
  }, [apiKey, loadData]);

  const openOrders = orders.filter((order) => order.status !== 'Avslutad');
  const availableTechnicians = technicians.filter((technician) => technician.status === 'Tillgänglig');
  const selectedHistory = selectedAsset ? history.filter((item) => item.assetId === selectedAsset.assetId) : [];
  const dateLabel = useMemo(() => new Intl.DateTimeFormat('sv-SE', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date()), []);

  async function createOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      await request<WorkOrder>('/api/work-orders', {
        method: 'POST',
        body: JSON.stringify({
          assetId: data.get('assetId'), title: data.get('title'), description: data.get('description'),
          priority: data.get('priority'), technicianId: data.get('technicianId') || undefined,
        }),
      });
      setShowForm(false);
      await loadData();
      setView('Arbetsorder');
    } catch (problem) { setError(problem instanceof Error ? problem.message : 'Arbetsordern kunde inte skapas.'); }
  }

  async function resetWorkspace() {
    await request<{ workOrders: WorkOrder[] }>('/api/reset', { method: 'POST', body: '{}' });
    await loadData();
  }

  function activateAccess(key: string, session: AccessSession) {
    window.localStorage.setItem('tberg-access-key', key);
    setApiKey(key);
    setAccess(session);
    setError('');
  }

  function disconnect() {
    window.localStorage.removeItem('tberg-access-key');
    setApiKey('');
    setAccess(null);
    setAssets([]);
    setOrders([]);
    setHistory([]);
  }

  if (!runtimeConfig || checkingAccess) return <LoadingScreen />;
  if (!apiKey || !access) return <AccessGate apiBase={apiBase} turnstileSiteKey={runtimeConfig.turnstileSiteKey} onAccess={activateAccess} />;

  const workspace = access.workspaceId;

  return (
    <main className="min-h-screen bg-[#f4f5f2] text-[#17211b]">
      <header className="border-b border-black/10 bg-[#173f31] text-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#d6ff54] text-lg font-black text-[#173f31]">T</div>
            <div><p className="text-lg font-bold tracking-tight">T-Berg D&amp;U</p><p className="text-xs text-white/60">Drift &amp; underhåll</p></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70 sm:block">Arbetsyta <span className="ml-1 font-mono font-semibold text-white">{workspace}</span></div>
            <div className="hidden rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70 md:block">Nyckeln gäller <span className="ml-1 font-mono font-semibold text-[#d6ff54]"><AccessCountdown expiresAt={access.expiresAt} /></span></div>
            <button onClick={() => void navigator.clipboard.writeText(apiKey)} className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-white/15">Kopiera nyckel</button>
            <button onClick={() => void resetWorkspace()} className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-white/15">Återställ</button>
            <button onClick={disconnect} className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-white/15">Avsluta</button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden min-h-[calc(100vh-77px)] border-r border-black/10 bg-white px-4 py-6 lg:block">
          <nav aria-label="Huvudnavigering" className="space-y-1 text-sm">
            {views.map((item) => (
              <button key={item} onClick={() => setView(item)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left ${view === item ? 'bg-[#e8f2eb] font-semibold text-[#173f31]' : 'text-zinc-600 hover:bg-zinc-50'}`}>
                <span className={`h-2 w-2 rounded-full ${view === item ? 'bg-[#2d7b58]' : 'border border-zinc-400'}`} /> {item}
              </button>
            ))}
          </nav>
          <div className="mt-10 rounded-2xl bg-[#173f31] p-4 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#d6ff54]">Systemstatus</p>
            <p className="mt-3 text-sm font-semibold">{error ? 'Anslutningsproblem' : 'Alla tjänster fungerar'}</p>
            <p className="mt-1 text-xs leading-5 text-white/60">REST-API och tre MCP-verktyg är aktiva.</p>
          </div>
        </aside>

        <section className="min-w-0 px-5 py-7 lg:px-8 lg:py-9">
          <div className="mb-5 flex gap-2 overflow-x-auto lg:hidden">
            {views.map((item) => <button key={item} onClick={() => setView(item)} className={`whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold ${view === item ? 'bg-[#173f31] text-white' : 'bg-white text-zinc-600'}`}>{item}</button>)}
          </div>

          {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error} Kontrollera anslutningen till API-tjänsten.</div>}

          {view === 'Översikt' && (
            <>
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2d7b58]">{dateLabel}</p><h1 className="mt-1 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">Driftöversikt</h1><p className="mt-2 text-sm text-zinc-600">Aktuellt läge i arbetsyta {workspace}.</p></div>
                <button onClick={() => setShowForm(true)} className="rounded-xl bg-[#173f31] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#20513f]">+ Ny arbetsorder</button>
              </div>
              <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[[assets.length, 'Objekt i registret', `${assets.filter((a) => ['Hög', 'Kritisk'].includes(a.criticality)).length} med hög kritikalitet`], [openOrders.length, 'Öppna arbetsorder', `${orders.filter((o) => o.priority === 'P1').length} med prioritet P1`], [availableTechnicians.length, 'Tillgängliga tekniker', technicians[0] ? `Nästa tid ${new Date(technicians[0].availableFrom).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}` : 'Ingen tid'], ['96%', 'Tillgänglighet', 'Senaste 30 dagarna']].map(([value, label, note]) => (
                  <article key={String(label)} className="rounded-2xl border border-black/10 bg-white p-5"><p className="text-3xl font-bold tracking-tight">{value}</p><p className="mt-1 text-sm font-semibold">{label}</p><p className="mt-3 text-xs text-zinc-500">{note}</p></article>
                ))}
              </div>
              <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
                <AssetTable assets={assets.slice(0, 5)} onSelect={setSelectedAsset} />
                <OrderList orders={orders.slice(0, 3)} />
              </div>
            </>
          )}

          {view === 'Objektregister' && <Section title="Objektregister" subtitle="Auktoritativ masterdata som custom connectorn hämtar."><AssetTable assets={assets} onSelect={setSelectedAsset} /></Section>}
          {view === 'Arbetsorder' && <Section title="Arbetsorder" subtitle={`Isolerade poster för ${workspace}.`} action={<button onClick={() => setShowForm(true)} className="rounded-xl bg-[#173f31] px-4 py-2.5 text-sm font-semibold text-white">+ Ny arbetsorder</button>}><OrderTable orders={orders} /></Section>}
          {view === 'Tekniker' && <Section title="Tekniker" subtitle="Kompetenser och tillgänglighet som MCP:n kan söka."><TechnicianGrid technicians={technicians} /></Section>}
          {view === 'Felhistorik' && <Section title="Felhistorik" subtitle="Tidigare fel och åtgärder som MCP:n hämtar vid behov."><HistoryTable history={history} assets={assets} /></Section>}

          {loading && <div className="fixed bottom-5 right-5 rounded-full bg-[#173f31] px-4 py-2 text-xs font-semibold text-white shadow-lg">Hämtar data…</div>}
        </section>
      </div>

      {selectedAsset && <AssetDrawer asset={selectedAsset} history={selectedHistory} onClose={() => setSelectedAsset(null)} />}
      {showForm && <WorkOrderModal assets={assets} technicians={technicians} onClose={() => setShowForm(false)} onSubmit={createOrder} />}
    </main>
  );
}

function LoadingScreen() {
  return <main className="grid min-h-screen place-items-center bg-[#f4f5f2] text-[#17211b]"><div className="text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#d6ff54] text-xl font-black text-[#173f31]">T</div><p className="mt-4 text-sm font-semibold">Kontrollerar testmiljön…</p></div></main>;
}

function AccessCountdown({ expiresAt }: { expiresAt: string }) {
  const calculate = useCallback(() => Math.max(0, Date.parse(expiresAt) - Date.now()), [expiresAt]);
  const [remaining, setRemaining] = useState(calculate);

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(calculate()), 1_000);
    return () => window.clearInterval(timer);
  }, [calculate]);

  const totalSeconds = Math.floor(remaining / 1_000);
  const hours = Math.floor(totalSeconds / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;
  if (remaining <= 0) return <>har gått ut</>;
  return <>{String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</>;
}

function AccessGate({ apiBase, turnstileSiteKey, onAccess }: { apiBase: string; turnstileSiteKey: string; onAccess: (key: string, session: AccessSession) => void }) {
  const [turnstileToken, setTurnstileToken] = useState(turnstileSiteKey ? '' : 'tberg-local-turnstile');
  const [issued, setIssued] = useState<IssuedAccess | null>(null);
  const [existingKey, setExistingKey] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const widgetElement = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    if (!turnstileSiteKey) return;
    let poll: number | undefined;
    const renderWidget = () => {
      if (!window.turnstile || !widgetElement.current || widgetId.current) return false;
      widgetId.current = window.turnstile.render(widgetElement.current, {
        sitekey: turnstileSiteKey,
        action: 'issue-test-key',
        theme: 'light',
        callback: (token: string) => setTurnstileToken(token),
        'expired-callback': () => setTurnstileToken(''),
        'error-callback': () => setError('Verifieringen kunde inte laddas. Försök igen.'),
      });
      return true;
    };

    const existing = document.getElementById('tberg-turnstile-script') as HTMLScriptElement | null;
    if (existing) {
      if (!renderWidget()) poll = window.setInterval(() => { if (renderWidget() && poll) window.clearInterval(poll); }, 100);
    } else {
      const script = document.createElement('script');
      script.id = 'tberg-turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = renderWidget;
      document.head.appendChild(script);
    }

    return () => {
      if (poll) window.clearInterval(poll);
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [turnstileSiteKey]);

  async function createKey() {
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`${apiBase}/access/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ turnstileToken }),
      });
      const body = await response.json() as unknown;
      if (!response.ok) throw new Error(apiError(body, 'Testnyckeln kunde inte skapas.'));
      setIssued(body as IssuedAccess);
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : 'Testnyckeln kunde inte skapas.');
      if (widgetId.current) window.turnstile?.reset(widgetId.current);
      if (turnstileSiteKey) setTurnstileToken('');
    } finally { setBusy(false); }
  }

  async function useExisting(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const key = existingKey.trim();
      const response = await fetch(`${apiBase}/access/session`, { headers: { 'x-workshop-key': key } });
      const body = await response.json() as unknown;
      if (!response.ok) throw new Error(apiError(body, 'Nyckeln kunde inte verifieras.'));
      onAccess(key, body as AccessSession);
    } catch (problem) { setError(problem instanceof Error ? problem.message : 'Nyckeln kunde inte verifieras.'); }
    finally { setBusy(false); }
  }

  return (
    <main className="min-h-screen bg-[#eef1ed] px-5 py-8 text-[#17211b] sm:py-14">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_24px_80px_rgba(23,63,49,0.12)] lg:grid lg:grid-cols-[0.9fr_1.1fr]">
        <section className="bg-[#173f31] p-8 text-white sm:p-12">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#d6ff54] text-lg font-black text-[#173f31]">T</div>
          <p className="mt-10 text-xs font-bold uppercase tracking-[0.18em] text-[#d6ff54]">T-Berg D&amp;U</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight tracking-[-0.04em]">Din privata testmiljö för drift och underhåll.</h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/70">En testnyckel fungerar i dashboarden, REST-connectorn och MCP-servern. Din arbetsyta isoleras från andra deltagare och rensas automatiskt.</p>
          <div className="mt-10 grid gap-3 text-sm text-white/80">
            {['Gäller i 24 timmar', '500 API- och MCP-anrop', 'Högst 20 arbetsordrar', 'Ingen registrering eller e-post'].map((item) => <div key={item} className="flex items-center gap-3"><span className="grid h-6 w-6 place-items-center rounded-full bg-white/10 text-[#d6ff54]">✓</span>{item}</div>)}
          </div>
        </section>

        <section className="p-8 sm:p-12">
          {issued ? (
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2d7b58]">Testmiljön är klar</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">Kopiera din nyckel</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">Använd samma nyckel i både custom connectorn och MCP-anslutningen. Den visas här så att du enkelt kan spara den.</p>
              <div className="mt-6 rounded-2xl border border-[#b9d6c6] bg-[#f1f8f3] p-4">
                <p className="text-xs font-semibold text-zinc-500">T-Berg-testnyckel</p>
                <code className="mt-2 block break-all text-sm font-bold text-[#173f31]">{issued.key}</code>
                <button onClick={() => void navigator.clipboard.writeText(issued.key)} className="mt-4 rounded-lg bg-white px-3 py-2 text-xs font-bold text-[#173f31] ring-1 ring-[#b9d6c6]">Kopiera nyckeln</button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm"><div className="rounded-xl bg-zinc-50 p-3"><p className="text-xs text-zinc-500">Arbetsyta</p><p className="mt-1 font-mono font-bold">{issued.workspaceId}</p></div><div className="rounded-xl bg-zinc-50 p-3"><p className="text-xs text-zinc-500">Giltig till</p><p className="mt-1 font-bold">{new Date(issued.expiresAt).toLocaleString('sv-SE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p></div></div>
              <button onClick={() => onAccess(issued.key, issued)} className="mt-6 w-full rounded-xl bg-[#173f31] px-4 py-3 text-sm font-bold text-white">Öppna min arbetsyta</button>
            </div>
          ) : (
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2d7b58]">Steg 1 av 1</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">Skapa en testnyckel</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">Verifiera att du är en människa. Ingen användare eller personlig information sparas.</p>
              <div className="mt-7 min-h-16">
                {turnstileSiteKey ? <div ref={widgetElement} /> : <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><p className="font-bold">Lokalt testläge</p><p className="mt-1 text-xs leading-5">Turnstile ersätts lokalt av en säker utvecklingstoken. Riktig verifiering aktiveras med miljövariabler vid publicering.</p></div>}
              </div>
              {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
              <button disabled={busy || !turnstileToken} onClick={() => void createKey()} className="mt-5 w-full rounded-xl bg-[#173f31] px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">{busy ? 'Skapar testmiljö…' : 'Skapa testnyckel'}</button>
              <div className="my-7 flex items-center gap-3 text-xs text-zinc-400"><span className="h-px flex-1 bg-zinc-200" />Har du redan en nyckel?<span className="h-px flex-1 bg-zinc-200" /></div>
              <form onSubmit={useExisting} className="flex gap-2"><input value={existingKey} onChange={(event) => setExistingKey(event.target.value)} required placeholder="tberg_…" aria-label="Befintlig testnyckel" className="min-w-0 flex-1 rounded-xl border border-zinc-300 px-3 py-2.5 font-mono text-sm" /><button disabled={busy} className="rounded-xl bg-zinc-100 px-4 py-2.5 text-sm font-bold text-zinc-700">Använd</button></form>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Section({ title, subtitle, action, children }: { title: string; subtitle: string; action?: React.ReactNode; children: React.ReactNode }) {
  return <><div className="flex items-end justify-between gap-4"><div><h1 className="text-3xl font-bold tracking-tight">{title}</h1><p className="mt-2 text-sm text-zinc-600">{subtitle}</p></div>{action}</div><div className="mt-6">{children}</div></>;
}

function AssetTable({ assets, onSelect }: { assets: Asset[]; onSelect: (asset: Asset) => void }) {
  return <article className="overflow-hidden rounded-2xl border border-black/10 bg-white"><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500"><tr><th className="px-5 py-3">Objekt</th><th className="px-5 py-3">Plats</th><th className="px-5 py-3">Kritikalitet</th><th className="px-5 py-3">SLA</th><th className="px-5 py-3">Status</th></tr></thead><tbody className="divide-y divide-black/5">{assets.map((asset) => <tr key={asset.assetId} onClick={() => onSelect(asset)} className="cursor-pointer hover:bg-[#f7faf7]"><td className="px-5 py-4"><p className="font-semibold">{asset.name}</p><p className="mt-0.5 font-mono text-xs text-zinc-500">{asset.assetId}</p></td><td className="px-5 py-4 text-zinc-600">{asset.location}</td><td className="px-5 py-4 font-medium">{asset.criticality}</td><td className="px-5 py-4 text-zinc-600">{asset.slaHours} h</td><td className="px-5 py-4"><Pill tone={statusTone(asset.status)}>{asset.status}</Pill></td></tr>)}</tbody></table></div></article>;
}

function OrderList({ orders }: { orders: WorkOrder[] }) {
  return <article className="rounded-2xl border border-black/10 bg-white"><div className="border-b border-black/10 px-5 py-4"><h2 className="font-bold">Pågående arbetsorder</h2><p className="mt-0.5 text-xs text-zinc-500">Senast uppdaterad nyss</p></div><div className="divide-y divide-black/5">{orders.map((order) => <div key={order.workOrderId} className="p-5"><div className="flex items-start justify-between gap-4"><div><p className="font-semibold">{order.title}</p><p className="mt-1 text-xs text-zinc-500">{order.workOrderId} · {order.assetId}</p></div><Pill tone={statusTone(order.status)}>{order.status}</Pill></div><div className="mt-4 flex justify-between text-xs"><span className="font-semibold text-[#2d7b58]">{order.priority}</span><span className="text-zinc-500">{order.technicianName || 'Ej tilldelad'}</span></div></div>)}</div></article>;
}

function OrderTable({ orders }: { orders: WorkOrder[] }) {
  return <div className="overflow-hidden rounded-2xl border border-black/10 bg-white"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-zinc-50 text-xs uppercase text-zinc-500"><tr><th className="px-5 py-3">Arbetsorder</th><th className="px-5 py-3">Objekt</th><th className="px-5 py-3">Prioritet</th><th className="px-5 py-3">Tekniker</th><th className="px-5 py-3">Status</th></tr></thead><tbody className="divide-y divide-black/5">{orders.map((order) => <tr key={order.workOrderId}><td className="px-5 py-4"><p className="font-semibold">{order.title}</p><p className="mt-1 text-xs text-zinc-500">{order.workOrderId}</p></td><td className="px-5 py-4 font-mono text-xs">{order.assetId}</td><td className="px-5 py-4 font-bold text-[#2d7b58]">{order.priority}</td><td className="px-5 py-4 text-zinc-600">{order.technicianName || 'Ej tilldelad'}</td><td className="px-5 py-4"><Pill tone={statusTone(order.status)}>{order.status}</Pill></td></tr>)}</tbody></table></div></div>;
}

function TechnicianGrid({ technicians }: { technicians: Technician[] }) {
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{technicians.map((technician) => <article key={technician.technicianId} className="rounded-2xl border border-black/10 bg-white p-5"><div className="flex items-start justify-between"><div className="grid h-11 w-11 place-items-center rounded-full bg-[#e8f2eb] font-bold text-[#173f31]">{technician.name.split(' ').map((part) => part[0]).join('')}</div><Pill tone={statusTone(technician.status)}>{technician.status}</Pill></div><h2 className="mt-4 font-bold">{technician.name}</h2><p className="mt-1 text-xs text-zinc-500">{technician.technicianId} · {technician.area}</p><div className="mt-4 flex flex-wrap gap-2">{technician.skills.map((skill) => <Pill key={skill}>{skill}</Pill>)}</div><p className="mt-4 text-xs text-zinc-500">Tillgänglig {new Date(technician.availableFrom).toLocaleString('sv-SE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p></article>)}</div>;
}

function HistoryTable({ history, assets }: { history: HistoryEntry[]; assets: Asset[] }) {
  return <div className="overflow-hidden rounded-2xl border border-black/10 bg-white"><div className="divide-y divide-black/5">{history.map((entry) => <article key={entry.historyId} className="grid gap-3 p-5 md:grid-cols-[140px_1fr_1fr_90px]"><div><p className="font-mono text-sm font-bold">{entry.assetId}</p><p className="mt-1 text-xs text-zinc-500">{assets.find((asset) => asset.assetId === entry.assetId)?.name}</p></div><div><p className="text-xs font-semibold uppercase text-zinc-400">Symptom</p><p className="mt-1 text-sm">{entry.symptom}{entry.errorCode ? ` (${entry.errorCode})` : ''}</p></div><div><p className="text-xs font-semibold uppercase text-zinc-400">Åtgärd</p><p className="mt-1 text-sm">{entry.action}</p></div><div className="text-right"><p className="text-sm font-semibold">{entry.date}</p><p className="mt-1 text-xs text-zinc-500">{entry.downtimeHours} h stopp</p></div></article>)}</div></div>;
}

function AssetDrawer({ asset, history, onClose }: { asset: Asset; history: HistoryEntry[]; onClose: () => void }) {
  return <div className="fixed inset-0 z-40 bg-black/35" onClick={onClose}><aside className="ml-auto h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between"><div><p className="font-mono text-xs font-bold text-[#2d7b58]">{asset.assetId}</p><h2 className="mt-1 text-2xl font-bold">{asset.name}</h2><p className="mt-1 text-sm text-zinc-500">{asset.location}</p></div><button onClick={onClose} className="rounded-lg bg-zinc-100 px-3 py-2 text-sm">Stäng</button></div><div className="mt-6 grid grid-cols-2 gap-3">{[['Kritikalitet', asset.criticality], ['SLA', `${asset.slaHours} timmar`], ['Kompetens', asset.requiredSkill], ['Garanti', asset.warrantyActive ? 'Aktiv' : 'Saknas'], ['Serviceform', asset.serviceType], ['Status', asset.status]].map(([label, value]) => <div key={label} className="rounded-xl bg-zinc-50 p-3"><p className="text-xs text-zinc-500">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div>)}</div><h3 className="mt-8 font-bold">Felhistorik</h3><div className="mt-3 space-y-3">{history.length ? history.map((item) => <article key={item.historyId} className="rounded-xl border border-black/10 p-4"><p className="text-xs font-semibold text-zinc-500">{item.date}{item.errorCode ? ` · ${item.errorCode}` : ''}</p><p className="mt-2 text-sm font-semibold">{item.symptom}</p><p className="mt-1 text-sm text-zinc-600">{item.action}</p></article>) : <p className="text-sm text-zinc-500">Ingen tidigare historik.</p>}</div></aside></div>;
}

function WorkOrderModal({ assets, technicians, onClose, onSubmit }: { assets: Asset[]; technicians: Technician[]; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"><form onSubmit={onSubmit} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-wide text-[#2d7b58]">Manuellt test</p><h2 className="mt-1 text-2xl font-bold">Ny arbetsorder</h2></div><button type="button" onClick={onClose} className="rounded-lg bg-zinc-100 px-3 py-2 text-sm">Stäng</button></div><div className="mt-6 grid gap-4"><label className="text-sm font-semibold">Objekt<select name="assetId" required className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 font-normal">{assets.map((asset) => <option key={asset.assetId} value={asset.assetId}>{asset.assetId} – {asset.name}</option>)}</select></label><label className="text-sm font-semibold">Rubrik<input name="title" required minLength={3} className="mt-2 w-full rounded-xl border border-zinc-300 px-3 py-2.5 font-normal" placeholder="Exempelvis onormalt lagerljud" /></label><label className="text-sm font-semibold">Beskrivning<textarea name="description" required minLength={3} rows={3} className="mt-2 w-full rounded-xl border border-zinc-300 px-3 py-2.5 font-normal" /></label><div className="grid grid-cols-2 gap-4"><label className="text-sm font-semibold">Prioritet<select name="priority" className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 font-normal">{['P1', 'P2', 'P3', 'P4'].map((item) => <option key={item}>{item}</option>)}</select></label><label className="text-sm font-semibold">Tekniker<select name="technicianId" className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 font-normal"><option value="">Ej tilldelad</option>{technicians.map((technician) => <option key={technician.technicianId} value={technician.technicianId}>{technician.name}</option>)}</select></label></div></div><button className="mt-6 w-full rounded-xl bg-[#173f31] px-4 py-3 text-sm font-bold text-white">Skapa arbetsorder</button></form></div>;
}
