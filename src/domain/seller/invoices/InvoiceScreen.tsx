'use client';
import { useInvoices } from './hooks/useInvoice';
import { InvoiceStatsCards } from './components/InvoiceStats';
import { InvoiceFilters } from './components/InvoiceFilters';
import { InvoiceTable } from './components/InvoiceTable/InvoiceTable';
import { InvoiceDetailsModal } from './components/InvoiceDetailsModal';
import { LoadingSpinner } from '../components/LoadingSpinner';

export  function InvoiceScreen() {
  const {
    invoices,
    stats,
    loading,
    error,
    filterParams,
    setFilterParams,
    selectedInvoice,
    setSelectedInvoice,
    downloading,
    sendingReminder,
    handleViewDetails,
    handleSendReminder,
    handleDownloadInvoice
  } = useInvoices();

  const handleSort = (field: string) => {
    const order = filterParams.sort === field && filterParams.order === 'asc' ? 'desc' : 'asc';
    setFilterParams({ ...filterParams, sort: field as any, order });
  };

  if (loading && !invoices.length) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600 bg-red-100 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
        <p className="mt-1 text-sm text-gray-600">
          View and manage all customer invoices
        </p>
      </div>

      <InvoiceStatsCards stats={stats} />
      
      <InvoiceFilters 
        params={filterParams} 
        onParamsChange={setFilterParams} 
      />

      <InvoiceTable
        invoices={invoices}
        onViewDetails={handleViewDetails}
        sortConfig={{
          sort: filterParams.sort,
          order: filterParams.order
        }}
        onSort={handleSort}
      />

      {invoices.length === 0 && !loading && (
        <div className="p-8 text-center bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">No invoices found matching your criteria.</p>
        </div>
      )}

      <InvoiceDetailsModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        onSendReminder={handleSendReminder}
        onDownload={handleDownloadInvoice}
        sendingReminder={sendingReminder}
        downloading={downloading}
      />
    </div>
  );
}