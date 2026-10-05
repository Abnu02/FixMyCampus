using Microsoft.EntityFrameworkCore;

namespace FixMyCampus.Infrastructure.Data;

public class FixMyCampusDbContext : DbContext
{
    public FixMyCampusDbContext(
        DbContextOptions<FixMyCampusDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(FixMyCampusDbContext).Assembly);
    }
}