namespace AlgoLens.Core.Models;

/// <summary>
/// State snapshot for Encode and Decode Strings at a given step. `Phase` is `"encode"` or
/// `"decode"`. `Encoded` is the encoded string as built so far (complete throughout decoding).
/// While decoding, `Cursor` is the start of the token being read, `HashIndex` the `#` its scan
/// stopped at (`-1` until found) and `ContentEnd` the exclusive end of the string's characters
/// (`-1` until the string has been sliced out); all three are `-1` while encoding. `Decoded` is
/// the list recovered so far.
/// </summary>
public sealed record EncodeAndDecodeStringsState(
    string Phase,
    IReadOnlyList<string> Strings,
    string Encoded,
    int Cursor,
    int HashIndex,
    int ContentEnd,
    IReadOnlyList<string> Decoded
);
