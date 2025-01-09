
namespace AutomatedInvoicing.Domain.Entities
{
    public class AutomationSettings : Entity
    {
        public string AutomationLevel { get; set; }
        public bool CreateInvoice { get; set; }
        public bool BuildInvoice { get; set; }
        public bool SendInvoice { get; set; }
        public List<string> EmailAddresses { get; set; }
        public DateTime BillingStartDate { get; set; }
        public string BillingPeriod { get; set; }
    }
}

