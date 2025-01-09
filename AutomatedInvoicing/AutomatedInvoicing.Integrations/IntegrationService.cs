using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutomatedInvoicing.Domain.Entities;
using AutomatedInvoicing.Integrations.Interfaces;

namespace AutomatedInvoicing.Integrations
{
    public class IntegrationService : IIntegrationService
    {
        IIntegrationServiceSettings _settings;

        ISystemIntegration _systemIntegration;

        public IntegrationService(IIntegrationServiceSettings settings)
        {
            _settings = settings;

            //TODO use settings in factory to obtain systemINtegration 
            _systemIntegration = new TransitSystem.TransitSystemIntegration();
        }

        public List<Sale> GetSales(DateTime startDate, DateTime endDate)
        {
            return _systemIntegration.GetSales(startDate, endDate);
        }
    }
}
