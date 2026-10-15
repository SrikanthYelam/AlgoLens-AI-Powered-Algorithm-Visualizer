namespace AlgoLens.Api.Contracts;

public sealed record ReconstructItineraryRequest(IReadOnlyList<IReadOnlyList<string>> Tickets);
