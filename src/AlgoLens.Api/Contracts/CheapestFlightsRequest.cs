namespace AlgoLens.Api.Contracts;

public sealed record CheapestFlightsRequest(int N, int[][] Flights, int Src, int Dst, int K);
