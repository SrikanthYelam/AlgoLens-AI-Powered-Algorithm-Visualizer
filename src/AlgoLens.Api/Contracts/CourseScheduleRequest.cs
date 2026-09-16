namespace AlgoLens.Api.Contracts;

public sealed record CourseScheduleRequest(int NumCourses, int[][] Prerequisites);
