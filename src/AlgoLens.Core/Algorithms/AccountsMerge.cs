using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Accounts Merge via Union-Find over email strings instead of plain indices: two accounts
/// belong to the same person exactly when they share an email, so within each account every
/// email is unioned with that account's first email. A `Dictionary&lt;string, string&gt;` plays
/// the role of the usual `int[]` parent array, with the same recursive path-compressed `Find`.
/// Once every account has contributed its unions, grouping every seen email by its root and
/// attaching the (any) name recorded for that root recovers each merged person's full email set.
/// </summary>
public sealed class AccountsMerge : IAlgorithmVisualizer<IReadOnlyList<IReadOnlyList<string>>>
{
    public string Id => "accounts-merge";

    public IReadOnlyList<AlgorithmStep> Run(IReadOnlyList<IReadOnlyList<string>> accounts)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;

        if (accounts.Count == 0)
        {
            StepRecorder.Add(steps, ref stepNumber, "No accounts to merge.",
                new AccountsMergeState(null, [], []), [], spanLines: 2);
            return steps;
        }

        var parent = new Dictionary<string, string>();
        var emailToName = new Dictionary<string, string>();

        string Find(string email)
        {
            if (parent[email] != email)
            {
                parent[email] = Find(parent[email]);
            }
            return parent[email];
        }

        void Union(string a, string b)
        {
            var rootA = Find(a);
            var rootB = Find(b);
            if (rootA != rootB)
            {
                parent[rootB] = rootA;
            }
        }

        List<IReadOnlyList<string>> BuildGroups()
        {
            var groups = new Dictionary<string, List<string>>();
            foreach (var email in parent.Keys)
            {
                var root = Find(email);
                if (!groups.TryGetValue(root, out var list))
                {
                    list = [];
                    groups[root] = list;
                }
                list.Add(email);
            }

            return groups
                .OrderBy(g => emailToName[g.Key], StringComparer.Ordinal)
                .Select(g =>
                {
                    var row = new List<string> { emailToName[g.Key] };
                    row.AddRange(g.Value.OrderBy(e => e, StringComparer.Ordinal));
                    return (IReadOnlyList<string>)row;
                })
                .ToList();
        }

        foreach (var account in accounts)
        {
            var name = account[0];
            var emails = account.Skip(1).ToList();

            foreach (var email in emails)
            {
                parent.TryAdd(email, email);
                emailToName[email] = name;
            }
            for (var i = 1; i < emails.Count; i++)
            {
                Union(emails[0], emails[i]);
            }

            StepRecorder.Add(steps, ref stepNumber,
                $"Processed {name}'s account ({emails.Count} email(s)) — union them into one group.",
                new AccountsMergeState(name, emails, BuildGroups()),
                emails,
                spanLines: 13);
        }

        StepRecorder.Add(steps, ref stepNumber,
            $"Done: merged into {BuildGroups().Count} account(s).",
            new AccountsMergeState(null, [], BuildGroups()),
            [],
            spanLines: 1);

        return steps;
    }
}
