using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Course Schedule via Kahn's algorithm: BFS topological sort. Every course starts with an
/// in-degree (number of unmet prerequisites); the queue is seeded with every in-degree-0 course,
/// and each dequeue "takes" that course and decrements its dependents' in-degrees, enqueueing any
/// that reach 0. If the resulting order contains every course, the graph is a DAG and the schedule
/// is finishable; otherwise the courses left out of the order are stuck in a cycle.
/// </summary>
public sealed class CourseScheduleKahn : IAlgorithmVisualizer<CourseScheduleInput>
{
    public string Id => "course-schedule-kahn";

    public IReadOnlyList<AlgorithmStep> Run(CourseScheduleInput input)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;
        var numCourses = input.NumCourses;

        if (numCourses == 0)
        {
            StepRecorder.Add(steps, ref stepNumber, "No courses to schedule.",
                new CourseScheduleKahnState(0, [], [], [], -1, true), [], spanLines: 2);
            return steps;
        }

        var adjacency = new List<int>[numCourses];
        for (var i = 0; i < numCourses; i++)
        {
            adjacency[i] = [];
        }

        var inDegree = new int[numCourses];

        foreach (var prerequisite in input.Prerequisites)
        {
            var course = prerequisite[0];
            var prereq = prerequisite[1];
            adjacency[prereq].Add(course);
            inDegree[course]++;

            StepRecorder.Add(steps, ref stepNumber,
                $"Course {prereq} must come before course {course}; course {course}'s in-degree is now {inDegree[course]}.",
                new CourseScheduleKahnState(numCourses, inDegree.ToList(), [], [], -1, true),
                [prereq.ToString(), course.ToString()],
                spanLines: 5);
        }

        var queue = new Queue<int>();
        for (var course = 0; course < numCourses; course++)
        {
            if (inDegree[course] == 0)
            {
                queue.Enqueue(course);
            }
        }

        StepRecorder.Add(steps, ref stepNumber,
            $"Seed the queue with every in-degree-0 course: [{string.Join(", ", queue)}].",
            new CourseScheduleKahnState(numCourses, inDegree.ToList(), queue.ToList(), [], -1, true),
            [],
            spanLines: 8);

        var order = new List<int>();

        while (queue.Count > 0)
        {
            var course = queue.Dequeue();
            order.Add(course);

            StepRecorder.Add(steps, ref stepNumber,
                $"Take course {course}; topological order is now [{string.Join(", ", order)}].",
                new CourseScheduleKahnState(numCourses, inDegree.ToList(), queue.ToList(), order.ToList(), course, true),
                [course.ToString()],
                spanLines: 3);

            foreach (var next in adjacency[course])
            {
                inDegree[next]--;

                if (inDegree[next] == 0)
                {
                    queue.Enqueue(next);
                }

                StepRecorder.Add(steps, ref stepNumber,
                    inDegree[next] == 0
                        ? $"Course {next}'s in-degree drops to 0 after taking {course}; enqueue it."
                        : $"Course {next}'s in-degree drops to {inDegree[next]} after taking {course}.",
                    new CourseScheduleKahnState(numCourses, inDegree.ToList(), queue.ToList(), order.ToList(), course, true),
                    [next.ToString()],
                    spanLines: 7);
            }
        }

        var canFinish = order.Count == numCourses;
        StepRecorder.Add(steps, ref stepNumber,
            canFinish
                ? $"Done: all {numCourses} courses scheduled — no cycle. Order: [{string.Join(", ", order)}]."
                : $"Done: only {order.Count} of {numCourses} courses could be scheduled — a cycle exists.",
            new CourseScheduleKahnState(numCourses, inDegree.ToList(), [], order.ToList(), -1, canFinish),
            [],
            spanLines: 1);

        return steps;
    }
}
