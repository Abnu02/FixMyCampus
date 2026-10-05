using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

using FixMyCampus.Application.Auth;
using FixMyCampus.Application.Interfaces;
using FixMyCampus.Infrastructure.Data;
using FixMyCampus.Infrastructure.Identity;
using FixMyCampus.Application.Interfaces;
using FixMyCampus.Infrastructure.Repositories;
using FixMyCampus.Application.Services;
using FixMyCampus.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

var jwtSettings = builder.Configuration.GetSection("Jwt");
builder.Services.AddDbContext<FixMyCampusDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings["Key"]!))
        };
    });
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:4200",
                "http://localhost:53613",
                "http://localhost:4201",
                "http://localhost:4202")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
//admin ticket repository
builder.Services.AddScoped<IAdminTicketRepository, AdminTicketRepository>();
//status workflow service
builder.Services.AddScoped<IStatusWorkflowService, StatusWorkflowService>();
builder.Services.AddScoped<IAdminTicketService, AdminTicketService>();

builder.Services.AddOpenApi();
builder.Services.AddAuthorization();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();

builder.Services.AddIdentityServices();

builder.Services.AddScoped<ICampusService, CampusService>();
builder.Services.AddScoped<IBuildingService, BuildingService>();
builder.Services.AddScoped<ITicketService, TicketService>();

builder.Services.AddControllers();

var app = builder.Build();
app.UseCors("Frontend");
using (var scope = app.Services.CreateScope())
{
    var userManager =
        scope.ServiceProvider
            .GetRequiredService<UserManager<ApplicationUser>>();

    var roleManager =
        scope.ServiceProvider
            .GetRequiredService<RoleManager<IdentityRole>>();

    await IdentitySeeder.SeedAsync(
        userManager,
        roleManager);

    var dbContext = scope.ServiceProvider.GetRequiredService<FixMyCampusDbContext>();
   await CampusSeeder.SeedAsync(dbContext);
await TicketSeeder.SeedAsync(dbContext);
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapOpenApi();
app.MapScalarApiReference();

app.MapControllers();

app.Run();
