using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

using FixMyCampus.Application.Auth;
using FixMyCampus.Infrastructure.Data;
using FixMyCampus.Infrastructure.Identity;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var isPlaceholderConnection = string.IsNullOrWhiteSpace(connectionString)
    || connectionString.Contains("******", StringComparison.Ordinal)
    || connectionString.Contains("change-me", StringComparison.OrdinalIgnoreCase);

var jwtSettings = builder.Configuration.GetSection("Jwt");
builder.Services.AddDbContext<FixMyCampusDbContext>(options =>
{
    if (isPlaceholderConnection)
    {
        options.UseInMemoryDatabase("FixMyCampusDb");
        return;
    }

    options.UseNpgsql(connectionString);
});

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
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
builder.Services.AddOpenApi();
builder.Services.AddAuthorization();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();


builder.Services.AddIdentityServices();

builder.Services.AddControllers();

var app = builder.Build();
app.UseCors("Frontend");

try
{
    using var scope = app.Services.CreateScope();

    var userManager =
        scope.ServiceProvider
            .GetRequiredService<UserManager<ApplicationUser>>();

    var roleManager =
        scope.ServiceProvider
            .GetRequiredService<RoleManager<IdentityRole>>();

    await IdentitySeeder.SeedAsync(
        userManager,
        roleManager);
}
catch (Exception ex)
{
    app.Logger.LogWarning(ex, "Database seeding could not complete. Starting with an in-memory database fallback if configured.");
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapOpenApi();
app.MapScalarApiReference();

app.MapControllers();

app.Run();