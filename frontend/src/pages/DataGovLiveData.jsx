import { useCallback, useEffect, useMemo, useState } from 'react';
import { Database, RefreshCw, Loader2, Table2, CircleDot, AlertTriangle, Inbox, Radio } from 'lucide-react';
import { getDataGovResources, getDataGovResourceRecords } from '../lib/dataGov';
import PageHeader from '../components/PageHeader';
import { SectionCard, EmptyState } from '../components/kit';

const ERROR_STATUS = 'API-ERROR';
const EMPTY_STATUS = 'LIVE-EMPTY';
const LIVE_STATUS = 'LIVE-DATA';

const STATUS_META = {
  [LIVE_STATUS]: { label: 'Live', dot: 'bg-leaf-500' },
  [EMPTY_STATUS]: { label: 'Empty', dot: 'bg-harvest-400' },
  [ERROR_STATUS]: { label: 'Error', dot: 'bg-red-500' },
  NOT_LOADED: { label: 'Not loaded', dot: 'bg-gray-300' },
};

function getResourceKey(resource) {
  return resource?.resource_key ?? resource?.resourceKey ?? resource?.key ?? resource?.id ?? '';
}

function getResourceTitle(resource) {
  return resource?.title ?? resource?.name ?? resource?.resource_name ?? getResourceKey(resource);
}

function getResourceDescription(resource) {
  return resource?.description ?? resource?.notes ?? resource?.about ?? '';
}

function normalizeRecords(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.records)) return response.records;
  if (Array.isArray(response?.data?.records)) return response.data.records;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

function classifyError(error) {
  const status = error?.status ?? error?.response?.status ?? error?.statusCode ?? null;
  return {
    status: ERROR_STATUS,
    httpStatus: status,
    message: error?.message || error?.response?.data?.message || 'Data.gov resource is temporarily unavailable.',
  };
}

function formatValue(value) {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'object') {
    try { return JSON.stringify(value); } catch { return String(value); }
  }
  return String(value);
}

