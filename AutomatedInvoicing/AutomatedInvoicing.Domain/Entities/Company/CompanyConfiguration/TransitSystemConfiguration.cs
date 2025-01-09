
namespace AutomatedInvoicing.Domain.Entities
{
    public  class TransitSystemConfiguration : CompanySettings
    {
        public string Name { get; set; }
        public string Url { get; set; }
        public string ApiKey { get; set; }
    }
}
