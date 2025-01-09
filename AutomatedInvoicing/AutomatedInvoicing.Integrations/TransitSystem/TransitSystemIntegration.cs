using AutomatedInvoicing.Domain.Entities;
using AutomatedInvoicing.Integrations.Interfaces;
using AutomatedInvoicing.Integrations.TransitSystem.HttpClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace AutomatedInvoicing.Integrations.TransitSystem
{
    public class TransitSystemIntegration : ISystemIntegration
    {
        TransitSystemHttpClient _httpClient;

        public TransitSystemIntegration(TransitSystemHttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<Client> GetClientAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<List<Client>> GetClientsAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<Invoice> GetInvoiceAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<List<InvoiceLineItem>> GetInvoiceLineItemsAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<List<Invoice>> GetInvoicesAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<List<Sale>> GetSalesAsync(DateTime startDate, DateTime endDate)
        {
            var trips = await _httpClient.Trips.GetAsync(startDate, endDate);

            return trips.Select(r => r.ToSale()).ToList();
        }
    }
}
