
namespace AutomatedInvoicing.Domain.Entities
{
    public class Item : Entity
    {
        public string Name { get; set; }
        public string Number { get; set; }
        public double Price { get; set; }

    }
}
