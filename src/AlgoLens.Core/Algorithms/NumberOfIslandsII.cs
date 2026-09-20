using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Number of Islands II via Union-Find: land is added to an initially all-water grid one cell at a
/// time, and the island count is reported after each addition. Re-running a flood fill per
/// addition (as Number of Islands does) would be wasteful, so instead a flat parent array over the
/// grid's cells tracks islands incrementally — `-1` marks water, and adding land at a cell makes it
/// its own root (count + 1). Each of its four neighbors that is already land is then unioned with
/// it; every union that merges two previously-separate islands decrements the count, while a
/// neighbor already in the same island changes nothing. A position that is already land is
/// skipped outright, still contributing the unchanged count to the answer.
/// </summary>
public sealed class NumberOfIslandsII : IAlgorithmVisualizer<NumberOfIslandsIIInput>
{
    public string Id => "number-of-islands-ii";

    public IReadOnlyList<AlgorithmStep> Run(NumberOfIslandsIIInput input)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;
        var (rows, cols, positions) = input;

        if (positions.Length == 0)
        {
            StepRecorder.Add(steps, ref stepNumber, "No land to add.",
                new NumberOfIslandsIIState(rows, cols, [], -1, -1, 0, []), [], spanLines: 2);
            return steps;
        }

        var parent = new int[rows * cols];
        Array.Fill(parent, -1);
        var count = 0;
        var counts = new List<int>();

        int Find(int x)
        {
            if (parent[x] != x)
            {
                parent[x] = Find(parent[x]);
            }
            return parent[x];
        }

        (int Row, int Col)[] directions = [(-1, 0), (1, 0), (0, -1), (0, 1)];

        foreach (var position in positions)
        {
            var row = position[0];
            var col = position[1];
            var cell = row * cols + col;

            if (parent[cell] != -1)
            {
                counts.Add(count);
                StepRecorder.Add(steps, ref stepNumber,
                    $"({row}, {col}) is already land — the island count stays {count}.",
                    new NumberOfIslandsIIState(rows, cols, parent.ToList(), row, col, count, counts.ToList()),
                    [$"{row},{col}"],
                    spanLines: 3);
                continue;
            }

            parent[cell] = cell;
            count++;
            StepRecorder.Add(steps, ref stepNumber,
                $"Add land at ({row}, {col}) as its own new island (now {count}).",
                new NumberOfIslandsIIState(rows, cols, parent.ToList(), row, col, count, counts.ToList()),
                [$"{row},{col}"],
                spanLines: 2);

            foreach (var (dRow, dCol) in directions)
            {
                var nRow = row + dRow;
                var nCol = col + dCol;
                if (nRow < 0 || nRow >= rows || nCol < 0 || nCol >= cols || parent[nRow * cols + nCol] == -1)
                {
                    continue;
                }

                var rootCell = Find(cell);
                var rootNeighbor = Find(nRow * cols + nCol);

                string action;
                if (rootCell != rootNeighbor)
                {
                    parent[rootNeighbor] = rootCell;
                    count--;
                    action = $"Neighbor ({nRow}, {nCol}) is land in a different island — merge them (now {count}).";
                }
                else
                {
                    action = $"Neighbor ({nRow}, {nCol}) is land but already in the same island.";
                }

                StepRecorder.Add(steps, ref stepNumber, action,
                    new NumberOfIslandsIIState(rows, cols, parent.ToList(), row, col, count, counts.ToList()),
                    [$"{row},{col}", $"{nRow},{nCol}"],
                    spanLines: 15);
            }

            counts.Add(count);
        }

        StepRecorder.Add(steps, ref stepNumber,
            $"Done: island counts after each addition are [{string.Join(", ", counts)}].",
            new NumberOfIslandsIIState(rows, cols, parent.ToList(), -1, -1, count, counts.ToList()),
            [],
            spanLines: 3);

        return steps;
    }
}
