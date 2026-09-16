namespace AlgoLens.Core.Models;

/// <summary>
/// Shared input for both Course Schedule visualizers. <c>Prerequisites[i] = [course, prerequisite]</c>,
/// matching LeetCode's own pair ordering — to take <c>course</c> you must first take <c>prerequisite</c>.
/// </summary>
public sealed record CourseScheduleInput(int NumCourses, int[][] Prerequisites);

/// <summary>
/// State snapshot for the Kahn's-algorithm (BFS topological sort) solution to Course Schedule at a
/// given step. <c>CanFinish</c> is optimistically <c>true</c> until the final step, where it reflects
/// whether every course made it into <c>Order</c>.
/// </summary>
public sealed record CourseScheduleKahnState(
    int NumCourses,
    IReadOnlyList<int> InDegree,
    IReadOnlyList<int> Queue,
    IReadOnlyList<int> Order,
    int CurrentCourse,
    bool CanFinish
);

/// <summary>
/// State snapshot for the DFS cycle-detection solution to Course Schedule at a given step.
/// <c>Color</c> is 0 (unvisited), 1 (visiting — on the current recursion path), or 2 (visited) per
/// course. <c>CanFinish</c> is optimistically <c>true</c> until a back edge into a visiting course is
/// found.
/// </summary>
public sealed record CourseScheduleDfsState(
    int NumCourses,
    IReadOnlyList<int> Color,
    IReadOnlyList<int> Path,
    int CurrentCourse,
    bool CanFinish
);
