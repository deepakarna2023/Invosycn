// components/InvoiceList.tsx
import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import InvoiceModel from '../../models/InvoiceModel';

interface InvoiceListProps {
  invoices: InvoiceModel[] | null;
  
}

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices }) => {
  return (
    <div>
      <DataTable value={invoices!} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }} stripedRows size="small">
        <Column field="invoiceNumber" header="Invoice Number" />
        <Column field="totalAmount" header="Total Amount" />
        <Column header="Payment Status" body={(rowData) => (
          <div>
            <Tag value={rowData.invoicePaymentStatus || 'No Status'} severity={rowData.invoicePaymentStatus === 'Paid' ? 'success' : 'warning'} />
          </div>
        )} />
        <Column header="Action" body={(rowData) => (
          <div>
            <Button icon="pi pi-eye" text  rounded tooltip="View Details" tooltipOptions={{ position: 'top' }} />
          </div>
        )} />
      </DataTable>
    </div>
  );
};

export default InvoiceList;
