
namespace AutomatedInvoicing.Domain.Entities
{
    public class InvoiceSettings : AutomationSettings
    {
        public string InvoiceId { get; set; }
        public virtual Invoice Invoice { get; set; }
    }
}
