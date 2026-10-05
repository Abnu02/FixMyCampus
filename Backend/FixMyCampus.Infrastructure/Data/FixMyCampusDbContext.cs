using FixMyCampus.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FixMyCampus.Infrastructure.Data;

public class FixMyCampusDbContext : IdentityDbContext<ApplicationUser>
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