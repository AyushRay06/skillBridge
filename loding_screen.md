Great question — here's exactly how we handle it:

The flow:
Steps 1-4 animate on a timer (~30-40s total) — the fun visual part
Step 5 ("Generating report") reaches a holding state — it doesn't show a checkmark ✅. Instead it stays in a pulsing "in progress" animation with text like "Finalizing results..."
In the background, we poll GET /autopilot/schedules every 5 seconds, checking if lastRunAt updated (meaning the backend actually finished)
Only when the poll confirms completion → we show the final checkmark, a success animation, and dismiss the overlay
So the last step essentially stretches to absorb any timing difference. The user sees:

✅ Building search queries
✅ Searching job boards  
✅ Evaluating & scoring
✅ Tailoring applications
⏳ Finalizing results...     ← holds here until backend confirms done
If the backend takes 2 minutes instead of 40 seconds, the user just sees that last step pulsing a bit longer — which actually feels natural ("the AI is still working"). They never see a false "complete".

And the reverse case — if the backend finishes faster than the animation? The poll detects it early, we speed through the remaining steps and show success.