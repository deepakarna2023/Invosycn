using AutomatedInvoicing.Integrations.TransitSystem.HttpClient.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutomatedInvoicing.Integrations.TransitSystem.HttpClient
{
    public class TransitSystemHttpClient
    {
        public TripClient Trips { get; set; }

        public class TripClient
        {
            public Task<List<Trip>> GetAsync(DateTime startDate, DateTime endDate)
            {
                return Task.FromResult(new List<Trip>());
            }
        }
    }
}