function ResourceTable({ records }) {
  const columns = useMemo(() => {
    const set = new Set();
    records.forEach((record) => {
      if (record && typeof record === 'object') {
        Object.keys(record).forEach((key) => set.add(key));
      }
    });
    return Array.from(set).slice(0, 30);
  }, [records]);

  if (!records.length) {
    return <EmptyState icon={Table2} title="No records" subtitle="Nothing returned for this resource." />;
  }

  return (
    <div className="overflow-auto rounded-2xl border border-gray-200 bg-white">
      <table className="min-w-full text-xs">
        <thead className="sticky top-0 bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th key={column} className="whitespace-nowrap border-b border-gray-200 px-3 py-2.5 text-left font-semibold text-gray-700">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={record?.id ?? record?._id ?? index} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
              {columns.map((column) => (
                <td key={column} className="max-w-[240px] truncate px-3 py-2.5 align-top text-gray-600">
                  {formatValue(record?.[column])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DataGovLiveData() {
  const [resources, setResources] = useState([]);
  const [results, setResults] = useState({});
  const [selectedKey, setSelectedKey] = useState('');
  const [loadingResources, setLoadingResources] = useState(true);
  const [loadingKey, setLoadingKey] = useState('');
  const [globalError, setGlobalError] = useState('');

  const loadResources = useCallback(async () => {
    setLoadingResources(true);
    setGlobalError('');
    try {
      const response = await getDataGovResources();
      const list = Array.isArray(response)
        ? response
        : Array.isArray(response?.resources)
          ? response.resources
          : Array.isArray(response?.data)
            ? response.data
            : [];
      setResources(list);
      if (!selectedKey && list.length) {
        setSelectedKey(getResourceKey(list[0]));
      }
    } catch (error) {
      setGlobalError(error?.message || 'Unable to load the Data.gov resource registry.');
    } finally {
      setLoadingResources(false);
    }
  }, [selectedKey]);

  const loadResource = useCallback(async (key) => {
    if (!key) return;
    setLoadingKey(key);
    try {
      const response = await getDataGovResourceRecords(key);
      const records = normalizeRecords(response);
      setResults((previous) => ({
        ...previous,
        [key]: {
          status: records.length ? LIVE_STATUS : EMPTY_STATUS,
          records,
          httpStatus: 200,
        },
      }));
    } catch (error) {
      const classified = classifyError(error);
      setResults((previous) => ({ ...previous, [key]: { ...classified, records: [] } }));
    } finally {
      setLoadingKey('');
    }
  }, []);

  useEffect(() => { loadResources(); }, [loadResources]);

  useEffect(() => {
    if (selectedKey && !results[selectedKey]) {
      loadResource(selectedKey);
    }
  }, [selectedKey, results, loadResource]);

  const selectedResource = useMemo(
    () => resources.find((resource) => getResourceKey(resource) === selectedKey),
    [resources, selectedKey]
  );

  const selectedResult = results[selectedKey];

  const summary = useMemo(() => {
    const values = Object.values(results);
    return {
      loaded: values.length,
      live: values.filter((item) => item.status === LIVE_STATUS).length,
      errors: values.filter((item) => item.status === ERROR_STATUS).length,
    };
  }, [results]);

  if (loadingResources) {
    return (
      <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
        <div className="mb-4 h-[150px] rounded-3xl bg-gray-100 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400px_100%] animate-shimmer" />
        <div className="space-y-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-[64px] rounded-2xl bg-gray-100 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400px_100%] animate-shimmer" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Data.gov Live Data" subtitle="Live agriculture datasets from the official Data.gov registry" icon={Database} />

      {/* Hero */}
      <div className="mb-4 overflow-hidden rounded-3xl bg-gradient-to-br from-leaf-800 to-leaf-950 p-5 text-white shadow-md animate-fade-up">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Registered datasets</p>
            <p className="mt-1 text-4xl font-bold tracking-tight">{resources.length}</p>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-white/75">
              <Radio size={12} className="animate-pulse" /> {summary.live} serving live records
            </p>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15"><Database size={24} /></span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-white/15 px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">Loaded</p>
            <p className="mt-0.5 text-sm font-bold">{summary.loaded}</p>
          </div>
          <div className="rounded-2xl bg-white/15 px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">Live</p>
            <p className="mt-0.5 text-sm font-bold">{summary.live}</p>
          </div>
          <div className={`rounded-2xl px-3 py-2.5 ${summary.errors ? 'bg-red-400/25' : 'bg-white/15'}`}>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">Errors</p>
            <p className="mt-0.5 text-sm font-bold">{summary.errors}</p>
          </div>
        </div>
      </div>

      {globalError && (
        <EmptyState icon={AlertTriangle} title="Registry failed to load" subtitle={globalError} />
      )}

      <button onClick={loadResources}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 animate-fade-up">
        <RefreshCw size={15} className="text-leaf-600" /> Refresh registry
      </button>

      {/* Resource list */}
      <SectionCard className="mb-4" icon={Database} title="All registered resources">
        {resources.length === 0 ? (
          <div className="p-4"><EmptyState icon={Database} title="No resources" subtitle="The registry returned nothing." /></div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {resources.map((resource, i) => {
              const key = getResourceKey(resource);
              const result = results[key];
              const status = result?.status ?? 'NOT_LOADED';
              const meta = STATUS_META[status] || STATUS_META.NOT_LOADED;
              const selected = selectedKey === key;
              return (
                <li key={key}>
                  <button onClick={() => setSelectedKey(key)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors animate-slide-in ${selected ? 'bg-leaf-50/60' : 'hover:bg-gray-50'}`}
                    style={{ animationDelay: `${Math.min(i, 8) * 25}ms` }}>
                    <CircleDot size={10} className={`shrink-0 ${meta.dot} rounded-full`} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-900">{getResourceTitle(resource)}</p>
                      <p className="truncate text-[11px] text-gray-400">{key}</p>
                    </div>
                    <span className="shrink-0 text-right">
                      <span className={`block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        status === LIVE_STATUS ? 'bg-leaf-100 text-leaf-800' :
                        status === EMPTY_STATUS ? 'bg-harvest-100 text-harvest-800' :
                        status === ERROR_STATUS ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {meta.label}
                      </span>
                      {result?.records?.length > 0 && (
                        <span className="mt-0.5 block text-[10px] font-medium text-gray-400">{result.records.length} rows</span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard>

      {/* Selected resource */}
      {selectedResource ? (
        <div className="space-y-3 animate-fade-up">
          <SectionCard icon={Table2} title={getResourceTitle(selectedResource)} action={
            <button onClick={() => loadResource(selectedKey)} disabled={loadingKey === selectedKey}
              className="flex items-center gap-1.5 rounded-xl bg-leaf-700 px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-leaf-800 disabled:opacity-50">
              {loadingKey === selectedKey ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
              {loadingKey === selectedKey ? 'Loading…' : 'Reload'}
            </button>
          }>
            <div className="p-4">
              <p className="break-all text-[11px] font-medium text-gray-400">{selectedKey}</p>
              {getResourceDescription(selectedResource) && (
                <p className="mt-2 text-xs leading-relaxed text-gray-600">{getResourceDescription(selectedResource)}</p>
              )}
            </div>
          </SectionCard>

          {loadingKey === selectedKey && (
            <div className="space-y-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-11 rounded-xl bg-gray-100 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400px_100%] animate-shimmer" />
              ))}
            </div>
          )}

          {!loadingKey && selectedResult?.status === LIVE_STATUS && (
            <ResourceTable records={selectedResult.records} />
          )}

          {!loadingKey && selectedResult?.status === EMPTY_STATUS && (
            <EmptyState icon={Inbox} title="Resource is empty right now" subtitle="The API responded successfully, but no records were returned." />
          )}

          {!loadingKey && selectedResult?.status === ERROR_STATUS && (
            <div className="rounded-2xl border border-red-100 bg-red-50/70 p-5">
              <p className="flex items-center gap-2 text-sm font-bold text-red-800">
                <AlertTriangle size={16} /> Data.gov API unavailable
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-red-700/90">
                HTTP {selectedResult.httpStatus ?? 'ERROR'} — {selectedResult.message}
              </p>
              <button onClick={() => loadResource(selectedKey)}
                className="mt-3 rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50">
                Retry resource
              </button>
            </div>
          )}
        </div>
      ) : (
        <EmptyState icon={Database} title="Select a resource" subtitle="Tap a dataset above to load its live records." />
      )}
    </div>
  );
}
