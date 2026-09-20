namespace AlgoLens.Core.Models;

/// <summary>
/// One saved frame on Decode String's stack: what had been decoded before a `[` opened
/// (`Prefix`), and how many times the bracket's contents must be repeated (`Repeat`).
/// </summary>
public sealed record DecodeStringFrame(string Prefix, int Repeat);

/// <summary>
/// State snapshot for Decode String at a given step. `Index` is the character just consumed
/// (`-1` on the empty/closing steps). `Current` is the string being built at the current nesting
/// level and `Number` the repeat count being parsed (multi-digit counts accumulate across steps).
/// `Stack` lists the open brackets' frames from outermost to innermost. `Result` is empty until
/// the closing step, when it holds the fully decoded string.
/// </summary>
public sealed record DecodeStringState(
    string Encoded,
    int Index,
    string Current,
    int Number,
    IReadOnlyList<DecodeStringFrame> Stack,
    string Result
);
