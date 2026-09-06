using System.Threading.RateLimiting;
using AlgoLens.Api.Endpoints;
using AlgoLens.Api.Services;
using AlgoLens.Core.Algorithms;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Caching.Memory;
using OpenAI.Chat;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

const string FrontendCorsPolicy = "Frontend";
// Allow frontend origins to be configured via DEV_FRONTEND_ORIGINS (comma-separated) in development.
// Default to http://localhost:5173 to preserve existing behavior. This prevents CORS failures when Vite
// auto-selects a different dev port (e.g., 5174).
var devOriginsEnv = Environment.GetEnvironmentVariable("DEV_FRONTEND_ORIGINS") ?? "http://localhost:5173";
var devOrigins = devOriginsEnv.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCorsPolicy, policy =>
        policy.WithOrigins(devOrigins).AllowAnyHeader().AllowAnyMethod());
});

// Reads OPENAI_API_KEY from the environment. Falls back to a placeholder (rather than
// throwing at startup) if unset, so the app still runs — ExplainStepsAsync's own
// try/catch degrades to null explanations on the resulting auth failure at request time.
const string OpenAiModel = "gpt-4o-mini";
var openAiApiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY") ?? "missing-openai-api-key";
builder.Services.AddSingleton(new ChatClient(OpenAiModel, openAiApiKey));
builder.Services.AddScoped<OpenAiStepExplanationService>();

// Bounded (SizeLimit-capped, not unlimited) in-memory cache of AI explanations, keyed by a
// content hash of each step — see CachingStepExplanationService for why. Each cached string
// counts as 1 unit against the limit below (its own MemoryCacheEntryOptions.Size), so this caps
// the cache at ~2000 distinct step explanations, evicting least-recently-used entries beyond that.
builder.Services.AddMemoryCache(options => options.SizeLimit = 2000);
builder.Services.AddScoped<IStepExplanationService>(sp => new CachingStepExplanationService(
    sp.GetRequiredService<OpenAiStepExplanationService>(),
    sp.GetRequiredService<IMemoryCache>(),
    sp.GetRequiredService<ILogger<CachingStepExplanationService>>()));

builder.Services.AddScoped<IUserSolutionJudge, RoslynUserSolutionJudge>();
builder.Services.AddScoped<BinaryTreeLevelOrderTraversal>();
builder.Services.AddScoped<SlidingWindowMaximum>();
builder.Services.AddScoped<LongestSubarrayAbsDiffLimit>();
builder.Services.AddScoped<LargestRectangleInHistogram>();
builder.Services.AddScoped<NumberOfIslands>();
builder.Services.AddScoped<Permutations>();
builder.Services.AddScoped<Combinations>();
builder.Services.AddScoped<Subsets>();
builder.Services.AddScoped<NQueens>();
builder.Services.AddScoped<LetterCombinationsOfPhoneNumber>();
builder.Services.AddScoped<TaskSchedulerAlgorithm>();
builder.Services.AddScoped<GenerateParentheses>();
builder.Services.AddScoped<RemoveInvalidParenthesesBfs>();
builder.Services.AddScoped<RemoveInvalidParenthesesDfs>();
builder.Services.AddScoped<LongestCommonSubsequence>();
builder.Services.AddScoped<LongestPalindromicSubsequence>();
builder.Services.AddScoped<LongestIncreasingSubsequence>();
builder.Services.AddScoped<EditDistance>();
builder.Services.AddScoped<LongestPalindromicSubstring>();
builder.Services.AddScoped<MeetingRoomsII>();
builder.Services.AddScoped<ValidateBst>();
builder.Services.AddScoped<KthSmallestInBst>();
builder.Services.AddScoped<LowestCommonAncestor>();
builder.Services.AddScoped<ConstructBinaryTree>();
builder.Services.AddScoped<RecoverBst>();
builder.Services.AddScoped<SortedListToBst>();

// Per-client (by IP) fixed-window rate limiting on the two endpoints that carry real cost: the
// judge (in-process compilation + execution of arbitrary submitted C#, see
// RoslynUserSolutionJudge's doc comment) and on-demand explanation regeneration (a direct,
// billed OpenAI call). QueueLimit 0 means an over-limit request is rejected immediately rather
// than queued, so callers get a fast, predictable 429 instead of a stalled connection.
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    options.AddPolicy(AlgorithmEndpoints.JudgeRateLimitPolicy, httpContext => RateLimitPartition.GetFixedWindowLimiter(
        partitionKey: ClientPartitionKey(httpContext),
        factory: _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 10,
            Window = TimeSpan.FromMinutes(1),
            QueueLimit = 0,
        }));

    options.AddPolicy(AlgorithmEndpoints.ExplainRateLimitPolicy, httpContext => RateLimitPartition.GetFixedWindowLimiter(
        partitionKey: ClientPartitionKey(httpContext),
        factory: _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 30,
            Window = TimeSpan.FromMinutes(1),
            QueueLimit = 0,
        }));

    options.OnRejected = async (context, cancellationToken) =>
    {
        if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
        {
            context.HttpContext.Response.Headers.RetryAfter = ((int)retryAfter.TotalSeconds).ToString();
        }
        context.HttpContext.Response.ContentType = "application/json";
        await context.HttpContext.Response.WriteAsJsonAsync(
            new { error = "Rate limit exceeded. Please slow down and try again shortly." },
            cancellationToken);
    };
});

static string ClientPartitionKey(HttpContext httpContext) =>
    httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(FrontendCorsPolicy);

app.UseRateLimiter();

app.MapGet("/", () => app.Environment.IsDevelopment()
        ? Results.Redirect("/swagger")
        : Results.Ok(new { status = "AlgoLens API is running." }))
    .ExcludeFromDescription();

app.MapAlgorithmEndpoints();
app.MapExplainEndpoint();

app.Run();
