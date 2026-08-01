namespace AlgoLens.Core;

/// <summary>
/// Reads an algorithm's own .cs file back out as text, for display alongside its
/// step animation on the frontend. Backed by the files under Algorithms/, which are
/// embedded as resources (in addition to being compiled) via AlgoLens.Core.csproj.
/// </summary>
public static class AlgorithmSource
{
    public static string Get(Type algorithmType)
    {
        var resourceName = $"AlgoLens.Core.Algorithms.{algorithmType.Name}.cs";
        using var stream = algorithmType.Assembly.GetManifestResourceStream(resourceName)
            ?? throw new InvalidOperationException($"No embedded source found for '{resourceName}'.");
        using var reader = new StreamReader(stream);
        return reader.ReadToEnd();
    }
}
