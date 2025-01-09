
using AutomatedInvoicing.Domain.Entities;

namespace AutomatedInvoicing.Domain
{
    public class Company : Entity
    {
        public string Name { get; set; }
        public string Address { get; set; }
        public string SystemName { get; set; }
        public CompanySettings CompanySettings { get; set; }

        public CompanySettings GetConfigurationBySystemName()
        {
            switch (SystemName)
            {
                case "Quickbooks":
                    return CompanySettings as QuickbooksConfiguration;

                case "TransitSystem":
                    return CompanySettings as TransitSystemConfiguration;

                default:
                    throw new InvalidOperationException($"Unknown system name: {SystemName}");
            }
        }
    }
}
