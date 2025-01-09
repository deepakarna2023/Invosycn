using AutomatedInvoicing.Domain.Entities;
using AutomatedInvoicing.Integrations.TransitSystem.HttpClient.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutomatedInvoicing.Integrations.TransitSystem
{
    public static class TransitSystemMapping
    {
        public static Sale ToSale(this Trip trip)
        {
            return new Sale();
        }
    }
}
