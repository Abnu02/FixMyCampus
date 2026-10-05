using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FixMyCampus.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ChangeTechnicianNameToTechnicianId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TechnicianName",
                table: "Tickets");

            migrationBuilder.AddColumn<int>(
                name: "TechnicianID",
                table: "Tickets",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TechnicianID",
                table: "Tickets");

            migrationBuilder.AddColumn<string>(
                name: "TechnicianName",
                table: "Tickets",
                type: "text",
                nullable: true);
        }
    }
}
