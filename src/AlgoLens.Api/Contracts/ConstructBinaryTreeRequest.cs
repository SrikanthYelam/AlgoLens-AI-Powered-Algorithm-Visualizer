namespace AlgoLens.Api.Contracts;

public sealed record ConstructBinaryTreeRequest(IReadOnlyList<int> Preorder, IReadOnlyList<int> Inorder);
