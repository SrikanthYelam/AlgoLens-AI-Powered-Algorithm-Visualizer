using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Max Area of Island via Union-Find with union by size: scan the grid row-major, making each land
/// cell its own one-cell island, then union it with its up and left neighbors when they are land —
/// those are the only neighbors already scanned, so every adjacency is still seen exactly once.
/// Each root keeps its island's size; a union attaches the smaller root under the larger and adds
/// the sizes, so the largest root size seen at any point is the answer.
/// </summary>
public sealed class MaxAreaOfIslandUnionFind : IAlgorithmVisualizer<int[][]>
{
    public string Id => "max-area-of-island-union-find";

    public IReadOnlyList<AlgorithmStep> Run(int[][] grid)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;

        if (grid.Length == 0 || grid[0].Length == 0)
        {
            StepRecorder.Add(steps, ref stepNumber, "The grid is empty — the max area is 0.",
                new MaxAreaOfIslandUnionFindState(0, 0, [], [], -1, -1, 0), [], spanLines: 2);
            return steps;
        }

        var rows = grid.Length;
        var cols = grid[0].Length;
        var parent = new int[rows * cols];
        var size = new int[rows * cols];
        Array.Fill(parent, -1);
        var maxArea = 0;

        int Find(int x)
        {
            if (parent[x] != x)
            {
                parent[x] = Find(parent[x]);
            }
            return parent[x];
        }

        MaxAreaOfIslandUnionFindState Snapshot(int row, int col) =>
            new(rows, cols, parent.ToList(), size.ToList(), row, col, maxArea);

        (int Row, int Col)[] scannedNeighbors = [(-1, 0), (0, -1)];

        for (var row = 0; row < rows; row++)
        {
            for (var col = 0; col < cols; col++)
            {
                if (grid[row][col] != 1)
                {
                    continue;
                }

                var cell = row * cols + col;
                parent[cell] = cell;
                size[cell] = 1;
                maxArea = Math.Max(maxArea, 1);
                StepRecorder.Add(steps, ref stepNumber,
                    $"Land at ({row}, {col}) — start it as its own island of area 1.",
                    Snapshot(row, col),
                    [$"{row},{col}"],
                    spanLines: 4);

                foreach (var (dRow, dCol) in scannedNeighbors)
                {
                    var nRow = row + dRow;
                    var nCol = col + dCol;
                    if (nRow < 0 || nCol < 0 || grid[nRow][nCol] != 1)
                    {
                        continue;
                    }

                    var rootA = Find(cell);
                    var rootB = Find(nRow * cols + nCol);

                    string action;
                    if (rootA != rootB)
                    {
                        if (size[rootA] < size[rootB])
                        {
                            (rootA, rootB) = (rootB, rootA);
                        }
                        parent[rootB] = rootA;
                        size[rootA] += size[rootB];
                        maxArea = Math.Max(maxArea, size[rootA]);
                        action = $"Neighbor ({nRow}, {nCol}) is land — merge the islands into one of area {size[rootA]} (max so far {maxArea}).";
                    }
                    else
                    {
                        action = $"Neighbor ({nRow}, {nCol}) is land but already in the same island (area {size[rootA]}).";
                    }

                    StepRecorder.Add(steps, ref stepNumber, action,
                        Snapshot(row, col),
                        [$"{row},{col}", $"{nRow},{nCol}"],
                        spanLines: 20);
                }
            }
        }

        StepRecorder.Add(steps, ref stepNumber,
            $"Done: the largest island has area {maxArea}.",
            Snapshot(-1, -1),
            [],
            spanLines: 3);

        return steps;
    }
}
