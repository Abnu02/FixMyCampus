using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FixMyCampus.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddnewattribuitmaxCapacity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "maxCapacity",
                table: "Buildings",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "maxCapacity",
                table: "Buildings");
        }
    }
}
