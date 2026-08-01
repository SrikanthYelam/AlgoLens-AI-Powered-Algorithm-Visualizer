using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Number of Islands via row-major scan + BFS flood fill. Captures one step
/// per newly discovered island, one step per cell visited during its BFS,
/// and a final scan-complete summary step.
/// </summary>
public sealed class NumberOfIslands : IAlgorithmVisualizer<int[][]>
{
    private static readonly (int DRow, int DCol)[] Neighbors = [(-1, 0), (1, 0), (0, -1), (0, 1)];

    public string Id => "number-of-islands";

    public IReadOnlyList<AlgorithmStep> Run(int[][] grid)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;

        if (grid.Length == 0 || grid[0].Length == 0)
        {
            StepRecorder.Add(steps, ref stepNumber, "Grid is empty.",
                new IslandsState([], [], 0, -1, -1), [], spanLines: 2);
            return steps;
        }

        var rows = grid.Length;
        var cols = grid[0].Length;
        var visited = new int[rows][];
        for (var r = 0; r < rows; r++)
        {
            visited[r] = new int[cols];
        }

        var islandCount = 0;

        IReadOnlyList<IReadOnlyList<int>> SnapshotGrid() =>
            grid.Select(row => (IReadOnlyList<int>)row.ToList()).ToList();

        IReadOnlyList<IReadOnlyList<int>> SnapshotVisited() =>
            visited.Select(row => (IReadOnlyList<int>)row.ToList()).ToList();

        for (var row = 0; row < rows; row++)
        {
            for (var col = 0; col < cols; col++)
            {
                if (grid[row][col] != 1 || visited[row][col] == 1)
                {
                    continue;
                }

                islandCount++;
                visited[row][col] = 1;

                StepRecorder.Add(steps, ref stepNumber,
                    $"Found unvisited land at ({row},{col}); starting island #{islandCount}.",
                    new IslandsState(SnapshotGrid(), SnapshotVisited(), islandCount, row, col),
                    [$"{row},{col}"],
                    spanLines: 3);

                var queue = new Queue<(int Row, int Col)>();
                queue.Enqueue((row, col));

                while (queue.Count > 0)
                {
                    var (r, c) = queue.Dequeue();

                    foreach (var (dRow, dCol) in Neighbors)
                    {
                        var nr = r + dRow;
                        var nc = c + dCol;
                        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols)
                        {
                            continue;
                        }
                        if (grid[nr][nc] != 1 || visited[nr][nc] == 1)
                        {
                            continue;
                        }

                        visited[nr][nc] = 1;
                        queue.Enqueue((nr, nc));

                        StepRecorder.Add(steps, ref stepNumber,
                            $"Visit ({nr},{nc}); part of island #{islandCount}.",
                            new IslandsState(SnapshotGrid(), SnapshotVisited(), islandCount, nr, nc),
                            [$"{nr},{nc}"],
                            spanLines: 3);
                    }
                }
            }
        }

        StepRecorder.Add(steps, ref stepNumber,
            $"Scan complete: {islandCount} island(s) found.",
            new IslandsState(SnapshotGrid(), SnapshotVisited(), islandCount, -1, -1),
            [],
            spanLines: 1);

        return steps;
    }
}
