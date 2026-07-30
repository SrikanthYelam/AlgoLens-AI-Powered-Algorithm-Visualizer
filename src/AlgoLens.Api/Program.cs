using AlgoLens.Api.Endpoints;
using AlgoLens.Api.Services;
using AlgoLens.Core.Algorithms;
using Anthropic;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

const string FrontendCorsPolicy = "Frontend";
builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCorsPolicy, policy =>
        policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod());
});

// Reads ANTHROPIC_API_KEY from the environment by default.
builder.Services.AddSingleton(new AnthropicClient());
builder.Services.AddScoped<IStepExplanationService, ClaudeStepExplanationService>();
builder.Services.AddScoped<BinaryTreeLevelOrderTraversal>();
builder.Services.AddScoped<SlidingWindowMaximum>();
builder.Services.AddScoped<LargestRectangleInHistogram>();
builder.Services.AddScoped<NumberOfIslands>();
builder.Services.AddScoped<Permutations>();
builder.Services.AddScoped<Combinations>();
builder.Services.AddScoped<Subsets>();
builder.Services.AddScoped<NQueens>();
builder.Services.AddScoped<LetterCombinationsOfPhoneNumber>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(FrontendCorsPolicy);

app.MapGet("/", () => app.Environment.IsDevelopment()
        ? Results.Redirect("/swagger")
        : Results.Ok(new { status = "AlgoLens API is running." }))
    .ExcludeFromDescription();

app.MapAlgorithmEndpoints();

app.Run();
