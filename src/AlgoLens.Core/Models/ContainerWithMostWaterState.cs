namespace AlgoLens.Core.Models;

/// <summary>
/// State snapshot for Container With Most Water at a given step. `Left`/`Right` are the two
/// pointers of the container being evaluated (on the closing step, the best container found).
/// `Area` is that container's area; `MaxArea` the best seen so far, achieved by the container
/// between `BestLeft` and `BestRight` (both `-1` until a container has been evaluated).
/// </summary>
public sealed record ContainerWithMostWaterState(
    IReadOnlyList<int> Heights,
    int Left,
    int Right,
    int Area,
    int MaxArea,
    int BestLeft,
    int BestRight
);
