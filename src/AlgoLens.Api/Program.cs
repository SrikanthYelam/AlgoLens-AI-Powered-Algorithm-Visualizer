using AlgoLens.Api.Endpoints;
using AlgoLens.Api.Services;
using AlgoLens.Core.Algorithms;
using OpenAI.Chat;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

const string FrontendCorsPolicy = "Frontend";
builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCorsPolicy, policy =>
        policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod());
});

// Reads OPENAI_API_KEY from the environment. Falls back to a placeholder (rather than
// throwing at startup) if unset, so the app still runs — ExplainStepsAsync's own
// try/catch degrades to null explanations on the resulting auth failure at request time.
const string OpenAiModel = "gpt-4o-mini";
var openAiApiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY") ?? "missing-openai-api-key";
builder.Services.AddSingleton(new ChatClient(OpenAiModel, openAiApiKey));
builder.Services.AddScoped<IStepExplanationService, OpenAiStepExplanationService>();
builder.Services.AddScoped<BinaryTreeLevelOrderTraversal>();
builder.Services.AddScoped<SlidingWindowMaximum>();
builder.Services.AddScoped<LargestRectangleInHistogram>();
builder.Services.AddScoped<NumberOfIslands>();
builder.Services.AddScoped<Permutations>();
builder.Services.AddScoped<Combinations>();
builder.Services.AddScoped<Subsets>();
builder.Services.AddScoped<NQueens>();
builder.Services.AddScoped<LetterCombinationsOfPhoneNumber>();
builder.Services.AddScoped<TaskSchedulerAlgorithm>();
builder.Services.AddScoped<GenerateParentheses>();

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
