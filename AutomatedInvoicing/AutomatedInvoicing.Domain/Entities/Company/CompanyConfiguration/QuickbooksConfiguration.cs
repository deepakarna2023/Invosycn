
namespace AutomatedInvoicing.Domain.Entities
{
    public class QuickbooksConfiguration : CompanySettings
    {
        public string ClientSecret { get; set; }
        public string RedirectUrl { get; set; }
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public string ClientId {  get; set; }
        public string ComapanyId {  get; set; }
        public virtual Client Client { get; set; }
        public virtual Company Company { get; set; }
    }
}