
namespace AutomatedInvoicing.Domain.Entities
{
    public class Sale : SystemOfRecordEntity
    {
        public Client Client { get; set; }

        public InvoiceLineItem ToInvoiceLineItem()
        {
            return new InvoiceLineItem();
        }
    }
}
