using AutomatedInvoicing.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace AutomatedInvoicing.Integrations.Interfaces
{
    public interface ISystemIntegration
    {
        public Task<List<Client>> GetClientsAsync();
        public Task<Client> GetClientAsync();
        public Task<Invoice> GetInvoiceAsync();
        public Task<List<Invoice>> GetInvoicesAsync();
        public Task<List<Sale>> GetSalesAsync(DateTime startDate, DateTime endDate);
        public Task<List<InvoiceLineItem>> GetInvoiceLineItemsAsync();
    }
}
