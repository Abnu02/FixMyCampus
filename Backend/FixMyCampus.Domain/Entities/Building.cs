namespace FixMyCampus.Domain.Entities;

public class Building
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int maxCapacity { get; set; }

    public int CampusId { get; set; }

    public Campus Campus { get; set; } = null!;

    public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
}
