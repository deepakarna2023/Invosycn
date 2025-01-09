using AutomatedInvoicing.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutomatedInvoicing.Integrations.Interfaces
{
    public interface IIntegrationService
    {
        List<Sale> GetSales(DateTime startDate, DateTime endDate);
    }
}
