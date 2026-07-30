using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// N-Queens via row-by-row column placement with a safety check (column and
/// both diagonals) against queens already placed.
/// </summary>
public sealed class NQueens : IAlgorithmVisualizer<int>
{
    public string Id => "n-queens";

    public IReadOnlyList<AlgorithmStep> Run(int boardSize)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;

        if (boardSize <= 0)
        {
            steps.Add(new AlgorithmStep(0, "Board size must be positive.", new NQueensState(boardSize, [], []), []));
            return steps;
        }

        var queenColumns = new List<int>();
        var solutions = new List<IReadOnlyList<int>>();

        bool IsSafe(int row, int col)
        {
            for (var r = 0; r < row; r++)
            {
                var c = queenColumns[r];
                if (c == col || Math.Abs(c - col) == Math.Abs(r - row))
                {
                    return false;
                }
            }
            return true;
        }

        void Backtrack(int row)
        {
            if (row == boardSize)
            {
                solutions.Add(queenColumns.ToList());
                steps.Add(new AlgorithmStep(
                    stepNumber++,
                    $"Complete solution found: queens at columns [{string.Join(", ", queenColumns)}].",
                    new NQueensState(boardSize, queenColumns.ToList(), solutions.ToList()),
                    []));
                return;
            }

            for (var col = 0; col < boardSize; col++)
            {
                if (!IsSafe(row, col))
                {
                    continue;
                }

                queenColumns.Add(col);
                steps.Add(new AlgorithmStep(
                    stepNumber++,
                    $"Place queen at row {row}, column {col}.",
                    new NQueensState(boardSize, queenColumns.ToList(), solutions.ToList()),
                    [$"{row},{col}"]));

                Backtrack(row + 1);

                var removedCol = queenColumns[^1];
                queenColumns.RemoveAt(queenColumns.Count - 1);
                steps.Add(new AlgorithmStep(
                    stepNumber++,
                    $"Backtrack: remove queen from row {row}, column {removedCol}.",
                    new NQueensState(boardSize, queenColumns.ToList(), solutions.ToList()),
                    [$"{row},{removedCol}"]));
            }
        }

        Backtrack(0);
        return steps;
    }
}
