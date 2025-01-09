
namespace AutomatedInvoicing.Domain.Entities
{
    public class Invoice : Entity
    {
        public string InvoiceNumber { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime BillingStartDate { get; set; }
        public DateTime BillingEndDate { get; set; }
        public bool IsReminder { get; set; }
        public double SubTotalAmount { get; set; }
        public double TaxAmount { get; set; }
        public double TotalAmount { get; set; }
        public string InvoiceStatus { get; set; }
        public string ClientId { get; set; }
        public virtual Client Client { get; set; }
        public ICollection<InvoiceLineItem> InvoiceLineItems { get; set; } = new List<InvoiceLineItem>();
    }
}
