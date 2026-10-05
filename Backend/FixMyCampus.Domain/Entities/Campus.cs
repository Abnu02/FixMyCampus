namespace FixMyCampus.Domain.Entities;

public class Campus
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Location { get; set; } = null!;

    public ICollection<Building> Buildings { get; set; } = new List<Building>();
}
