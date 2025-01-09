
namespace AutomatedInvoicing.Domain.Entities
{
    public class InvoiceLineItem : Entity
    {
        public int Quantity { get; set; }
        public string ItemId { get; set; }
        public string SystemOfRecordId { get; set; }
        public double TotalPriceAmount { get; set; }
        public string Description { get; set; }
        public virtual Item Item { get; set; }
        public virtual SystemOfRecordEntity SystemOfRecord { get; set; }
    }
}
