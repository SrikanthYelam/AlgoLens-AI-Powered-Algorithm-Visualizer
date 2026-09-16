using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Course Schedule via DFS cycle detection: each course is colored 0 (unvisited), 1 (visiting —
/// currently on the recursion path) or 2 (visited — fully explored, no cycle through it). DFS-ing
/// from every unvisited course and hitting a course colored 1 is a back edge into the current
/// path, which is exactly a cycle; a course only turns 2 once every course reachable from it has
/// been explored without finding one.
/// </summary>
public sealed class CourseScheduleDfs : IAlgorithmVisualizer<CourseScheduleInput>
{
    public string Id => "course-schedule-dfs";

    public IReadOnlyList<AlgorithmStep> Run(CourseScheduleInput input)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;
        var numCourses = input.NumCourses;

        if (numCourses == 0)
        {
            StepRecorder.Add(steps, ref stepNumber, "No courses to schedule.",
                new CourseScheduleDfsState(0, [], [], -1, true), [], spanLines: 2);
            return steps;
        }

        var adjacency = new List<int>[numCourses];
        for (var i = 0; i < numCourses; i++)
        {
            adjacency[i] = [];
        }

        foreach (var prerequisite in input.Prerequisites)
        {
            adjacency[prerequisite[1]].Add(prerequisite[0]);
        }

        var color = new int[numCourses];
        var path = new List<int>();

        bool Dfs(int course)
        {
            color[course] = 1;
            path.Add(course);

            StepRecorder.Add(steps, ref stepNumber,
                $"Visit course {course}; mark it visiting and push it onto the recursion path.",
                new CourseScheduleDfsState(numCourses, color.ToList(), path.ToList(), course, true),
                [course.ToString()],
                spanLines: 4);

            foreach (var next in adjacency[course])
            {
                if (color[next] == 1)
                {
                    StepRecorder.Add(steps, ref stepNumber,
                        $"Course {next} is already on the recursion path — back edge found, a cycle exists.",
                        new CourseScheduleDfsState(numCourses, color.ToList(), path.ToList(), next, false),
                        [next.ToString()],
                        spanLines: 2);
                    return true;
                }

                if (color[next] == 0 && Dfs(next))
                {
                    return true;
                }
            }

            color[course] = 2;
            path.RemoveAt(path.Count - 1);

            StepRecorder.Add(steps, ref stepNumber,
                $"Course {course} has no unresolved dependencies left; mark it visited and pop it off the path.",
                new CourseScheduleDfsState(numCourses, color.ToList(), path.ToList(), course, true),
                [course.ToString()],
                spanLines: 4);

            return false;
        }

        var hasCycle = false;
        for (var course = 0; course < numCourses && !hasCycle; course++)
        {
            if (color[course] == 0)
            {
                hasCycle = Dfs(course);
            }
        }

        var canFinish = !hasCycle;
        StepRecorder.Add(steps, ref stepNumber,
            canFinish
                ? $"Done: no cycle found — all {numCourses} courses can be finished."
                : "Done: a cycle was found — the courses cannot all be finished.",
            new CourseScheduleDfsState(numCourses, color.ToList(), [], -1, canFinish),
            [],
            spanLines: 1);

        return steps;
    }
}
