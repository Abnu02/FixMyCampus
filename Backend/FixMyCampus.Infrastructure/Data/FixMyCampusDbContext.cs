using FixMyCampus.Domain.Entities;
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

    public DbSet<Campus> Campuses => Set<Campus>();
    public DbSet<Building> Buildings => Set<Building>();
    public DbSet<Ticket> Tickets => Set<Ticket>();
    public DbSet<TicketHistory> TicketHistories => Set<TicketHistory>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Domain Entity Relationships
        modelBuilder.Entity<Campus>()
            .HasMany(c => c.Buildings)
            .WithOne(b => b.Campus)
            .HasForeignKey(b => b.CampusId);

        modelBuilder.Entity<Building>()
            .HasMany(b => b.Tickets)
            .WithOne(t => t.Building)
            .HasForeignKey(t => t.BuildingId);

        modelBuilder.Entity<Ticket>()
            .HasMany(t => t.History)
            .WithOne(th => th.Ticket)
            .HasForeignKey(th => th.TicketId);

        // Identity decoupling relationships (Fluent API only)
        modelBuilder.Entity<Ticket>()
            .HasOne<ApplicationUser>()
            .WithMany()
            .HasForeignKey(x => x.ReporterId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<TicketHistory>()
            .HasOne<ApplicationUser>()
            .WithMany()
            .HasForeignKey(x => x.ChangedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(FixMyCampusDbContext).Assembly);
    }
}
