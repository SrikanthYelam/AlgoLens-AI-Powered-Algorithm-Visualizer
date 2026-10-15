using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// LeetCode 787. Bellman-Ford relaxation limited to exactly `k + 1` rounds (at most `k` stops means
/// at most `k + 1` edges in the path): starting from `dist[src] = 0` and everything else unreached,
/// each round builds a fresh `next` array seeded from the previous round's `dist`, relaxing every
/// flight using only the *previous* round's distances — never a value already updated earlier in
/// the same round. That one-round-behind read is what caps the path length at exactly one extra
/// edge per round; a plain in-place Bellman-Ford (relaxing into the same array within a round)
/// would let a single round chain together more edges than the stop limit allows. Dijkstra doesn't
/// fit this problem because its greedy "finalize the smallest frontier node" guarantee says nothing
/// about how many edges that shortest path used.
/// </summary>
public sealed class CheapestFlights : IAlgorithmVisualizer<CheapestFlightsInput>
{
    public string Id => "cheapest-flights-within-k-stops";

    public IReadOnlyList<AlgorithmStep> Run(CheapestFlightsInput input)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;
        var flights = input.Flights;

        var dist = new int?[input.N];
        dist[input.Src] = 0;

        StepRecorder.Add(steps, ref stepNumber,
            $"Start: city {input.Src} costs $0; every other city is unreached.",
            new CheapestFlightsState(-1, dist.ToList(), dist.ToList(), -1, -1, -1, false, null),
            [input.Src.ToString()],
            spanLines: 2);

        for (var round = 0; round <= input.K; round++)
        {
            var next = (int?[])dist.Clone();

            foreach (var flight in flights)
            {
                var from = flight[0];
                var to = flight[1];
                var price = flight[2];
                var updated = false;

                if (dist[from] is int fromPrice && (next[to] is null || fromPrice + price < next[to]))
                {
                    next[to] = fromPrice + price;
                    updated = true;
                }

                StepRecorder.Add(steps, ref stepNumber,
                    updated
                        ? $"Round {round}: flight {from}->{to} (${price}) improves city {to} to ${next[to]}."
                        : $"Round {round}: flight {from}->{to} (${price}) doesn't improve city {to}.",
                    new CheapestFlightsState(round, dist.ToList(), next.ToList(), from, to, price, updated, null),
                    [from.ToString(), to.ToString()],
                    spanLines: 11);
            }

            dist = next;
        }

        var answer = dist[input.Dst];
        StepRecorder.Add(steps, ref stepNumber,
            answer is null
                ? $"Done: city {input.Dst} is unreachable within {input.K} stop(s)."
                : $"Done: cheapest price to city {input.Dst} within {input.K} stop(s) is ${answer}.",
            new CheapestFlightsState(input.K, dist.ToList(), dist.ToList(), -1, -1, -1, false, answer ?? -1),
            [],
            spanLines: 2);

        return steps;
    }
}
