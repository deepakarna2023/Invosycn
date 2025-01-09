
namespace AutomatedInvoicing.Domain.Entities
{
    public class ClientSettings : AutomationSettings
    {
        public string ClientId { get; set; }
        public virtual Client Client { get; set; }
    }
}
