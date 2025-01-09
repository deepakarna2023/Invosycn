
namespace AutomatedInvoicing.Domain.Entities
{
    public class CompanySettings : Entity
    {
        string SMTPHost { get; set; }
        string SMTPPort { get; set; }
    }
}
