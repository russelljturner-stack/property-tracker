Please end this session by completing the following steps:

## 1. Check for Running Processes

List any background processes (dev servers, etc.) that are running and provide commands to stop them.

## 2. Git Status Check

- Check for uncommitted changes
- If there are changes, ask Russell if he wants to commit them
- If committing, create a clear commit message summarising what changed
- Check if there are unpushed commits and offer to push (only if a remote is configured)

## 3. Update Handover Document

Create or update the handover document at `docs/handover/[DATE]-session-handover.md` with:

- **Date:** Today's date
- **Session Summary:** What was accomplished this session
- **Current Status:** Where the project stands now
- **Next Steps:** What should be done next session
- **Running Services:** Any servers or services that need to be started
- **Known Issues:** Any problems or blockers discovered

## 4. Provide Startup Prompt

Generate a startup prompt for the next session in a code block that Russell can copy and paste. It should:

- Reference the handover document location
- Briefly state what was last worked on
- State what the next task is

Format it like this:
```
I'm continuing work on the Property Development Tracker. Please read the handover document at:
docs/handover/[DATE]-session-handover.md

Last session: [brief summary]
Next task: [what to do]
```

## 5. Final Checklist

Confirm:
- [ ] All servers stopped (or instructions provided)
- [ ] Changes committed (or confirmed not needed)
- [ ] Handover document updated
- [ ] Startup prompt provided
