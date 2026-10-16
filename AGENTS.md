<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the supported TanStack Start router; each reference content page has its own leaf route for navigation and metadata.
- Render sanitized reference page snapshots through the shared ReferencePage renderer to preserve exact original markup without running remote scripts.
- Store original media as Lovable Assets pointers and keep all reference visual tokens in src/styles.css for faithful, centralized styling.
- Initialize browser-only reference interactions in a cleanup-aware effect; all appointment, callback, and career forms are presentation-only and must never send data to the original hospital.
