
namespace AutomatedInvoicing.Domain.Entities
{
    public class Client : Entity
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ProfilePicture { get; set; }
        public string CompanyId { get; set; }
        public string ClientContactId { get; set; }
        public string ClientSettingsId { get; set; }
        public virtual Company Company { get; set; }
        public virtual ClientContact ClientContact { get; set; }
        public virtual ClientSettings ClientSettings { get; set; }
        public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
    }
}
